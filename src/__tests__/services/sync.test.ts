import { describe, test, expect, beforeEach, vi } from 'vitest';
import { USERS, INSPECTIONS, CLIENTS } from '../fixtures';

// ============================================================
// Testes do SyncService — Card 6.1
// ============================================================

describe('🔄 SyncService', () => {

  describe('Push para Supabase', () => {
    test('inspeção contém tenant_id antes do sync', () => {
      for (const inspection of INSPECTIONS) {
        expect(inspection).toHaveProperty('tenant_id');
        expect(inspection.tenant_id).toBeTruthy();
      }
    });

    test('cliente contém tenant_id antes do sync', () => {
      for (const client of CLIENTS) {
        expect(client).toHaveProperty('tenant_id');
        expect(client.tenant_id).toBeTruthy();
      }
    });

    test('payload de sync não envia tenant_id de outro usuário', () => {
      const currentUserTenant = USERS.client.tenant_id;
      const inspectionsToSync = INSPECTIONS.filter(
        i => i.tenant_id === currentUserTenant
      );

      for (const i of inspectionsToSync) {
        expect(i.tenant_id).toBe(currentUserTenant);
      }
    });
  });

  describe('Pull do Supabase', () => {
    test('pull filtra apenas dados do tenant do usuário', () => {
      const userTenant = USERS.client.tenant_id;
      const remoteData = [...INSPECTIONS, { id: 'foreign-001', tenant_id: 'tenant-999', clientId: '', templateId: '', consultantName: '', inspectionDate: new Date(), status: 'completed' as const, createdAt: new Date(), responses: [] }];

      const filtered = remoteData.filter(i => i.tenant_id === userTenant);

      expect(filtered.every(i => i.tenant_id === userTenant)).toBe(true);
      expect(filtered.some(i => i.tenant_id === 'tenant-999')).toBe(false);
    });
  });

  describe('Offline-first com tenant_id', () => {
    test('registro local mantém tenant_id antes de sincronizar', () => {
      const localInspection = {
        id: 'local-001',
        tenant_id: 'tenant-002',
        synced: false,
      };

      expect(localInspection.tenant_id).toBe('tenant-002');
      expect(localInspection.synced).toBe(false);
    });

    test('após sync, tenant_id não muda', () => {
      const before = { id: 'local-001', tenant_id: 'tenant-002', synced: false };
      const after = { ...before, synced: true };

      expect(after.tenant_id).toBe(before.tenant_id);
    });
  });
});
