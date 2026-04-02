import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { db, initializeDatabase } from './db/database';
import { getTemplates } from './data/templates';
import { useSettingsStore } from './store/useSettingsStore';
import { Loader2 } from 'lucide-react';

// Layout
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { Inspections } from './pages/Inspections';
import { NewInspection } from './pages/NewInspection';
import { InspectionExecution } from './pages/InspectionExecution';
import { InspectionSummary } from './pages/InspectionSummary';
import { Settings } from './pages/Settings';
import { ClientDetails } from './pages/ClientDetails';
import { Schedules } from './pages/Schedules';
import { ImportLegacyData } from './pages/ImportLegacyData';

import { useAuthStore } from './store/useAuthStore';
import { Login } from './pages/Login';
import { AccessDenied } from './pages/AccessDenied';
import Debug from './pages/Debug';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ClientRoute } from './components/ClientRoute';
import { ProfileSelection } from './pages/ProfileSelection';

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const theme = useSettingsStore((s) => s.settings.theme);
  const { user, initialized, initialize } = useAuthStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Initialize Auth and Database
    const initApp = async () => {
      try {
        await initialize();
        const templates = getTemplates();
        await initializeDatabase(templates);
      } catch (err) {
        console.error('Initialization fail:', err);
      } finally {
        setIsInitializing(false);
      }
    };
    initApp();
  }, [initialize]);

  // Background Auto-Sync Hook
  useEffect(() => {
    if (!initialized || !user) return;

    const backgroundSync = () => {
      if (navigator.onLine && !(window as any).isSyncingGlobally) {
        import('./services/syncService').then(m => m.syncData().catch(console.error));
      }
    };

    // Trigger on network reconnect
    window.addEventListener('online', backgroundSync);
    // Trigger on app visibility change (back from background)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') backgroundSync();
    };
    window.addEventListener('visibilitychange', handleVisibility);

    // Trigger automatically every 2 minutes
    const interval = setInterval(backgroundSync, 2 * 60 * 1000);

    return () => {
      window.removeEventListener('online', backgroundSync);
      window.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, [initialized, user]);

  if (!initialized || isInitializing) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary-600 mb-4" />
        <p className="text-gray-500 font-medium">Iniciando InspecVISA...</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  // ✅ Se não tem perfil selecionado, mostra seleção antes da aplicação em si
  const { name } = useSettingsStore.getState().settings;
  if (!name) {
    return <ProfileSelection />;
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-gray-900 antialiased selection:bg-primary-500 selection:text-white">
        
        {/* Desktop Sidebar hidden on execution screen */}
        <div className="hidden lg:block">
           <Routes>
             <Route path="/execute" element={null} />
             <Route path="*" element={<Sidebar />} />
           </Routes>
        </div>

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto w-full relative pb-24 lg:pb-0">
          <Routes>
            {/* Rotas staff (admin / consultant) */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
            <Route path="/clients/:id" element={<ProtectedRoute><ClientDetails /></ProtectedRoute>} />
            <Route path="/schedules" element={<ProtectedRoute><Schedules /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute requiredRole="admin"><Settings /></ProtectedRoute>} />

            {/* Rotas compartilhadas (staff + client) */}
            <Route path="/inspections" element={<Inspections />} />
            <Route path="/new" element={<NewInspection />} />
            <Route path="/execute" element={<InspectionExecution />} />
            <Route path="/summary" element={<InspectionSummary />} />

            {/* Administração e Migração */}
            <Route path="/settings" element={<ProtectedRoute requiredRole="admin"><Settings /></ProtectedRoute>} />
            <Route path="/importar-dados" element={<ProtectedRoute requiredRole="admin"><ImportLegacyData /></ProtectedRoute>} />

            {/* Utilitárias */}
            <Route path="/debug" element={<Debug />} />
            <Route path="/access-denied" element={<AccessDenied />} />
          </Routes>
        </main>

        {/* Mobile Bottom Nav hidden on execution screen */}
        <div className="lg:hidden">
          <Routes>
             <Route path="/execute" element={null} />
             <Route path="*" element={<BottomNav />} />
          </Routes>
        </div>
        
      </div>
    </BrowserRouter>
  );
}

export default App;
