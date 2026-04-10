import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileCheck2, Loader2, PlusCircle, Info, Users2, WifiOff } from 'lucide-react';
import { db } from '../db/database';
import { getTemplateById, enrichTemplate } from '../data/templates';
import { FOOD_SEGMENT_LABELS, type FoodEstablishmentType } from '../types';
import { ILPIStaffCalculator } from '../components/inspection/ILPIStaffCalculator';
import { useInspectionStore } from '../store/useInspectionStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { generateId, formatDateTime } from '../utils/imageUtils';
import type { InspectionResponse, InspectionPhoto } from '../types';

import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SectionAccordion } from '../components/inspection/SectionAccordion';
import { ChecklistItem } from '../components/inspection/ChecklistItem';
import { ScorePanel } from '../components/inspection/ScorePanel';
import { SignaturePad } from '../components/ui/SignaturePad';
import { X } from 'lucide-react';

export function InspectionExecution() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentInspection, responses, setCurrentInspection, setResponses, updateResponse } = useInspectionStore();
  
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

  // Load inspection on mount
  useEffect(() => {
    const { inspectionId, previousInspectionId } = location.state || {};
    
    // Background sync to catch changes from other consultants (Ana/Ester)
    import('../services/syncService').then(m => m.syncData().catch(console.error));

    if (!inspectionId && !currentInspection) {
      navigate('/inspections');
      return;
    }

    const loadData = async () => {
      try {
        const id = inspectionId || currentInspection?.id;
        const insp = await db.inspections.get(id);
        
        if (!insp || insp.deletedAt) {
          alert('Esta inspeção não existe ou foi excluída.');
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

        // 🚀 Mapeamento de reparo de IDs legado para evitar perda de dados em rascunhos
        let resps = await db.responses
          .where('inspectionId').equals(id)
          .filter(r => !r.deletedAt)
          .toArray();

        // Se detectarmos IDs antigos (ilpi-) ou template ID antigo, migramos para o novo padrão (fed-)
        const isLegacy = insp.templateId === 'tpl-ilpi-v1' || resps.some(r => r.itemId.startsWith('ilpi-'));

        if (isLegacy) {
          console.log('Migrando rascunho legado para o novo padrão federal (fed-)...');
          
          const migratedResps = resps.map(r => {
            if (r.itemId.startsWith('ilpi-')) {
              return { ...r, itemId: r.itemId.replace('ilpi-', 'fed-') };
            }
            // Também migrar referências a seções em itens extras
            if (r.itemId.startsWith('extra|sec-ilpi-')) {
              return { ...r, itemId: r.itemId.replace('sec-ilpi-', 'sec-fed-') };
            }
            return r;
          });

          // Atualizar no banco para persistir a migração
          for (const r of migratedResps) {
            await db.responses.update(r.id, { itemId: r.itemId });
          }

          // Atualizar o ID do template na inspeção
          if (insp.templateId !== 'tpl-ilpi-federal-v1') {
            await db.inspections.update(insp.id, { templateId: 'tpl-ilpi-federal-v1' });
            insp.templateId = 'tpl-ilpi-federal-v1';
          }

          resps = migratedResps;
        }
        
        // Load photos for each response
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
        alert('Erro ao carregar inspeção');
        navigate('/inspections');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [location.state?.inspectionId]);

  // Derived state
  const template = useMemo(() => {
    if (!currentInspection) return null;
    const tpl = getTemplateById(currentInspection.templateId);
    if (!tpl) return null;
    
    // Convert currentInspection partially to Client for enrichment if it has enough data
    // Or better, we know currentInspection has foodTypes and category cached.
    return enrichTemplate(tpl, currentInspection as any);
  }, [currentInspection]);

  // Filter sections based on client foodTypes if category is alimentos
  // and filter by consultantRole if category is ILPI
  const visibleSections = useMemo(() => {
    if (!template || !currentInspection) return [];
    
    // For Estética, normally show all
    let sections = template.sections;
    
    // 1. Filter by ILPI Consultant Role
    if (template.category === 'ilpi') {
      const role = useSettingsStore.getState().settings.consultantRole || 'ambos';
      const nutritionSections = ['sec-fed-05', 'sec-fed-06']; // Nutrição and Refeitório (Federal)
      
      if (role === 'nutricao') {
        sections = sections.filter(s => nutritionSections.includes(s.id));
      } else if (role === 'saude') {
        sections = sections.filter(s => !nutritionSections.includes(s.id));
      }
      // if 'ambos', keep all
    }

    // 2. Filter by Alimentos FoodType
    if (template.category === 'alimentos') {
       const clientTypes = currentInspection.foodTypes || [];
       sections = sections.filter(section => {
        // If section has no applicable types defined, it's global, always show
        if (!section.applicableFoodTypes || section.applicableFoodTypes.length === 0) return true;
        // If section has types defined, client must have at least one matching type
        return section.applicableFoodTypes.some(t => clientTypes.includes(t));
      });
    }

    return sections;
  }, [template, currentInspection]);

  // Auto-save debounced implementation
  useEffect(() => {
    if (loading || !currentInspection) return;
    
    const saveTimer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        // Save responses
        for (const r of responses) {
          const { photos, ...respData } = r; // separate photos
          await db.responses.put(respData as any);
          
          // Save photos
          for (const p of photos) {
            await db.photos.put({ ...p, responseId: r.id });
          }
        }
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (err) {
        console.error('Auto-save error', err);
      }
    }, 1500);

    return () => clearTimeout(saveTimer);
  }, [responses, currentInspection, loading]); // run effect when responses change


  const handleResponseChange = (itemId: string, result: InspectionResponse['result']) => {
    if (!currentInspection) return;
    
    try {
      const existing = responses.find(r => r.itemId === itemId);
      if (existing) {
        // If switching away from NOT_COMPLIANT, optionally clear details? 
        // User requested keeping data if accident, so we don't clear text fields automatically.
        updateResponse(existing.id, { result });
      } else {
        // Create new response
        const newResponse: InspectionResponse = {
          id: generateId(),
          inspectionId: currentInspection.id,
          itemId,
          result,
          photos: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setResponses([...responses, newResponse]);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar resposta: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleAddExtraItem = (sectionId: string) => {
    if (!currentInspection) return;
    const desc = window.prompt('Descreva a nova observação/não conformidade:');
    if (!desc) return;

    const newResponse: InspectionResponse = {
      id: generateId(),
      inspectionId: currentInspection.id,
      itemId: `extra|${sectionId}|${generateId()}`,
      result: 'not_complies',
      customDescription: desc,
      photos: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setResponses([...responses, newResponse]);
  };

  const handleUpdateDetails = (responseId: string, updates: Partial<InspectionResponse>) => {
    updateResponse(responseId, updates);
  };

  const handleAddPhoto = (responseId: string, photo: Omit<InspectionPhoto, 'id'>) => {
    try {
      const existing = responses.find(r => r.id === responseId);
      if (existing) {
        updateResponse(responseId, { 
          photos: [...existing.photos, { ...photo, id: generateId() }] 
        });
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao adicionar foto: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleRemovePhoto = async (responseId: string, photoId: string) => {
    const existing = responses.find(r => r.id === responseId);
    if (existing) {
      updateResponse(responseId, {
        photos: existing.photos.filter(p => p.id !== photoId)
      });
      await db.photos.delete(photoId); // delete from db immediately to free space
    }
  };

  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);

  const finishInspection = async () => {
    if (!currentInspection || !template) return;
    
    const invalidResponses = responses.filter(r => 
      r.result === 'not_complies' && (!r.situationDescription || !r.correctiveAction)
    );

    if (invalidResponses.length > 0) {
      const firstInvalid = invalidResponses[0];
      const sectionContaining = visibleSections.find(s => s.items.some(i => i.id === firstInvalid.itemId));
      
      if (sectionContaining) {
        setExpandedSectionIds(prev => Array.from(new Set([...prev, sectionContaining.id])));
        
        setTimeout(() => {
          const el = document.getElementById(`item-${firstInvalid.itemId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-2', 'ring-red-500', 'ring-offset-2', 'transition-shadow');
            setTimeout(() => {
              el.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2');
            }, 3000);
          }
        }, 300);
      }

      alert(`Você tem ${invalidResponses.length} item(ns) NÃO CONFORME(S) sem detalhamento ou ação corretiva preenchida. Rolando para o primeiro pendente.`);
      return;
    }

    // open signature modal
    setShowSignatureModal(true);
  };

  const handleConfirmFinish = async () => {
    if (!currentInspection || !signature) return;

    if (window.confirm('Confirmar o encerramento da inspeção? Você poderá reabri-la posteriormente caso precise alterar algo.')) {
      await db.inspections.update(currentInspection.id, {
        status: 'completed',
        completedAt: new Date(),
        signatureDataUrl: signature
      });
      navigate('/summary', { state: { inspectionId: currentInspection.id } });
    }
  };

  if (loading || !currentInspection || !template) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <p className="text-gray-500">Carregando roteiro de inspeção...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50 pb-safe pb-16 lg:pb-0">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <Button variant="ghost" size="icon" onClick={() => navigate('/inspections')}>
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <div>
              <h1 className="text-sm font-bold leading-tight text-gray-900 sm:text-lg overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px] sm:max-w-md">
                {currentInspection.clientName}
              </h1>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span className="uppercase text-primary-600 font-semibold">{currentInspection.clientCategory}</span>
                <span>•</span>
                {!isOnline && <span className="flex items-center text-amber-600 font-bold"><WifiOff className="mr-1 h-3 w-3" /> OFFLINE</span>}
                {isOnline && saveStatus === 'saving' && <span className="flex items-center text-primary-600"><Loader2 className="mr-1 h-3 w-3 animate-spin" /> Salvando...</span>}
                {isOnline && saveStatus === 'saved' && <span className="flex items-center text-green-600"><Save className="mr-1 h-3 w-3" /> Salvo</span>}
                {isOnline && saveStatus === 'idle' && <span>{formatDateTime(new Date())}</span>}
              </div>
            </div>
          </div>
          <Button 
            onClick={finishInspection}
            className="shadow-sm"
            disabled={!isOnline}
            variant={isOnline ? 'default' : 'outline'}
          >
            <FileCheck2 className="mr-2 h-4 w-4 hidden sm:block" />
            {isOnline ? 'Finalizar' : 'Offline'}
          </Button>
        </div>
      </header>

      {/* Main Content area with sidebar layout on desktop */}
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-8">
        
        {/* Dynamic Items (Accordion List) */}
        <div className="lg:col-span-8 space-y-6">
          {visibleSections.map((section, idx) => {
            const sectionResponses = section.items.map(i => responses.find(r => r.itemId === i.id)).filter(Boolean) as InspectionResponse[];
            const compliesCount = sectionResponses.filter(r => r.result === 'complies').length;
            const notCompliesCount = sectionResponses.filter(r => r.result === 'not_complies').length;
            
            return (
              <SectionAccordion
                key={section.id}
                title={
                  <div className="flex items-center gap-2">
                    <span>{idx + 1}. {section.title}</span>
                    {section.isExtraSection && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] py-0 uppercase">
                        Específico: {section.segmentKey ? (FOOD_SEGMENT_LABELS[section.segmentKey as FoodEstablishmentType] || section.segmentKey) : ''}
                      </Badge>
                    )}
                  </div>
                }
                totalItems={section.items.length}
                evaluatedItems={sectionResponses.length}
                compliesCount={compliesCount}
                notCompliesCount={notCompliesCount}
                defaultExpanded={idx === 0 || expandedSectionIds.includes(section.id)}
              >
                <div className="space-y-4">
                  {section.id === 'sec-fed-12' && (
                    <div className="space-y-4 mb-6">
                      <div className="bg-white border rounded-lg p-4 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-gray-700">Dados de Residentes (ILPI)</h4>
                          <span className="text-[10px] text-gray-400">Clique nos campos para editar</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase text-gray-400">Grau I</label>
                            <input 
                              type="number" 
                              value={currentInspection.dependencyLevel1 || 0}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                db.inspections.update(currentInspection.id, { dependencyLevel1: val });
                                setCurrentInspection({...currentInspection, dependencyLevel1: val});
                              }}
                              className="w-full border rounded p-1 text-sm font-bold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase text-gray-400">Grau II</label>
                            <input 
                              type="number" 
                              value={currentInspection.dependencyLevel2 || 0}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                db.inspections.update(currentInspection.id, { dependencyLevel2: val });
                                setCurrentInspection({...currentInspection, dependencyLevel2: val});
                              }}
                              className="w-full border rounded p-1 text-sm font-bold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase text-gray-400">Grau III</label>
                            <input 
                              type="number" 
                              value={currentInspection.dependencyLevel3 || 0}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                db.inspections.update(currentInspection.id, { dependencyLevel3: val });
                                setCurrentInspection({...currentInspection, dependencyLevel3: val});
                              }}
                              className="w-full border rounded p-1 text-sm font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      <ILPIStaffCalculator 
                        level1={currentInspection.dependencyLevel1 || 0}
                        level2={currentInspection.dependencyLevel2 || 0}
                        level3={currentInspection.dependencyLevel3 || 0}
                        currentStaff={
                          currentInspection.observedStaff || 0
                        }
                      />
                      
                      <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-md border border-slate-200">
                        <Users2 className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">Cuidadores/Técnicos em Turno:</span>
                        <input 
                          type="number" 
                          placeholder="Qtd atual..."
                          value={currentInspection.observedStaff || ''}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            db.inspections.update(currentInspection.id, { observedStaff: val });
                            setCurrentInspection({...currentInspection, observedStaff: val});
                          }}
                          className="w-20 border rounded px-2 py-1 text-sm font-bold ml-auto"
                        />
                      </div>
                    </div>
                  )}

                  {section.items.map((item) => {
                    const response = responses.find((r) => r.itemId === item.id);
                    return (
                      <ChecklistItem
                        key={item.id}
                        item={item}
                        response={response}
                        wasNonCompliant={prevNCIds.includes(item.id)}
                        onChange={(res) => handleResponseChange(item.id, res)}
                        onUpdateDetails={(updates) => response && handleUpdateDetails(response.id, updates)}
                        onAddPhoto={(photo) => response && handleAddPhoto(response.id, photo)}
                        onRemovePhoto={(photoId) => response && handleRemovePhoto(response.id, photoId)}
                      />
                    );
                  })}

                  {/* Render Extra Items for this section */}
                  {responses.filter(r => r.itemId.startsWith('extra|') && r.itemId.split('|')[1] === section.id).map(r => (
                    <ChecklistItem
                      key={r.id}
                      item={{ 
                        id: r.itemId, 
                        sectionId: section.id, 
                        order: 99, 
                        description: r.customDescription || 'Item Extra', 
                        weight: 1, 
                        isCritical: false 
                      }}
                      response={r}
                      onChange={(res) => handleResponseChange(r.itemId, res)}
                      onUpdateDetails={(updates) => handleUpdateDetails(r.id, updates)}
                      onAddPhoto={(photo) => handleAddPhoto(r.id, photo)}
                      onRemovePhoto={(photoId) => handleRemovePhoto(r.id, photoId)}
                    />
                  ))}

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4 border-dashed border-primary-300 text-primary-600 bg-primary-50/30"
                    onClick={() => handleAddExtraItem(section.id)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Item Extra / Observação nesta seção
                  </Button>
                </div>
              </SectionAccordion>
            );
          })}
        </div>

        {/* Sidebar Score (Desktop) / Bottom Score (Mobile - Optional) */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky top-24">
            <ScorePanel />
          </div>
        </div>
      </div>
      {/* Signature Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-primary-600 px-6 py-4 flex items-center justify-between text-white">
              <h3 className="font-bold text-lg">Assinatura do Acompanhante</h3>
              <button onClick={() => setShowSignatureModal(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="text-sm text-gray-500 bg-blue-50 p-4 rounded-lg border border-blue-100 italic">
                Estabelecimento: <span className="font-bold text-blue-900">{currentInspection.clientName}</span><br/>
                Acompanhante: <span className="font-bold text-blue-900">{currentInspection.accompanistName || 'Não identificado'}</span>
              </div>
              
              <SignaturePad 
                onSave={(dataUrl) => setSignature(dataUrl)}
                onClear={() => setSignature(null)}
              />

              <div className="flex gap-4 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowSignatureModal(false)}>
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 bg-primary-600 hover:bg-primary-700 h-11" 
                  disabled={!signature}
                  onClick={handleConfirmFinish}
                >
                  Finalizar Tudo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
