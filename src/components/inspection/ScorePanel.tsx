import React from 'react';
import { calculateScore, classificationLabel, classificationColor } from '../../utils/scoring';
import { useInspectionStore } from '../../store/useInspectionStore';
import { getTemplateById } from '../../data/templates';
import type { Inspection, InspectionResponse, ChecklistItem, Section, SectionScore } from '../../types';

interface ScorePanelProps {
  inspection?: Inspection;
  responses?: InspectionResponse[];
}

export function ScorePanel({ inspection, responses: propResponses }: ScorePanelProps) {
  const store = useInspectionStore();
  
  const currentInspection = inspection || store.currentInspection;
  const responses = propResponses || store.responses;
  
  if (!currentInspection) return null;
  const template = getTemplateById(currentInspection.templateId);
  if (!template) return null;

  const score = calculateScore(responses, template.sections);
  const color = classificationColor(score.classification);

  // Circular progress math
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score.scorePercentage / 100) * circumference;

  return (
    <div className="rounded-3xl bg-[#262624] p-8 shadow-2xl text-white border border-white/5">
      {/* Header with Hierarchy: Risk First */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex-1 space-y-3">
          <div className="inline-flex items-center gap-2 bg-white rounded-md px-3 py-1 shadow-sm">
            <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: color }} />
            <span className="text-xs font-black uppercase tracking-tighter" style={{ color: color }}>
              {classificationLabel(score.classification)}
            </span>
          </div>

          <div>
            <h2 className="text-4xl font-black tracking-tight leading-none">Nível de risco</h2>
            <p className="mt-3 text-lg font-medium text-gray-300 leading-snug max-w-lg">
              <span className="text-white font-bold">{score.criticalNotCompliesCount} itens críticos</span> não conformes elevam o risco, independente da conformidade geral.
            </p>
          </div>

          <div className="flex items-center gap-6 pt-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-white">{score.compliesCount}</span>
              <span>conformes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#EF4444]">{score.notCompliesCount}</span>
              <span>não conformes</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{score.notApplicableCount}</span>
              <span>n/a</span>
            </div>
          </div>
        </div>

        {/* Circular Progress Support (Side Data) */}
        <div className="relative flex-shrink-0 flex flex-col items-center">
          <div className="relative">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-800"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                stroke="#D97706"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                style={{ 
                  strokeDashoffset: offset,
                  transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black leading-none">{Math.round(score.scorePercentage)}%</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Conformidade</span>
            </div>
          </div>
        </div>
      </div>

      <div className="my-10 h-[1px] bg-white/10" />

      {/* Grid of Sections: Compact & Semantic */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-6 border-l-2 border-[#D97706] pl-3">Situação por Seção</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-5">
          {score.scoreBySection.map((section) => {
            const statusColor = section.criticalNotCompliesCount > 0 ? '#EF4444' : 
                                section.notCompliesCount > 0 ? '#F59E0B' : '#22C55E';
            
            return (
              <div 
                key={section.sectionId}
                className="flex items-center justify-between group py-0.5"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: statusColor }} />
                  <span className="text-[14px] font-semibold text-gray-300 group-hover:text-white transition-colors truncate">
                    {section.sectionTitle}
                  </span>
                </div>
                {section.notCompliesCount > 0 && (
                  <span className="flex-shrink-0 text-[11px] font-black text-gray-500 ml-4">
                    {section.notCompliesCount} NC
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend Footer */}
      <div className="mt-12 flex items-center gap-8 pt-6 border-t border-white/5 text-[9px] font-black uppercase tracking-widest text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span>Bom</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          <span>Atenção</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
          <span>Crítico</span>
        </div>
      </div>
    </div>
  );
}
