import { db } from '../db/database';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';

const withTimeout = <T>(promise: Promise<T>, ms: number = 45000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('SYNC_TIMEOUT')), ms))
  ]);
};

async function logSync(level: 'info' | 'warn' | 'error', message: string, details?: any) {
  console[level](`[Sync] ${message}`, details || '');
  try {
    await db.sync_logs.add({
      timestamp: new Date(),
      level,
      message,
      details: details ? JSON.parse(JSON.stringify(details)) : undefined
    });
  } catch (e) {
    console.error('Failed to write sync log', e);
  }
}

async function safeBatchUpsert(tableName: string, records: any[]): Promise<{ successIds: string[], errors: any[] }> {
  if (records.length === 0) return { successIds: [], errors: [] };
  
  const CHUNK_SIZE = 50;
  const successIds: string[] = [];
  const errors: any[] = [];

  for (let i = 0; i < records.length; i += CHUNK_SIZE) {
    const chunk = records.slice(i, i + CHUNK_SIZE);
    
    const { error: bulkError } = await withTimeout<any>(
      Promise.resolve(supabase.from(tableName).upsert(chunk))
    );

    if (!bulkError) {
      successIds.push(...chunk.map(r => r.id));
      continue;
    }

    await logSync('warn', `Chunk upsert falhou na tabela ${tableName}, processando 1 por 1.`, bulkError);
    
    for (const record of chunk) {
      const { error } = await withTimeout<any>(
        Promise.resolve(supabase.from(tableName).upsert([record]))
      );
      if (!error) {
        successIds.push(record.id);
      } else {
        errors.push({ id: record.id, error });
        if (error.code === '23503') {
          await logSync('error', `FK Violation on ${tableName} ID ${record.id}: Parent record missing on server.`);
        }
      }
    }
  }

  return { successIds, errors };
}

function shouldUpdateLocal(serverDate: Date, localDate: Date | undefined): boolean {
  if (!localDate) return true;
  return serverDate > localDate;
}

async function pullAllPages(tableName: string, orderBy: string = 'updated_at'): Promise<any[]> {
  const all: any[] = [];
  const PAGE_SIZE = 500;
  let page = 0;

  while (true) {
    const { data, error } = await withTimeout<any>(
      Promise.resolve(
        supabase
          .from(tableName)
          .select('*')
          .is('deleted_at', null) // ✅ IGNORA registros deletados no servidor
          .order(orderBy, { ascending: false })
          .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
      )
    );

    if (error) {
      await logSync('error', `Falha ao baixar página ${page} de ${tableName}`, error);
      break;
    }

    if (!data || data.length === 0) break;

    all.push(...data);
    if (data.length < PAGE_SIZE) break;
    page++;
  }

  return all;
}

// ✅ NOVA FUNÇÃO: Baixar registros DELETADOS do servidor e aplicar localmente
async function pullDeletedRecords(tableName: string, localTable: any) {
  try {
    const { data: deletedRecords } = await withTimeout<any>(
      Promise.resolve(
        supabase
          .from(tableName)
          .select('id, deleted_at')
          .not('deleted_at', 'is', null) // Apenas registros deletados
      )
    );

    if (deletedRecords && deletedRecords.length > 0) {
      await logSync('info', `Aplicando ${deletedRecords.length} deleções de ${tableName}...`);
      
      for (const record of deletedRecords) {
        const local = await localTable.get(record.id);
        if (local && !local.deletedAt) {
          // Marca como deletado localmente (soft delete)
          await localTable.update(record.id, { 
            deletedAt: new Date(record.deleted_at),
            synced: 1 
          });
        }
      }
    }
  } catch (err: any) {
    await logSync('error', `Erro ao processar deleções de ${tableName}`, err.message);
  }
}

async function cleanupOrphans() {
  await logSync('info', 'Limpando registros órfãos locais...');
  
  // ✅ IMPORTANTE: Agora também limpa registros marcados como deletados há mais de 30 dias
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Hard delete de registros soft-deleted antigos (economiza espaço)
  await db.clients.where('deletedAt').below(thirtyDaysAgo).delete();
  await db.inspections.where('deletedAt').below(thirtyDaysAgo).delete();
  await db.responses.where('deletedAt').below(thirtyDaysAgo).delete();
  await db.photos.where('deletedAt').below(thirtyDaysAgo).delete();
  await db.schedules.where('deletedAt').below(thirtyDaysAgo).delete();
  
  // Respostas órfãs (inspeção não existe OU está deletada)
  const responses = await db.responses.filter(r => !r.deletedAt).toArray();
  for (const r of responses) {
    const parent = await db.inspections.get(r.inspectionId);
    if (!parent || parent.deletedAt) {
      await db.responses.update(r.id, { deletedAt: new Date(), synced: 0 });
      await logSync('warn', `Resposta órfã marcada para deleção: ${r.id}`);
    }
  }

  // Fotos órfãs
  const photos = await db.photos.filter(p => !p.deletedAt).toArray();
  for (const p of photos) {
    const parent = await db.responses.get(p.responseId);
    if (!parent || parent.deletedAt) {
      await db.photos.update(p.id, { deletedAt: new Date(), synced: 0 });
      await logSync('warn', `Foto órfã marcada para deleção: ${p.id}`);
    }
  }

  // Inspeções órfãs
  const inspections = await db.inspections.filter(i => !i.deletedAt).toArray();
  for (const i of inspections) {
    const parent = await db.clients.get(i.clientId);
    if (!parent || parent.deletedAt) {
      await db.inspections.update(i.id, { deletedAt: new Date(), synced: 0 });
      await logSync('warn', `Inspeção órfã marcada para deleção: ${i.id}`);
    }
  }

  // Schedules órfãos
  const schedules = await db.schedules.filter(s => !s.deletedAt).toArray();
  for (const s of schedules) {
    const parent = await db.clients.get(s.clientId);
    if (!parent || parent.deletedAt) {
      await db.schedules.update(s.id, { deletedAt: new Date(), synced: 0 });
      await logSync('warn', `Schedule órfão marcado para deleção: ${s.id}`);
    }
  }
}

export async function syncData(isManual: boolean = false) {
  const { user } = useAuthStore.getState();
  if (!user) {
    if (isManual) alert('Faça login antes de sincronizar.');
    return;
  }

  if ((window as any).isSyncingGlobally) {
    if (isManual) alert('Uma sincronização já está em andamento.');
    return;
  }
  (window as any).isSyncingGlobally = true;

  try {
    await logSync('info', '🔄 Iniciando Sincronização com Soft Delete...', { manual: isManual });

    // 0. Sync PROFILE
    const { settings } = (await import('../store/useSettingsStore')).useSettingsStore.getState();
    if (settings.name) {
      await supabase.from('profiles').upsert({
        id: user.id,
        name: settings.name,
        coren: settings.professionalId,
        phone: settings.phone,
        consultant_role: settings.consultantRole,
        updated_at: new Date()
      });
    }

    // ============================================================
    // 1. CLIENTES
    // ============================================================
    
    // PUSH (inclui registros deletados)
    const clientQuery = isManual 
      ? db.clients.filter(c => c.synced !== 1)
      : db.clients.where('synced').equals(0);
    
    const pendingClients = await clientQuery.toArray();
    
    if (pendingClients.length > 0) {
      await logSync('info', `📤 Enviando ${pendingClients.length} clientes...`);
      
      const clientsToPush = pendingClients.map(c => ({
        id: c.id, name: c.name, cnpj: c.cnpj, address: c.address, category: c.category,
        food_types: c.foodTypes, responsible_name: c.responsibleName, phone: c.phone,
        email: c.email, created_at: c.createdAt, updated_at: c.updatedAt || new Date(),
        user_id: user.id, city: c.city, state: c.state,
        deleted_at: c.deletedAt || null // ✅ Envia status de deleção
      }));

      const { error: pushError } = await withTimeout<any>(
        Promise.resolve(supabase.from('clients').upsert(clientsToPush))
      );
      
      if (!pushError) {
        await db.clients.where('id').anyOf(clientsToPush.map(c => c.id)).modify({ synced: 1 });
        await logSync('info', '✅ Clientes enviados com sucesso');
      } else {
        await logSync('error', '❌ Falha ao enviar Clientes', pushError);
      }
    }

    // PULL CLIENTES (ativos)
    const remoteClients = await pullAllPages('clients');
    if (remoteClients.length > 0) {
      await logSync('info', `📥 Baixados ${remoteClients.length} clientes ativos`);
      
      for (const rc of remoteClients) {
        const local = await db.clients.get(rc.id);
        const serverUpdate = new Date(rc.updated_at || rc.created_at);
        const localUpdate = local?.updatedAt ? new Date(local.updatedAt) : undefined;

        if (shouldUpdateLocal(serverUpdate, localUpdate)) {
          await db.clients.put({
            id: rc.id, name: rc.name, cnpj: rc.cnpj, address: rc.address,
            category: rc.category as any, foodTypes: rc.food_types,
            responsibleName: rc.responsible_name, phone: rc.phone, email: rc.email,
            createdAt: new Date(rc.created_at), updatedAt: serverUpdate,
            city: rc.city, state: rc.state, tenantId: rc.tenant_id, 
            deletedAt: rc.deleted_at ? new Date(rc.deleted_at) : null,
            synced: 1
          });
        } else if (local && local.synced === 0) {
          await db.clients.update(rc.id, { synced: 1 });
        }
      }
    }

    // ✅ PULL DELEÇÕES de clientes
    await pullDeletedRecords('clients', db.clients);

    // ============================================================
    // 2. INSPEÇÕES
    // ============================================================
    
    // PUSH
    const inspecQuery = isManual 
      ? db.inspections.filter(i => i.synced !== 1) 
      : db.inspections.where('synced').equals(0);
    
    const allPendingInspec = await inspecQuery.toArray();
    
    const pendingInspec = [];
    for (const i of allPendingInspec) {
      const client = await db.clients.get(i.clientId);
      if (client && client.synced === 1) {
        pendingInspec.push(i);
      } else {
        await logSync('warn', `⏳ Inspeção ${i.id} aguardando cliente ${i.clientId}`);
      }
    }

    if (pendingInspec.length > 0) {
      await logSync('info', `📤 Enviando ${pendingInspec.length} inspeções...`);
      
      const recordsToPush = pendingInspec.map(i => ({
        id: i.id, client_id: i.clientId, template_id: i.templateId,
        consultant_name: i.consultantName, inspection_date: i.inspectionDate,
        status: i.status, observations: i.observations, created_at: i.createdAt,
        completed_at: i.completedAt, user_id: user.id,
        ilpi_capacity: i.ilpiCapacity, residents_total: i.residentsTotal,
        residents_male: i.residentsMale, residents_female: i.residentsFemale,
        dependency_level1: i.dependencyLevel1, dependency_level2: i.dependencyLevel2,
        dependency_level3: i.dependencyLevel3, accompanist_name: i.accompanistName,
        accompanist_role: i.accompanistRole, signature_data_url: i.signatureDataUrl,
        updated_at: i.updatedAt || new Date(),
        deleted_at: i.deletedAt || null // ✅ Soft delete
      }));
      
      const { successIds, errors } = await safeBatchUpsert('inspections', recordsToPush);
      if (successIds.length > 0) await db.inspections.where('id').anyOf(successIds).modify({ synced: 1 });
      if (errors.length > 0) await logSync('error', '❌ Falha em algumas inspeções', errors[0].error);
    }

    // PULL INSPEÇÕES
    const remoteInspec = await pullAllPages('inspections');
    if (remoteInspec.length > 0) {
      await logSync('info', `📥 Baixados ${remoteInspec.length} inspeções ativas`);
      
      for (const ri of remoteInspec) {
        const local = await db.inspections.get(ri.id);
        const serverUpdate = new Date(ri.updated_at || ri.created_at);
        const localUpdate = local?.updatedAt ? new Date(local.updatedAt) : undefined;

        if (shouldUpdateLocal(serverUpdate, localUpdate)) {
          await db.inspections.put({
            id: ri.id, clientId: ri.client_id, templateId: ri.template_id,
            consultantName: ri.consultant_name, inspectionDate: new Date(ri.inspection_date),
            status: ri.status as any, observations: ri.observations,
            createdAt: new Date(ri.created_at), updatedAt: serverUpdate,
            completedAt: ri.completed_at ? new Date(ri.completed_at) : undefined,
            ilpiCapacity: ri.ilpi_capacity, residentsTotal: ri.residents_total,
            residentsMale: ri.residents_male, residentsFemale: ri.residents_female,
            dependencyLevel1: ri.dependency_level1, dependencyLevel2: ri.dependency_level2,
            dependencyLevel3: ri.dependency_level3, accompanistName: ri.accompanist_name,
            accompanistRole: ri.accompanist_role, signatureDataUrl: ri.signature_data_url,
            tenantId: ri.tenant_id, 
            deletedAt: ri.deleted_at ? new Date(ri.deleted_at) : null,
            synced: 1
          });
        } else if (local && local.synced === 0) {
          await db.inspections.update(ri.id, { synced: 1 });
        }
      }
    }

    await pullDeletedRecords('inspections', db.inspections);

    // ============================================================
    // 3. RESPOSTAS
    // ============================================================
    
    // PUSH
    const resQuery = isManual ? db.responses.filter(r => r.synced !== 1) : db.responses.where('synced').equals(0);
    const allPendingResponses = await resQuery.toArray();

    const pendingResponses = [];
    for (const r of allPendingResponses) {
      const parent = await db.inspections.get(r.inspectionId);
      if (parent && parent.synced === 1) {
        pendingResponses.push(r);
      }
    }

    if (pendingResponses.length > 0) {
      await logSync('info', `📤 Enviando ${pendingResponses.length} respostas...`);
      
      const recordsToPush = pendingResponses.map(r => ({
        id: r.id, inspection_id: r.inspectionId, item_id: r.itemId,
        result: r.result, situation_description: r.situationDescription,
        corrective_action: r.correctiveAction, created_at: r.createdAt,
        updated_at: r.updatedAt || new Date(), user_id: user.id, 
        custom_description: r.customDescription,
        deleted_at: r.deletedAt || null
      }));
      
      const { successIds } = await safeBatchUpsert('responses', recordsToPush);
      if (successIds.length > 0) await db.responses.where('id').anyOf(successIds).modify({ synced: 1 });
    }

    // PULL RESPOSTAS
    const remoteRes = await pullAllPages('responses');
    if (remoteRes.length > 0) {
      await logSync('info', `📥 Baixados ${remoteRes.length} respostas ativas`);
      
      for (const rr of remoteRes) {
        const local = await db.responses.get(rr.id);
        const serverUpdate = new Date(rr.updated_at || rr.created_at);
        const localUpdate = local?.updatedAt ? new Date(local.updatedAt) : undefined;

        if (shouldUpdateLocal(serverUpdate, localUpdate)) {
          await db.responses.put({
            id: rr.id, inspectionId: rr.inspection_id, itemId: rr.item_id,
            result: rr.result as any, situationDescription: rr.situation_description,
            correctiveAction: rr.corrective_action, createdAt: new Date(rr.created_at),
            updatedAt: serverUpdate, photos: [], tenantId: rr.tenant_id, 
            deletedAt: rr.deleted_at ? new Date(rr.deleted_at) : null,
            synced: 1,
            customDescription: rr.custom_description
          });
        } else if (local && local.synced === 0) {
          await db.responses.update(rr.id, { synced: 1 });
        }
      }
    }

    await pullDeletedRecords('responses', db.responses);

    // ============================================================
    // 4. FOTOS
    // ============================================================
    
    // PUSH
    const photoQuery = isManual ? db.photos.filter(p => p.synced !== 1) : db.photos.where('synced').equals(0);
    const allPendingPhotos = await photoQuery.toArray();

    const pendingPhotos = [];
    for (const p of allPendingPhotos) {
      const parent = await db.responses.get(p.responseId);
      if (parent && parent.synced === 1) {
        pendingPhotos.push(p);
      }
    }

    if (pendingPhotos.length > 0) {
      await logSync('info', `📤 Enviando ${pendingPhotos.length} fotos...`);
      
      const recordsToPush = pendingPhotos.map(p => ({
        id: p.id, response_id: p.responseId, data_url: p.dataUrl,
        caption: p.caption, taken_at: p.takenAt, user_id: user.id,
        updated_at: p.updatedAt || new Date(),
        deleted_at: p.deletedAt || null
      }));
      
      const { successIds } = await safeBatchUpsert('photos', recordsToPush);
      if (successIds.length > 0) await db.photos.where('id').anyOf(successIds).modify({ synced: 1 });
    }

    // PULL FOTOS
    const remotePh = await pullAllPages('photos', 'taken_at');
    if (remotePh.length > 0) {
      await logSync('info', `📥 Baixados ${remotePh.length} fotos ativas`);
      
      for (const rp of remotePh) {
        const local = await db.photos.get(rp.id);
        const serverUpdate = new Date(rp.updated_at || rp.taken_at || rp.created_at);
        const localUpdate = local?.updatedAt ? new Date(local.updatedAt) : undefined;

        if (shouldUpdateLocal(serverUpdate, localUpdate)) {
          await db.photos.put({
            id: rp.id, responseId: rp.response_id, dataUrl: rp.data_url,
            caption: rp.caption, takenAt: new Date(rp.taken_at), 
            updatedAt: serverUpdate, tenantId: rp.tenant_id, 
            deletedAt: rp.deleted_at ? new Date(rp.deleted_at) : null,
            synced: 1
          });
        } else if (local && local.synced === 0) {
          await db.photos.update(rp.id, { synced: 1 });
        }
      }
    }

    await pullDeletedRecords('photos', db.photos);

    // ============================================================
    // 5. SCHEDULES
    // ============================================================
    
    // PUSH
    const schQuery = isManual ? db.schedules.filter(s => s.synced !== 1) : db.schedules.where('synced').equals(0);
    const allPendingSchedules = await schQuery.toArray();

    const pendingSchedules = [];
    for (const s of allPendingSchedules) {
      const client = await db.clients.get(s.clientId);
      if (client && client.synced === 1) {
        pendingSchedules.push(s);
      } else {
        await logSync('warn', `⏳ Schedule ${s.id} aguardando cliente ${s.clientId}`);
      }
    }

    if (pendingSchedules.length > 0) {
      await logSync('info', `📤 Enviando ${pendingSchedules.length} agendamentos...`);
      
      const recordsToPush = pendingSchedules.map(s => ({
        id: s.id, client_id: s.clientId, scheduled_at: s.scheduledAt,
        status: s.status, notes: s.notes, user_id: s.user_id || user.id,
        updated_at: s.updatedAt || new Date(),
        deleted_at: s.deletedAt || null 
      }));
      
      const { successIds } = await safeBatchUpsert('schedules', recordsToPush);
      if (successIds.length > 0) {
        await db.schedules.where('id').anyOf(successIds).modify({ synced: 1 });
        await logSync('info', `✅ ${successIds.length} agendamentos sincronizados`);
      }
    }

    // PULL SCHEDULES
    const remoteSch = await pullAllPages('schedules');
    if (remoteSch.length > 0) {
      await logSync('info', `📥 Baixados ${remoteSch.length} agendamentos ativos`);
      
      for (const rs of remoteSch) {
        const local = await db.schedules.get(rs.id);
        const serverUpdate = new Date(rs.updated_at || rs.created_at);
        const localUpdate = local?.updatedAt ? new Date(local.updatedAt) : undefined;

        if (shouldUpdateLocal(serverUpdate, localUpdate)) {
          await db.schedules.put({
            id: rs.id, clientId: rs.client_id, scheduledAt: new Date(rs.scheduled_at),
            status: rs.status as any, notes: rs.notes, user_id: rs.user_id, 
            updatedAt: serverUpdate, tenantId: rs.tenant_id, 
            deletedAt: rs.deleted_at ? new Date(rs.deleted_at) : null,
            synced: 1
          });
        } else if (local && local.synced === 0) {
          await db.schedules.update(rs.id, { synced: 1 });
        }
      }
    }

    await pullDeletedRecords('schedules', db.schedules);

    // ============================================================
    // 6. CLEANUP (FINAL)
    // ============================================================
    await cleanupOrphans();

    await logSync('info', '✅ Sincronização concluída com sucesso!');
    if (isManual) alert('✅ Sincronização concluída!');
    
  } catch (err: any) {
    await logSync('error', '❌ Erro na sincronização', err?.message || err);
    if (isManual) alert('❌ Erro: ' + (err?.message || err));
  } finally {
    (window as any).isSyncingGlobally = false;
  }
}

export async function syncClientsOnly() {
  const { user } = useAuthStore.getState();
  if (!user || (window as any).isSyncingGlobally) return;
  
  (window as any).isSyncingGlobally = true;
  try {
    await logSync('info', 'Sync rápido de clientes...');
    
    const remoteClients = await pullAllPages('clients');
    
    if (remoteClients && remoteClients.length > 0) {
      for (const rc of remoteClients) {
        const local = await db.clients.get(rc.id);
        const serverUpdate = new Date(rc.updated_at || rc.created_at);
        const localUpdate = local?.updatedAt ? new Date(local.updatedAt) : undefined;

        if (shouldUpdateLocal(serverUpdate, localUpdate)) {
          await db.clients.put({
            id: rc.id, name: rc.name, cnpj: rc.cnpj, address: rc.address,
            category: rc.category as any, foodTypes: rc.food_types,
            responsibleName: rc.responsible_name, phone: rc.phone, email: rc.email,
            createdAt: new Date(rc.created_at), updatedAt: serverUpdate,
            city: rc.city, state: rc.state, tenantId: rc.tenant_id, 
            deletedAt: rc.deleted_at ? new Date(rc.deleted_at) : null,
            synced: 1
          });
        } else if (local && local.synced === 0) {
          await db.clients.update(rc.id, { synced: 1 });
        }
      }
    }
    
    await pullDeletedRecords('clients', db.clients);
    await logSync('info', 'Sync rápido concluído');
  } catch (err) {
    console.error('Failed fast sync', err);
  } finally {
    (window as any).isSyncingGlobally = false;
  }
}
