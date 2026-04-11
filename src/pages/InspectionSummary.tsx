import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileDown, ArrowLeft, Loader2, Save, Info, Users2 } from 'lucide-react';
import { db } from '../db/database';
import { supabase } from '../lib/supabase';
import { getTemplateById, enrichTemplate } from '../data/templates';
import { calculateScore, classificationColor, classificationLabel } from '../utils/scoring';
import { generatePDF } from '../utils/pdfGenerator';
import { useSettingsStore } from '../store/useSettingsStore';
import type { Inspection, InspectionResponse, ChecklistTemplate } from '../types';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { formatDateTime } from '../utils/imageUtils';
import { ScorePanel } from '../components/inspection/ScorePanel';

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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-6">
          <div className="p-8 sm:p-12 text-center border-b border-gray-100 pb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{currentInspection.clientName || 'Inspeção'}</h1>
            <p className="mt-2 text-gray-500 font-medium">{template.name}</p>
            <p className="text-sm text-gray-400 mt-1">Concluída em {formatDateTime(currentInspection.completedAt || new Date())}</p>
          </div>
          
          <div className="p-6 sm:p-8 bg-gray-50">
            <ScorePanel inspection={currentInspection} responses={responses} />
          </div>
        </div>
      </div>
      
      <div className="pb-10"></div>
    </div>
  );
}
