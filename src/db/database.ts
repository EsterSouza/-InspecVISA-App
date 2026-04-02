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
import { useAuthStore } from '../store/useAuthStore';

export interface DeletionSync {
  id?: number;
  table: string;
  recordId: string;
  timestamp: Date;
}

export class InspectionDatabase extends Dexie {
  clients!: Table<Client>;
  templates!: Table<ChecklistTemplate>;
  inspections!: Table<Inspection>;
  responses!: Table<InspectionResponse>;
  photos!: Table<InspectionPhoto>;
  schedules!: Table<Schedule>;
  sync_logs!: Table<SyncLog>;
  deletions_sync!: Table<DeletionSync>;

  constructor() {
    super('InspectionDB');
    this.version(10).stores({ // ✅ Bumped to version 10
      clients:     'id, category, name, city, state, tenantId, deletedAt, createdAt, updatedAt, synced',
      templates:   'id, category',
      inspections: 'id, clientId, templateId, status, tenantId, deletedAt, [clientId+status], inspectionDate, completedAt, createdAt, updatedAt, synced',
      responses:   'id, inspectionId, itemId, result, tenantId, deletedAt, updatedAt, synced',
      photos:      'id, responseId, tenantId, deletedAt, synced',
      schedules:   'id, clientId, scheduledAt, status, tenantId, deletedAt, updatedAt, synced',
      sync_logs:   '++id, timestamp, level',
      deletions_sync: '++id, table, recordId'
    });

    // Auto-manage sync metadata via hooks
    const tablesToHook = [this.clients, this.inspections, this.responses, this.schedules, this.photos];
    tablesToHook.forEach(table => {
      table.hook('creating', (primaryKey, obj) => {
        const tenantId = useAuthStore.getState().tenantInfo?.tenantId;

        obj.synced = 0; // 0 = pending
        obj.updatedAt = new Date();
        obj.deletedAt = null; // ✅ Inicializa como não deletado
        
        if (tenantId) {
          obj.tenantId = tenantId;
        }
      });

      table.hook('updating', (mods: Record<string, any>, primKey, obj) => {
        // ✅ FIX #7: Se o syncService está explicitamente marcando como sincronizado, retorna mods sem alterar
        if (mods.synced === 1) return mods;

        // Qualquer outra atualização do usuário reseta para pendente
        return {
          ...mods,
          synced: 0,
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

// ✅ SOFT DELETE: Marca como deletado em vez de apagar fisicamente do banco local
export async function deleteClient(clientId: string) {
  const now = new Date();
  
  await db.transaction('rw', [db.clients, db.inspections, db.responses, db.photos, db.schedules], async () => {
    // Marca cliente como deletado
    await db.clients.update(clientId, { 
      deletedAt: now, 
      synced: 0, // ✅ Força sync para enviar ao servidor
      updatedAt: now 
    });

    // Marca inspeções do cliente como deletadas
    const clientInspections = await db.inspections.where('clientId').equals(clientId).toArray();
    for (const inspec of clientInspections) {
      await db.inspections.update(inspec.id, { 
        deletedAt: now, 
        synced: 0, 
        updatedAt: now 
      });
      
      // Marca respostas como deletadas
      const responses = await db.responses.where('inspectionId').equals(inspec.id).toArray();
      for (const res of responses) {
        await db.responses.update(res.id, { 
          deletedAt: now, 
          synced: 0, 
          updatedAt: now 
        });
        
        // Marca fotos como deletadas
        await db.photos.where('responseId').equals(res.id).modify({ 
          deletedAt: now, 
          synced: 0, 
          updatedAt: now 
        });
      }
    }
    
    // Marca agendamentos como deletados
    await db.schedules.where('clientId').equals(clientId).modify({ 
      deletedAt: now, 
      synced: 0, 
      updatedAt: now 
    });
  });
}

export async function deleteInspection(inspectionId: string) {
  const now = new Date();
  
  await db.transaction('rw', [db.inspections, db.responses, db.photos], async () => {
    await db.inspections.update(inspectionId, { 
      deletedAt: now, 
      synced: 0, 
      updatedAt: now 
    });
    
    const responses = await db.responses.where('inspectionId').equals(inspectionId).toArray();
    for (const res of responses) {
      await db.responses.update(res.id, { 
        deletedAt: now, 
        synced: 0, 
        updatedAt: now 
      });
      
      await db.photos.where('responseId').equals(res.id).modify({ 
        deletedAt: now, 
        synced: 0, 
        updatedAt: now 
      });
    }
  });
}

export async function deleteSchedule(scheduleId: string) {
  const now = new Date();
  await db.schedules.update(scheduleId, { 
    deletedAt: now, 
    synced: 0, 
    updatedAt: now 
  });
}

