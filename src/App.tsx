import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { initializeDatabase } from './db/database';
import { getTemplates } from './data/templates';
import { useSettingsStore } from './store/useSettingsStore';
import { useAuthStore } from './store/useAuthStore';
import { Loader2, AlertCircle } from 'lucide-react';

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
import { Debug } from './pages/Debug';
import { AccessDenied } from './pages/AccessDenied';

import { AdminLayout } from './components/layout/AdminLayout';
import { AdminTemplates } from './pages/admin/AdminTemplates';
import { SmartImporter } from './pages/admin/SmartImporter';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProfileSelection } from './pages/ProfileSelection';
import { Login } from './pages/Login';
import { LegislationsManager } from './pages/admin/LegislationsManager';

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState(false);
  const theme = useSettingsStore((s) => s.settings.theme);
  const { user, initialized, initialize } = useAuthStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const doReset = () => {
    localStorage.clear();
    const req = indexedDB.deleteDatabase('InspectionDB');
    req.onsuccess = () => window.location.reload();
    req.onerror = () => window.location.reload();
    req.onblocked = () => window.location.reload();
  };

  useEffect(() => {
    let didCancel = false;

    const initApp = async () => {
      const timeout = setTimeout(() => {
        if (!didCancel) {
          setInitError(true);
          setIsInitializing(false);
        }
      }, 15000);

      try {
        await initialize();
        
        let remoteTemplates = [];
        if (navigator.onLine) {
          try {
            const { TemplateService } = await import('./services/templateService');
            remoteTemplates = await TemplateService.listTemplates();
          } catch (tErr) {
            console.warn('[App] Falha ao buscar roteiros remotos:', tErr);
          }
        }

        const staticTemplates = getTemplates();
        await initializeDatabase([...staticTemplates, ...remoteTemplates]);
        
        if (!didCancel) setIsInitializing(false);
      } catch (err: unknown) {
        console.error('[App] Init failed:', err);
        const error = err as Error;
        const isBackingStoreError =
          error?.name === 'UnknownError' ||
          error?.message?.includes('backing store');

        if (isBackingStoreError) {
          doReset();
          return;
        }

        if (!didCancel) {
          setInitError(true);
          setIsInitializing(false);
        }
      } finally {
        clearTimeout(timeout);
      }
    };

    initApp();
    return () => { didCancel = true; };
  }, [initialize]);

  // Online Status & Sync Recovery
  useEffect(() => {
    if (!initialized || !user) return;

    const syncPendingData = async () => {
      if (navigator.onLine) {
        // Envia qualquer dado que ficou pendente no Dexie enquanto estava sem sinal
        import('./services/syncService').then(m => m.syncData().catch(console.error));
      }
    };

    window.addEventListener('online', syncPendingData);
    const interval = setInterval(syncPendingData, 5 * 60 * 1000); // 5 min check

    return () => {
      window.removeEventListener('online', syncPendingData);
      clearInterval(interval);
    };
  }, [initialized, user]);

  const name = useSettingsStore((s) => s.settings.name);

  if (initError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-red-50 p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-600 mb-4" />
        <h2 className="text-xl font-bold text-red-900 mb-2">Erro na Inicialização</h2>
        <p className="text-red-700 mb-6 max-w-xs mx-auto">
          Ocorreu um problema ao carregar os dados locais. Clique abaixo para tentar recuperar seu acesso.
        </p>
        <button
          onClick={doReset}
          className="rounded-lg bg-red-600 px-6 py-3 text-white font-bold hover:bg-red-700 transition-all"
        >
          🔄 Recuperar App
        </button>
      </div>
    );
  }

  if (!initialized || isInitializing) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary-600 mb-4" />
        <p className="text-gray-500 font-medium">Conectando ao InspecVISA...</p>
      </div>
    );
  }

  if (!user) return <Login />;
  if (!name) return <ProfileSelection />;

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-gray-900 antialiased">
        <div className="hidden lg:block">
           <Routes>
             <Route path="/execute" element={null} />
             <Route path="*" element={<Sidebar />} />
           </Routes>
        </div>

        <main className="flex-1 overflow-y-auto w-full relative pb-24 lg:pb-0">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
            <Route path="/clients/:id" element={<ProtectedRoute><ClientDetails /></ProtectedRoute>} />
            <Route path="/schedules" element={<ProtectedRoute><Schedules /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute requiredRole="admin"><Settings /></ProtectedRoute>} />
            <Route path="/importar-dados" element={<ProtectedRoute requiredRole="admin"><ImportLegacyData /></ProtectedRoute>} />
            <Route path="/inspections" element={<Inspections />} />
            <Route path="/new" element={<NewInspection />} />
            <Route path="/execute" element={<InspectionExecution />} />
            <Route path="/summary" element={<InspectionSummary />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminTemplates />} />
              <Route path="templates" element={<AdminTemplates />} />
              <Route path="templates/import" element={<SmartImporter />} />
              <Route path="legislations" element={<LegislationsManager />} />
            </Route>
            <Route path="/debug" element={<Debug />} />
            <Route path="/access-denied" element={<AccessDenied />} />
          </Routes>
        </main>

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
