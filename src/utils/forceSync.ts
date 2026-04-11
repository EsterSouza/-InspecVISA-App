import { db } from '../db/database';
import { supabase } from '../lib/supabase';

export async function forcePushFinalData() {
  console.log('🚀 Iniciando Push Final de Dados Locais...');
  
  const tables = [
    { name: 'clients', dexie: db.clients },
    { name: 'inspections', dexie: db.inspections },
    { name: 'responses', dexie: db.responses },
    { name: 'photos', dexie: db.photos },
    { name: 'schedules', dexie: db.schedules }
  ];

  let totalSynced = 0;
  let errors = 0;

  for (const table of tables) {
    const pending = await table.dexie.where('synced').equals(0).toArray();
    
    if (pending.length === 0) continue;

    console.log(`📦 Processando ${pending.length} registros pendentes em ${table.name}...`);

    for (const record of pending) {
      try {
        // Map to PG format (reusing logic or simple mapping)
        const pgRecord = mapRecordToSupabase(table.name, record);
        
        const { error } = await supabase.from(table.name).upsert(pgRecord);
        
        if (!error) {
          await table.dexie.update(record.id, { synced: 1 });
          totalSynced++;
        } else {
          console.error(`❌ Erro no Supabase (${table.name}:${record.id}):`, error);
          errors++;
        }
      } catch (err) {
        console.error(`❌ Erro de rede (${table.name}:${record.id}):`, err);
        errors++;
      }
    }
  }

  console.log(`✅ Push Final Concluído. Sincronizados: ${totalSynced}, Erros: ${errors}`);
  return { totalSynced, errors };
}

function mapRecordToSupabase(tableName: string, record: any) {
  const mapped: any = { ...record };
  
  // Basic date mapping
  Object.keys(mapped).forEach(key => {
    if (mapped[key] instanceof Date) {
      mapped[key] = mapped[key].toISOString();
    }
  });

  // Specific table mapping (sync with DB migration types)
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
      created_at: record.createdAt, accompanist_name: record.accompanistName,
      accompanist_role: record.accompanistRole, ilpi_capacity: record.ilpiCapacity,
      residents_total: record.residentsTotal, dependency_level1: record.dependencyLevel1,
      dependency_level2: record.dependencyLevel2, dependency_level3: record.dependencyLevel3
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

  // Fallback map
  const pg: any = {};
  for (const key in mapped) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    pg[snakeKey] = mapped[key];
  }
  return pg;
}
