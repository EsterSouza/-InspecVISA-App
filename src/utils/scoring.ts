import type { InspectionResponse, Section, InspectionScore, SectionScore, ScoreClassification, ChecklistItem } from '../types';

/**
 * MARP Calculation - Potential Risk Matrix
 * Scale 0-3 (Binary: Conforms=3, NotConforms=0)
 */
function calcMARPValues(items: ChecklistItem[], responseMap: Map<string, InspectionResponse>) {
  const binaryScore = (id: string) => {
    const res = responseMap.get(id);
    if (!res || (res.result as string) === 'not_evaluated') return 3;
    // Actually, if it's evaluated as not_complies, it's 0. In MARP binary, we assume not_applicable/not_observed as "neutral" (3) or we filter them out.
    // Let's filter out NA/NO from the items list before calling this or treat as 3.
    if (res.result === 'not_applicable' || res.result === 'not_observed') return 3;
    return res.result === 'complies' ? 3 : 0;
  };

  const criticals = items.filter((i: ChecklistItem) => i.isCritical);
  const nonCriticals = items.filter((i: ChecklistItem) => !i.isCritical);

  // 1. IC (Índice Crítico) - Média Geométrica
  let ic = 3; 
  if (criticals.length > 0) {
    const product = criticals.reduce((acc: number, item: ChecklistItem) => acc * binaryScore(item.id), 1);
    ic = Math.pow(product, 1 / criticals.length);
  }

  // 2. INC (Índice Não Crítico) - Média Aritmética Ponderada
  let inc = 3;
  if (nonCriticals.length > 0) {
    const activeNonCriticals = nonCriticals.filter((i: ChecklistItem) => {
      const r = responseMap.get(i.id);
      return !r || (r.result !== 'not_applicable' && r.result !== 'not_observed');
    });

    if (activeNonCriticals.length > 0) {
      const weightedSum = activeNonCriticals.reduce((acc: number, item: ChecklistItem) => {
        return acc + (binaryScore(item.id) * item.weight);
      }, 0);
      const totalWeight = activeNonCriticals.reduce((acc: number, item: ChecklistItem) => acc + item.weight, 0);
      inc = totalWeight > 0 ? weightedSum / totalWeight : 3;
    }
  }

  // 3. CR (Coeficiente de Risco)
  // Pesos normatizados: IC=0.6, INC=0.4
  const cr = (ic * 0.6) + (inc * 0.4);

  // 4. RP (Risco Potencial) - Escala 0 a 15
  // No MARP federal, o valor máximo é 15 (3.0 * 5)
  const rp = cr * 5;

  return { ic, inc, cr, rp };
}

/**
 * Main score calculation for the entire inspection
 */
export function calculateScore(responses: InspectionResponse[], sections: Section[]): InspectionScore {
  const allItems = sections.flatMap((s: Section) => s.items);
  const itemIds = new Set(allItems.map((i: ChecklistItem) => i.id));
  
  // ISOLATION: Only consider responses for items that exist in the CURRENT template sections
  // This avoids "ghost" responses from other templates or versions.
  const relevantResponses = responses.filter((r: InspectionResponse) => r && r.itemId && itemIds.has(r.itemId));

  const responseMap = new Map<string, InspectionResponse>(
    relevantResponses.map((r: InspectionResponse) => [r.itemId, r] as [string, InspectionResponse])
  );

  // Global counts for valid responses (Bug 3: items with no response or 'not_evaluated' are ignored here)
  const evaluatedResponses = relevantResponses.filter((r: InspectionResponse) => r.result && r.result !== 'not_evaluated');
  
  const compliesCount = evaluatedResponses.filter((r: InspectionResponse) => r.result === 'complies').length;
  const notCompliesCount = evaluatedResponses.filter((r: InspectionResponse) => r.result === 'not_complies').length;
  const criticalNotCompliesCount = evaluatedResponses.filter((r: InspectionResponse) => {
    if (r.result !== 'not_complies') return false;
    const item = allItems.find((i: ChecklistItem) => i.id === r.itemId);
    return item?.isCritical;
  }).length;
  
  const notApplicableCount = evaluatedResponses.filter((r: InspectionResponse) => r.result === 'not_applicable').length;
  const notObservedCount = evaluatedResponses.filter((r: InspectionResponse) => r.result === 'not_observed').length;
  
  // Bug 1: totalItems is strictly the items present in the composed sections (the 97)
  const totalItemsCount = allItems.length;
  
  // X / Y where X is the count of items with ANY definitive answer (C, NC, NA, NO)
  const evaluatedCount = evaluatedResponses.length;
  const notEvaluatedCount = totalItemsCount - evaluatedCount;

  // Bug 2: scorePercentage denominator = only items that ARE C or NC (exclude NA/NO/Unanswered)
  const scoreDenominator = compliesCount + notCompliesCount;
  const scorePercentage = scoreDenominator > 0 ? (compliesCount / scoreDenominator) * 100 : 0;

  // Global MARP calculation
  const globalMarp = calcMARPValues(allItems, responseMap);

  // Section-by-section MARP calculation
  const scoreBySection: SectionScore[] = sections.map((s: Section) => {
    const sectionItems = s.items;
    const sItemIds = new Set(sectionItems.map((i: ChecklistItem) => i.id));
    const sectionResponses = relevantResponses.filter((r: InspectionResponse) => sItemIds.has(r.itemId));
    
    const sEvaluated = sectionResponses.filter((r: InspectionResponse) => r.result && r.result !== 'not_evaluated');
    const sComplies = sEvaluated.filter((r: InspectionResponse) => r.result === 'complies').length;
    const sNotComplies = sEvaluated.filter((r: InspectionResponse) => r.result === 'not_complies').length;
    const sCriticalNC = sEvaluated.filter((r: InspectionResponse) => {
      if (r.result !== 'not_complies') return false;
      const item = sectionItems.find((i: ChecklistItem) => i.id === r.itemId);
      return item?.isCritical;
    }).length;
    
    const sDenom = sComplies + sNotComplies;
    
    const sectionMarp = calcMARPValues(sectionItems, responseMap);

    return {
      sectionId: s.id,
      sectionTitle: s.title,
      totalItems: sectionItems.length,
      evaluatedItems: sEvaluated.length,
      compliesCount: sComplies,
      notCompliesCount: sNotComplies,
      criticalNotCompliesCount: sCriticalNC,
      notApplicableCount: sEvaluated.filter((r: InspectionResponse) => r.result === 'not_applicable').length,
      notObservedCount: sEvaluated.filter((r: InspectionResponse) => r.result === 'not_observed').length,
      scorePercentage: sDenom > 0 ? (sComplies / sDenom) * 100 : 0,
      ...sectionMarp
    };
  });

  // Classification based on RP (Risco Potencial)
  const classification: ScoreClassification =
    globalMarp.rp >= 13.5 ? 'excellent' :
    globalMarp.rp >= 12.0 ? 'good' :
    globalMarp.rp >= 9.0  ? 'regular' : 'critical';

  return {
    totalItems: totalItemsCount,
    evaluatedItems: evaluatedCount,
    compliesCount,
    notCompliesCount,
    criticalNotCompliesCount,
    notApplicableCount,
    notObservedCount,
    notEvaluatedCount,
    scorePercentage,
    scoreBySection,
    classification,
    ...globalMarp
  };
}

export function classificationLabel(c: ScoreClassification): string {
  return { 
    critical: 'INACEITÁVEL', 
    regular: 'TOLERÁVEL', 
    good: 'ACEITÁVEL', 
    excellent: 'ALTO PADRÃO' 
  }[c];
}

export function classificationColor(c: ScoreClassification): string {
  return {
    critical: '#EF4444', // Red
    regular: '#F59E0B',  // Amber
    good: '#84CC16',     // Lime
    excellent: '#22C55E', // Green
  }[c];
}

