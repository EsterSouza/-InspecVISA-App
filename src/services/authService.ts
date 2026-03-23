import { supabase } from '../lib/supabase';
import type { ClientCategory } from '../types';

// ============================================================
// Tipos
// ============================================================

export type TenantRole = 'admin' | 'consultant' | 'client';

export interface TenantInfo {
  tenantId: string;
  userId: string;
  role: TenantRole;
  email: string;
}

export interface ChecklistAccess {
  estetica: boolean;
  ilpi: boolean;
  alimentos: boolean;
}

// ============================================================
// Cache em memória (5 minutos)
// ============================================================

const CACHE_TTL = 5 * 60 * 1000;

let tenantCache: { data: TenantInfo; expiresAt: number } | null = null;
let checklistCache: { data: ChecklistAccess; tenantId: string; expiresAt: number } | null = null;

function isCacheValid(expiresAt: number) {
  return Date.now() < expiresAt;
}

export function clearAuthCache() {
  tenantCache = null;
  checklistCache = null;
}

// ============================================================
// getCurrentTenant()
// ============================================================

export async function getCurrentTenant(): Promise<TenantInfo | null> {
  if (tenantCache && isCacheValid(tenantCache.expiresAt)) {
    return tenantCache.data;
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data, error } = await supabase
    .from('tenant_users')
    .select('tenant_id, role')
    .eq('user_id', session.user.id)
    .single();

  if (error || !data) return null;

  const info: TenantInfo = {
    tenantId: data.tenant_id,
    userId: session.user.id,
    role: data.role as TenantRole,
    email: session.user.email ?? '',
  };

  tenantCache = { data: info, expiresAt: Date.now() + CACHE_TTL };
  return info;
}

// ============================================================
// getUserRole()
// ============================================================

export async function getUserRole(): Promise<TenantRole | null> {
  const tenant = await getCurrentTenant();
  return tenant?.role ?? null;
}

// ============================================================
// hasChecklistAccess()
// ============================================================

export async function hasChecklistAccess(
  tenantId: string,
  checklistType: ClientCategory
): Promise<boolean> {
  if (
    checklistCache &&
    checklistCache.tenantId === tenantId &&
    isCacheValid(checklistCache.expiresAt)
  ) {
    return checklistCache.data[checklistType];
  }

  const { data, error } = await supabase
    .from('tenant_checklist_access')
    .select('checklist_type')
    .eq('tenant_id', tenantId);

  if (error || !data) return false;

  const access: ChecklistAccess = {
    estetica: data.some(r => r.checklist_type === 'estetica'),
    ilpi: data.some(r => r.checklist_type === 'ilpi'),
    alimentos: data.some(r => r.checklist_type === 'alimentos'),
  };

  checklistCache = { data: access, tenantId, expiresAt: Date.now() + CACHE_TTL };
  return access[checklistType];
}

// ============================================================
// getChecklistAccess() — retorna o objeto completo de acesso
// ============================================================

export async function getChecklistAccess(tenantId: string): Promise<ChecklistAccess> {
  if (
    checklistCache &&
    checklistCache.tenantId === tenantId &&
    isCacheValid(checklistCache.expiresAt)
  ) {
    return checklistCache.data;
  }

  const { data, error } = await supabase
    .from('tenant_checklist_access')
    .select('checklist_type')
    .eq('tenant_id', tenantId);

  const access: ChecklistAccess = {
    estetica: !error && !!data?.some(r => r.checklist_type === 'estetica'),
    ilpi: !error && !!data?.some(r => r.checklist_type === 'ilpi'),
    alimentos: !error && !!data?.some(r => r.checklist_type === 'alimentos'),
  };

  checklistCache = { data: access, tenantId, expiresAt: Date.now() + CACHE_TTL };
  return access;
}
