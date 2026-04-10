import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileDown, ArrowLeft, Loader2, Share2, Save, Info, Users2 } from 'lucide-react';
import { db } from '../db/database';
import { supabase } from '../lib/supabase';
import { getTemplateById, enrichTemplate } from '../data/templates';
import { calculateScore, classificationLabel, classificationColor } from '../utils/scoring';
import { generatePDF } from '../utils/pdfGenerator';
import { useSettingsStore } from '../store/useSettingsStore';
import type { Inspection, InspectionResponse, ChecklistTemplate } from '../types';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { type FoodEstablishmentType, FOOD_SEGMENT_LABELS } from '../types';
import { formatDateTime } from '../utils/imageUtils';

export function InspectionSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const settings = useSettingsStore((s) => s.settings);

  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [currentInspection, setInspection] = useState<Inspection | null>(null);
  const [responses, setResponses] = useState<InspectionResponse[]>([]);
  const [template, setTemplate] = useState<ChecklistTemplate | null>(null);
  const [allClients, setAllClients] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [savingMeta, setSavingMeta] = useState(false);

  useEffect(() => {
    const inspectionId = location.state?.inspectionId;
    if (!inspectionId) {
      navigate('/inspections');
      return;
    }

    const loadData = async () => {
      try {
        const insp = await db.inspections.get(inspectionId);
        if (!insp) throw new Error('Inspection not found');
        
        const client = await db.clients.get(insp.clientId);
        if (client) {
          insp.clientName = client.name;
          insp.clientCategory = client.category;
          insp.city = client.city;
          insp.state = client.state;
        }

        const clients = await db.clients.toArray();
        setAllClients(clients);

        const localResps = await db.responses.where('inspectionId').equals(inspectionId).toArray();
        for (const r of localResps) {
          r.photos = await db.photos.where('responseId').equals(r.id).toArray();
        }

        // --- UNIFIED REPORT: Fetch remote responses to merge ---
        const { data: remoteResps } = await supabase
          .from('responses')
          .select('*')
          .eq('inspection_id', inspectionId);

        if (remoteResps && remoteResps.length > 0) {
          for (const rr of remoteResps) {
            const existsLocally = localResps.find(lr => lr.id === rr.id);
            if (!existsLocally) {
              localResps.push({
                id: rr.id,
                inspectionId: rr.inspection_id,
                itemId: rr.item_id,
                result: rr.result as any,
                situationDescription: rr.situation_description,
                correctiveAction: rr.corrective_action,
                createdAt: new Date(rr.created_at),
                updatedAt: new Date(rr.updated_at),
                photos: [], // Photos would need another pull if critical, but summary usually text + specific photos
                synced: 1
              });
            }
          }
        }

        const tpl = getTemplateById(insp.templateId);

        setInspection(insp);
        setResponses(localResps);
        setTemplate(tpl ? enrichTemplate(tpl, client || (insp as any)) : null);
      } catch (err) {
        console.error(err);
        navigate('/inspections');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [location.state?.inspectionId]);

  const scoreArea = useMemo(() => {
    if (!currentInspection || !template) return null;
    return calculateScore(responses, template.sections);
  }, [currentInspection, responses, template]);

  const handleSaveMetadata = async () => {
    if (!currentInspection) return;
    setSavingMeta(true);
    try {
      const { id, clientName, clientCategory, city, state, ...updates } = currentInspection;
      const selectedClient = allClients.find(c => c.id === currentInspection.clientId);
      if (selectedClient) {
        (updates as any).clientName = selectedClient.name;
        (updates as any).clientCategory = selectedClient.category;
      }
      
      await db.inspections.update(id, updates);
      setIsEditing(false);
    } catch (err) {
      alert('Erro ao salvar: ' + err);
    } finally {
      setSavingMeta(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!currentInspection || !template || !scoreArea) return;
    setIsGenerating(true);
    try {
       // Allow React state update to show spinner
       await new Promise(resolve => setTimeout(resolve, 100));
       await generatePDF(currentInspection, responses, template, scoreArea, settings as any);
    } catch (err) {
       console.error('PDF Error:', err);
      alert('Erro ao gerar PDF. Verifique os dados e tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading || !currentInspection || !template || !scoreArea) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const scoreColor = classificationColor(scoreArea.classification);

  return (
    <div className="flex h-screen flex-col bg-gray-50 pb-safe pb-16 lg:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/inspections')}>
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)} 
              className={isEditing ? 'bg-primary-50 border-primary-200' : ''}
            >
              {isEditing ? 'Cancelar' : 'Editar Info'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/execute', { state: { inspectionId: currentInspection.id }})} 
              className="text-primary-600 border-primary-200 hover:bg-primary-50"
            >
              Editar Respostas
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleGeneratePDF} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4 hidden sm:block" />}
              PDF
            </Button>
          </div>
        </div>
      </header>
      
      <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto flex-1">
        {isEditing && (
          <Card className="mb-6 border-primary-100 bg-primary-50/30 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary-900 uppercase tracking-wider">
                <Info className="h-4 w-4" />
                Editar Dados da Inspeção
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Cliente</label>
                  <select 
                    value={currentInspection.clientId}
                    onChange={(e) => setInspection({...currentInspection, clientId: e.target.value})}
                    className="w-full border-gray-300 rounded-lg text-sm shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  >
                    {allClients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Acompanhante</label>
                  <input 
                    type="text" 
                    value={currentInspection.accompanistName || ''}
                    onChange={(e) => setInspection({...currentInspection, accompanistName: e.target.value})}
                    className="w-full border-gray-300 rounded-lg text-sm shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Nome do acompanhante..."
                  />
                </div>
              </div>

              {currentInspection.clientCategory === 'ilpi' && (
                <div className="pt-4 border-t border-primary-100 space-y-3">
                  <p className="text-[10px] font-bold text-primary-700 uppercase">Residentes por Grau de Dependência</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-semibold uppercase">Grau I</label>
                      <input 
                        type="number" 
                        value={currentInspection.dependencyLevel1 || 0}
                        onChange={(e) => setInspection({...currentInspection, dependencyLevel1: parseInt(e.target.value) || 0})}
                        className="w-full border-gray-300 rounded-lg text-sm shadow-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-semibold uppercase">Grau II</label>
                      <input 
                        type="number" 
                        value={currentInspection.dependencyLevel2 || 0}
                        onChange={(e) => setInspection({...currentInspection, dependencyLevel2: parseInt(e.target.value) || 0})}
                        className="w-full border-gray-300 rounded-lg text-sm shadow-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-semibold uppercase">Grau III</label>
                      <input 
                        type="number" 
                        value={currentInspection.dependencyLevel3 || 0}
                        onChange={(e) => setInspection({...currentInspection, dependencyLevel3: parseInt(e.target.value) || 0})}
                        className="w-full border-gray-300 rounded-lg text-sm shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button onClick={handleSaveMetadata} disabled={savingMeta} className="w-full shadow-lg h-10">
                {savingMeta ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                {savingMeta ? 'Processando...' : 'Salvar Alterações'}
              </Button>
            </CardContent>
          </Card>
        )}
        <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 mt-6">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{currentInspection.clientName}</h1>
          <p className="mt-2 text-gray-500 font-medium">{template.name}</p>
          <p className="text-sm text-gray-400 mt-1">Concluída em {formatDateTime(currentInspection.completedAt || new Date())}</p>
          
          <div className="mt-8 flex flex-col items-center justify-center space-y-2">
              <div 
                className="text-6xl sm:text-7xl font-black tracking-tighter"
                style={{ color: scoreColor }}
              >
                {Math.round(scoreArea.scorePercentage)}<span className="text-4xl text-gray-400 font-bold ml-1">%</span>
              </div>
              <div 
                className="px-4 py-1.5 rounded-full text-sm font-bold tracking-widest text-white uppercase mt-4"
                style={{ backgroundColor: scoreColor }}
              >
                {classificationLabel(scoreArea.classification)}
              </div>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto border-t border-gray-100 pt-8">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-gray-900">{scoreArea.evaluatedItems}</span>
                <span className="text-xs font-semibold text-gray-500 uppercase mt-1">Itens Avaliados</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-green-600">{scoreArea.compliesCount}</span>
                <span className="text-xs font-semibold text-green-800 uppercase mt-1">Conformes</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-red-600">{scoreArea.notCompliesCount}</span>
                <span className="text-xs font-semibold text-red-800 uppercase mt-1">Nãos Conf.</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-slate-500">{scoreArea.notObservedCount}</span>
                <span className="text-xs font-semibold text-slate-500 uppercase mt-1">N. Obs (NO)</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-gray-400">{scoreArea.notApplicableCount}</span>
                <span className="text-xs font-semibold text-gray-500 uppercase mt-1">N/A</span>
              </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo por Seção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scoreArea.scoreBySection.map((s) => {
                const sectionDef = template.sections.find(sec => sec.id === s.sectionId);
                return (
                  <div key={s.sectionId} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 text-sm">{s.sectionTitle}</h4>
                          {sectionDef?.isExtraSection && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[9px] py-0 uppercase">
                              Específico: {sectionDef.segmentKey ? (FOOD_SEGMENT_LABELS[sectionDef.segmentKey as FoodEstablishmentType] || sectionDef.segmentKey) : ''}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex gap-3">
                          <span>{Math.round(s.scorePercentage)}% Conforme</span>
                          <span className="text-red-500">{s.notCompliesCount} Irreg.</span>
                          {s.notObservedCount > 0 && <span className="text-slate-500">{s.notObservedCount} Não Obs.</span>}
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0 w-full sm:w-48 h-2 bg-gray-200 rounded-full overflow-hidden flex">
                        <div style={{ width: `${s.totalItems > 0 ? (s.compliesCount/s.totalItems)*100 : 0}%` }} className="bg-green-500 h-full" />
                        <div style={{ width: `${s.totalItems > 0 ? (s.notCompliesCount/s.totalItems)*100 : 0}%` }} className="bg-red-500 h-full" />
                        <div style={{ width: `${s.totalItems > 0 ? (s.notObservedCount/s.totalItems)*100 : 0}%` }} className="bg-slate-400 h-full" />
                        <div style={{ width: `${s.totalItems > 0 ? (s.notApplicableCount/s.totalItems)*100 : 0}%` }} className="bg-gray-300 h-full" />
                      </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="pb-10"></div>
    </div>
  );
}
