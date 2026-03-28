import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRight, ArrowLeft, WifiOff } from 'lucide-react';
import { db } from '../db/database';
import { useSettingsStore } from '../store/useSettingsStore';
import type { Client, ChecklistTemplate } from '../types';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { generateId } from '../utils/imageUtils';
import { getTemplates, enrichTemplate } from '../data/templates';

export function NewInspection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedClientId = searchParams.get('clientId');
  
  const settings = useSettingsStore((s) => s.settings);
  const [step, setStep] = useState(1);
  const [clients, setClients] = useState<Client[]>([]);
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);

  // New P2 Metadata Fields
  const [accompanistName, setAccompanistName] = useState('');
  const [accompanistRole, setAccompanistRole] = useState('');
  
  // ILPI Specifics
  const [ilpiCapacity, setIlpiCapacity] = useState('');
  const [residentsTotal, setResidentsTotal] = useState('');
  const [dep1, setDep1] = useState('');
  const [dep2, setDep2] = useState('');
  const [dep3, setDep3] = useState('');

  const [inspectionDate, setInspectionDate] = useState(new Date().toISOString().split('T')[0]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      const cList = await db.clients.orderBy('name').toArray();
      setClients(cList);
      
      if (preSelectedClientId) {
        const found = cList.find(c => c.id === preSelectedClientId);
        if (found) {
          setSelectedClient(found);
          setStep(2); // Auto-advance to template selection
        }
      }
      
      setTemplates(getTemplates());
    };
    init();
  }, [preSelectedClientId]);

  const handleStart = async () => {
    if (!selectedClient || !selectedTemplate) return;

    try {
      // Find the last completed inspection for this client to carry over NCs
      const lastInspection = await db.inspections
        .where('[clientId+status]')
        .equals([selectedClient.id, 'completed'])
        .reverse()
        .first();

      const newInspectionId = generateId();
      await db.inspections.add({
        id: newInspectionId,
        clientId: selectedClient.id,
        templateId: selectedTemplate.id,
        consultantName: settings.name || 'Consultor Não Identificado',
        inspectionDate: new Date(inspectionDate + 'T12:00:00'),
        status: 'in_progress',
        createdAt: new Date(),
        city: selectedClient.city,
        state: selectedClient.state,
        // P2 Fields
        accompanistName,
        accompanistRole,
        ilpiCapacity: ilpiCapacity ? parseInt(ilpiCapacity) : undefined,
        residentsTotal: residentsTotal ? parseInt(residentsTotal) : undefined,
        dependencyLevel1: dep1 ? parseInt(dep1) : undefined,
        dependencyLevel2: dep2 ? parseInt(dep2) : undefined,
        dependencyLevel3: dep3 ? parseInt(dep3) : undefined
      });

      navigate('/execute', { 
        state: { 
          inspectionId: newInspectionId,
          previousInspectionId: lastInspection?.id 
        } 
      });
    } catch (err) {
      console.error(err);
      alert('Erro ao iniciar inspeção: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
      {/* Stepper Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-3 mb-4 text-gray-500">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Nova Inspeção</h1>
        
        <div className="mt-6 flex items-center justify-between px-2 text-sm font-medium text-gray-500">
          <span className={step >= 1 ? 'text-primary-600' : ''}>1. Selecionar Cliente</span>
          <ChevronRight className="h-4 w-4 text-gray-300" />
          <span className={step >= 2 ? 'text-primary-600' : ''}>2. Escolher Roteiro</span>
          <ChevronRight className="h-4 w-4 text-gray-300" />
          <span className={step >= 3 ? 'text-primary-600' : ''}>3. Configurar</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div 
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-8">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Selecione o estabelecimento para inspeção:</h2>
            {clients.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                 <p className="text-gray-500 mb-4">Você ainda não tem clientes cadastrados.</p>
                 <Button onClick={() => navigate('/clients')}>Cadastrar Cliente</Button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {clients.map(client => (
                  <Card 
                    key={client.id}
                    className={`cursor-pointer transition-all hover:border-primary-300 hover:shadow-md ${selectedClient?.id === client.id ? 'border-primary-500 ring-1 ring-primary-500 bg-primary-50/50' : ''}`}
                    onClick={() => setSelectedClient(client)}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900">{client.name}</h3>
                        <Badge variant="neutral" className="uppercase text-[10px]">{client.category}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{client.address || 'Sem endereço'}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="mt-8 flex justify-end">
              <Button disabled={!selectedClient} onClick={() => setStep(2)}>
                Próximo Passo <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && selectedClient && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Roteiros disponíveis para a categoria: <span className="uppercase text-primary-600">{selectedClient.category}</span></h2>
            
            <div className="grid gap-4">
              {(() => {
                let filtered = templates.filter(t => t.category === selectedClient.category);
                
                // Location-based filtering for Alimentos
                if (selectedClient.category === 'alimentos') {
                  const isRJ = selectedClient.state === 'RJ' || 
                               selectedClient.city?.toLowerCase().includes('rio de janeiro');
                  
                  if (!isRJ) {
                    // Hide RJ template if not in RJ
                    filtered = filtered.filter(t => t.id !== 'tpl-alimentos-rj-v1');
                  }
                }

                if (filtered.length === 0) {
                  return (
                    <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                      Nenhum roteiro encontrado para esta categoria.
                    </div>
                  );
                }

                return filtered.map(t => (
                  <Card 
                    key={t.id}
                    className={`cursor-pointer p-4 transition-all hover:border-primary-300 hover:shadow-md ${selectedTemplate?.id === t.id ? 'border-primary-500 ring-1 ring-primary-500 bg-primary-50/50' : ''}`}
                    onClick={() => setSelectedTemplate(t)}
                  >
                     <div className="flex justify-between items-center">
                        <div>
                           <h3 className="font-semibold text-gray-900 text-lg">{t.name}</h3>
                           <p className="text-sm text-gray-500 mt-1">{t.sections.length} seções • {t.sections.reduce((acc, s) => acc + s.items.length, 0)} itens</p>
                        </div>
                        <div className="h-5 w-5 rounded-full border border-gray-300 bg-white flex items-center justify-center">
                           {selectedTemplate?.id === t.id && <div className="h-3 w-3 rounded-full bg-primary-600" />}
                        </div>
                     </div>
                  </Card>
                ));
              })()}
            </div>

            <div className="mt-8 flex justify-between space-x-4">
              <Button variant="outline" onClick={() => setStep(1)}>Voltar</Button>
              <Button disabled={!selectedTemplate} onClick={() => setStep(3)}>
                Próximo Passo <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && selectedClient && selectedTemplate && (
           <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="rounded-xl bg-gray-50 p-6 border border-gray-200">
               <h2 className="text-lg font-semibold text-gray-900 mb-6">Configurações da Visita</h2>
               
               <div className="space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 border-b border-gray-200 pb-4">
                   <dt className="text-sm font-medium text-gray-500">Cliente</dt>
                   <dd className="text-sm font-semibold text-gray-900 sm:col-span-2">{selectedClient.name}</dd>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 border-b border-gray-200 pb-4">
                    <dt className="text-sm font-medium text-gray-500 flex flex-col">
                       Acompanhante
                       <span className="text-[10px] text-gray-400 font-normal">Responsável no local</span>
                    </dt>
                    <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3">
                       <input 
                         type="text" 
                         placeholder="Nome completo"
                         className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none bg-white"
                         value={accompanistName}
                         onChange={(e) => setAccompanistName(e.target.value)}
                       />
                       <input 
                         type="text" 
                         placeholder="Cargo/Função"
                         className="sm:w-32 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none bg-white"
                         value={accompanistRole}
                         onChange={(e) => setAccompanistRole(e.target.value)}
                       />
                    </div>
                 </div>

                 {selectedClient.category === 'ilpi' && (
                   <div className="space-y-4 border-b border-gray-200 pb-4">
                      <dt className="text-sm font-medium text-gray-500 mb-2">Dados do ILPI</dt>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                         <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 uppercase font-bold">Capacidade Máx.</label>
                            <input 
                              type="number" 
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none bg-white"
                              value={ilpiCapacity}
                              onChange={(e) => setIlpiCapacity(e.target.value)}
                            />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 uppercase font-bold">Nº Residentes</label>
                            <input 
                              type="number" 
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none bg-white"
                              value={residentsTotal}
                              onChange={(e) => setResidentsTotal(e.target.value)}
                            />
                         </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                         <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 uppercase font-bold text-center block">Grau I</label>
                            <input type="number" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white" value={dep1} onChange={(e) => setDep1(e.target.value)} />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 uppercase font-bold text-center block">Grau II</label>
                            <input type="number" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white" value={dep2} onChange={(e) => setDep2(e.target.value)} />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 uppercase font-bold text-center block">Grau III</label>
                            <input type="number" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white" value={dep3} onChange={(e) => setDep3(e.target.value)} />
                         </div>
                      </div>
                   </div>
                 )}

                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 border-b border-gray-200 pb-4">
                   <dt className="text-sm font-medium text-gray-500">Roteiro</dt>
                   <dd className="text-sm font-semibold text-primary-700 sm:col-span-2">{selectedTemplate.name}</dd>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                   <dt className="text-sm font-medium text-gray-500">Data de início</dt>
                   <dd className="sm:col-span-2">
                     <input 
                       type="date"
                       className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-primary-500 focus:outline-none bg-white font-semibold"
                       value={inspectionDate}
                       onChange={(e) => setInspectionDate(e.target.value)}
                       max={new Date().toISOString().split('T')[0]}
                     />
                   </dd>
                 </div>
               </div>
             </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>Voltar</Button>
                <div className="flex flex-col items-end gap-2">
                  {!isOnline && (
                    <span className="text-amber-600 text-xs font-bold flex items-center">
                      <WifiOff className="mr-1 h-3 w-3" /> CONECTE-SE PARA INICIAR
                    </span>
                  )}
                  <Button 
                    onClick={handleStart} 
                    disabled={!isOnline}
                    className="bg-primary-600 hover:bg-primary-700 text-lg py-6 px-8 h-auto shadow-xl w-full sm:w-auto"
                  >
                    {isOnline ? 'INICIAR INSPEÇÃO' : 'FORA DE LINHA'}
                  </Button>
                </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
