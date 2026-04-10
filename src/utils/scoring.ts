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

  const criticals = items.filter(i => i.isCritical);
  const nonCriticals = items.filter(i => !i.isCritical);

  // 1. IC (Índice Crítico) - Média Geométrica
  let ic = 3; 
  if (criticals.length > 0) {
    const product = criticals.reduce((acc, item) => acc * binaryScore(item.id), 1);
    ic = Math.pow(product, 1 / criticals.length);
  }

  // 2. INC (Índice Não Crítico) - Média Aritmética Ponderada
  let inc = 3;
  if (nonCriticals.length > 0) {
    const activeNonCriticals = nonCriticals.filter(i => {
      const r = responseMap.get(i.id);
      return !r || (r.result !== 'not_applicable' && r.result !== 'not_observed');
    });

    if (activeNonCriticals.length > 0) {
      const weightedSum = activeNonCriticals.reduce((acc, item) => {
        return acc + (binaryScore(item.id) * item.weight);
      }, 0);
      const totalWeight = activeNonCriticals.reduce((acc, item) => acc + item.weight, 0);
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
  const responseMap = new Map<string, InspectionResponse>(
    responses
      .filter(r => r && r.itemId)
      .map(r => [r.itemId, r] as [string, InspectionResponse])
  );
  const allItems = sections.flatMap(s => s.items);

  // Global metrics
  const evaluatedItems = responses.filter(r => r?.result && r.result !== 'not_evaluated').length;
  const compliesCount = responses.filter(r => r?.result === 'complies').length;
  const notCompliesCount = responses.filter(r => r?.result === 'not_complies').length;
  const notApplicableCount = responses.filter(r => r?.result === 'not_applicable').length;
  const notObservedCount = responses.filter(r => r?.result === 'not_observed').length;
  const notEvaluatedCount = allItems.length - evaluatedItems;

  const denominator = compliesCount + notCompliesCount;
  const scorePercentage = denominator > 0 ? (compliesCount / denominator) * 100 : 0;

  // Global MARP calculation
  const globalMarp = calcMARPValues(allItems, responseMap);

  // Section-by-section MARP calculation
  const scoreBySection: SectionScore[] = sections.map(s => {
    const sectionItems = s.items;
    const itemIds = new Set(sectionItems.map(i => i.id));
    const sectionResponses = responses.filter(r => itemIds.has(r.itemId));
    
    // Section basic metrics
    const sectionComplies = sectionResponses.filter(r => r.result === 'complies').length;
    const sectionNotComplies = sectionResponses.filter(r => r.result === 'not_complies').length;
    const sectionDenom = sectionComplies + sectionNotComplies;
    
    const sectionMarp = calcMARPValues(sectionItems, responseMap);

    return {
      sectionId: s.id,
      sectionTitle: s.title,
      totalItems: sectionItems.length,
      evaluatedItems: sectionResponses.length,
      compliesCount: sectionComplies,
      notCompliesCount: sectionNotComplies,
      notApplicableCount: sectionResponses.filter(r => r.result === 'not_applicable').length,
      notObservedCount: sectionResponses.filter(r => r.result === 'not_observed').length,
      scorePercentage: sectionDenom > 0 ? (sectionComplies / sectionDenom) * 100 : 0,
      ...sectionMarp
    };
  });

  // Classification based on RP (Risco Potencial)
  // Escala: Aceitável (≥ 13.5), Tolerável (12 a 13.5), Crítico (9 a 12), Inaceitável (< 9)
  const classification: ScoreClassification =
    globalMarp.rp >= 13.5 ? 'excellent' :
    globalMarp.rp >= 12.0 ? 'good' :
    globalMarp.rp >= 9.0  ? 'regular' : 'critical';

  return {
    totalItems: allItems.length,
    evaluatedItems,
    compliesCount,
    notCompliesCount,
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

