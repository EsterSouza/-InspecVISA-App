import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BookOpen, FileText, Settings, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

export function AdminLayout() {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-4">
            <NavLink to="/" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Voltar ao App</span>
            </NavLink>
            <div className="h-6 w-px bg-gray-200" />
            <h1 className="text-lg font-bold text-gray-900 tracking-tight flex items-center">
              <Settings className="h-5 w-5 mr-2 text-primary-600" />
              Painel de Gestão
            </h1>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Admin Sidebar */}
        <aside className="w-64 border-r border-gray-200 bg-white overflow-y-auto hidden md:block">
          <nav className="p-4 space-y-1">
            <AdminNavLink to="/admin/templates" icon={<FileText className="h-5 w-5" />} label="Roteiros Dinâmicos" />
            <AdminNavLink to="/admin/legislations" icon={<BookOpen className="h-5 w-5" />} label="Biblioteca de Leis" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function AdminNavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
          isActive
            ? "bg-primary-50 text-primary-700 shadow-sm"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        )
      }
    >
      <span className="mr-3 text-gray-400 group-hover:text-primary-500">{icon}</span>
      {label}
    </NavLink>
  );
}
