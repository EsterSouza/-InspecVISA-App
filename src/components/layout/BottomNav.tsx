import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, ClipboardCheck, PlusCircle, Settings, RefreshCw, User, Calendar } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { syncData } from '../../services/syncService';

const staffNavItems = [
  { to: '/',            icon: Home,          label: 'Início' },
  { to: '/clients',     icon: Users,         label: 'Clientes' },
  { to: '/inspections', icon: ClipboardCheck,label: 'Inspeções' },
  { to: '/schedules',   icon: Calendar,      label: 'Agenda' },
  { to: '/new',         icon: PlusCircle,    label: 'Nova', main: true },
];

const clientNavItems = [
  { to: '/inspections', icon: ClipboardCheck, label: 'Inspeções' },
  { to: '/new',         icon: PlusCircle,     label: 'Nova', main: true },
  { to: '/profile',     icon: User,           label: 'Perfil' },
];

export function BottomNav() {
  const { tenantInfo } = useAuthStore();
  const isClient = tenantInfo?.role === 'client';
  const navItems = isClient ? clientNavItems : staffNavItems;
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleManualSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      await syncData(true);
    } catch (err) {
      console.error('Manual sync failed', err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white pb-safe lg:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => {
                if (item.main) {
                  return `flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md transition-transform active:scale-95 ${
                    isActive ? 'bg-primary-700 ring-4 ring-primary-100' : 'bg-primary-600'
                  }`;
                }
                return `flex flex-col items-center justify-center space-y-1 p-2 ${
                  isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
                }`;
              }}
            >
              {({ isActive }) => (
                <>
                  <Icon className={item.main ? 'h-6 w-6' : `h-5 w-5 ${isActive ? 'fill-primary-50 stroke-primary-600' : ''}`} />
                  {!item.main && (
                    <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
        
        {/* Mobile Sync Button */}
        {!isClient && (
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className={`flex flex-col items-center justify-center space-y-1 p-2 ${
              isSyncing ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <RefreshCw className={`h-5 w-5 ${isSyncing ? 'animate-spin text-primary-600' : ''}`} />
            <span className="text-[10px] font-medium">Sync</span>
          </button>
        )}

        {/* Settings/Ajustes moved to last position as requested for staff */}
        {!isClient && (
          <NavLink
            to="/settings"
            className={({ isActive }) => `flex flex-col items-center justify-center space-y-1 p-2 ${
              isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {({ isActive }) => (
              <>
                <Settings className={`h-5 w-5 ${isActive ? 'fill-primary-50 stroke-primary-600' : ''}`} />
                <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                  Ajustes
                </span>
              </>
            )}
          </NavLink>
        )}
      </div>
    </nav>
  );
}
