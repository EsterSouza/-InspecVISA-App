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
    this.version(12).stores({ 
      clients: 'id, category, name, city, state, tenantId, deletedAt, createdAt, updatedAt, synced',
      templates: 'id, category',
      inspections: 'id, clientId, templateId, status, tenantId, deletedAt, [clientId+status], inspectionDate, completedAt, createdAt, updatedAt, synced',
      responses: 'id, inspectionId, itemId, result, tenantId, deletedAt, updatedAt, synced, [inspectionId+itemId]',
      photos: 'id, responseId, tenantId, deletedAt, synced',
      schedules: 'id, clientId, scheduledAt, status, tenantId, deletedAt, updatedAt, synced',
      sync_logs: '++id, timestamp, level',
      deletions_sync: '++id, table, recordId'
    });
  }

  /**
   * ✅ NEW: ONLINE-FIRST UPSERT
   * Tenta salvar no Supabase primariamente. Se houver erro de conexão, 
   * salva no Dexie com synced = 0 para posterior sincronização silenciosa.
   */
  async onlineUpsert(tableName: string, record: any, dexieTable: Table<any>) {
    const tenantId = useAuthStore.getState().tenantInfo?.tenantId;
    const updatedAt = new Date();
    
    const enrichedRecord = {
      ...record,
      tenantId: record.tenantId || tenantId,
      updatedAt,
      synced: 0 // Iniciamos como 0, mudamos para 1 se o Supabase aceitar
    };

    // Prepare for Postgres (map camelCase to snake_case if necessary)
    // For now, assume Supabase tables match the record structure OR we map them
    // Note: Our types use camelCase, but PG uses snake_case. 
    // We need a mapper if we are going to go direct.
    const pgRecord = this.mapToPostgres(tableName, enrichedRecord);

    if (navigator.onLine) {
      try {
        const { error } = await supabase.from(tableName).upsert(pgRecord);
        if (!error) {
          enrichedRecord.synced = 1;
        } else {
          console.warn(`[DB] Supabase upsert fail for ${tableName}:`, error);
        }
      } catch (err) {
        console.warn(`[DB] Network error during ${tableName} upsert`, err);
      }
    }

    // Always save to Dexie as cache/ref of truth for the UI
    await dexieTable.put(enrichedRecord);
    return enrichedRecord;
  }

  private mapToPostgres(tableName: string, record: any) {
    // Simple mapper based on existing syncService logic
    const mapped: any = { ...record };
    
    // Convert Dates to ISO strings for PG
    Object.keys(mapped).forEach(key => {
      if (mapped[key] instanceof Date) {
        mapped[key] = mapped[key].toISOString();
      }
    });

    // Handle specific table mapping (CamelCase -> SnakeCase)
    if (tableName === 'clients') {
      return {
        id: record.id, name: record.name, cnpj: record.cnpj, address: record.address, 
        category: record.category, food_types: record.foodTypes, responsible_name: record.responsibleName,
        phone: record.phone, email: record.email, city: record.city, state: record.state,
        tenant_id: record.tenantId, deleted_at: record.deletedAt, updated_at: record.updatedAt,
        created_at: record.createdAt
      };
    }

    if (tableName === 'inspections') {
      return {
        id: record.id, client_id: record.clientId, template_id: record.templateId,
        consultant_name: record.consultantName, inspection_date: record.inspectionDate,
        status: record.status, observations: record.observations, 
        completed_at: record.completedAt, tenant_id: record.tenantId,
        deleted_at: record.deletedAt, updated_at: record.updatedAt,
        created_at: record.createdAt,
        accompanist_name: record.accompanistName, accompanist_role: record.accompanistRole,
        ilpi_capacity: record.ilpiCapacity, residents_total: record.residentsTotal,
        dependency_level1: record.dependencyLevel1, dependency_level2: record.dependencyLevel2,
        dependency_level3: record.dependencyLevel3
      };
    }

    if (tableName === 'responses') {
       return {
         id: record.id, inspection_id: record.inspectionId, item_id: record.itemId,
         result: record.result, situation_description: record.situationDescription,
         corrective_action: record.correctiveAction, tenant_id: record.tenantId,
         deleted_at: record.deletedAt, updated_at: record.updatedAt,
         created_at: record.createdAt, custom_description: record.customDescription
       };
    }

    if (tableName === 'photos') {
      return {
        id: record.id, response_id: record.responseId, data_url: record.dataUrl,
        caption: record.caption, taken_at: record.takenAt,
        tenant_id: record.tenantId, deleted_at: record.deletedAt, updated_at: record.updatedAt
      };
    }

    if (tableName === 'schedules') {
      return {
        id: record.id, client_id: record.clientId, scheduled_at: record.scheduledAt,
        status: record.status, notes: record.notes, user_id: record.user_id,
        tenant_id: record.tenantId, deleted_at: record.deletedAt, updated_at: record.updatedAt
      };
    }

    // Default: try to camel->snake simple map for any other tables
    const pg: any = {};
    for (const key in mapped) {
      if (key === 'tenantId') {
        pg.tenant_id = mapped[key];
      } else if (key === 'deletedAt') {
        pg.deleted_at = mapped[key];
      } else if (key === 'updatedAt') {
        pg.updated_at = mapped[key];
      } else if (key === 'createdAt') {
        pg.created_at = mapped[key];
      } else {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        pg[snakeKey] = mapped[key];
      }
    }
    return pg;
  }
}

export const db = new InspectionDatabase();

export async function initializeDatabase(templates: ChecklistTemplate[]) {
  await db.templates.bulkPut(templates);
}

// ✅ REFACTORED DELETE (ONLINE-FIRST)
export async function deleteClient(clientId: string) {
  const now = new Date();
  const tenantId = useAuthStore.getState().tenantInfo?.tenantId;

  // 1. Tenta deletar no Supabase (Soft Delete)
  if (navigator.onLine) {
    await supabase.from('clients').update({ deleted_at: now }).eq('id', clientId);
  }

  // 2. Atualiza localmente
  await db.clients.update(clientId, { deletedAt: now, synced: navigator.onLine ? 1 : 0, updatedAt: now });
  
  // Marca inspeções relacionadas
  await db.inspections.where('clientId').equals(clientId).modify({ deletedAt: now, synced: 0, updatedAt: now });
}

export async function deleteInspection(inspectionId: string) {
  const now = new Date();
  if (navigator.onLine) {
    await supabase.from('inspections').update({ deleted_at: now }).eq('id', inspectionId);
  }
  await db.inspections.update(inspectionId, { deletedAt: now, synced: navigator.onLine ? 1 : 0, updatedAt: now });
}
