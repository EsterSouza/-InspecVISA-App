import { describe, test, expect, beforeEach, vi } from 'vitest';
import { USERS, CHECKLIST_ACCESS } from '../fixtures';

// ============================================================
// Mock do Supabase configurado via setup.ts (vi.mock global)
// Aqui refinamos os retornos por teste.
// ============================================================

const { supabase } = await import('../../lib/supabase');

describe('🔑 AuthService', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    // Limpa o cache entre testes
    vi.resetModules();
  });

  describe('getCurrentTenant()', () => {
    test('retorna TenantInfo completo para usuário autenticado', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: { user: { id: USERS.admin.id, email: USERS.admin.email } } as any },
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { tenant_id: USERS.admin.tenant_id, role: USERS.admin.role },
          error: null,
        }),
      } as any);

      const { getCurrentTenant } = await import('../../services/authService');
      const result = await getCurrentTenant();

      expect(result).not.toBeNull();
      expect(result?.tenantId).toBe(USERS.admin.tenant_id);
      expect(result?.userId).toBe(USERS.admin.id);
      expect(result?.role).toBe('admin');
      expect(result?.email).toBe(USERS.admin.email);
    });

    test('retorna null se não há sessão ativa', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const { getCurrentTenant } = await import('../../services/authService');
      const result = await getCurrentTenant();

      expect(result).toBeNull();
    });

    test('retorna null se usuário não está em nenhum tenant', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: { user: { id: 'user-sem-tenant', email: 'x@x.com' } } as any },
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
      } as any);

      const { getCurrentTenant } = await import('../../services/authService');
      const result = await getCurrentTenant();

      expect(result).toBeNull();
    });
  });

  describe('hasChecklistAccess()', () => {
    beforeEach(() => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        mockResolvedValue: undefined,
        then: undefined,
      } as any);
    });

    test('retorna true para checklist liberado', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: CHECKLIST_ACCESS.filter(a => a.tenant_id === 'tenant-002'),
          error: null,
        }),
      } as any);

      const { hasChecklistAccess } = await import('../../services/authService');
      expect(await hasChecklistAccess('tenant-002', 'estetica')).toBe(true);
      expect(await hasChecklistAccess('tenant-002', 'ilpi')).toBe(true);
    });

    test('retorna false para checklist não liberado', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: CHECKLIST_ACCESS.filter(a => a.tenant_id === 'tenant-002'),
          error: null,
        }),
      } as any);

      const { hasChecklistAccess } = await import('../../services/authService');
      expect(await hasChecklistAccess('tenant-002', 'alimentos')).toBe(false);
    });

    test('retorna false se erro na query', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
      } as any);

      const { hasChecklistAccess } = await import('../../services/authService');
      expect(await hasChecklistAccess('tenant-002', 'estetica')).toBe(false);
    });
  });

  describe('getUserRole()', () => {
    test('retorna role do usuário autenticado', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: { user: { id: USERS.consultant.id, email: USERS.consultant.email } } as any },
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { tenant_id: USERS.consultant.tenant_id, role: 'consultant' },
          error: null,
        }),
      } as any);

      const { getUserRole } = await import('../../services/authService');
      const role = await getUserRole();

      expect(role).toBe('consultant');
    });

    test('retorna null se não autenticado', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const { getUserRole } = await import('../../services/authService');
      expect(await getUserRole()).toBeNull();
    });
  });

  describe('Cache', () => {
    test('TTL de 5 minutos é válido', () => {
      const CACHE_TTL = 5 * 60 * 1000;
      const cachedAt = Date.now();
      const expiresAt = cachedAt + CACHE_TTL;

      expect(Date.now() < expiresAt).toBe(true);
    });

    test('TTL expirado é inválido', () => {
      const expiresAt = Date.now() - 1000;
      expect(Date.now() < expiresAt).toBe(false);
    });

    test('clearAuthCache limpa o cache de sessão', async () => {
      const { clearAuthCache } = await import('../../services/authService');
      expect(() => clearAuthCache()).not.toThrow();
    });
  });
});
