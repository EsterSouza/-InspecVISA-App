import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Calendar, Activity, CheckCircle, Trash2, Edit } from 'lucide-react';
import { db } from '../db/database';
import type { Inspection, Client } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { formatDateTime } from '../utils/imageUtils';

export function Inspections() {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in_progress' | 'completed'>('all');

  const loadInspections = async () => {
    let list = await db.inspections.orderBy('createdAt').reverse().toArray();
    
    // Join client data
    const clientIds = [...new Set(list.map(i => i.clientId))];
    const clients = await db.clients.where('id').anyOf(clientIds).toArray();
    const clientMap = new Map<string, Client>(clients.map(c => [c.id, c]));

    list = list.map(insp => {
      const c = clientMap.get(insp.clientId);
      return {
        ...insp,
        clientName: c?.name || 'Cliente deletado',
        clientCategory: c?.category,
      };
    });

    if (filterStatus !== 'all') {
      list = list.filter(i => i.status === filterStatus);
    }
    if (search) {
      list = list.filter(i => 
        i.clientName?.toLowerCase().includes(search.toLowerCase()) || 
        i.consultantName.toLowerCase().includes(search.toLowerCase())
      );
    }

    setInspections(list);
  };

  useEffect(() => { loadInspections(); }, [search, filterStatus]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir esta inspeção? Todos os dados e fotos serão perdidos permanentemente.')) {
      await db.inspections.delete(id);
      
      // Cascade delete responses and photos
      const responses = await db.responses.where('inspectionId').equals(id).toArray();
      const responseIds = responses.map(r => r.id);
      await db.photos.where('responseId').anyOf(responseIds).delete();
      await db.responses.bulkDelete(responseIds);
      
      loadInspections();
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inspeções</h1>
          <p className="text-sm text-gray-500">Histórico e andamento de avaliações.</p>
        </div>
        <Button onClick={() => navigate('/new')} className="w-full sm:w-auto shadow-md">
          <Plus className="mr-2 h-5 w-5" />
          Nova Inspeção
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="relative col-span-1 sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, consultor..."
            className="h-10 w-full rounded-md border border-gray-300 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
        >
          <option value="all">Todos os Status</option>
          <option value="in_progress">Em Andamento</option>
          <option value="completed">Concluídas</option>
        </select>
      </div>

      <div className="space-y-4">
        {inspections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-gray-500 bg-gray-50">
            Nenhuma inspeção encontrada com os filtros atuais.
          </div>
        ) : (
          inspections.map(insp => (
            <Card 
              key={insp.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${insp.status === 'in_progress' ? 'border-primary-200 bg-primary-50/10' : ''}`}
              onClick={() => navigate(insp.status === 'in_progress' ? '/execute' : '/summary', { state: { inspectionId: insp.id }})}
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-bold text-gray-900">{insp.clientName}</h3>
                      {insp.status === 'in_progress' ? (
                        <Badge variant="warning" className="animate-pulse"><Activity className="mr-1 h-3 w-3" /> Em Andamento</Badge>
                      ) : (
                        <Badge variant="success"><CheckCircle className="mr-1 h-3 w-3" /> Concluída</Badge>
                      )}
                    </div>
                    
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-400" /> 
                        Início: {formatDateTime(insp.createdAt)}
                      </div>
                      {insp.completedAt && (
                        <div className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> 
                          Fim: {formatDateTime(insp.completedAt)}
                        </div>
                      )}
                      {insp.clientCategory && (
                        <div className="col-span-1 sm:col-span-2 text-xs font-semibold text-gray-500 tracking-wider font-mono">
                          CATEGORIA: {insp.clientCategory.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      className="bg-white"
                      onClick={(e) => {
                         e.stopPropagation();
                         navigate(insp.status === 'in_progress' ? '/execute' : '/summary', { state: { inspectionId: insp.id }});
                      }}
                    >
                      {insp.status === 'in_progress' ? 'Continuar' : 'Ver Relatório'}
                    </Button>
                    
                    {insp.status === 'completed' && (
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-10 w-10 text-primary-600 border-primary-100 hover:bg-primary-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/execute', { state: { inspectionId: insp.id }});
                        }}
                        title="Editar Inspeção"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}

                    <Button 
                      variant="ghost" 
                      className="text-red-500 hover:bg-red-50 hover:text-red-600 px-3"
                      onClick={(e) => handleDelete(e, insp.id)}
                      title="Excluir Inspeção"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
