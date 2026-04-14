import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileCheck2, Loader2, PlusCircle, Info, Users2, WifiOff, X } from 'lucide-react';
import { db } from '../db/database';
import { supabase } from '../lib/supabase';
import { getTemplateById, getEffectiveTemplate } from '../data/templates';
import { FOOD_SEGMENT_LABELS, type FoodEstablishmentType, type InspectionResponse, type InspectionPhoto } from '../types';
import { ILPIStaffCalculator } from '../components/inspection/ILPIStaffCalculator';
import { useInspectionStore } from '../store/useInspectionStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { generateId, formatDateTime } from '../utils/imageUtils';
import { CollaborativeProgress } from '../components/inspection/CollaborativeProgress';

import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SectionAccordion } from '../components/inspection/SectionAccordion';
import { ChecklistItem } from '../components/inspection/ChecklistItem';
import { ScorePanel } from '../components/inspection/ScorePanel';
import { SignaturePad } from '../components/ui/SignaturePad';

export function InspectionExecution() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentInspection, responses, setCurrentInspection, setResponses, updateResponse, addResponse, mergeResponses } = useInspectionStore();
  
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [prevNCIds, setPrevNCIds] = useState<string[]>([]);
  const [expandedSectionIds, setExpandedSectionIds] = useState<string[]>([]);
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
    const { inspectionId, previousInspectionId } = location.state || {};
    
    if (!inspectionId && !currentInspection) {
      navigate('/inspections');
      return;
    }

    const loadData = async () => {
      try {
        const id = inspectionId || currentInspection?.id;
        const insp = await db.inspections.get(id);
        
        if (!insp || insp.deletedAt) {
          alert('Inspeção não encontrada.');
          navigate('/inspections');
          return;
        }
        
        const client = await db.clients.get(insp.clientId);
        if (client) {
          insp.clientName = client.name;
          insp.clientCategory = client.category;
          insp.foodTypes = client.foodTypes;
          insp.city = client.city;
          insp.state = client.state;
        }

        let resps = await db.responses
          .where('inspectionId').equals(id)
          .filter(r => !r.deletedAt)
          .toArray();
        
        for (const r of resps) {
          r.photos = await db.photos
            .where('responseId').equals(r.id)
            .filter(p => !p.deletedAt)
            .toArray();
        }

        setCurrentInspection(insp);
        setResponses(resps);

        if (previousInspectionId) {
          const prevResps = await db.responses.where('inspectionId').equals(previousInspectionId).toArray();
          setPrevNCIds(prevResps.filter(r => r.result === 'not_complies').map(r => r.itemId));
        }
      } catch (err) {
        console.error(err);
        navigate('/inspections');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [location.state?.inspectionId]);

  const template = useMemo(() => {
    if (!currentInspection) return null;
    const base = getTemplateById(currentInspection.templateId);
    if (!base) {
      console.warn('Template not found:', currentInspection.templateId);
      return null;
    }
    return base;
  }, [currentInspection]);

  const visibleSections = useMemo(() => {
    if (!template || !currentInspection) return [];
    const role = useSettingsStore.getState().settings.consultantRole || 'saude';
    
    const clientContext = {
      ...currentInspection,
      category: (currentInspection as any).clientCategory || (currentInspection as any).category
    };
    
    try {
      return getEffectiveTemplate(template, clientContext as any, role, false).sections;
    } catch (err) {
      console.error('Error generating effective template:', err);
      return template.sections;
    }
  }, [template, currentInspection]);

  useEffect(() => {
    if (!currentInspection || loading) return;

    const pullInterval = setInterval(async () => {
      if (!navigator.onLine) return;
      
      try {
        const { data: remoteResps, error } = await supabase
          .from('responses')
          .select('*')
          .eq('inspection_id', currentInspection.id)
          .is('deleted_at', null);

        if (error) throw error;
        if (!remoteResps) return;

        const mappedRemote: InspectionResponse[] = remoteResps.map(rr => ({
          id: rr.id,
          inspectionId: rr.inspection_id,
          itemId: rr.item_id,
          result: rr.result,
          situationDescription: rr.situation_description,
          correctiveAction: rr.corrective_action,
          responsible: rr.responsible,
          deadline: rr.deadline,
          customDescription: rr.custom_description,
          createdAt: new Date(rr.created_at),
          updatedAt: new Date(rr.updated_at || rr.created_at),
          synced: 1,
          photos: []
        }));

        mergeResponses(mappedRemote);
        
        for (const m of mappedRemote) {
          const local = await db.responses.get(m.id);
          if (local && local.synced === 0) continue;

          await db.responses.put({
            ...m,
            photos: local?.photos || [] 
          });
        }
      } catch (err) {
        console.warn('[Sync] Background pull failed:', err);
      }
    }, 15000);

    return () => clearInterval(pullInterval);
  }, [currentInspection?.id, responses.length, loading]);

  useEffect(() => {
    if (loading || !currentInspection) return;
    
    const saveTimer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await db.onlineUpsert('inspections', currentInspection, db.inspections);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (err) {
        console.error('Auto-save error', err);
      }
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [currentInspection, loading]);


  const handleResponseChange = (itemId: string, result: InspectionResponse['result']) => {
    if (!currentInspection) return;
    const existing = responses.find(r => r.itemId === itemId);
    if (existing) {
      updateResponse(existing.id, { result, updatedAt: new Date() });
    } else {
      const newResp: InspectionResponse = {
        id: generateId(),
        inspectionId: currentInspection.id,
        itemId,
        result,
        photos: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      addResponse(newResp);
    }
  };

  const handleAddExtraItem = async (sectionId: string) => {
    if (!currentInspection) return;
    const desc = window.prompt('Descrição do item extra:');
    if (!desc) return;

    const newResp: InspectionResponse = {
      id: generateId(),
      inspectionId: currentInspection.id,
      itemId: `extra|${sectionId}|${generateId()}`,
      result: 'not_observed',
      customDescription: desc,
      photos: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      synced: 0
    };
    await addResponse(newResp);
  };

  const updateStaffData = (field: string, value: number) => {
    if (!currentInspection) return;
    const updated = { ...currentInspection, [field]: value };
    setCurrentInspection(updated);
  };

  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);

  const handleConfirmFinish = async () => {
    if (!currentInspection || !signature) return;

    if (window.confirm('Encerrar Inspeção?')) {
      const finalData = {
        ...currentInspection,
        status: 'completed' as const,
        completedAt: new Date(),
        signatureDataUrl: signature
      };

      await db.onlineUpsert('inspections', finalData, db.inspections);
      navigate('/summary', { state: { inspectionId: currentInspection.id } });
    }
  };

  if (loading || !currentInspection || !template) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary-600" /></div>;
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50 pb-safe pb-16 lg:pb-0">
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 backdrop-blur-md px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/inspections')} className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 truncate max-w-[200px]">{currentInspection.clientName}</h1>
              <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider">
                {!isOnline && <span className="text-amber-600 flex items-center bg-amber-50 px-2 py-0.5 rounded-md"><WifiOff className="mr-1 h-3 w-3" /> Offline</span>}
                {saveStatus === 'saving' && <span className="text-primary-600 animate-pulse">Sincronizando...</span>}
                {saveStatus === 'saved' && <span className="text-green-600">Dados Protegidos na Nuvem</span>}
              </div>
            </div>
          </div>
          <Button onClick={() => setShowSignatureModal(true)} disabled={!isOnline} className="shadow-lg shadow-primary-100">
            Finalizar Visita
          </Button>
        </div>
      </header>

      {currentInspection.templateId === 'tpl-ilpi-federal-v1' && <CollaborativeProgress />}

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:grid lg:grid-cols-12 lg:gap-8 overflow-y-auto">
        <div className="lg:col-span-8 space-y-6">
          {visibleSections.map((section, idx) => {
             const sectionResponses = section.items.map(i => responses.find(r => r.itemId === i.id)).filter(Boolean) as InspectionResponse[];
             return (
               <SectionAccordion
                 key={section.id}
                 title={`${idx + 1}. ${section.title}`}
                 totalItems={section.items.length}
                 evaluatedItems={sectionResponses.length}
                 compliesCount={sectionResponses.filter(r => r.result === 'complies').length}
                 notCompliesCount={sectionResponses.filter(r => r.result === 'not_complies').length}
                 defaultExpanded={idx === 0 || expandedSectionIds.includes(section.id)}
               >
                 <div className="space-y-4">
                    {section.id === 'sec-fed-12' && (
                      <div className="space-y-4 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                         <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest text-slate-500">Dimensionamento ILPI</label>
                            {currentInspection.state === 'RJ' && (
                              <Badge variant="outline" className="text-[10px] border-blue-200 text-blue-600 bg-blue-50 font-bold">
                                Rio de Janeiro (Lei 8.049/18)
                              </Badge>
                            )}
                         </div>
                         <div className="grid grid-cols-3 gap-4">
                            {['Level1', 'Level2', 'Level3'].map((lvl, i) => (
                              <div key={lvl}>
                                <span className="text-[10px] text-slate-500 block mb-1 font-semibold uppercase tracking-tight">GRAU {i+1}</span>
                                <input 
                                  type="number" 
                                  className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold focus:ring-2 focus:ring-primary-500 outline-none shadow-sm"
                                  value={(currentInspection as any)[`dependencyLevel${i+1}`] || 0}
                                  onChange={(e) => updateStaffData(`dependencyLevel${i+1}`, parseInt(e.target.value) || 0)}
                                />
                              </div>
                            ))}
                         </div>
                         <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                            <div>
                               <span className="text-[10px] text-primary-600 font-bold block mb-1 uppercase tracking-tight">Equipe Cuidadores Atual</span>
                               <input 
                                 type="number" 
                                 placeholder="Qtd. Cuidadores..."
                                 className="w-full bg-white border border-primary-100 rounded-lg p-2 font-bold text-primary-900 shadow-sm"
                                 value={currentInspection.observedStaff || 0}
                                 onChange={(e) => updateStaffData('observedStaff', parseInt(e.target.value) || 0)}
                               />
                            </div>
                            <div>
                               <span className="text-[10px] text-primary-600 font-bold block mb-1 uppercase tracking-tight">Equipe Técnica Atual</span>
                               <input 
                                 type="number" 
                                 placeholder="Técnicos/Enf..."
                                 className="w-full bg-white border border-primary-100 rounded-lg p-2 font-bold text-primary-900 shadow-sm"
                                 value={currentInspection.observedNursingTechs || 0}
                                 onChange={(e) => updateStaffData('observedNursingTechs', parseInt(e.target.value) || 0)}
                               />
                            </div>
                         </div>
                         <ILPIStaffCalculator 
                           level1={currentInspection.dependencyLevel1 || 0}
                           level2={currentInspection.dependencyLevel2 || 0}
                           level3={currentInspection.dependencyLevel3 || 0}
                           currentCaregivers={currentInspection.observedStaff || 0}
                           currentNursingTechs={currentInspection.observedNursingTechs || 0}
                           isRJ={currentInspection.state === 'RJ'}
                         />
                      </div>
                    )}

                    {section.items.map((item) => {
                      const resp = responses.find(r => r.itemId === item.id);
                      return (
                        <ChecklistItem
                          key={item.id}
                          item={item}
                          response={resp}
                          wasNonCompliant={prevNCIds.includes(item.id)}
                          onChange={(res) => handleResponseChange(item.id, res)}
                          onUpdateDetails={(u) => resp && updateResponse(resp.id, u)}
                          onAddPhoto={(p) => resp && updateResponse(resp.id, { photos: [...resp.photos, { ...p, id: generateId() }] })}
                          onRemovePhoto={(pid) => resp && updateResponse(resp.id, { photos: resp.photos.filter(p => p.id !== pid) })}
                        />
                      );
                    })}

                    {responses
                      .filter(r => r.itemId?.startsWith(`extra|${section.id}|`))
                      .map((resp) => (
                        <ChecklistItem
                          key={resp.id}
                          item={{ 
                            id: resp.itemId, 
                            description: resp.customDescription || 'Item Extra',
                            sectionId: section.id,
                            weight: 1,
                            isCritical: false,
                            order: 999 
                          }}
                          response={resp}
                          onChange={(res) => updateResponse(resp.id, { result: res })}
                          onUpdateDetails={(u) => updateResponse(resp.id, u)}
                          onEditDescription={(d) => updateResponse(resp.id, { customDescription: d })}
                          onAddPhoto={(p) => updateResponse(resp.id, { photos: [...resp.photos, { ...p, id: generateId() }] })}
                          onRemovePhoto={(pid) => updateResponse(resp.id, { photos: resp.photos.filter(p => p.id !== pid) })}
                        />
                      ))}

                    <Button variant="ghost" className="w-full border-2 border-dashed border-gray-100 text-gray-400 hover:text-primary-600 hover:bg-white" onClick={() => handleAddExtraItem(section.id)}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Observação Extra
                    </Button>
                 </div>
               </SectionAccordion>
             )
          })}
        </div>

        <div className="hidden lg:block lg:col-span-4 sticky top-24 h-fit">
          <ScorePanel />
        </div>
      </div>

      {showSignatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95">
             <div className="bg-primary-600 p-6 text-white flex justify-between">
                <h3 className="font-bold text-lg">Assinatura de Encerramento</h3>
                <button onClick={() => setShowSignatureModal(false)}><X className="h-6 w-6" /></button>
             </div>
             <CardContent className="p-6 space-y-6">
                <div className="bg-primary-50 p-4 rounded-xl space-y-1">
                   <p className="text-xs text-primary-400 font-bold uppercase">Acompanhante</p>
                   <p className="text-primary-900 font-bold">{currentInspection.accompanistName || 'Não Informado'}</p>
                </div>
                <SignaturePad onSave={setSignature} onClear={() => setSignature(null)} />
                <Button className="w-full h-12 bg-primary-600 font-bold text-lg" disabled={!signature} onClick={handleConfirmFinish}>
                   CONFIRMAR E FINALIZAR
                </Button>
             </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
