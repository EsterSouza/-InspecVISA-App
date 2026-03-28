import Dexie, { type Table } from 'dexie';
import type {
  Client,
  ChecklistTemplate,
  Inspection,
  InspectionResponse,
  InspectionPhoto,
  Schedule,
  SyncLog,
} from '../types';
import { supabase } from '../lib/supabase';

export class InspectionDatabase extends Dexie {
  clients!: Table<Client>;
  templates!: Table<ChecklistTemplate>;
  inspections!: Table<Inspection>;
  responses!: Table<InspectionResponse>;
  photos!: Table<InspectionPhoto>;
  schedules!: Table<Schedule>;
  sync_logs!: Table<SyncLog>;

  constructor() {
    super('InspectionDB');
    this.version(7).stores({
      clients:     'id, category, name, city, state, createdAt, updatedAt, synced',
      templates:   'id, category',
      inspections: 'id, clientId, templateId, status, [clientId+status], inspectionDate, completedAt, createdAt, updatedAt, synced',
      responses:   'id, inspectionId, itemId, result, updatedAt, synced',
      photos:      'id, responseId, synced',
      schedules:   'id, clientId, scheduledAt, status, updatedAt, synced',
      sync_logs:   '++id, timestamp, level'
    });

    // Auto-manage sync metadata via hooks
    const tablesToHook = [this.clients, this.inspections, this.responses, this.schedules, this.photos];
    tablesToHook.forEach(table => {
      table.hook('creating', (primaryKey, obj) => {
        obj.synced = 0; // 0 = pending
        obj.updatedAt = new Date();
      });
      table.hook('updating', (mods, primKey, obj) => {
        // If the update itself is setting synced=1 (from syncService), don't revert it
        if (mods.hasOwnProperty('synced')) return;
        
        return {
          ...mods,
          synced: 0, // 0 = pending
          updatedAt: new Date()
        };
      });
    });
  }
}

export const db = new InspectionDatabase();

// Initialize templates seed on first load
export async function initializeDatabase(templates: ChecklistTemplate[]) {
  // Use bulkPut to avoid BulkError if IDs already exist
  await db.templates.bulkPut(templates);
}

// Recursive deletion of a client and all associated data
export async function deleteClient(clientId: string) {
  await db.transaction('rw', [db.clients, db.inspections, db.responses, db.photos, db.schedules], async () => {
    // 1. Get all inspections for this client
    const clientInspections = await db.inspections.where('clientId').equals(clientId).toArray();
    const inspectionIds = clientInspections.map(i => i.id);

    if (inspectionIds.length > 0) {
      // 2. Get all responses for these inspections
      const responses = await db.responses.where('inspectionId').anyOf(inspectionIds).toArray();
      const responseIds = responses.map(r => r.id);

      if (responseIds.length > 0) {
        // 3. Delete all photos for these responses
        await db.photos.where('responseId').anyOf(responseIds).delete();
        // 4. Delete all responses
        await db.responses.bulkDelete(responseIds);
      }

      // 5. Delete all inspections
      await db.inspections.bulkDelete(inspectionIds);
    }

    // 6. Delete all schedules for this client
    await db.schedules.where('clientId').equals(clientId).delete();

    // 7. Delete the client record
    await db.clients.delete(clientId);
  });

  // Attempt to delete from Supabase if online
  try {
    await supabase.from('clients').delete().eq('id', clientId);
    // Also delete inspections, responses and schedules from Supabase
    // This is optional if RLS handles it, but better be explicit
    await supabase.from('inspections').delete().eq('client_id', clientId);
    await supabase.from('schedules').delete().eq('client_id', clientId);
  } catch (err) {
    console.warn('Could not sync client deletion to Supabase.', err);
  }
}

export async function deleteInspection(inspectionId: string) {
  await db.transaction('readwrite', [db.inspections, db.responses, db.photos], async () => {
    // 1. Get all responses for this inspection
    const responses = await db.responses.where('inspectionId').equals(inspectionId).toArray();
    const responseIds = responses.map(r => r.id);

    // 2. Delete all photos for these responses
    await db.photos.where('responseId').anyOf(responseIds).delete();

    // 3. Delete responses
    await db.responses.bulkDelete(responseIds);

    // 4. Delete the inspection
    await db.inspections.delete(inspectionId);
  });

  // Attempt to delete from Supabase if online
  try {
    await supabase.from('inspections').delete().eq('id', inspectionId);
    // Note: Responses and Photos in Supabase should ideally be deleted too
    // In a full implementation, we'd have a 'photos' table in PG.
    await supabase.from('responses').delete().eq('inspection_id', inspectionId);
  } catch (err) {
    console.warn('Could not sync inspection deletion to Supabase.', err);
  }
}

export async function deleteSchedule(scheduleId: string) {
  await db.schedules.delete(scheduleId);

  // Attempt to delete from Supabase if online
  try {
    await supabase.from('schedules').delete().eq('id', scheduleId);
  } catch (err) {
    console.warn('Could not sync schedule deletion to Supabase.', err);
  }
}
