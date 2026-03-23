import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import type { TenantRole } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: TenantRole | TenantRole[];
  redirectTo?: string;
}

/**
 * Protege rotas que exigem role admin ou consultant.
 * - Mostra loading enquanto a sessão está sendo verificada.
 * - Redireciona para /access-denied se o role não for suficiente.
 * - Se tenantInfo for null mas user existir (período de transição),
 *   permite acesso para não quebrar o fluxo atual.
 */
export function ProtectedRoute({
  children,
  requiredRole = ['admin', 'consultant'],
  redirectTo = '/access-denied',
}: ProtectedRouteProps) {
  const { user, tenantInfo, loading, initialized } = useAuthStore();

  if (!initialized || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Período de transição: usuários sem tenant_users ainda têm acesso total
  if (!tenantInfo) return <>{children}</>;

  const allowed = Array.isArray(requiredRole)
    ? requiredRole.includes(tenantInfo.role)
    : tenantInfo.role === requiredRole;

  if (!allowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
