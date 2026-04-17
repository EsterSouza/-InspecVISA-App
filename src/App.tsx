import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { initializeDatabase } from './db/database';
import { getTemplates } from './data/templates';
import { useSettingsStore } from './store/useSettingsStore';
import { useAuthStore } from './store/useAuthStore';
import { Loader2 } from 'lucide-react';

// Layout
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';

// Lazy Loaded Pages
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Clients = lazy(() => import('./pages/Clients').then(m => ({ default: m.Clients })));
const ClientDetails = lazy(() => import('./pages/ClientDetails').then(m => ({ default: m.ClientDetails })));
const Schedules = lazy(() => import('./pages/Schedules').then(m => ({ default: m.Schedules })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const ImportLegacyData = lazy(() => import('./pages/ImportLegacyData').then(m => ({ default: m.ImportLegacyData })));
const Inspections = lazy(() => import('./pages/Inspections').then(m => ({ default: m.Inspections })));
const NewInspection = lazy(() => import('./pages/NewInspection').then(m => ({ default: m.NewInspection })));
const InspectionExecution = lazy(() => import('./pages/InspectionExecution').then(m => ({ default: m.InspectionExecution })));
const InspectionSummary = lazy(() => import('./pages/InspectionSummary').then(m => ({ default: m.InspectionSummary })));
const Debug = lazy(() => import('./pages/Debug').then(m => ({ default: m.Debug })));
const AccessDenied = lazy(() => import('./pages/AccessDenied').then(m => ({ default: m.AccessDenied })));

const AdminLayout = lazy(() => import('./components/layout/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminTemplates = lazy(() => import('./pages/admin/AdminTemplates').then(m => ({ default: m.AdminTemplates })));
const SmartImporter = lazy(() => import('./pages/admin/SmartImporter').then(m => ({ default: m.SmartImporter })));
const LegislationsManager = lazy(() => import('./pages/admin/LegislationsManager').then(m => ({ default: m.LegislationsManager })));
const TemplateDetail = lazy(() => import('./pages/TemplateDetail').then(m => ({ default: m.TemplateDetail })));

import { ProtectedRoute } from './components/ProtectedRoute';
import { ProfileSelection } from './pages/ProfileSelection';
import { Login } from './pages/Login';

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
      // Step 1: Initialize auth (instant from cache if previously logged in)
      await initialize();

      // Step 2: Load static templates immediately into Dexie (offline-safe)
      const staticTemplates = getTemplates();
      try {
        await initializeDatabase(staticTemplates);
      } catch (dbErr: unknown) {
        const error = dbErr as Error;
        const isBackingStoreError =
          error?.name === 'UnknownError' ||
          error?.message?.includes('backing store');
        if (isBackingStoreError) {
          doReset();
          return;
        }
        console.warn('[App] DB init error (non-fatal):', dbErr);
      }

      // Step 3: App is ready — show it!
      if (!didCancel) setIsInitializing(false);

      // Step 4: Fetch remote templates in background (non-blocking)
      if (navigator.onLine) {
        import('./services/templateService').then(async ({ TemplateService }) => {
          try {
            const remoteTemplates = await TemplateService.listTemplates();
            if (remoteTemplates?.length) {
              await initializeDatabase([...staticTemplates, ...remoteTemplates]);
            }
          } catch (tErr) {
            console.warn('[App] Remote templates fetch failed (non-fatal):', tErr);
          }
        }).catch(() => {});
      }
    };

    initApp().catch((err) => {
      console.error('[App] Fatal init error:', err);
      // Even on fatal error, unblock UI
      if (!didCancel) setIsInitializing(false);
    });

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
          <Suspense fallback={
            <div className="flex h-full items-center justify-center bg-gray-50/50 backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          }>
            <Routes>
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
              <Route path="/clients/:id" element={<ProtectedRoute><ClientDetails /></ProtectedRoute>} />
              <Route path="/schedules" element={<ProtectedRoute><Schedules /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/importar-dados" element={<ProtectedRoute><ImportLegacyData /></ProtectedRoute>} />
              <Route path="/inspections" element={<Inspections />} />
              <Route path="/new" element={<NewInspection />} />
              <Route path="/execute" element={<InspectionExecution />} />
              <Route path="/summary" element={<InspectionSummary />} />
              <Route path="/templates" element={<AdminTemplates />} />
              <Route path="/templates/import" element={<SmartImporter />} />
              <Route path="/templates/:id" element={<TemplateDetail />} />
              <Route path="/legislations" element={<LegislationsManager />} />
              <Route path="/debug" element={<Debug />} />
              <Route path="/access-denied" element={<AccessDenied />} />
            </Routes>
          </Suspense>
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
