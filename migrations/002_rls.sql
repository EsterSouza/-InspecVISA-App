-- ============================================================
-- Migration 002 — Row Level Security (Card 1.2)
-- InspecVISA — C&C Consultoria Sanitária
-- ============================================================

-- ─── 1. FUNÇÕES HELPER (SECURITY DEFINER) ───────────────────
-- Executam com privilégios elevados para evitar recursão infinita
-- quando policies consultam tenant_users (que também tem RLS).

-- Retorna todos os tenant_ids do usuário atual
CREATE OR REPLACE FUNCTION public.my_tenant_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
$$;

-- Verifica se o usuário atual é admin de um tenant específico
CREATE OR REPLACE FUNCTION public.is_tenant_admin(p_tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM tenant_users
    WHERE user_id = auth.uid()
      AND tenant_id = p_tenant_id
      AND role = 'admin'
  )
$$;

-- Verifica se o usuário atual é admin ou consultant de um tenant
CREATE OR REPLACE FUNCTION public.is_tenant_staff(p_tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM tenant_users
    WHERE user_id = auth.uid()
      AND tenant_id = p_tenant_id
      AND role IN ('admin', 'consultant')
  )
$$;

-- ─── 2. HABILITAR RLS ────────────────────────────────────────

ALTER TABLE tenants                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_checklist_access  ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections              ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses                ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules                ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos                   ENABLE ROW LEVEL SECURITY;

-- ─── 3. POLICIES — tenants ───────────────────────────────────

-- Qualquer membro pode ver o próprio tenant
CREATE POLICY "tenants_select" ON tenants
  FOR SELECT USING (id IN (SELECT my_tenant_ids()));

-- Qualquer usuário autenticado pode criar um tenant (vai ser o admin)
CREATE POLICY "tenants_insert" ON tenants
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Apenas admin pode editar o tenant
CREATE POLICY "tenants_update" ON tenants
  FOR UPDATE USING (is_tenant_admin(id));

-- Apenas admin pode deletar o tenant
CREATE POLICY "tenants_delete" ON tenants
  FOR DELETE USING (is_tenant_admin(id));

-- ─── 4. POLICIES — tenant_users ──────────────────────────────

-- Admin e consultant podem ver membros do próprio tenant
-- O próprio usuário sempre pode ver seu registro
CREATE POLICY "tenant_users_select" ON tenant_users
  FOR SELECT USING (
    tenant_id IN (SELECT my_tenant_ids())
    AND (
      is_tenant_staff(tenant_id)
      OR user_id = auth.uid()
    )
  );

-- Apenas admin pode adicionar membros
CREATE POLICY "tenant_users_insert" ON tenant_users
  FOR INSERT WITH CHECK (is_tenant_admin(tenant_id));

-- Apenas admin pode alterar roles
CREATE POLICY "tenant_users_update" ON tenant_users
  FOR UPDATE USING (is_tenant_admin(tenant_id));

-- Apenas admin pode remover membros
CREATE POLICY "tenant_users_delete" ON tenant_users
  FOR DELETE USING (is_tenant_admin(tenant_id));

-- ─── 5. POLICIES — tenant_checklist_access ───────────────────

-- Qualquer membro do tenant pode ver os checklists liberados
CREATE POLICY "tca_select" ON tenant_checklist_access
  FOR SELECT USING (tenant_id IN (SELECT my_tenant_ids()));

-- Apenas admin pode liberar checklists
CREATE POLICY "tca_insert" ON tenant_checklist_access
  FOR INSERT WITH CHECK (is_tenant_admin(tenant_id));

-- Apenas admin pode alterar
CREATE POLICY "tca_update" ON tenant_checklist_access
  FOR UPDATE USING (is_tenant_admin(tenant_id));

-- Apenas admin pode revogar
CREATE POLICY "tca_delete" ON tenant_checklist_access
  FOR DELETE USING (is_tenant_admin(tenant_id));

-- ─── 6. POLICIES — clients ───────────────────────────────────

CREATE POLICY "clients_select" ON clients
  FOR SELECT USING (tenant_id IN (SELECT my_tenant_ids()));

CREATE POLICY "clients_insert" ON clients
  FOR INSERT WITH CHECK (
    tenant_id IN (SELECT my_tenant_ids())
    AND is_tenant_staff(tenant_id)
  );

CREATE POLICY "clients_update" ON clients
  FOR UPDATE USING (
    tenant_id IN (SELECT my_tenant_ids())
    AND is_tenant_staff(tenant_id)
  );

CREATE POLICY "clients_delete" ON clients
  FOR DELETE USING (is_tenant_admin(tenant_id));

-- ─── 7. POLICIES — inspections ───────────────────────────────

CREATE POLICY "inspections_select" ON inspections
  FOR SELECT USING (tenant_id IN (SELECT my_tenant_ids()));

CREATE POLICY "inspections_insert" ON inspections
  FOR INSERT WITH CHECK (
    tenant_id IN (SELECT my_tenant_ids())
    AND is_tenant_staff(tenant_id)
  );

CREATE POLICY "inspections_update" ON inspections
  FOR UPDATE USING (
    tenant_id IN (SELECT my_tenant_ids())
    AND is_tenant_staff(tenant_id)
  );

CREATE POLICY "inspections_delete" ON inspections
  FOR DELETE USING (
    tenant_id IN (SELECT my_tenant_ids())
    AND is_tenant_staff(tenant_id)
  );

-- ─── 8. POLICIES — responses ─────────────────────────────────

CREATE POLICY "responses_select" ON responses
  FOR SELECT USING (tenant_id IN (SELECT my_tenant_ids()));

CREATE POLICY "responses_insert" ON responses
  FOR INSERT WITH CHECK (
    tenant_id IN (SELECT my_tenant_ids())
    AND is_tenant_staff(tenant_id)
  );

CREATE POLICY "responses_update" ON responses
  FOR UPDATE USING (
    tenant_id IN (SELECT my_tenant_ids())
    AND is_tenant_staff(tenant_id)
  );

CREATE POLICY "responses_delete" ON responses
  FOR DELETE USING (
    tenant_id IN (SELECT my_tenant_ids())
    AND is_tenant_staff(tenant_id)
  );

-- ─── 9. POLICIES — schedules ─────────────────────────────────

CREATE POLICY "schedules_select" ON schedules
  FOR SELECT USING (tenant_id IN (SELECT my_tenant_ids()));

CREATE POLICY "schedules_insert" ON schedules
  FOR INSERT WITH CHECK (
    tenant_id IN (SELECT my_tenant_ids())
    AND is_tenant_staff(tenant_id)
  );

CREATE POLICY "schedules_update" ON schedules
  FOR UPDATE USING (
    tenant_id IN (SELECT my_tenant_ids())
    AND is_tenant_staff(tenant_id)
  );

CREATE POLICY "schedules_delete" ON schedules
  FOR DELETE USING (
    tenant_id IN (SELECT my_tenant_ids())
    AND is_tenant_staff(tenant_id)
  );

-- ─── NOTA: As policies legadas "Acesso apenas ao dono" (user_id = auth.uid())
-- foram removidas manualmente pois conflitavam com o isolamento por tenant.
-- DROP POLICY "Acesso apenas ao dono" ON clients/inspections/photos/responses/schedules

-- ─── 10. POLICIES — photos ───────────────────────────────────

CREATE POLICY "photos_select" ON photos
  FOR SELECT USING (tenant_id IN (SELECT my_tenant_ids()));

CREATE POLICY "photos_insert" ON photos
  FOR INSERT WITH CHECK (
    tenant_id IN (SELECT my_tenant_ids())
    AND is_tenant_staff(tenant_id)
  );

CREATE POLICY "photos_update" ON photos
  FOR UPDATE USING (
    tenant_id IN (SELECT my_tenant_ids())
    AND is_tenant_staff(tenant_id)
  );

CREATE POLICY "photos_delete" ON photos
  FOR DELETE USING (
    tenant_id IN (SELECT my_tenant_ids())
    AND is_tenant_staff(tenant_id)
  );
