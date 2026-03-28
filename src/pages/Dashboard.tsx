import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { syncData } from '../services/syncService';
import { useSettingsStore } from '../store/useSettingsStore';
import { db } from '../db/database';
import type { Inspection, InspectionResponse, ChecklistItem, Schedule } from '../types';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PlusCircle, ClipboardCheck, ArrowRight, Activity, TrendingUp, AlertTriangle, Calendar, Clock, Settings } from 'lucide-react';
import { formatDateTime } from '../utils/imageUtils';
import { calculateScore } from '../utils/scoring';
import { getTemplates } from '../data/templates';

export function Dashboard() {
  const settings = useSettingsStore((s) => s.settings);
  const navigate = useNavigate();
  const [recentInspections, setRecentInspections] = useState<Inspection[]>([]);
  const [nextSchedules, setNextSchedules] = useState<Schedule[]>([]);
  const [stats, setStats] = useState({ totalActive: 0, totalCompleted: 0, avgScore: 0 });
  const [recurringIssues, setRecurringIssues] = useState<{item: ChecklistItem, count: number}[]>([]);

  useEffect(() => {
    const loadData = async () => {
      // Tentar sincronizar em background ao carregar
      syncData().catch(console.error);

      // Get upcoming schedules
      const upcoming = await db.schedules
        .where('status')
        .equals('pending')
        .toArray();
      
      const sortedUpcoming = upcoming
        .filter(s => s.scheduledAt >= new Date())
        .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
        .slice(0, 3);
      
      for (const s of sortedUpcoming) {
        const client = await db.clients.get(s.clientId);
        if (client) s.clientName = client.name;
      }
      setNextSchedules(sortedUpcoming);

      // Get latest 5 inspections
      const inspections = await db.inspections.orderBy('createdAt').reverse().limit(5).toArray();
      // Populate client names
      for (const insp of inspections) {
        const client = await db.clients.get(insp.clientId);
        if (client) insp.clientName = client.name;
      }
      setRecentInspections(inspections);

      // Get basic stats
      const active = await db.inspections.where('status').equals('in_progress').count();
      const completedList = await db.inspections.where('status').equals('completed').toArray();
      
      let totalPct = 0;
      const allTemplates = getTemplates();
      
      for (const insp of completedList) {
        const resp = await db.responses.where('inspectionId').equals(insp.id).toArray();
        const template = allTemplates.find(t => t.id === insp.templateId);
        if (template) {
          const score = calculateScore(resp, template.sections);
          totalPct += score.scorePercentage;
        }
      }

      setStats({ 
        totalActive: active, 
        totalCompleted: completedList.length,
        avgScore: completedList.length > 0 ? Math.round(totalPct / completedList.length) : 0
      });

      // Calculate Recurring Issues
      const allNCs = await db.responses.where('result').equals('not_complies').toArray();
      const itemCounts: Record<string, number> = {};
      allNCs.forEach(nc => {
        itemCounts[nc.itemId] = (itemCounts[nc.itemId] || 0) + 1;
      });

      const sortedItems = Object.entries(itemCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

      const items: {item: ChecklistItem, count: number}[] = [];
      const templates = getTemplates();
      const allChecklistItems = templates.flatMap(t => t.sections.flatMap(s => s.items));

      for (const [id, count] of sortedItems) {
        const found = allChecklistItems.find(i => i.id === id);
        if (found) items.push({ item: found, count });
      }
      setRecurringIssues(items);
    };
    loadData();
  }, []);

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      {/* Header Greeting */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Olá, {settings.name ? settings.name.split(' ')[0] : 'Consultora'} 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Bem-vinda ao InspecVISA. O que você deseja inspecionar hoje?
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button variant="outline" onClick={() => navigate('/settings')} className="h-14 lg:hidden">
             <Settings className="mr-2 h-5 w-5" />
             Ajustes
           </Button>
           <Button variant="outline" onClick={() => navigate('/schedules')} className="h-14">
             <Calendar className="mr-2 h-5 w-5" />
             Agenda
           </Button>
           <Button 
            size="lg" 
            className="shadow-lg h-14 px-6 text-md"
            onClick={() => navigate('/new')}
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Nova Inspeção
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        <Card className="bg-primary-50 border-primary-100">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-900">{stats.totalActive}</div>
              <div className="text-xs font-medium text-primary-700 uppercase tracking-wider">Ativas</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-100">
           <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">{stats.totalCompleted}</div>
              <div className="text-xs font-medium text-green-700 uppercase tracking-wider">Concluídas</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
           <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">{stats.avgScore}%</div>
              <div className="text-xs font-medium text-blue-700 uppercase tracking-wider">Média Global</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Schedules Section */}
      {nextSchedules.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary-600" />
              Próximas Visitas Agendadas
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {nextSchedules.map(s => (
              <Card key={s.id} className="bg-white border-l-4 border-l-primary-500 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/schedules')}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-primary-600 uppercase">
                      {s.scheduledAt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>
                    <span className="text-[10px] font-medium text-gray-400">
                      {s.scheduledAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm truncate mb-1">{s.clientName}</h3>
                  <div className="flex items-center text-[10px] text-gray-500">
                    <Clock className="mr-1 h-3 w-3" />
                    Iniciar em breve
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Recent Inspections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Visitas Recentes</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/inspections')}>
              Ver todas
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          {recentInspections.length === 0 ? (
            <Card className="flex flex-col items-center justify-center bg-gray-50 border-dashed py-12">
              <ClipboardCheck className="mb-4 h-12 w-12 text-gray-300" />
              <p className="text-gray-500 text-sm">Nenhuma inspeção registrada.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentInspections.map((insp) => (
                <Card 
                  key={insp.id} 
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => navigate(insp.status === 'in_progress' ? '/execute' : '/inspections')}
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{insp.clientName || 'Cliente'}</h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{formatDateTime(insp.createdAt)}</span>
                        <span>•</span>
                        <Badge variant={insp.status === 'completed' ? 'success' : 'warning'} className="text-[10px] px-1 py-0">
                          {insp.status === 'completed' ? 'Finalizada' : 'Em andamento'}
                        </Badge>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recurring Issues */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
            Problemas Recorrentes
          </h2>
          {recurringIssues.length === 0 ? (
             <Card className="p-8 text-center bg-gray-50 border-dashed text-sm text-gray-500">
               Tudo certo! Nenhuma não conformidade frequente detectada.
             </Card>
          ) : (
            <div className="space-y-3">
              {recurringIssues.map(({ item, count }) => (
                <Card key={item.id} className="p-4 border-l-4 border-l-amber-500">
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-sm text-gray-700 font-medium line-clamp-2">{item.description}</p>
                    <div className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                      {count}x
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
