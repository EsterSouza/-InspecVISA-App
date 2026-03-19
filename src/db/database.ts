import Dexie, { type Table } from 'dexie';
import type {
  Client,
  ChecklistTemplate,
  Inspection,
  InspectionResponse,
  InspectionPhoto,
  Schedule,
} from '../types';

export class InspectionDatabase extends Dexie {
  clients!: Table<Client>;
  templates!: Table<ChecklistTemplate>;
  inspections!: Table<Inspection>;
  responses!: Table<InspectionResponse>;
  photos!: Table<InspectionPhoto>;
  schedules!: Table<Schedule>;

  constructor() {
    super('InspectionDB');
    this.version(4).stores({
      clients:     'id, category, name, city, state, createdAt',
      templates:   'id, category',
      inspections: 'id, clientId, templateId, status, [clientId+status], inspectionDate, completedAt, createdAt',
      responses:   'id, inspectionId, itemId, result',
      photos:      'id, responseId',
      schedules:   'id, clientId, scheduledAt, status'
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
}
