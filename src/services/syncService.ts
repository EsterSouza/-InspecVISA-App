import { db } from '../db/database';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { dataUrlToBlob } from '../utils/imageUtils';

const withTimeout = <T>(promise: Promise<T>, ms: number = 15000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('SYNC_TIMEOUT')), ms))
  ]);
};

export async function syncData() {
  const user = useAuthStore.getState().user;
  if (!user) return;

  // Global lock to prevent concurrent syncs
  if ((window as any).isSyncingGlobally) return;
  (window as any).isSyncingGlobally = true;

  try {
    console.log('[Sync] Starting Safe Sync...');

    // 1. Sync CLIENTS
    // PUSH Pending
    const pendingClients = await db.clients.where('synced').equals(0).toArray();
    if (pendingClients.length > 0) {
      // PHASE 26 Merge logic remains: check CNPJ before push
      const { data: remoteCnpjData } = await withTimeout<any>(Promise.resolve(supabase.from('clients').select('id, cnpj')));
      const remoteCnpjMap = new Map<string, string>(
        remoteCnpjData?.filter((c: any) => c.cnpj).map((c: any) => [c.cnpj, c.id]) || []
      );

      for (const localClient of pendingClients) {
        if (localClient.cnpj && remoteCnpjMap.has(localClient.cnpj)) {
          const canonicalRemoteId = remoteCnpjMap.get(localClient.cnpj)!;
          if (localClient.id !== canonicalRemoteId) {
            const oldId = localClient.id;
            // Relink local records to canonical ID
            await db.inspections.where({ clientId: oldId }).modify({ clientId: canonicalRemoteId });
            await db.schedules.where({ clientId: oldId }).modify({ clientId: canonicalRemoteId });
            await db.clients.delete(oldId);
            localClient.id = canonicalRemoteId;
            await db.clients.put(localClient);
          }
        }
      }

      // Re-fetch to get updated IDs after merge
      const clientsToPush = await db.clients.where('synced').equals(0).toArray();
      const { error: pushError } = await withTimeout<any>(Promise.resolve(supabase.from('clients').upsert(
        clientsToPush.map(c => ({
          id: c.id, name: c.name, cnpj: c.cnpj, address: c.address, category: c.category,
          food_types: c.foodTypes, responsible_name: c.responsibleName, phone: c.phone,
          email: c.email, created_at: c.createdAt, user_id: user.id
        }))
      )));
      
      if (!pushError) {
        await db.clients.where('id').anyOf(clientsToPush.map(c => c.id)).modify({ synced: true });
      } else {
        console.error('[Sync] Client Push Error:', pushError);
      }
    }

    // PULL Clients
    const { data: remoteClients } = await withTimeout<any>(Promise.resolve(supabase.from('clients').select('*')));
    if (remoteClients) {
      for (const rc of remoteClients) {
        const local = await db.clients.get(rc.id);
        if (!local || local.synced !== false) {
          await db.clients.put({
            id: rc.id, name: rc.name, cnpj: rc.cnpj, address: rc.address,
            category: rc.category as any, foodTypes: rc.food_types,
            responsibleName: rc.responsible_name, phone: rc.phone, email: rc.email,
            createdAt: new Date(rc.created_at), city: rc.city, state: rc.state,
            synced: true
          });
        }
      }
    }

    // 2. Sync INSPECTIONS
    // PUSH Pending
    const pendingInspections = await db.inspections.where('synced').equals(0).toArray();
    if (pendingInspections.length > 0) {
      const { error: insPushError } = await withTimeout<any>(Promise.resolve(supabase.from('inspections').upsert(
        pendingInspections.map(i => ({
          id: i.id, client_id: i.clientId, template_id: i.templateId,
          consultant_name: i.consultantName, inspection_date: i.inspectionDate,
          status: i.status, observations: i.observations, created_at: i.createdAt,
          completed_at: i.completedAt, user_id: user.id
        }))
      )));
      if (!insPushError) {
        await db.inspections.where('id').anyOf(pendingInspections.map(i => i.id)).modify({ synced: true });
      }
    }

    // PULL Inspections
    const { data: remoteInspec } = await withTimeout<any>(Promise.resolve(supabase.from('inspections').select('*')));
    if (remoteInspec) {
      for (const ri of remoteInspec) {
        const local = await db.inspections.get(ri.id);
        if (!local || local.synced !== false) {
          await db.inspections.put({
            id: ri.id, clientId: ri.client_id, templateId: ri.template_id,
            consultantName: ri.consultant_name, inspectionDate: new Date(ri.inspection_date),
            status: ri.status as any, observations: ri.observations,
            createdAt: new Date(ri.created_at), synced: true,
            completedAt: ri.completed_at ? new Date(ri.completed_at) : undefined
          });
        }
      }
    }

    // 3. Sync RESPONSES
    // PUSH Pending
    const pendingResponses = await db.responses.where('synced').equals(0).toArray();
    if (pendingResponses.length > 0) {
      const { error: resPushError } = await withTimeout<any>(Promise.resolve(supabase.from('responses').upsert(
        pendingResponses.map(r => ({
          id: r.id, inspection_id: r.inspectionId, item_id: r.itemId,
          result: r.result, situation_description: r.situationDescription,
          corrective_action: r.correctiveAction, created_at: r.createdAt,
          updated_at: r.updatedAt, user_id: user.id
        }))
      )));
      if (!resPushError) {
        await db.responses.where('id').anyOf(pendingResponses.map(r => r.id)).modify({ synced: true });
      }
    }

    // PULL Responses
    const { data: remoteRes } = await withTimeout<any>(Promise.resolve(supabase.from('responses').select('*')), 25000);
    if (remoteRes) {
      for (const rr of remoteRes) {
        const local = await db.responses.get(rr.id);
        if (!local || local.synced !== false) {
          await db.responses.put({
            id: rr.id, inspectionId: rr.inspection_id, itemId: rr.item_id,
            result: rr.result as any, situationDescription: rr.situation_description,
            correctiveAction: rr.corrective_action, createdAt: new Date(rr.created_at),
            updatedAt: new Date(rr.updated_at), photos: [], synced: true
          });
        }
      }
    }

    // 4. Sync SCHEDULES
    // PUSH Pending
    const pendingSchedules = await db.schedules.where('synced').equals(0).toArray();
    if (pendingSchedules.length > 0) {
      const { error: schPushError } = await withTimeout<any>(Promise.resolve(supabase.from('schedules').upsert(
        pendingSchedules.map(s => ({
          id: s.id, client_id: s.clientId, scheduled_at: s.scheduledAt,
          status: s.status, notes: s.notes, user_id: user.id
        }))
      )));
      if (!schPushError) {
        await db.schedules.where('id').anyOf(pendingSchedules.map(s => s.id)).modify({ synced: true });
      }
    }

    // PULL Schedules
    const { data: remoteSch } = await withTimeout<any>(Promise.resolve(supabase.from('schedules').select('*')));
    if (remoteSch) {
      for (const rs of remoteSch) {
        const local = await db.schedules.get(rs.id);
        if (!local || local.synced !== false) {
          await db.schedules.put({
            id: rs.id, clientId: rs.client_id, scheduledAt: new Date(rs.scheduled_at),
            status: rs.status as any, notes: rs.notes, user_id: rs.user_id, synced: true
          });
        }
      }
    }

    // Sync Photos
    const localPhotos = await db.photos.toArray();
    for (const photo of localPhotos) {
      // Only upload if it's base64 (dataUrl)
      if (photo.dataUrl.startsWith('data:')) {
        try {
          const blob = dataUrlToBlob(photo.dataUrl);
          // NEW: Use shared folder instead of user-specific folder for multi-user sync
          const fileName = `shared/${photo.id}.jpg`;
          
          const { error: uploadError } = await withTimeout<any>(
            Promise.resolve(supabase.storage.from('photos').upload(fileName, blob, { 
              contentType: 'image/jpeg',
              upsert: true 
            })),
            30000 // 30s timeout for uploads
          );

          if (!uploadError) {
             const { data: { publicUrl } } = supabase.storage
               .from('photos')
               .getPublicUrl(fileName);
             
             // Update local record to use remote URL and free space
             await db.photos.update(photo.id, { dataUrl: publicUrl });
          } else {
            console.error('Photo Upload Error:', uploadError);
          }
        } catch (err) {
          console.error('Photo Process Error:', err);
        }
      }
    }

    // Sync Photo records to DB metadata table (if it exists, for now we just handle Storage)
    // In a full implementation, we'd also push/pull photo metadata to a 'photos' table in Postgres.

    console.log('Sync completed at:', new Date().toLocaleString());
  } catch (err) {
    console.error('Sync unexpected error:', err);
  } finally {
    (window as any).isSyncingGlobally = false;
  }
}
