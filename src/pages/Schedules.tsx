import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../db/database';
import type { Client, Schedule } from '../types';
import { formatDateTime, generateId } from '../utils/imageUtils';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Calendar, Clock, Plus, Trash2, CheckCircle, AlertCircle, User, Play, Edit2 } from 'lucide-react';
import { syncData } from '../services/syncService';
import { deleteSchedule } from '../db/database';

export function Schedules() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [selectedClientId, setSelectedClientId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [sList, cList] = await Promise.all([
        db.schedules.toArray().then(list => list.filter(s => !s.deletedAt)),
        db.clients.toArray().then(list => list.filter(c => !c.deletedAt))
      ]);
      
      // Revive dates and populate client names
      const revivedSchedules = sList.map(s => ({
        ...s,
        scheduledAt: s.scheduledAt instanceof Date ? s.scheduledAt : new Date(s.scheduledAt),
        clientName: cList.find(c => c.id === s.clientId)?.name
      }));

      // Sort: Pending first, then by date
      revivedSchedules.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return a.scheduledAt.getTime() - b.scheduledAt.getTime();
      });

      setSchedules(revivedSchedules);
      setClients(cList);
    } catch (err) {
      console.error('Error loading schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    syncData().then(loadData).catch(console.error);
  }, []);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !scheduledDate || !scheduledTime) return;

    try {
      const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);
      
      if (isEditing && editingId) {
        await db.schedules.update(editingId, {
          clientId: selectedClientId,
          scheduledAt,
          notes: notes
        });
        
        // Update on Supabase (syncService might handle this, but let's be proactive if needed)
        // syncData handles updates by comparing timestamps, so local update + sync usually works.
      } else {
        const newSchedule: Schedule = {
          id: generateId(),
          clientId: selectedClientId,
          scheduledAt,
          status: 'pending',
          notes: notes
        };
        await db.schedules.add(newSchedule);
      }

      setIsModalOpen(false);
      resetForm();
      loadData();
      syncData().catch(console.error);
    } catch (err) {
      alert('Erro ao salvar agendamento: ' + err);
    }
  };

  const handleEdit = (schedule: Schedule) => {
    const date = schedule.scheduledAt.toISOString().split('T')[0];
    const time = schedule.scheduledAt.toTimeString().split(' ')[0].substring(0, 5);
    
    setSelectedClientId(schedule.clientId);
    setScheduledDate(date);
    setScheduledTime(time);
    setNotes(schedule.notes || '');
    setIsEditing(true);
    setEditingId(schedule.id);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setSelectedClientId('');
    setScheduledDate('');
    setScheduledTime('');
    setNotes('');
    setIsEditing(false);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir este agendamento?')) {
      try {
        await deleteSchedule(id);
        loadData();
        syncData().catch(console.error);
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir agendamento.');
      }
    }
  };

  const handleComplete = async (id: string) => {
    await db.schedules.update(id, { status: 'completed' });
    loadData();
    syncData().catch(console.error);
  };

  const upcomingSchedules = schedules.filter(s => s.status === 'pending');
  const pastSchedules = schedules.filter(s => s.status !== 'pending').slice(0, 10);

  if (loading && schedules.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-sm text-gray-500">Organize suas próximas inspeções e auditorias.</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Agendar Visita
        </Button>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-primary-600" />
            Próximas Visitas
          </h2>
          {upcomingSchedules.length === 0 ? (
            <Card className="bg-gray-50 border-dashed py-12 flex flex-col items-center justify-center">
              <Calendar className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm">Nenhuma visita agendada.</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {upcomingSchedules.map(schedule => (
                <Card key={schedule.id} className="overflow-hidden border-l-4 border-l-primary-500 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary-50 p-3 rounded-xl flex flex-col items-center justify-center min-w-[64px]">
                        <span className="text-xs font-bold text-primary-600 uppercase">
                          {schedule.scheduledAt.toLocaleDateString('pt-BR', { month: 'short' })}
                        </span>
                        <span className="text-xl font-black text-primary-900 leading-none mt-1">
                          {schedule.scheduledAt.getDate()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{schedule.clientName || 'Cliente'}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center"><Clock className="mr-1.5 h-3.5 w-3.5" /> 
                            {schedule.scheduledAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {schedule.notes && <span className="flex items-center italic truncate max-w-[200px]"><AlertCircle className="mr-1.5 h-3.5 w-3.5 text-amber-500" /> {schedule.notes}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                       <Button variant="outline" size="sm" onClick={() => navigate(`/new?clientId=${schedule.clientId}`)} className="text-primary-600 border-primary-100 hover:bg-primary-50">
                         <Play className="mr-2 h-4 w-4 fill-current" />
                         Iniciar
                       </Button>
                       <Button variant="ghost" size="sm" onClick={() => handleComplete(schedule.id)}>
                         <CheckCircle className="h-4 w-4 text-green-600" />
                       </Button>
                       <Button variant="ghost" size="sm" onClick={() => handleEdit(schedule)} className="text-gray-500 hover:bg-gray-50">
                         <Edit2 className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="sm" onClick={() => handleDelete(schedule.id)} className="text-red-500 hover:bg-red-50">
                         <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {pastSchedules.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-600 mb-4">Finalizados recentemente</h2>
            <div className="space-y-2">
              {pastSchedules.map(schedule => (
                 <div key={schedule.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 opacity-60">
                   <div className="flex items-center space-x-3">
                     <CheckCircle className="h-4 w-4 text-gray-400" />
                     <span className="text-sm font-medium text-gray-700">{schedule.clientName}</span>
                     <span className="text-xs text-gray-400">{formatDateTime(schedule.scheduledAt)}</span>
                   </div>
                   {schedule.status === 'completed' ? (
                     <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">CONCLUÍDO</span>
                   ) : (
                     <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase">{schedule.status}</span>
                   )}
                 </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-lg shadow-2xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {isEditing ? 'Editar Agendamento' : 'Agendar Nova Inspeção'}
              </h3>
              <form onSubmit={handleSchedule} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <User className="mr-2 h-4 w-4 text-gray-400" /> Cliente
                  </label>
                  <select
                    required
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm bg-white"
                  >
                    <option value="">Selecione um cliente...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" /> Data
                    </label>
                    <input
                      type="date"
                      required
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 p-3 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-gray-400" /> Horário
                    </label>
                    <input
                      type="time"
                      required
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 p-3 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Observações (Opcional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm"
                    placeholder="Ex: Levar checklist extra..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    {isEditing ? 'Salvar Alterações' : 'Confirmar'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
