import type { InspectionResponse, Section, InspectionScore, SectionScore, ScoreClassification, ChecklistItem } from '../types';

/**
 * MARP Calculation - Potential Risk Matrix
 * Scale 0-3 (Binary: Conforms=3, NotConforms=0)
 */
function calcMARPValues(items: ChecklistItem[], responseMap: Map<string, InspectionResponse>) {
  const binaryScore = (id: string) => {
    const res = responseMap.get(id);
    if (!res || res.result === 'not_evaluated') return 3; // Neutral for calculation if not evaluated? 
    // Actually, if it's evaluated as not_complies, it's 0. In MARP binary, we assume not_applicable/not_observed as "neutral" (3) or we filter them out.
    // Let's filter out NA/NO from the items list before calling this or treat as 3.
    if (res.result === 'not_applicable' || res.result === 'not_observed') return 3;
    return res.result === 'complies' ? 3 : 0;
  };

  const criticals = items.filter(i => i.isCritical);
  const nonCriticals = items.filter(i => !i.isCritical);

  // IC - Geometric Mean of Critical Items
  let ic = 3;
  if (criticals.length > 0) {
    const product = criticals.reduce((acc, item) => acc * binaryScore(item.id), 1);
    ic = Math.pow(product, 1 / criticals.length);
  }

  // INC - Weighted Arithmetic Mean of Non-Critical Items
  let inc = 3;
  if (nonCriticals.length > 0) {
    const activeNonCriticals = nonCriticals.filter(i => {
      const r = responseMap.get(i.id);
      return !r || (r.result !== 'not_applicable' && r.result !== 'not_observed');
    });
    
    const totalWeight = activeNonCriticals.reduce((acc, item) => acc + item.weight, 0);
    const weightedSum = activeNonCriticals.reduce((acc, item) => acc + (binaryScore(item.id) * item.weight), 0);
    inc = totalWeight > 0 ? weightedSum / totalWeight : 3;
  }

  const cr = Math.sqrt(ic * inc);
  const rp = Math.exp(-cr);

  return { ic, inc, cr, rp };
}

export function calculateScore(
  responses: InspectionResponse[],
  sections: Section[]
): InspectionScore {
  const responseMap = new Map(responses.map(r => [r.itemId, r]));
  const allItems = sections.flatMap(s => s.items);

  const compliesCount = responses.filter(r => r.result === 'complies').length;
  const notCompliesCount = responses.filter(r => r.result === 'not_complies').length;
  const notApplicableCount = responses.filter(r => r.result === 'not_applicable').length;
  const notObservedCount = responses.filter(r => r.result === 'not_observed').length;
  const evaluatedItems = responses.filter(r => r.result !== 'not_evaluated').length;
  const notEvaluatedCount = allItems.length - evaluatedItems;

  const denominator = compliesCount + notCompliesCount;
  const scorePercentage = denominator > 0 ? (compliesCount / denominator) * 100 : 0;

  // Global MARP
  const globalMarp = calcMARPValues(allItems, responseMap);

  const classification: ScoreClassification =
    globalMarp.rp <= 0.10 ? 'excellent' :
    globalMarp.rp <= 0.25 ? 'good' :
    globalMarp.rp <= 0.35 ? 'regular' : 'critical';

  const scoreBySection: SectionScore[] = sections.map((section: Section) => {
    const sectionItems = section.items;
    const sectionResponses = sectionItems.map((i: any) => responseMap.get(i.id)).filter(Boolean) as InspectionResponse[];
    const sComplies = sectionResponses.filter(r => r.result === 'complies').length;
    const sNotComplies = sectionResponses.filter(r => r.result === 'not_complies').length;
    const sNA = sectionResponses.filter(r => r.result === 'not_applicable').length;
    const sNO = sectionResponses.filter(r => r.result === 'not_observed').length;
    const sDenom = sComplies + sNotComplies;
    
    const sectionMarp = calcMARPValues(sectionItems, responseMap);

    return {
      sectionId: section.id,
      sectionTitle: section.title,
      totalItems: sectionItems.length,
      evaluatedItems: sectionResponses.length,
      compliesCount: sComplies,
      notCompliesCount: sNotComplies,
      notApplicableCount: sNA,
      notObservedCount: sNO,
      scorePercentage: sDenom > 0 ? (sComplies / sDenom) * 100 : 0,
      ...sectionMarp
    };
  });

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
    critical: 'INACEITÁVEL (RISCO ALTO)', 
    regular: 'TOLERÁVEL (RISCO MÉDIO)', 
    good: 'TOLERÁVEL (BOM)', 
    excellent: 'ACEITÁVEL (EXCELENTE)' 
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

