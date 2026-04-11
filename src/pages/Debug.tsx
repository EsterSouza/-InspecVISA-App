import React, { useEffect, useState } from 'react';
import { db } from '../db/database';
import type { SyncLog } from '../types';
import { ArrowLeft, Trash2, Copy, RefreshCw, Search, Wrench, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { syncData } from '../services/syncService';

export function Debug() {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [report, setReport] = useState<Record<string, any> | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const navigate = useNavigate();

  const loadLogs = async () => {
    const data = await db.sync_logs.orderBy('timestamp').reverse().limit(200).toArray();
    setLogs(data);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const clearLogs = async () => {
    if (confirm('Limpar todos os logs de diagnóstico?')) {
      await db.sync_logs.clear();
      loadLogs();
    }
  };

  const copyLogs = () => {
    const text = logs.map((l: SyncLog) => 
      `[${l.timestamp.toLocaleString()}] ${l.level.toUpperCase()}: ${l.message} ${l.details ? JSON.stringify(l.details) : ''}`
    ).join('\n');
    navigator.clipboard.writeText(text);
    alert('Logs copiados!');
  };

  const runDiagnostic = async () => {
    setIsRunning(true);
    try {
      const allClients = await db.clients.toArray();
      const allInspections = await db.inspections.toArray();
      const allSchedules = await db.schedules.toArray();
      
      const pendingClients = allClients.filter(c => c.synced !== 1);
      const pendingInspections = allInspections.filter(i => i.synced !== 1);
      const pendingSchedules = allSchedules.filter(s => s.synced !== 1);

      setReport({
        'Totais Locais': {
          'Clientes': allClients.length,
          'Inspeções': allInspections.length,
          'Schedules': allSchedules.length
        },
        'Pendentes de Sincronização': {
          'Clientes': pendingClients.length,
          'Inspeções': pendingInspections.length,
          'Schedules': pendingSchedules.length
        },
        'Detalhes dos Pendentes': {
          'IDs Clientes': pendingClients.length > 0 ? pendingClients.map(c => `${c.name || 'Sem Nome'} (${c.id.substring(0,8)})`).join(', ') : 'NENHUM',
          'IDs Inspeções': pendingInspections.length > 0 ? pendingInspections.map(i => i.id.substring(0,8)).join(', ') : 'NENHUM'
        }
      });
    } finally {
      setIsRunning(false);
    }
  };


  const runManualSync = async () => {
    setIsRunning(true);
    try {
      await syncData(true);
      await loadLogs();
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 rounded-full">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-slate-800">Diagnóstico de Sincronização</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={loadLogs} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200" title="Atualizar logs">
              <RefreshCw size={20} />
            </button>
            <button onClick={copyLogs} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200" title="Copiar logs">
              <RefreshCw size={20} />
            </button>
            <button onClick={clearLogs} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Limpar logs">
              <Trash2 size={20} />
            </button>
          </div>
        </header>

        {/* Repair Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button
            onClick={runDiagnostic}
            disabled={isRunning}
            className="flex items-center gap-2 justify-center px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            <Search size={18} />
            Executar Diagnóstico
          </button>
            <button
              onClick={runManualSync}
              disabled={isRunning}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
              Sincronizar Agora
            </button>
            <button
              onClick={async () => {
                setIsRunning(true);
                try {
                  const m = await import('../services/syncService');
                  const fixed = await m.repairSyncStatus();
                  alert(`Reparo concluído! ${fixed} registros foram corrigidos.`);
                  await runDiagnostic();
                } catch (e) {
                  console.error(e);
                  alert('Falha ao executar reparo.');
                } finally {
                  setIsRunning(false);
                }
              }}
              disabled={isRunning}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-white font-medium hover:bg-amber-700 disabled:opacity-50 transition-all font-mono text-xs"
            >
              <Wrench className="h-4 w-4" />
              AUTO-REPARAR SYNC
            </button>

        </div>

        {/* Diagnostic Report */}
        {report && (
          <div className="mb-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
              <h2 className="font-bold text-slate-700">📊 Relatório de Diagnóstico</h2>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(report).map(([section, values]) => (
                <div key={section} className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase">{section}</p>
                  {typeof values === 'object' ? (
                    Object.entries(values).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="text-slate-600">{k}</span>
                        <span className={`font-bold ${Number(v) > 0 ? 'text-red-500' : 'text-green-600'}`}>
                          {String(v)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className={`text-sm font-bold ${String(values).includes('NENHUM') ? 'text-red-500' : 'text-green-600'}`}>
                      {String(values)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Log Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Data/Hora</th>
                  <th className="px-4 py-3">Nível</th>
                  <th className="px-4 py-3">Mensagem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-slate-400">Nenhum log registrado.</td>
                  </tr>
                ) : (
                  logs.map((log: SyncLog) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          log.level === 'error' ? 'bg-red-100 text-red-600' :
                          log.level === 'warn' ? 'bg-amber-100 text-amber-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {log.level}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-700">{log.message}</div>
                        {log.details && (
                          <pre className="mt-1 text-[10px] text-slate-400 bg-slate-50 p-2 rounded max-w-lg overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-sm">
          <p className="font-bold mb-1 flex items-center gap-2"><AlertTriangle size={16} /> Guia de Diagnóstico:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Sem Sincronização</strong>: Execute o Aplicativo conectado na internet</li>
            <li><strong>Erros de Timeout</strong>: Internet instável — tente sync manual</li>
            <li><strong>Permissão Negada</strong>: Verifique regras RLS no BD</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
