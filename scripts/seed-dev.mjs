/**
 * Seed de desenvolvimento — InspecVISA
 * Cria usuários, tenants e permissões para ambiente dev.
 *
 * Uso: node scripts/seed-dev.mjs
 *
 * Usuários criados:
 *   admin@dev.inspecvisa      / Dev@123456  → admin    (C&C Consultoria)
 *   consultora@dev.inspecvisa / Dev@123456  → consultant (C&C Consultoria)
 *   cliente@dev.inspecvisa    / Dev@123456  → client   (Salão Bella - estetica)
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL     = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Defina VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env antes de rodar.');
  console.error('   Exemplo: node --env-file=.env scripts/seed-dev.mjs');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── UUIDs fixos para reprodutibilidade ──────────────────────
const IDS = {
  tenantCC:     'aaaaaaaa-0001-0001-0001-000000000001',
  tenantSalao:  'aaaaaaaa-0002-0002-0002-000000000002',
  userAdmin:    'bbbbbbbb-0001-0001-0001-000000000001',
  userConsult:  'bbbbbbbb-0002-0002-0002-000000000002',
  userClient:   'bbbbbbbb-0003-0003-0003-000000000003',
};

const DEV_PASSWORD = 'Dev@123456';

// ─── Helpers ─────────────────────────────────────────────────

async function createUser(id, email, name) {
  const { data, error } = await supabase.auth.admin.createUser({
    user_metadata: { full_name: name },
    email,
    password: DEV_PASSWORD,
    email_confirm: true,
  });

  if (error?.message?.includes('already been registered')) {
    console.log(`  → ${email} já existe, pulando`);
    return;
  }
  if (error) throw new Error(`Erro ao criar ${email}: ${error.message}`);
  console.log(`  ✓ ${email} criado (${data.user.id})`);
}

async function upsert(table, rows) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' });
  if (error) throw new Error(`Erro em ${table}: ${error.message}`);
  console.log(`  ✓ ${table}: ${rows.length} registro(s)`);
}

// ─── Seed ────────────────────────────────────────────────────

async function seed() {
  console.log('\n🌱 InspecVISA — Seed de desenvolvimento\n');

  // 1. Usuários
  console.log('👤 Criando usuários...');
  await createUser(IDS.userAdmin,   'admin@dev.inspecvisa',      'Admin Dev');
  await createUser(IDS.userConsult, 'consultora@dev.inspecvisa', 'Consultora Dev');
  await createUser(IDS.userClient,  'cliente@dev.inspecvisa',    'Cliente Dev');

  // Busca IDs reais (o Supabase pode não usar os IDs que passamos no createUser)
  const { data: users } = await supabase.auth.admin.listUsers();
  const find = (email) => users.users.find(u => u.email === email)?.id;

  const adminId   = find('admin@dev.inspecvisa');
  const consultId = find('consultora@dev.inspecvisa');
  const clientId  = find('cliente@dev.inspecvisa');

  if (!adminId || !consultId || !clientId) {
    throw new Error('Não foi possível encontrar os usuários criados');
  }

  // 2. Tenants
  console.log('\n🏢 Criando tenants...');
  await upsert('tenants', [
    { id: IDS.tenantCC,    name: 'C&C Consultoria Sanitária', slug: 'cc-consultoria',  created_by: adminId },
    { id: IDS.tenantSalao, name: 'Salão Bella (Dev)',         slug: 'salao-bella-dev', created_by: adminId },
  ]);

  // 3. Membros dos tenants
  console.log('\n👥 Associando usuários aos tenants...');
  await upsert('tenant_users', [
    { id: 'cccccccc-0001-0001-0001-000000000001', tenant_id: IDS.tenantCC,    user_id: adminId,   role: 'admin'      },
    { id: 'cccccccc-0002-0002-0002-000000000002', tenant_id: IDS.tenantCC,    user_id: consultId, role: 'consultant' },
    { id: 'cccccccc-0003-0003-0003-000000000003', tenant_id: IDS.tenantSalao, user_id: clientId,  role: 'client'     },
  ]);

  // 4. Checklists liberados para o cliente de teste
  console.log('\n✅ Liberando checklists para Salão Bella...');
  await upsert('tenant_checklist_access', [
    { id: 'dddddddd-0001-0001-0001-000000000001', tenant_id: IDS.tenantSalao, checklist_type: 'estetica' },
  ]);

  console.log('\n✅ Seed concluído!\n');
  console.log('┌─────────────────────────────────────────────────────┐');
  console.log('│  Usuários de teste                                  │');
  console.log('├─────────────────────────────────────────────────────┤');
  console.log('│  admin@dev.inspecvisa      Dev@123456  (admin)      │');
  console.log('│  consultora@dev.inspecvisa Dev@123456  (consultant) │');
  console.log('│  cliente@dev.inspecvisa    Dev@123456  (client)     │');
  console.log('└─────────────────────────────────────────────────────┘\n');
}

seed().catch((err) => {
  console.error('\n❌ Seed falhou:', err.message);
  process.exit(1);
});
