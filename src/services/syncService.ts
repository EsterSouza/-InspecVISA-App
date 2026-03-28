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

    await logSync('warn', `Chunk upsert falhou na tabela ${tableName}, processando 1 por 1. Erro:`, bulkError);
    
    for (const record of chunk) {
      const { error } = await withTimeout<any>(
        Promise.resolve(supabase.from(tableName).upsert([record]))
      );
      if (!error) {
        successIds.push(record.id);
      } else {
        errors.push({ id: record.id, error });
        // Handle FK violation 23503 - Log it, but don't delete locally anymore to avoid data loss
        // Data loss happens if client sync fails but others continue.
        if (error.code === '23503') {
           await logSync('error', `FK Violation on ${tableName} ID ${record.id}: Parent record missing on server.`);
        }
      }
    }
  }

  return { successIds, errors };
}

async function processPendingDeletions() {
  const deletions = await db.deletions_sync.toArray();
  if (deletions.length === 0) return;

  await logSync('info', `Processando ${deletions.length} exclusões pendentes...`);
  
  for (const del of deletions) {
    try {
      const { error } = await supabase.from(del.table).delete().eq('id', del.recordId);
      if (!error) {
        await db.deletions_sync.delete(del.id!);
      } else if (error.code === 'PGRST116' || error.code === '404') {
        // Record already gone from server
        await db.deletions_sync.delete(del.id!);
      }
    } catch (err) {
      console.warn(`Failed to sync deletion for ${del.table}:${del.recordId}`, err);
    }
  }
}

export async function syncData(isManual: boolean = false) {
  const user = useAuthStore.getState().user;
  if (!user) return;

  if ((window as any).isSyncingGlobally) {
    if (isManual) alert('Uma sincronização já está em andamento.');
    return;
  }
  (window as any).isSyncingGlobally = true;

  try {
    await logSync('info', 'Iniciando Sincronização Segura...', { manual: isManual });

    // A. Sync Deletions First
    await processPendingDeletions();
    const activeDeletions = await db.deletions_sync.toArray();
    const deletedIds = new Set(activeDeletions.map(d => d.recordId));

    // 0. Sync PROFILE / SETTINGS
    const { settings, updateSettings } = (await import('../store/useSettingsStore')).useSettingsStore.getState();
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

    // 1. Sync CLIENTS (PUSH)
    const clientQuery = isManual 
      ? db.clients.filter(c => c.synced !== 1)
      : db.clients.where('synced').equals(0);
    
    let pendingClients = await clientQuery.toArray();
    
    if (pendingClients.length > 0) {
      // -- LOCAL DEDUPLICATION --
      const localCnpjToId = new Map<string, string>();
      for (const lc of pendingClients) {
        if (lc.cnpj) {
          const canonicalId = localCnpjToId.get(lc.cnpj);
          if (!canonicalId) {
            localCnpjToId.set(lc.cnpj, lc.id);
          } else if (lc.id !== canonicalId) {
            const canonicalRecord = await db.clients.get(canonicalId);
            if (canonicalRecord) {
              let changed = false;
              if (!canonicalRecord.address && lc.address) { canonicalRecord.address = lc.address; changed = true; }
              if (!canonicalRecord.city && lc.city) { canonicalRecord.city = lc.city; changed = true; }
              if (!canonicalRecord.state && lc.state) { canonicalRecord.state = lc.state; changed = true; }
              if (!canonicalRecord.phone && lc.phone) { canonicalRecord.phone = lc.phone; changed = true; }
              if (!canonicalRecord.responsibleName && lc.responsibleName) { canonicalRecord.responsibleName = lc.responsibleName; changed = true; }
              if (changed) await db.clients.put(canonicalRecord);
            }
            await logSync('info', `Deduplicando localmente: ${lc.name}`);
            await db.inspections.where({ clientId: lc.id }).modify({ clientId: canonicalId });
            await db.schedules.where({ clientId: lc.id }).modify({ clientId: canonicalId });
            await db.clients.delete(lc.id);
          }
        }
      }

      pendingClients = await clientQuery.toArray();

      // -- REMOTE DEDUPLICATION (CNPJ Merge) --
      const { data: remoteCnpjData } = await withTimeout<any>(Promise.resolve(supabase.from('clients').select('id, cnpj').limit(1000)));
      const remoteCnpjMap = new Map<string, string>(
        remoteCnpjData?.filter((c: any) => c.cnpj).map((c: any) => [c.cnpj, c.id]) || []
      );

      for (const localClient of pendingClients) {
        if (localClient.cnpj && remoteCnpjMap.has(localClient.cnpj)) {
          const canonicalRemoteId = remoteCnpjMap.get(localClient.cnpj)!;
          if (localClient.id !== canonicalRemoteId) {
            await logSync('info', `Mesclando cliente com a nuvem: ${localClient.name}`);
            await db.inspections.where({ clientId: localClient.id }).modify({ clientId: canonicalRemoteId });
            await db.schedules.where({ clientId: localClient.id }).modify({ clientId: canonicalRemoteId });
            await db.clients.delete(localClient.id);
            localClient.id = canonicalRemoteId;
            await db.clients.put(localClient);
          }
        }
      }

      const clientsToPush = (await clientQuery.toArray()).map(c => ({
        id: c.id, name: c.name, cnpj: c.cnpj, address: c.address, category: c.category,
        food_types: c.foodTypes, responsible_name: c.responsibleName, phone: c.phone,
        email: c.email, created_at: c.createdAt, user_id: user.id
      }));

      const { error: pushError } = await withTimeout<any>(Promise.resolve(supabase.from('clients').upsert(clientsToPush)));
      if (!pushError) {
        await db.clients.where('id').anyOf(pendingClients.map(c => c.id)).modify({ synced: 1 });
        await logSync('info', 'Clientes enviados com sucesso');
      } else {
        await logSync('error', 'Falha ao enviar Clientes. Abortando sync para evitar perda de dados.', pushError);
        (window as any).isSyncingGlobally = false;
        return; // CRITICAL ABORT
      }
    }

    // 1. PULL CLIENTS
    const { data: remoteClients, error: cErr } = await withTimeout<any>(Promise.resolve(supabase.from('clients').select('*').limit(1000)));
    if (cErr) await logSync('error', 'Falha ao baixar Clientes', cErr);
    if (remoteClients) {
      await logSync('info', `Baixados ${remoteClients.length} clientes da nuvem`);
      for (const rc of remoteClients) {
        if (deletedIds.has(rc.id)) continue;
        const local = await db.clients.get(rc.id);
        if (!local || local.synced !== 0) {
          await db.clients.put({
            id: rc.id, name: rc.name, cnpj: rc.cnpj, address: rc.address,
            category: rc.category as any, foodTypes: rc.food_types,
            responsibleName: rc.responsible_name, phone: rc.phone, email: rc.email,
            createdAt: new Date(rc.created_at), city: rc.city, state: rc.state,
            synced: 1
          });
        }
      }
    }

    // 2. Sync INSPECTIONS (PUSH)
    const inspecQuery = isManual ? db.inspections.filter(i => i.synced !== 1) : db.inspections.where('synced').equals(0);
    const pendingInspec = await inspecQuery.toArray();
    if (pendingInspec.length > 0) {
      const recordsToPush = pendingInspec.map(i => ({
        id: i.id, client_id: i.clientId, template_id: i.templateId,
        consultant_name: i.consultantName, inspection_date: i.inspectionDate,
        status: i.status, observations: i.observations, created_at: i.createdAt,
        completed_at: i.completedAt, user_id: user.id,
        ilpi_capacity: i.ilpiCapacity, residents_total: i.residentsTotal,
        residents_male: i.residentsMale, residents_female: i.residentsFemale,
        dependency_level1: i.dependencyLevel1, dependency_level2: i.dependencyLevel2,
        dependency_level3: i.dependencyLevel3, accompanist_name: i.accompanistName,
        accompanist_role: i.accompanistRole, signature_data_url: i.signatureDataUrl
      }));
      const { successIds, errors } = await safeBatchUpsert('inspections', recordsToPush);
      if (successIds.length > 0) await db.inspections.where('id').anyOf(successIds).modify({ synced: 1 });
      if (errors.length > 0) await logSync('error', 'Falha em algumas inspeções', errors[0].error);
    }

    // 2. PULL INSPECTIONS
    const { data: remoteInspec } = await withTimeout<any>(Promise.resolve(supabase.from('inspections').select('*').limit(1000)));
    if (remoteInspec) {
      for (const ri of remoteInspec) {
        if (deletedIds.has(ri.id)) continue;
        const local = await db.inspections.get(ri.id);
        if (!local || local.synced !== 0) {
          await db.inspections.put({
            id: ri.id, clientId: ri.client_id, templateId: ri.template_id,
            consultantName: ri.consultant_name, inspectionDate: new Date(ri.inspection_date),
            status: ri.status as any, observations: ri.observations,
            createdAt: new Date(ri.created_at), synced: 1,
            completedAt: ri.completed_at ? new Date(ri.completed_at) : undefined,
            ilpiCapacity: ri.ilpi_capacity, residentsTotal: ri.residents_total,
            residentsMale: ri.residents_male, residentsFemale: ri.residents_female,
            dependencyLevel1: ri.dependency_level1, dependencyLevel2: ri.dependency_level2,
            dependencyLevel3: ri.dependency_level3, accompanistName: ri.accompanist_name,
            accompanistRole: ri.accompanist_role, signatureDataUrl: ri.signature_data_url
          });
        }
      }
    }

    // 3. Sync RESPONSES (PUSH)
    const resQuery = isManual ? db.responses.filter(r => r.synced !== 1) : db.responses.where('synced').equals(0);
    const pendingResponses = await resQuery.toArray();
    if (pendingResponses.length > 0) {
      const recordsToPush = pendingResponses.map(r => ({
        id: r.id, inspection_id: r.inspectionId, item_id: r.itemId,
        result: r.result, situation_description: r.situationDescription,
        corrective_action: r.correctiveAction, created_at: r.createdAt,
        updated_at: r.updatedAt, user_id: user.id, custom_description: r.customDescription
      }));
      const { successIds, errors } = await safeBatchUpsert('responses', recordsToPush);
      if (successIds.length > 0) await db.responses.where('id').anyOf(successIds).modify({ synced: 1 });
    }

    // 3. PULL RESPONSES
    const { data: remoteRes } = await withTimeout<any>(Promise.resolve(supabase.from('responses').select('*').limit(1000)));
    if (remoteRes) {
      for (const rr of remoteRes) {
        if (deletedIds.has(rr.id)) continue;
        const local = await db.responses.get(rr.id);
        if (!local || local.synced !== 0) {
          await db.responses.put({
            id: rr.id, inspectionId: rr.inspection_id, itemId: rr.item_id,
            result: rr.result as any, situationDescription: rr.situation_description,
            correctiveAction: rr.corrective_action, createdAt: new Date(rr.created_at),
            updatedAt: new Date(rr.updated_at), photos: [], synced: 1,
            customDescription: rr.custom_description
          });
        }
      }
    }

    // 4. Sync PHOTOS (PUSH)
    const photoQuery = isManual ? db.photos.filter(p => p.synced !== 1) : db.photos.where('synced').equals(0);
    const pendingPhotos = await photoQuery.toArray();
    if (pendingPhotos.length > 0) {
      const recordsToPush = pendingPhotos.map(p => ({
        id: p.id, response_id: p.responseId, data_url: p.dataUrl,
        caption: p.caption, taken_at: p.takenAt, user_id: user.id
      }));
      const { successIds } = await safeBatchUpsert('photos', recordsToPush);
      if (successIds.length > 0) await db.photos.where('id').anyOf(successIds).modify({ synced: 1 });
    }

    // 4. PULL PHOTOS
    const { data: remotePh } = await withTimeout<any>(Promise.resolve(supabase.from('photos').select('*').limit(1000)));
    if (remotePh) {
      for (const rp of remotePh) {
        if (deletedIds.has(rp.id)) continue;
        const local = await db.photos.get(rp.id);
        if (!local || local.synced !== 0) {
          await db.photos.put({
            id: rp.id, responseId: rp.response_id, dataUrl: rp.data_url,
            caption: rp.caption, takenAt: new Date(rp.taken_at), synced: 1
          });
        }
      }
    }

    // 5. Sync SCHEDULES (PUSH)
    const schQuery = isManual ? db.schedules.filter(s => s.synced !== 1) : db.schedules.where('synced').equals(0);
    const pendingSchedules = await schQuery.toArray();
    if (pendingSchedules.length > 0) {
      const recordsToPush = pendingSchedules.map(s => ({
        id: s.id, client_id: s.clientId, scheduled_at: s.scheduledAt,
        status: s.status, notes: s.notes, user_id: user.id
      }));
      const { successIds } = await safeBatchUpsert('schedules', recordsToPush);
      if (successIds.length > 0) await db.schedules.where('id').anyOf(successIds).modify({ synced: 1 });
    }

    // 5. PULL SCHEDULES
    const { data: remoteSch } = await withTimeout<any>(Promise.resolve(supabase.from('schedules').select('*').limit(1000)));
    if (remoteSch) {
      for (const rs of remoteSch) {
        if (deletedIds.has(rs.id)) continue;
        const local = await db.schedules.get(rs.id);
        if (!local || local.synced !== 0) {
          await db.schedules.put({
            id: rs.id, clientId: rs.client_id, scheduledAt: new Date(rs.scheduled_at),
            status: rs.status as any, notes: rs.notes, user_id: rs.user_id, synced: 1
          });
        }
      }
    }

    // CLEANUP ORPHANS (The 200+ responses issue)
    const orphans = await db.responses.filter(r => r.synced === 0).toArray();
    let orphanCount = 0;
    for (const orphan of orphans) {
      const parent = await db.inspections.get(orphan.inspectionId);
      if (!parent) {
        await db.responses.delete(orphan.id);
        orphanCount++;
      }
    }
    if (orphanCount > 0) await logSync('info', `Limpeza concluída: ${orphanCount} respostas órfãs removidas.`);

    await logSync('info', 'Sincronização concluída com sucesso');
    if (isManual) alert('Sincronização concluída!');
  } catch (err: any) {
    await logSync('error', 'Erro inesperado na sincronização', err?.message || err);
    if (isManual) alert('Erro na sincronização: ' + (err?.message || err));
  } finally {
    (window as any).isSyncingGlobally = false;
  }
}
