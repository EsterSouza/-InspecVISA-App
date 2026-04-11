import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, Users, ClipboardCheck, PlusCircle, Settings,
  ShieldCheck, LogOut, RefreshCw, Calendar, User, BookOpen,
} from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { syncData } from '../../services/syncService';

const staffNavItems = [
  { to: '/',            icon: Home,          label: 'Início' },
  { to: '/clients',     icon: Users,         label: 'Clientes' },
  { to: '/new',         icon: PlusCircle,    label: 'Nova Inspeção', main: true },
  { to: '/schedules',   icon: Calendar,      label: 'Agendamentos' },
  { to: '/inspections', icon: ClipboardCheck,label: 'Inspeções' },
  { to: '/settings',    icon: Settings,      label: 'Configurações' },
];

const clientNavItems = [
  { to: '/inspections', icon: ClipboardCheck, label: 'Minhas Inspeções' },
  { to: '/new',         icon: PlusCircle,     label: 'Nova Inspeção', main: true },
  { to: '/profile',     icon: User,           label: 'Meu Perfil' },
];

export function Sidebar() {
  const settings = useSettingsStore((s) => s.settings);
  const { signOut, tenantInfo } = useAuthStore();
  const [isSyncing, setIsSyncing] = useState(false);

  const isClient = tenantInfo?.role === 'client';
  const navItems = isClient ? clientNavItems : staffNavItems;

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncData();
    } catch (err) {
      console.error('Manual sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex h-screen sticky top-0">
      <div className="flex h-16 items-center px-6 border-b border-gray-100 justify-between">
        <div className="flex items-center">
          <ShieldCheck className="h-6 w-6 text-primary-600 mr-2" />
          <span className="text-xl font-bold tracking-tight text-gray-900">InspecVISA</span>
        </div>
        {!isClient && (
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${isSyncing ? 'text-primary-600' : 'text-gray-400'}`}
            title="Sincronizar agora"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => {
                if (item.main) {
                  return `mt-6 mb-2 flex w-full items-center justify-center space-x-2 rounded-lg py-3 text-sm font-medium text-white shadow-sm transition-colors ${
                    isActive ? 'bg-primary-700' : 'bg-primary-600 hover:bg-primary-700'
                  }`;
                }
                return `flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`;
              }}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`h-5 w-5 ${item.main ? '' : isActive ? 'text-primary-600 stroke-2' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}

        {tenantInfo?.role === 'admin' && (
          <>
            <div className="my-4 h-px bg-gray-100" />
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-semibold'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <BookOpen className={`h-5 w-5 ${isActive ? 'text-primary-600 stroke-2' : 'text-gray-400'}`} />
                  <span>Painel de Gestão</span>
                </>
              )}
            </NavLink>
          </>
        )}
      </nav>

      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
              {isClient
                ? (tenantInfo?.email?.charAt(0).toUpperCase() ?? 'C')
                : (settings.name ? settings.name.charAt(0).toUpperCase() : 'C')}
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-gray-900 truncate">
                {isClient ? tenantInfo?.email : (settings.name || 'Consultora')}
              </p>
              <p className="text-xs text-gray-500 truncate capitalize">
                {tenantInfo?.role ?? 'staff'}
              </p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
