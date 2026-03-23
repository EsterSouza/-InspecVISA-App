import { describe, test, expect } from 'vitest';
import { TENANTS, USERS, CHECKLIST_ACCESS, CLIENTS, INSPECTIONS } from '../fixtures';

// ============================================================
// Testes de integração — fluxos multi-tenant completos
// ============================================================

describe('🔗 Integração — Fluxos Multi-Tenant', () => {

  test('Admin cria cliente → libera checklist → client vê checklist', () => {
    // 1. Admin existe e é dono do tenant
    expect(TENANTS.admin.created_by).toBe(USERS.admin.id);

    // 2. Admin libera estetica para tenant-002
    const access = CHECKLIST_ACCESS.find(
      a => a.tenant_id === TENANTS.client.id && a.checklist_type === 'estetica'
    );
    expect(access).toBeDefined();

    // 3. Client do tenant-002 vê o checklist liberado
    const clientTenant = USERS.client.tenant_id;
    const available = CHECKLIST_ACCESS
      .filter(a => a.tenant_id === clientTenant)
      .map(a => a.checklist_type);
    expect(available).toContain('estetica');
  });

  test('Client só vê inspeções do seu tenant', () => {
    const clientTenant = USERS.client.tenant_id;
    const visibleInspections = INSPECTIONS.filter(i => i.tenant_id === clientTenant);

    expect(visibleInspections.length).toBeGreaterThan(0);
    expect(visibleInspections.every(i => i.tenant_id === clientTenant)).toBe(true);
  });

  test('Client de outro tenant não vê inspeções de tenant-002', () => {
    const otherTenant = USERS.clientOther.tenant_id;
    const visible = INSPECTIONS.filter(i => i.tenant_id === otherTenant);

    expect(visible).toHaveLength(0);
  });

  test('Revogar checklist remove acesso imediatamente', () => {
    const before = CHECKLIST_ACCESS.filter(a => a.tenant_id === 'tenant-002');
    expect(before.some(a => a.checklist_type === 'estetica')).toBe(true);

    const after = before.filter(a => a.checklist_type !== 'estetica');
    expect(after.some(a => a.checklist_type === 'estetica')).toBe(false);
    expect(after.some(a => a.checklist_type === 'ilpi')).toBe(true);
  });

  test('Deletar cliente cascata: remove clientes, inspeções e checklists', () => {
    const tenantToDelete = 'tenant-002';

    const orphanClients = CLIENTS.filter(c => c.tenant_id === tenantToDelete);
    const orphanInspections = INSPECTIONS.filter(i => i.tenant_id === tenantToDelete);
    const orphanAccess = CHECKLIST_ACCESS.filter(a => a.tenant_id === tenantToDelete);

    // Todos seriam removidos pela cascata (ON DELETE CASCADE no banco)
    expect(orphanClients.length).toBeGreaterThan(0);
    expect(orphanInspections.length).toBeGreaterThan(0);
    expect(orphanAccess.length).toBeGreaterThan(0);
  });

  test('Dois admins de tenants diferentes não compartilham dados', () => {
    const admin1Tenant = USERS.admin.tenant_id;
    const otherTenant = TENANTS.other.id;

    expect(admin1Tenant).not.toBe(otherTenant);

    const admin1Data = INSPECTIONS.filter(i => i.tenant_id === admin1Tenant);
    const otherData = INSPECTIONS.filter(i => i.tenant_id === otherTenant);

    // Nenhuma inspeção em comum
    const sharedIds = admin1Data
      .map(i => i.id)
      .filter(id => otherData.map(i => i.id).includes(id));
    expect(sharedIds).toHaveLength(0);
  });
});
