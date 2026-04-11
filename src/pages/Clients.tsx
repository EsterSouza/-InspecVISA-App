import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search, Plus, Building2, Phone, MapPin, Edit2, Trash2, Loader2, WifiOff } from 'lucide-react';
import { db, deleteClient } from '../db/database';
import { type Client, type ClientCategory, type FoodEstablishmentType, FOOD_SEGMENT_LABELS } from '../types';
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
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<Client>();

  const loadClients = async () => {
    let list = await db.clients.orderBy('createdAt').reverse().toArray();
    list = list.filter(c => !c.deletedAt);

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

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const onSubmit = async (data: Client) => {
    setIsLoading(true);
    try {
      const clientToSave: Client = editingClient 
        ? { ...editingClient, ...data }
        : { ...data, id: generateId(), createdAt: new Date() };

      // Limpeza de campos específicos de categoria
      if (clientToSave.category !== 'alimentos') {
        delete clientToSave.foodTypes;
      } else if (!clientToSave.foodTypes || clientToSave.foodTypes.length === 0) {
        clientToSave.foodTypes = ['servico_alimentacao'];
      }

      // ✅ ONLINE-DIRECT UPSERT: Salva na nuvem e atualiza cache local
      await db.onlineUpsert('clients', clientToSave, db.clients);

      setIsModalOpen(false);
      setEditingClient(null);
      reset();
      loadClients();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar cliente.');
    } finally {
      setIsLoading(false);
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
    if (window.confirm(`Deseja realmente excluir o cliente "${client.name}"?`)) {
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

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500">Gerencie seus estabelecimentos.</p>
        </div>
        <div className="flex items-center gap-3">
          {!isOnline && (
            <div className="flex items-center text-amber-600 text-sm font-medium">
              <WifiOff className="mr-2 h-4 w-4" /> Offline
            </div>
          )}
          <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto shadow-lg shadow-primary-100">
            <Plus className="mr-2 h-5 w-5" /> Novo Cliente
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="relative col-span-1 sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, CNPJ..."
            className="h-10 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value as any)}
        >
          <option value="all">Todas Categorias</option>
          <option value="estetica">Estética</option>
          <option value="ilpi">ILPI</option>
          <option value="alimentos">Alimentos</option>
        </select>
      </div>

      <div className="space-y-4">
        {clients.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 py-12 text-center text-gray-500 bg-white">
            Nenhum cliente encontrado.
          </div>
        ) : (
          clients.map(client => (
            <Card 
              key={client.id} 
              className="p-5 hover:border-primary-200 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => navigate(`/clients/${client.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{client.name}</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                     <Badge variant={
                       client.category === 'estetica' ? 'success' : 
                       client.category === 'ilpi' ? 'warning' : 'default'
                     }>
                       {client.category.toUpperCase()}
                     </Badge>
                     {client.category === 'alimentos' && client.foodTypes?.map(ft => (
                       <Badge key={ft} variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                         {FOOD_SEGMENT_LABELS[ft as FoodEstablishmentType] || ft}
                       </Badge>
                     ))}
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm text-gray-600">
                    {client.phone && <div className="flex items-center"><Phone className="mr-2 h-4 w-4 text-gray-400" /> {client.phone}</div>}
                    {client.address && <div className="flex items-center col-span-1 sm:col-span-2"><MapPin className="mr-2 h-4 w-4 text-gray-400" /> {client.address}</div>}
                  </div>
                </div>
                <div className="flex gap-1 ml-4 group-hover:opacity-100 opacity-0 transition-opacity">
                  <button onClick={(e) => handleEdit(client, e)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl"><Edit2 className="h-5 w-5" /></button>
                  <button onClick={(e) => handleDelete(client, e)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl"><Trash2 className="h-5 w-5" /></button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingClient(null); reset(); }} title={editingClient ? "Editar Cliente" : "Novo Cliente"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Estabelecimento *</label>
            <input {...register('name', { required: true })} className="mt-1 h-11 w-full rounded-xl border border-gray-200 px-4 focus:ring-2 focus:ring-primary-500 outline-none" />
            {errors.name && <span className="text-xs text-red-500">Obrigatório</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Categoria *</label>
              <select {...register('category', { required: true })} className="mt-1 h-11 w-full rounded-xl border border-gray-200 px-4 focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                <option value="estetica">Estética</option>
                <option value="ilpi">ILPI</option>
                <option value="alimentos">Alimentos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CNPJ</label>
              <input {...register('cnpj')} className="mt-1 h-11 w-full rounded-xl border border-gray-200 px-4 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
          </div>

          {selectedCategory === 'alimentos' && (
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50/50 p-4 space-y-3">
              <label className="block text-xs font-bold uppercase text-yellow-800 tracking-wider">Tipos de Serviço</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {Object.entries(FOOD_SEGMENT_LABELS).map(([val, label]) => (
                  <label key={val} className="flex items-center space-x-2">
                    <input type="checkbox" value={val} {...register('foodTypes')} className="rounded text-primary-600" />
                    <span className="text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Cidade</label>
              <input {...register('city')} className="mt-1 h-11 w-full rounded-xl border border-gray-200 px-4 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <input {...register('state')} className="mt-1 h-11 w-full rounded-xl border border-gray-200 px-4 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
          </div>

          <div className="pt-6 border-t flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Confirmar e Salvar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
