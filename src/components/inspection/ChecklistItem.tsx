import React from 'react';
import { AlertTriangle, ExternalLink, LogIn, FileCheck2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { PhotoCapture } from './PhotoCapture';
import type { ChecklistItem as ItemType, InspectionResponse, InspectionPhoto } from '../../types';
import { generateId } from '../../utils/imageUtils';

interface ChecklistItemProps {
  item: ItemType;
  response?: InspectionResponse;
  wasNonCompliant?: boolean;
  onChange: (result: InspectionResponse['result']) => void;
  onUpdateDetails: (details: Partial<InspectionResponse>) => void;
  onAddPhoto: (photo: Omit<InspectionPhoto, 'id'>) => void;
  onRemovePhoto: (id: string) => void;
}

export function ChecklistItem({
  item,
  response,
  wasNonCompliant,
  onChange,
  onUpdateDetails,
  onAddPhoto,
  onRemovePhoto,
}: ChecklistItemProps) {
  const [showObs, setShowObs] = React.useState(!!response?.situationDescription || !!response?.correctiveAction || (response?.photos?.length ?? 0) > 0);
  
  const isSelected = !!response?.result;
  const isNotCompliant = response?.result === 'not_complies';
  const hasError = isNotCompliant && (!response?.situationDescription || !response?.correctiveAction);

  const getBorderColor = () => {
    if (!isSelected) return 'border-l-4 border-l-yellow-400 border-gray-200';
    if (response.result === 'complies') return 'border-l-4 border-l-green-500 border-green-200 bg-green-50/30';
    if (isNotCompliant) return 'border-l-4 border-l-red-500 border-red-200 bg-red-50/30';
    return 'border-l-4 border-l-gray-400 border-gray-200 bg-gray-50';
  };

  return (
    <div id={`item-${item.id}`} className={cn("rounded-xl border bg-white p-5 shadow-sm transition-all", getBorderColor())}>
      <div className="flex items-start justify-between">
        <div className="space-y-2 pr-4 flex-1">
          {/* Header row with badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral" className="font-mono">{`Item ${item.order}`}</Badge>
            {item.isCritical && (
              <Badge variant="danger" className="animate-pulse">
                <AlertTriangle className="mr-1 h-3 w-3" />
                CRÍTICO
              </Badge>
            )}
            {wasNonCompliant && (
              <Badge variant="warning" className="border-amber-200 bg-amber-50 text-amber-800">
                <AlertTriangle className="mr-1 h-3 w-3" />
                REINCIDÊNCIA
              </Badge>
            )}
            {item.legislation && (
              <span className="inline-flex items-center text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {item.legislation}
                {item.legislationUrl && (
                  <a href={item.legislationUrl} target="_blank" rel="noreferrer" className="ml-1 text-primary-600 hover:text-primary-800">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </span>
            )}
          </div>
          
          <p className="text-[15px] font-medium leading-relaxed text-gray-900 mt-2">
            {item.id.startsWith('extra|') ? (response?.customDescription || item.description) : item.description}
          </p>
        </div>

        {/* Observation Toggle Button */}
        {isSelected && (
          <button
            onClick={() => setShowObs(!showObs)}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-xl border transition-all shrink-0 ml-2",
              showObs 
                ? "bg-primary-600 border-primary-600 text-white shadow-lg" 
                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-primary-300 hover:text-primary-600"
            )}
          >
            <div className="relative">
              <LogIn className={cn("h-5 w-5 rotate-90", showObs ? "text-white" : "text-gray-400")} />
              {((response?.photos?.length ?? 0) > 0 || response?.situationDescription) && !showObs && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 rounded-full bg-primary-500 ring-2 ring-white"></span>
              )}
            </div>
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tight">Obs</span>
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onChange('complies')}
          className={cn(
            "flex h-[52px] items-center justify-center rounded-lg border-2 text-[13px] font-semibold transition-all active:scale-95",
            response?.result === 'complies'
              ? "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-500 ring-offset-1"
              : "border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50"
          )}
        >
          CUMPRE
        </button>
        <button
          onClick={() => onChange('not_complies')}
          className={cn(
            "flex h-[52px] items-center justify-center rounded-lg border-2 text-[13px] font-semibold transition-all active:scale-95",
            response?.result === 'not_complies'
              ? "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-500 ring-offset-1"
              : "border-gray-200 bg-white text-gray-700 hover:border-red-300 hover:bg-red-50"
          )}
        >
          NÃO CUMPRE
        </button>
        <button
          onClick={() => onChange('not_applicable')}
          className={cn(
            "flex h-[52px] items-center justify-center rounded-lg border-2 text-[13px] font-semibold transition-all active:scale-95",
            response?.result === 'not_applicable'
              ? "border-gray-500 bg-gray-100 text-gray-700 ring-2 ring-gray-400 ring-offset-1"
              : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-100"
          )}
        >
          N/A
        </button>
        <button
          onClick={() => onChange('not_observed')}
          className={cn(
            "flex h-[52px] items-center justify-center rounded-lg border-2 border-dashed font-semibold transition-all active:scale-95 text-[13px]",
            response?.result === 'not_observed'
              ? "border-slate-500 bg-slate-100 text-slate-700 ring-2 ring-slate-400 ring-offset-1"
              : "border-gray-300 bg-white text-gray-400 hover:border-slate-300 hover:bg-slate-50"
          )}
        >
          NO
        </button>
      </div>

      {/* Expanded Details Section (For any status if toggled) */}
      {showObs && isSelected && (
        <div className={cn(
          "mt-6 space-y-5 rounded-lg border p-5 shadow-inner animate-in slide-in-from-top-2 duration-200",
          isNotCompliant ? "border-red-100 bg-red-50/10" : "border-indigo-100 bg-indigo-50/10"
        )}>
          <div className={cn(
            "flex items-center space-x-2",
            isNotCompliant ? "text-red-700" : "text-indigo-700"
          )}>
            {isNotCompliant ? <AlertTriangle className="h-5 w-5" /> : <FileCheck2 className="h-5 w-5" />}
            <h4 className="font-semibold text-sm">
              {isNotCompliant ? 'Detalhes da Não Conformidade' : 'Observações de Alto Padrão / Melhoria'}
            </h4>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              {isNotCompliant ? 'Situação encontrada' : 'O que foi observado (Pontos de Excelência)'}
              {isNotCompliant && <span className="text-red-500"> *</span>}
            </label>
            <textarea
              className={cn(
                "w-full rounded-md border p-3 text-sm focus:outline-none focus:ring-2 disabled:opacity-50 min-h-[100px] resize-y shadow-sm",
                !response?.situationDescription && hasError 
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500 ring-1 ring-red-100" 
                  : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              )}
              placeholder={isNotCompliant ? "Descreva a falha observada..." : "Descreva pontos positivos ou o que pode ser elevado para alto padrão..."}
              value={response?.situationDescription || ''}
              onChange={(e) => onUpdateDetails({ situationDescription: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              {isNotCompliant ? 'Ação corretiva necessária' : 'Sugestões de melhoria profissional'}
              {isNotCompliant && <span className="text-red-500"> *</span>}
            </label>
            {isNotCompliant && (
              <div className="flex flex-wrap gap-1.5 pb-1">
                {['Providenciar', 'Substituir', 'Implementar', 'Abolir', 'Adequar'].map((verb) => (
                  <button
                    key={verb}
                    onClick={() => {
                      const current = (response?.correctiveAction || '').trim();
                      const prefix = current ? `${current} \n- ` : '- ';
                      onUpdateDetails({ correctiveAction: `${prefix}${verb} ` });
                    }}
                    className="text-[11px] font-medium bg-white hover:bg-primary-50 text-gray-600 hover:text-primary-700 border border-gray-200 hover:border-primary-200 rounded-full px-2 py-0.5 transition-colors shadow-sm"
                  >
                    {verb}
                  </button>
                ))}
              </div>
            )}
            <textarea
               className={cn(
                "w-full rounded-md border p-3 text-sm focus:outline-none focus:ring-2 disabled:opacity-50 min-h-[100px] resize-y shadow-sm",
                !response?.correctiveAction && hasError 
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500 ring-1 ring-red-100" 
                  : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              )}
              placeholder={isNotCompliant ? "O que precisa ser feito para adequação..." : "Dê sugestões para que o local atinja a nota máxima ou mantenha o brilho..."}
              value={response?.correctiveAction || ''}
              onChange={(e) => onUpdateDetails({ correctiveAction: e.target.value })}
            />
          </div>

          <datalist id="responsables-list">
            <option value="Responsável Técnico (RT)" />
            <option value="Gerência / Administração" />
            <option value="Equipe de Manutenção" />
            <option value="Equipe de Limpeza / Higiene" />
            <option value="Manipulador / Funcionário" />
            <option value="Proprietário" />
            <option value="Empresa Terceirizada" />
          </datalist>

          <datalist id="deadlines-list">
            <option value="Imediato" />
            <option value="24 horas" />
            <option value="7 dias" />
            <option value="15 dias" />
            <option value="30 dias" />
            <option value="45 dias" />
            <option value="60 dias" />
            <option value="90 dias" />
          </datalist>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Responsável{isNotCompliant ? ' p/ Correção' : ''}</label>
              <input
                type="text"
                list="responsables-list"
                className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                placeholder="Ex: Gerente, RT..."
                value={response?.responsible || ''}
                onChange={(e) => onUpdateDetails({ responsible: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">{isNotCompliant ? 'Prazo Sugerido' : 'Prazo de Implantação'}</label>
              <input
                type="text"
                list="deadlines-list"
                className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                placeholder="Ex: Imediato, 15 dias..."
                value={response?.deadline || ''}
                onChange={(e) => onUpdateDetails({ deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-2">
            <PhotoCapture 
              inputId={`photo-upload-${item.id}`}
              photos={response?.photos || []} 
              onAddPhoto={onAddPhoto} 
              onRemovePhoto={onRemovePhoto} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
