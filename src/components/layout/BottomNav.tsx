import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, ClipboardCheck, PlusCircle, Settings, Calendar, User } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const staffNavItems = [
  { to: '/',            icon: Home,          label: 'Início' },
  { to: '/clients',     icon: Users,         label: 'Clientes' },
  { to: '/new',         icon: PlusCircle,    label: 'Nova', main: true },
  { to: '/inspections', icon: ClipboardCheck,label: 'Inspeções' },
  { to: '/schedules',   icon: Calendar,      label: 'Agenda' },
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
        
        {/* Mobile Sync Button (Staff only) */}
        {!isClient && (
          <button
            onClick={async (e) => {
              e.preventDefault();
              if (isSyncing) return;
              setIsSyncing(true);
              try {
                const { syncData } = await import('../../services/syncService');
                await syncData(true); // isManual = true
              } finally {
                setIsSyncing(false);
              }
            }}
            disabled={isSyncing}
            className={`flex flex-col items-center justify-center space-y-1 p-2 transition-colors ${isSyncing ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isSyncing ? 'animate-spin text-primary-600' : ''}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            <span className={`text-[10px] font-medium ${isSyncing ? 'font-semibold' : ''}`}>Sincronizar</span>
          </button>
        )}

        {/* Secret Debug Link */}
        <NavLink to="/debug" className="hidden lg:flex p-2 text-gray-400 hover:text-gray-600">
           <Settings size={16} />
        </NavLink>
      </div>
    </nav>
  );
}
