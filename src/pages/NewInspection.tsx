import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRight, ArrowLeft, WifiOff, Loader2 } from 'lucide-react';
import { db } from '../db/database';
import { useSettingsStore } from '../store/useSettingsStore';
import type { Client, ChecklistTemplate, Inspection } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { generateId } from '../utils/imageUtils';

export function NewInspection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedClientId = searchParams.get('clientId');
  
  const settings = useSettingsStore((s) => s.settings);
  const [step, setStep] = useState(preSelectedClientId ? 2 : 1);
  const [clients, setClients] = useState<Client[]>([]);
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);

  const [accompanistName, setAccompanistName] = useState('');
  const [accompanistRole, setAccompanistRole] = useState('');
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
      setLoading(true);
      try {
        const cList = await db.clients.orderBy('name').toArray();
        setClients(cList.filter(c => !c.deletedAt));
        
        if (preSelectedClientId) {
          const found = cList.find(c => c.id === preSelectedClientId);
          if (found) setSelectedClient(found);
        }
        
        const dbTemplates = await db.templates.toArray();
        setTemplates(dbTemplates);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [preSelectedClientId]);

  const handleStart = async () => {
    if (!selectedClient || !selectedTemplate) return;
    setIsStarting(true);

    try {
      const lastInspection = await db.inspections
        .where('[clientId+status]')
        .equals([selectedClient.id, 'completed'])
        .reverse()
        .first();

      const newInspectionId = generateId();
      
      const inspectionData: Inspection = {
        id: newInspectionId,
        clientId: selectedClient.id,
        templateId: selectedTemplate.id,
        consultantName: settings.name || 'Consultor',
        inspectionDate: new Date(inspectionDate + 'T12:00:00'),
        status: 'in_progress',
        createdAt: new Date(),
        city: selectedClient.city,
        state: selectedClient.state,
        accompanistName,
        accompanistRole,
        ilpiCapacity: ilpiCapacity ? parseInt(ilpiCapacity) : undefined,
        residentsTotal: residentsTotal ? parseInt(residentsTotal) : undefined,
        dependencyLevel1: dep1 ? parseInt(dep1) : undefined,
        dependencyLevel2: dep2 ? parseInt(dep2) : undefined,
        dependencyLevel3: dep3 ? parseInt(dep3) : undefined
      };

      // ✅ ONLINE-DIRECT: Salva no Supabase e no cache local
      await db.onlineUpsert('inspections', inspectionData, db.inspections);

      navigate('/execute', { 
        state: { 
          inspectionId: newInspectionId,
          previousInspectionId: lastInspection?.id 
        } 
      });
    } catch (err) {
      console.error(err);
      alert('Erro ao iniciar inspeção.');
    } finally {
      setIsStarting(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="mx-auto max-w-3xl p-6 lg:p-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-3 mb-2 text-gray-500">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Nova Inspeção</h1>
        </div>
        {!isOnline && (
          <div className="flex items-center text-amber-600 bg-amber-50 px-4 py-2 rounded-xl text-sm font-bold border border-amber-100">
            <WifiOff className="mr-2 h-4 w-4" /> Modo Offline
          </div>
        )}
      </div>

      <div className="mb-10 flex gap-4 overflow-hidden rounded-2xl bg-white p-2 border border-gray-100 shadow-sm">
        {[1, 2, 3].map(s => (
          <div key={s} className={`flex-1 h-2 rounded-full transition-all duration-500 ${step >= s ? 'bg-primary-500' : 'bg-gray-100'}`} />
        ))}
      </div>

      <div className="min-h-[400px]">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Selecione o estabelecimento:</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {clients.map(client => (
                <Card 
                  key={client.id}
                  className={`cursor-pointer transition-all border-2 ${selectedClient?.id === client.id ? 'border-primary-500 bg-primary-50/30' : 'border-gray-100'}`}
                  onClick={() => setSelectedClient(client)}
                >
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900">{client.name}</h3>
                    <div className="flex items-center mt-2 gap-2">
                      <Badge variant="neutral" className="uppercase text-[9px]">{client.category}</Badge>
                      <span className="text-xs text-gray-400">{client.city || 'Cidade N/D'}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="pt-10 flex justify-end">
              <Button disabled={!selectedClient} onClick={() => setStep(2)} className="h-12 px-8">
                Próximo <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && selectedClient && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
             <h2 className="text-xl font-bold text-gray-800 mb-6">Escolha o Roteiro <span className="text-primary-600">({selectedClient.category.toUpperCase()})</span></h2>
             <div className="grid gap-4">
               {templates.filter(t => t.category === selectedClient.category).map(t => (
                 <Card 
                    key={t.id}
                    className={`cursor-pointer p-6 transition-all border-2 ${selectedTemplate?.id === t.id ? 'border-primary-500 bg-primary-50/30' : 'border-gray-100'}`}
                    onClick={() => setSelectedTemplate(t)}
                  >
                    <div className="flex justify-between items-center">
                       <div>
                          <h3 className="font-bold text-gray-900 text-lg">{t.name}</h3>
                          <p className="text-sm text-gray-400 mt-1">Roteiro completo para {selectedClient.category}</p>
                       </div>
                       <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${selectedTemplate?.id === t.id ? 'border-primary-500' : 'border-gray-200'}`}>
                          {selectedTemplate?.id === t.id && <div className="h-3 w-3 rounded-full bg-primary-500" />}
                       </div>
                    </div>
                 </Card>
               ))}
             </div>
             <div className="pt-10 flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)} className="h-12">Voltar</Button>
                <Button disabled={!selectedTemplate} onClick={() => setStep(3)} className="h-12 px-8">
                  Configurar Visita <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
             </div>
          </div>
        )}

        {step === 3 && selectedClient && selectedTemplate && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8 space-y-8">
              <div>
                 <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Responsável no Local</label>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <input placeholder="Nome do acompanhante" className="h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-primary-500 outline-none" value={accompanistName} onChange={(e) => setAccompanistName(e.target.value)} />
                    <input placeholder="Cargo/Função" className="h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-primary-500 outline-none" value={accompanistRole} onChange={(e) => setAccompanistRole(e.target.value)} />
                 </div>
              </div>

              {selectedClient.category === 'ilpi' && (
                <div className="space-y-4 pt-4 border-t border-gray-50">
                   <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Dados do ILPI</label>
                   <div className="grid grid-cols-2 gap-4">
                      <input type="number" placeholder="Capacidade" className="h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none" value={ilpiCapacity} onChange={(e) => setIlpiCapacity(e.target.value)} />
                      <input type="number" placeholder="Total Residentes" className="h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none" value={residentsTotal} onChange={(e) => setResidentsTotal(e.target.value)} />
                   </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-50 grid grid-cols-2 gap-10">
                 <div>
                    <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Data da Inspeção</label>
                    <input type="date" className="mt-2 block w-full text-lg font-bold text-primary-900 bg-transparent outline-none" value={inspectionDate} onChange={(e) => setInspectionDate(e.target.value)} />
                 </div>
                 <div className="text-right">
                    <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Estabelecimento</label>
                    <div className="mt-2 text-lg font-bold text-gray-900 truncate">{selectedClient.name}</div>
                 </div>
              </div>
            </div>

            <div className="pt-10 flex flex-col sm:flex-row justify-between gap-4">
              <Button variant="outline" onClick={() => setStep(2)} className="h-14 px-8">Voltar</Button>
              <Button 
                onClick={handleStart} 
                className="h-14 px-12 bg-primary-600 hover:bg-primary-700 text-lg font-bold shadow-2xl shadow-primary-200"
                disabled={isStarting}
              >
                {isStarting ? <Loader2 className="animate-spin" /> : 'INICIAR AGORA'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
