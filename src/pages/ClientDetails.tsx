import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Edit2,
  Trash2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { db, deleteClient } from '../db/database';
import { type Client, type Inspection, type InspectionScore, FOOD_SEGMENT_LABELS } from '../types';
import { calculateScore } from '../utils/scoring';
import { formatDateTime } from '../utils/imageUtils';
import { getTemplates } from '../data/templates';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

type RecurringNC = { itemId: string; description: string; count: number };

export function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [inspections, setInspections] = useState<(Inspection & { score: InspectionScore })[]>([]);
  const [recurringNCs, setRecurringNCs] = useState<RecurringNC[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<Client>();
  const selectedCategory = watch('category');

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      const clientData = await db.clients.get(id);
      if (!clientData) {
        navigate('/clients');
        return;
      }
      setClient(clientData);

      // Load all inspections for this client
      const rawInspections = (await db.inspections
        .where('clientId').equals(id)
        .reverse()
        .toArray())
        .filter(i => !i.deletedAt);

      const inspectionsWithScores = await Promise.all(
        rawInspections.map(async (insp) => {
          const responses = await db.responses
            .where('inspectionId').equals(insp.id)
            .filter(r => !r.deletedAt)
            .toArray();
          const template = await db.templates.get(insp.templateId);
          const score = calculateScore(responses, template?.sections || []);
          return { ...insp, score };
        })
      );

      setInspections(inspectionsWithScores.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()));

      // --- Calcular Não Conformidades Recorrentes deste cliente ---
      const allInspIds = rawInspections.map(i => i.id);
      const allResponses = await db.responses
        .filter(r => !r.deletedAt && allInspIds.includes(r.inspectionId) && r.result === 'not_complies')
        .toArray();

      // Contar por itemId
      const countMap: Record<string, number> = {};
      for (const r of allResponses) {
        countMap[r.itemId] = (countMap[r.itemId] || 0) + 1;
      }

      // Buscar descrição de cada item nos templates
      const templates = getTemplates();
      const allItems = templates.flatMap(t => t.sections.flatMap(s => s.items));

      const ncs: RecurringNC[] = Object.entries(countMap)
        .filter(([, count]) => count >= 2)
        .sort(([, a], [, b]) => b - a)
        .map(([itemId, count]) => {
          const item = allItems.find(i => i.id === itemId);
          return {
            itemId,
            description: item?.description || `Item ${itemId}`,
            count,
          };
        });

      setRecurringNCs(ncs);
      setLoading(false);
    };

    loadData();
  }, [id, navigate]);

  const onEditSubmit = async (data: Client) => {
    try {
      if (!client) return;
      const updatedClient: Client = {
        ...client,
        ...data,
        updatedAt: new Date()
      };

      if (updatedClient.category !== 'alimentos') {
        delete updatedClient.foodTypes;
      }

      await db.onlineUpsert('clients', updatedClient, db.clients);
      setClient({ ...updatedClient, synced: navigator.onLine ? 1 : 0 });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar cliente.');
    }
  };


  const handleDelete = async () => {
    if (!client) return;
    if (window.confirm(`Deseja realmente excluir o cliente "${client.name}"? Todas as inspeções e fotos associadas serão apagadas permanentemente.`)) {
      try {
        await deleteClient(client.id);
        navigate('/clients');
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir cliente.');
      }
    }
  };

  if (loading || !client) {
    return <div className="p-8 text-center text-gray-500">Carregando detalhes...</div>;
  }

  const chartData = [...inspections]
    .reverse()
    .filter(i => i.status === 'completed')
    .map(i => ({
      date: new Date(i.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      score: Math.round(i.score?.scorePercentage || 0),
    }));

  const latestInspection = inspections.find(i => i.status === 'completed');

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/clients')} className="-ml-3 mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Clientes
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="default">{client.category?.toUpperCase() || 'SEM CATEGORIA'}</Badge>
              <span className="text-sm text-gray-500">Cód: {client.id.substring(0, 8)}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => { reset(client); setIsModalOpen(true); }}>
              <Edit2 className="mr-2 h-4 w-4" /> Editar
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" /> Excluir
            </Button>
            <Button onClick={() => navigate('/new')}>
              <Calendar className="mr-2 h-4 w-4" /> Nova Inspeção
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statistics & Evolution */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary-600" />
                  Evolução da Conformidade
                </h2>
              </div>
              
              {chartData.length > 1 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        style={{ fontSize: '12px', fill: '#94a3b8' }} 
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        axisLine={false} 
                        tickLine={false} 
                        style={{ fontSize: '12px', fill: '#94a3b8' }}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value) => [`${value}%`, 'Conformidade']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#1e6b5e" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#1e6b5e', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                  <Activity className="h-10 w-10 mb-2 opacity-20" />
                  <p>Dados insuficientes para gerar gráfico.</p>
                  <p className="text-xs">Realize pelo menos 2 inspeções concluídas.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* History */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center px-1">
              <FileText className="mr-2 h-5 w-5 text-gray-500" />
              Histórico de Visitas
            </h2>
            {inspections.length === 0 ? (
              <p className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed">Nenhuma visita registrada.</p>
            ) : (
              <div className="space-y-3">
                {inspections.map((insp) => (
                  <Card key={insp.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(insp.status === 'in_progress' ? '/execute' : '/summary', { state: { inspectionId: insp.id }})}>
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold ${
                          insp.status === 'in_progress' ? 'bg-amber-400' :
                          insp.score.scorePercentage >= 90 ? 'bg-green-500' :
                          insp.score.scorePercentage >= 70 ? 'bg-blue-500' :
                          'bg-red-500'
                        }`}>
                          {insp.status === 'completed' ? `${Math.round(insp.score.scorePercentage)}%` : '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{formatDateTime(insp.createdAt)}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant={insp.status === 'completed' ? 'success' : 'warning'}>
                              {insp.status === 'completed' ? 'Finalizada' : 'Em andamento'}
                            </Badge>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{insp.score.compliesCount} conformidades</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-300" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center uppercase tracking-wider">
                <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
                Plano de Ação Aberto
              </h3>
              {!latestInspection ? (
                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded">Aguardando primeira inspeção concluída.</p>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 mb-2">Baseado na última visita ({latestInspection.score.notCompliesCount} itens pendentes):</p>
                  <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => navigate('/summary', { state: { inspectionId: latestInspection.id }})}>
                    Ver Último Relatório <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Não Conformidades Recorrentes (≥2x neste cliente) */}
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-1 flex items-center uppercase tracking-wider">
                <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                NC Recorrentes
              </h3>
              <p className="text-[10px] text-gray-400 mb-4">Itens com ≥ 2 falhas neste cliente</p>
              {recurringNCs.length === 0 ? (
                <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded text-center">
                  {inspections.length === 0
                    ? 'Aguardando inspeções.'
                    : '✅ Nenhuma NC repetida detectada.'}
                </p>
              ) : (
                <div className="space-y-2">
                  {recurringNCs.map(nc => (
                    <div
                      key={nc.itemId}
                      className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-lg p-3"
                    >
                      <span className="mt-0.5 flex-shrink-0 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {nc.count}
                      </span>
                      <p className="text-xs text-gray-700 leading-snug">{nc.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-primary-900 text-white border-none">
            <CardContent className="p-5">
              <h3 className="text-sm font-bold mb-4 opacity-80 flex items-center uppercase tracking-wider text-primary-200">
                Resumo do Cliente
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs opacity-60 block text-primary-200">Categoria Principal</label>
                  <p className="font-medium">{client.category?.toUpperCase() || 'SEM CATEGORIA'}</p>
                </div>
                {client.category === 'alimentos' && client.foodTypes && client.foodTypes.length > 0 && (
                  <div>
                    <label className="text-xs opacity-60 block text-primary-200">Segmentos</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {client.foodTypes.map(ft => (
                        <Badge key={ft} variant="outline" className="bg-white/10 text-white border-white/20 text-[10px] py-0">
                          {FOOD_SEGMENT_LABELS[ft] || ft}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-xs opacity-60 block text-primary-200">Responsável</label>
                  <p className="font-medium">{client.responsibleName || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-xs opacity-60 block">Telefone</label>
                  <p className="font-medium">{client.phone || '—'}</p>
                </div>
                <div>
                  <label className="text-xs opacity-60 block">Endereço</label>
                  <p className="text-sm opacity-90">{client.address || '—'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Editar Cliente"
      >
        <form id="edit-client-form" onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Estabelecimento *</label>
            <input 
              {...register('name', { required: true })} 
              className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500" 
            />
            {errors.name && <span className="text-xs text-red-500">Campo obrigatório</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Categoria *</label>
              <select 
                {...register('category', { required: true })}
                className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">Selecione...</option>
                <option value="estetica">Estética e Beleza</option>
                <option value="ilpi">ILPI</option>
                <option value="alimentos">Alimentos</option>
              </select>
              {errors.category && <span className="text-xs text-red-500">Campo obrigatório</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CNPJ</label>
              <input {...register('cnpj')} className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>

          {selectedCategory === 'alimentos' && (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
              <label className="block text-sm font-medium text-gray-800 mb-2">Tipos de Serviço de Alimentação</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" value="servico_alimentacao" {...register('foodTypes')} className="rounded text-primary-600 focus:ring-primary-500" />
                  <span>Restaurante / Lanchonete</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" value="panificacao_confeitaria" {...register('foodTypes')} className="rounded text-primary-600 focus:ring-primary-500" />
                  <span>Padaria / Confeitaria</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" value="mercado_varejo" {...register('foodTypes')} className="rounded text-primary-600 focus:ring-primary-500" />
                  <span>Mercado / Hortifrúti</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" value="manipulacao_carnes" {...register('foodTypes')} className="rounded text-primary-600 focus:ring-primary-500" />
                  <span>Açougue / Peixaria</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" value="pescados_crus" {...register('foodTypes')} className="rounded text-primary-600 focus:ring-primary-500" />
                  <span>Japonês / Pescados Crus</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" value="dark_kitchen" {...register('foodTypes')} className="rounded text-primary-600 focus:ring-primary-500" />
                  <span>Dark Kitchen / Delivery</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" value="bebidas_sorvetes" {...register('foodTypes')} className="rounded text-primary-600 focus:ring-primary-500" />
                  <span>Sorveteria / Lanchonete / Café</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" value="catering_eventos" {...register('foodTypes')} className="rounded text-primary-600 focus:ring-primary-500" />
                  <span>Buffet / Catering</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" value="industria_artesanal" {...register('foodTypes')} className="rounded text-primary-600 focus:ring-primary-500" />
                  <span>Indústria Artesanal</span>
                </label>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Responsável pelo local</label>
            <input {...register('responsibleName')} className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone</label>
              <input {...register('phone')} className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input {...register('email')} type="email" className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Cidade</label>
              <input {...register('city')} className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado (UF)</label>
              <input {...register('state')} className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Endereço Completo</label>
            <textarea {...register('address')} rows={2} className="mt-1 w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>

          <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" form="edit-client-form">Salvar Alterações</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function Activity(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
