import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search, Plus, Building2, Phone, MapPin, Edit2, Trash2 } from 'lucide-react';
import { db, deleteClient } from '../db/database';
import type { Client, ClientCategory, FoodEstablishmentType } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { generateId } from '../utils/imageUtils';

import { useNavigate } from 'react-router-dom';

export function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<ClientCategory | 'all'>('all');
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<Client>();

  const loadClients = async () => {
    let list = await db.clients.orderBy('createdAt').reverse().toArray();
    if (filterCat !== 'all') {
      list = list.filter(c => c.category === filterCat);
    }
    if (search) {
      list = list.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || 
                              c.cnpj?.includes(search) || 
                              c.responsibleName?.toLowerCase().includes(search.toLowerCase()));
    }
    setClients(list);
  };

  useEffect(() => { loadClients(); }, [search, filterCat]);

  const onSubmit = async (data: Client) => {
    try {
      if (editingClient) {
        // Update existing client
        const updatedClient: Client = {
          ...editingClient,
          ...data,
          // category change might require cleanup but we keep it simple for now
        };
        
        if (updatedClient.category !== 'alimentos') {
          delete updatedClient.foodTypes;
        }

        await db.clients.put(updatedClient);
      } else {
        // Create new client
        const newClient: Client = {
          ...data,
          id: generateId(),
          createdAt: new Date(),
        };
        
        if (newClient.category !== 'alimentos') {
          delete newClient.foodTypes;
        } else if (!newClient.foodTypes || newClient.foodTypes.length === 0) {
          newClient.foodTypes = ['servico_alimentacao'];
        }

        await db.clients.add(newClient);
      }

      setIsModalOpen(false);
      setEditingClient(null);
      reset();
      loadClients();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar cliente: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleEdit = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingClient(client);
    reset(client);
    setIsModalOpen(true);
  };

  const handleDelete = async (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Deseja realmente excluir o cliente "${client.name}"? Todas as inspeções e fotos associadas serão apagadas permanentemente.`)) {
      try {
        await deleteClient(client.id);
        loadClients();
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir cliente.');
      }
    }
  };

  const selectedCategory = watch('category');

  const categoryOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'estetica', label: 'Estética' },
    { value: 'ilpi', label: 'ILPI' },
    { value: 'alimentos', label: 'Alimentos' }
  ];

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500">Gerencie seus estabelecimentos.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-5 w-5" />
          Novo Cliente
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="relative col-span-1 sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, CNPJ..."
            className="h-10 w-full rounded-md border border-gray-300 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value as any)}
        >
          {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {clients.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-gray-500">
            Nenhum cliente encontrado.
          </div>
        ) : (
          clients.map(client => (
            <Card 
              key={client.id} 
              className="p-4 sm:p-5 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => navigate(`/clients/${client.id}`)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                  <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-500">
                     {client.cnpj && <span>CNPJ: {client.cnpj}</span>}
                     {client.cnpj && <span className="hidden sm:inline">•</span>}
                     <Badge variant={
                       client.category === 'estetica' ? 'success' : 
                       client.category === 'ilpi' ? 'warning' : 'default'
                     }>
                       {client.category.toUpperCase()}
                     </Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm text-gray-600">
                    {client.responsibleName && (
                      <div className="flex items-center"><Building2 className="mr-2 h-4 w-4" /> {client.responsibleName}</div>
                    )}
                    {client.phone && (
                      <div className="flex items-center"><Phone className="mr-2 h-4 w-4" /> {client.phone}</div>
                    )}
                    {client.address && (
                      <div className="flex items-center col-span-1 sm:col-span-2"><MapPin className="mr-2 h-4 w-4 flex-shrink-0" /> <span className="truncate">{client.address}</span></div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 self-start ml-4">
                  <button 
                    onClick={(e) => handleEdit(client, e)}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(client, e)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingClient(null); reset(); }} 
        title={editingClient ? "Editar Cliente" : "Cadastrar Novo Cliente"}
      >
        <form id="client-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <p className="text-xs text-gray-600 mb-3 hover:text-gray-900">
                Selecione os tipos para habilitar seções específicas no roteiro de inspeção.
              </p>
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
              <input {...register('city')} placeholder="Ex: Rio de Janeiro" className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado (UF)</label>
              <select 
                {...register('state')}
                className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">Selecione...</option>
                <option value="AC">AC</option><option value="AL">AL</option><option value="AP">AP</option>
                <option value="AM">AM</option><option value="BA">BA</option><option value="CE">CE</option>
                <option value="DF">DF</option><option value="ES">ES</option><option value="GO">GO</option>
                <option value="MA">MA</option><option value="MT">MT</option><option value="MS">MS</option>
                <option value="MG">MG</option><option value="PA">PA</option><option value="PB">PB</option>
                <option value="PR">PR</option><option value="PE">PE</option><option value="PI">PI</option>
                <option value="RJ">RJ</option><option value="RN">RN</option><option value="RS">RS</option>
                <option value="RO">RO</option><option value="RR">RR</option><option value="SC">SC</option>
                <option value="SP">SP</option><option value="SE">SE</option><option value="TO">TO</option>
              </select>
            </div>
          </div>

           <div>
            <label className="block text-sm font-medium text-gray-700">Endereço Completo</label>
            <textarea {...register('address')} rows={2} className="mt-1 w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>

          <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" form="client-form">Salvar Cliente</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
