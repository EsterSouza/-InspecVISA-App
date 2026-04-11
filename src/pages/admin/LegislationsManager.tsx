import React, { useState, useEffect } from 'react';
import { LegislationService, type Legislation } from '../../services/legislationService';
import { Plus, Trash2, ExternalLink, Search, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function LegislationsManager() {
  const [legislations, setLegislations] = useState<Legislation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newLeg, setNewLeg] = useState({ name: '', summary: '', url: '' });

  useEffect(() => {
    loadLegislations();
  }, []);

  async function loadLegislations() {
    try {
      setLoading(true);
      const data = await LegislationService.listLegislations();
      setLegislations(data);
    } catch (err) {
      console.error('Failed to load legislations:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    if (!newLeg.name) return;
    try {
      await LegislationService.saveLegislation(newLeg);
      setNewLeg({ name: '', summary: '', url: '' });
      setIsAdding(false);
      loadLegislations();
    } catch (err) {
      alert('Erro ao salvar legislação');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta legislação?')) return;
    try {
      await LegislationService.deleteLegislation(id);
      loadLegislations();
    } catch (err) {
      alert('Erro ao excluir');
    }
  }

  const filtered = legislations.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Biblioteca de Legislação</h1>
          <p className="text-gray-500">Gerencie as leis que serão vinculadas aos itens de inspeção.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Nova Legislação
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar legislação..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isAdding && (
        <div className="mb-8 p-6 bg-white rounded-2xl border border-primary-100 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary-600" /> Adicionar Legislação
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              placeholder="Nome (Ex: RDC 63/2011)"
              className="p-3 rounded-lg border border-gray-200"
              value={newLeg.name}
              onChange={(e) => setNewLeg({ ...newLeg, name: e.target.value })}
            />
            <input
              placeholder="URL do PDF (opcional)"
              className="p-3 rounded-lg border border-gray-200"
              value={newLeg.url}
              onChange={(e) => setNewLeg({ ...newLeg, url: e.target.value })}
            />
            <textarea
              placeholder="Resumo ou descrição"
              className="p-3 rounded-lg border border-gray-200 md:col-span-2 h-24"
              value={newLeg.summary}
              onChange={(e) => setNewLeg({ ...newLeg, summary: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAdding(false)}>Cancelar</Button>
            <Button onClick={handleAdd}>Salvar Legislação</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Nenhuma legislação encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((leg) => (
            <div key={leg.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-lg text-gray-900">{leg.name}</h4>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {leg.url && (
                    <a href={leg.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <button onClick={() => handleDelete(leg.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                {leg.summary || 'Sem resumo disponível.'}
              </p>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                Adicionado em: {new Date(leg.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
