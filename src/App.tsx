import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { db, initializeDatabase } from './db/database';
import { getTemplates } from './data/templates';
import { useSettingsStore } from './store/useSettingsStore';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from './components/ui/Button';

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

  useEffect(() => {
    // Safety Timeout: 10s
    const timeout = setTimeout(() => {
      // ✅ SÓ força a partida se NÃO houver um erro explícito e ainda estiver inicializando
      if (!initialized && !initError) {
        console.warn('Initialization timeout hit. Forcing start.');
        setIsInitializing(false);
      }
    }, 10000);

    const initApp = async () => {
      try {
        await initialize();
        const templates = getTemplates();
        await initializeDatabase(templates);
        setIsInitializing(false);
      } catch (err: any) {
        console.error('Initialization fail:', err);
        // ✅ Detecta o erro específico de corrupção do Chrome
        if (err.name === 'UnknownError' || err.message?.includes('backing store')) {
          console.error('DETECTADO: Corrupção do Chrome IndexedDB');
        }
        setInitError(true);
        setIsInitializing(false); // ✅ Libera o loader para mostrar a tela de erro
      }
    };

    initApp();
    return () => clearTimeout(timeout);
  }, [initialized, initError]); // ✅ Adicionado initError na dependência

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

  const name = useSettingsStore((s) => s.settings.name);

  return (
    <BrowserRouter>
      {(initError) ? (
        <div className="flex h-screen flex-col items-center justify-center bg-red-50 p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2">Erro ao Iniciar</h2>
          <p className="text-red-700 mb-6 max-w-xs mx-auto">Não foi possível carregar o banco de dados. Tente atualizar a página ou limpar os dados.</p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 w-full">Tentar Novamente</Button>
            
            <button 
              onClick={async () => {
                if (window.confirm('CUIDADO: Isso apagará TODOS os dados salvos localmente (fotos e inspeções não sincronizadas) para tentar recuperar o app. Deseja prosseguir?')) {
                  localStorage.clear();
                  const req = indexedDB.deleteDatabase('InspectionDB');
                  req.onsuccess = () => window.location.reload();
                  req.onerror = () => window.location.reload();
                }
              }}
              className="text-red-400 hover:text-red-500 text-xs font-medium underline"
            >
              Emergência: Limpar tudo e recomeçar
            </button>
          </div>
        </div>
      ) : (!initialized || isInitializing) ? (
        <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
          <Loader2 className="h-10 w-10 animate-spin text-primary-600 mb-4" />
          <p className="text-gray-500 font-medium">Iniciando InspecVISA...</p>
        </div>
      ) : !user ? (
        <Login />
      ) : !name ? (
        <ProfileSelection />
      ) : (
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
              
              {/* Administração e Migração */}
              <Route path="/settings" element={<ProtectedRoute requiredRole="admin"><Settings /></ProtectedRoute>} />
              <Route path="/importar-dados" element={<ProtectedRoute requiredRole="admin"><ImportLegacyData /></ProtectedRoute>} />

              {/* Rotas compartilhadas (staff + client) */}
              <Route path="/inspections" element={<Inspections />} />
              <Route path="/new" element={<NewInspection />} />
              <Route path="/execute" element={<InspectionExecution />} />
              <Route path="/summary" element={<InspectionSummary />} />

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
      )}
    </BrowserRouter>
  );
}

export default App;
