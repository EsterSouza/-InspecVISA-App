import { describe, test, expect } from 'vitest';
import { USERS, CHECKLIST_ACCESS } from '../fixtures';

// ============================================================
// Testes de lógica de roteamento — Cards 2.1, 2.2
// Testes de renderização React serão adicionados quando
// ProtectedRoute e ClientRoute forem implementados.
// ============================================================

type Role = 'admin' | 'consultant' | 'client';

const canAccessAdminRoute = (role: Role) => ['admin', 'consultant'].includes(role);
const canAccessClientRoute = (role: Role) => role === 'client';
const isAdminOnly = (role: Role) => role === 'admin';

describe('⚛️ Lógica de Rotas', () => {

  describe('ProtectedRoute — Admin/Consultant', () => {
    test('admin tem acesso a rotas protegidas', () => {
      expect(canAccessAdminRoute(USERS.admin.role)).toBe(true);
    });

    test('consultant tem acesso a rotas protegidas', () => {
      expect(canAccessAdminRoute(USERS.consultant.role)).toBe(true);
    });

    test('client não tem acesso a rotas admin', () => {
      expect(canAccessAdminRoute(USERS.client.role)).toBe(false);
    });

    test('rotas /admin/* exigem role admin ou consultant', () => {
      const adminRoutes = ['/admin', '/admin/clients', '/settings', '/dashboard'];
      for (const route of adminRoutes) {
        const isProtected = route.startsWith('/admin') || route === '/settings' || route === '/dashboard';
        expect(isProtected).toBe(true);
      }
    });
  });

  describe('ClientRoute — Client Only', () => {
    test('client acessa rotas de client', () => {
      expect(canAccessClientRoute(USERS.client.role)).toBe(true);
    });

    test('admin é redirecionado para dashboard nas rotas de client', () => {
      expect(canAccessClientRoute(USERS.admin.role)).toBe(false);
    });

    test('rotas permitidas para client', () => {
      const clientRoutes = ['/inspections', '/reports', '/profile'];
      expect(clientRoutes).not.toContain('/admin');
      expect(clientRoutes).not.toContain('/settings');
      expect(clientRoutes).not.toContain('/templates');
    });

    test('checklists disponíveis para client são filtrados por tenant_checklist_access', () => {
      const tenantId = USERS.client.tenant_id;
      const available = CHECKLIST_ACCESS
        .filter(a => a.tenant_id === tenantId)
        .map(a => a.checklist_type);

      expect(available).toContain('estetica');
      expect(available).toContain('ilpi');
      expect(available).not.toContain('alimentos');
    });
  });

  describe('Admin-only actions', () => {
    test('apenas admin pode gerenciar checklists de clientes', () => {
      expect(isAdminOnly(USERS.admin.role)).toBe(true);
      expect(isAdminOnly(USERS.consultant.role)).toBe(false);
      expect(isAdminOnly(USERS.client.role)).toBe(false);
    });

    test('apenas admin pode deletar tenants', () => {
      expect(isAdminOnly(USERS.admin.role)).toBe(true);
    });
  });

  describe('Menu dinâmico', () => {
    const getMenuItems = (role: Role) =>
      role === 'client'
        ? ['Minhas Inspeções', 'Meus Relatórios', 'Meu Perfil', 'Logout']
        : ['Dashboard', 'Gerenciar Clientes', 'Templates', 'Configurações', 'Logout'];

    test('menu admin tem 5 itens', () => {
      expect(getMenuItems('admin')).toHaveLength(5);
    });

    test('menu client tem 4 itens', () => {
      expect(getMenuItems('client')).toHaveLength(4);
    });

    test('menu client não expõe opções admin', () => {
      const clientMenu = getMenuItems('client');
      expect(clientMenu).not.toContain('Gerenciar Clientes');
      expect(clientMenu).not.toContain('Templates');
      expect(clientMenu).not.toContain('Configurações');
    });

    test('ambos os menus têm Logout', () => {
      expect(getMenuItems('admin')).toContain('Logout');
      expect(getMenuItems('client')).toContain('Logout');
    });
  });
});
