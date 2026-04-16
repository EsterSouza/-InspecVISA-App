import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, ChevronRight, Search, Trash2, Edit, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { TemplateService } from '../../services/templateService';
import { Badge } from '../../components/ui/Badge';
import { getTemplates } from '../../data/templates';

export function AdminTemplates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);

      // Fetch remote templates first (editable, Supabase)
      let remoteData: any[] = [];
      try {
        remoteData = await TemplateService.listTemplates();
      } catch (remoteErr) {
        console.warn('[AdminTemplates] Could not fetch remote templates:', remoteErr);
      }

      // Build set of names that remote already covers
      const remoteNames = new Set(remoteData.map((t: any) => t.name));

      // Static templates only shown if their name is NOT in remote
      const staticData = getTemplates()
        .filter(t => !remoteNames.has(t.name))
        .map(t => ({
          ...t,
          isStatic: true,
          updated_at: new Date().toISOString(),
        }));

      // Merge: remote (editable) first, then unique statics (read-only)
      setTemplates([...remoteData, ...staticData]);
    } catch (err: any) {
      console.error('Error loading templates:', err);
      setLoadError(err?.message || 'Erro ao carregar roteiros.');
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = templates.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Roteiros de Inspeção</h2>
          <p className="text-sm text-gray-500">Gerencie e importe novos modelos (ROIs) para as consultoras.</p>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          <Button onClick={() => navigate('/templates/import')} variant="outline">
            Importar ROI
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Pesquisar roteiros por nome ou categoria..."
          className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : loadError ? (
        <Card className="border-red-200 bg-red-50 py-10">
          <div className="flex flex-col items-center text-center px-6">
            <p className="text-red-700 font-semibold mb-2">❌ {loadError}</p>
            <p className="text-sm text-red-500 mb-4">Verifique se você está conectado à internet e tente novamente.</p>
            <Button onClick={loadTemplates} variant="outline">Tentar Novamente</Button>
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed border-2 py-12">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Nenhum roteiro encontrado</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1 mb-6">
              Você ainda não tem roteiros personalizados. Comece importando um novo arquivo ou criando um do zero.
            </p>
            <div className="flex space-x-3">
              <Button onClick={() => navigate('/admin/templates/import')} variant="outline">Importar Agora</Button>
              <Button onClick={() => loadTemplates()} variant="ghost">Recarregar</Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map(template => (
            <Card key={template.id} className="hover:border-primary-300 transition-all group overflow-hidden">
               <div className="flex p-4 items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center mr-4 transition-colors ${
                      (template as any).isStatic ? 'bg-gray-50 group-hover:bg-gray-100' : 'bg-primary-50 group-hover:bg-primary-100'
                    }`}>
                      <FileText className={`h-5 w-5 ${(template as any).isStatic ? 'text-gray-400' : 'text-primary-600'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900">{template.name}</h4>
                        {(template as any).isStatic && (
                          <span className="flex items-center gap-1 text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-semibold">
                            <Lock className="h-2.5 w-2.5" /> Padrão
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-0.5 space-x-2">
                        <Badge variant="neutral" className="uppercase text-[10px]">{template.category}</Badge>
                        <span className="text-[10px] text-gray-400">• v{template.version || '1.0'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!(template as any).isStatic ? (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/templates/${template.id}/edit`)} title="Editar roteiro customizado">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-red-500" title="Excluir">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <span className="text-[10px] text-gray-400 italic mr-2">Roteiro nativo — somente leitura</span>
                    )}
                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary-400 transition-colors ml-2" />
                  </div>
               </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
