import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Inspection, InspectionResponse, ChecklistTemplate, InspectionScore, ConsultantSettings, FoodEstablishmentType } from '../types';
import { FOOD_SEGMENT_LABELS } from '../types';
import { classificationLabel, classificationColor } from './scoring';
import { formatDate } from './imageUtils';
import { enrichTemplate } from '../data/templates';

export async function generatePDF(
  inspection: Inspection,
  responses: InspectionResponse[],
  template: ChecklistTemplate,
  score: InspectionScore,
  settings: ConsultantSettings
): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentW = pageW - margin * 2;
  const primaryColor: [number, number, number] = [30, 107, 94];
  const secondaryColor: [number, number, number] = [45, 90, 142];

  // Helper: footer on every page
  function addFooter(pageNum: number, totalPages: number) {
    const y = pageH - 10;
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.setFont('helvetica', 'normal');
    doc.text(settings.companyName || settings.name, margin, y);
    doc.text(`Página ${pageNum} de ${totalPages}`, pageW - margin, y, { align: 'right' });
    doc.text(formatDate(new Date()), pageW / 2, y, { align: 'center' });
  }

  // ── PAGE 1: CAPA ─────────────────────────────────────────
  // Header bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageW, 40, 'F');

  // Logo if available
  if (settings.logoDataUrl) {
    try {
      doc.addImage(settings.logoDataUrl, 'JPEG', pageW - margin - 30, 5, 28, 28);
    } catch (_) { /* skip invalid logo */ }
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('RELATÓRIO DE INSPEÇÃO SANITÁRIA', margin, 18);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(template.name, margin, 28);

  // Establishment data
  let y = 55;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO ESTABELECIMENTO', margin, y);
  y += 2;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + contentW, y);
  y += 8;

  const drawField = (label: string, value: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    doc.text(label, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(10);
    doc.text(value || '—', margin + 35, y);
    y += 7;
  };

  drawField('Estabelecimento:', inspection.clientName || '');
  drawField('Localização:', `${inspection.city || '—'} / ${inspection.state || '—'}`);
  drawField('Data da Visita:', formatDate(inspection.inspectionDate));
  drawField('Consultora:', inspection.consultantName);
  
  if (inspection.clientCategory === 'alimentos' && inspection.foodTypes && inspection.foodTypes.length > 0) {
    const segments = inspection.foodTypes.map(ft => FOOD_SEGMENT_LABELS[ft] || ft).join(', ');
    drawField('Segmentos:', segments);
  }

  if (inspection.accompanistName) {
    drawField('Acompanhante:', `${inspection.accompanistName} ${inspection.accompanistRole ? `(${inspection.accompanistRole})` : ''}`);
  }

  if (settings.professionalId) {
    drawField(`${settings.professionalIdLabel || 'Registro'}:`, settings.professionalId);
  }

  // ILPI Extra Information
  if (inspection.ilpiCapacity || inspection.residentsTotal) {
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text('DADOS TÉCNICOS ILPI', margin, y);
    y += 5;
    
    autoTable(doc, {
      startY: y,
      head: [['Capacidade', 'Nº Residentes', 'Grau I', 'Grau II', 'Grau III']],
      body: [[
        inspection.ilpiCapacity || '—',
        inspection.residentsTotal || '—',
        inspection.dependencyLevel1 || '0',
        inspection.dependencyLevel2 || '0',
        inspection.dependencyLevel3 || '0',
      ]],
      headStyles: { fillColor: [240, 240, 240], textColor: [60, 60, 60], fontSize: 8 },
      bodyStyles: { fontSize: 10, halign: 'center' },
      margin: { left: margin, right: margin },
      theme: 'grid',
    });
    y = (doc as any).lastAutoTable.finalY + 8;

    // Staffing calculation summary
    const l1 = inspection.dependencyLevel1 || 0;
    const l2 = inspection.dependencyLevel2 || 0;
    const l3 = inspection.dependencyLevel3 || 0;
    const reqLei = Math.ceil(l1/20 + l2/10 + l3/5);
    const reqRDC = Math.ceil(l1/20 + l2/8 + l3/6);
    const maxReq = Math.max(reqLei, reqRDC);
    const observed = (inspection as any).observedStaff || 0;
    const isCompliant = observed >= maxReq;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    if (isCompliant) {
      doc.setTextColor(30, 90, 60);
    } else {
      doc.setTextColor(180, 40, 40);
    }
    doc.text(`DIMENSIONAMENTO: ${observed} COLABORADORES EM TURNO (MÍNIMO EXIGIDO: ${maxReq})`, margin, y);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    y += 4;
    doc.text(`Base legal: RDC 502/2021 e Lei 8049/2018. Status: ${isCompliant ? 'ADEQUADO' : 'INSUFICIENTE'}`, margin, y);

    y += 10;
  }

  // Score box
  y += 5;
  const classification = score.classification;
  const classColor = classificationColor(classification);
  const rgb = hexToRgb(classColor);
  
  // Big Status Box
  doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  doc.roundedRect(margin, y, contentW, 42, 4, 4, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  
  // RP (Risco Potencial)
  doc.setFontSize(32);
  doc.text(`${score.rp?.toFixed(1) || '0.0'}`, margin + contentW / 2, y + 16, { align: 'center' });
  doc.setFontSize(10);
  doc.text('RISCO POTENCIAL (0-15)', margin + contentW / 2, y + 22, { align: 'center' });
  
  // Status Label
  doc.setFontSize(16);
  doc.text(classificationLabel(classification).toUpperCase(), margin + contentW / 2, y + 32, { align: 'center' });
  
  // Detailed Indices
  y += 45;
  autoTable(doc, {
    startY: y,
    head: [['IC (Crítico)', 'INC (Não Crítico)', 'CR (Coef. Risco)', 'Conformidade']],
    body: [[
      score.ic?.toFixed(2) || '—',
      score.inc?.toFixed(2) || '—',
      score.cr?.toFixed(2) || '—',
      `${Math.round(score.scorePercentage)}%`
    ]],
    headStyles: { fillColor: [240, 240, 240], textColor: [60, 60, 60], fontSize: 8, halign: 'center' },
    bodyStyles: { fontSize: 11, fontStyle: 'bold', halign: 'center' },
    margin: { left: margin, right: margin },
    theme: 'grid'
  });
  y = (doc as any).lastAutoTable.finalY + 10;


  // ── PAGE 2: RESUMO ───────────────────────────────────────
  doc.addPage();
  y = margin;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...primaryColor);
  doc.text('RESUMO EXECUTIVO', margin, y);
  y += 8;

  // Summary table
  autoTable(doc, {
    startY: y,
    head: [['Seção', 'Total', 'Cumpre', 'Não Cumpre', 'NO', 'N/A', '%']],
    body: score.scoreBySection.map(s => {
      const sectionDef = template.sections.find(sec => sec.id === s.sectionId);
      const isExtra = sectionDef?.isExtraSection;
      const segment = sectionDef?.segmentKey ? (FOOD_SEGMENT_LABELS[sectionDef.segmentKey as FoodEstablishmentType] || sectionDef.segmentKey) : '';
      const title = isExtra ? `${s.sectionTitle} (ESPECÍFICO - ${segment.toUpperCase()})` : s.sectionTitle;
      
      return [
        title.length > 45 ? title.substring(0, 43) + '…' : title,
        s.totalItems,
        s.compliesCount,
        s.notCompliesCount,
        s.notObservedCount,
        s.notApplicableCount,
        `${Math.round(s.scorePercentage)}%`,
      ];
    }),
    foot: [[
      'TOTAL',
      score.totalItems,
      score.compliesCount,
      score.notCompliesCount,
      score.notObservedCount,
      score.notApplicableCount,
      `${Math.round(score.scorePercentage)}%`,
    ]],
    headStyles: { fillColor: primaryColor, fontSize: 9, fontStyle: 'bold' },
    footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    columnStyles: { 0: { cellWidth: 80 } },
    margin: { left: margin, right: margin },
    theme: 'striped',
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  if (inspection.observations) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text('Observações Gerais:', margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const obsLines = doc.splitTextToSize(inspection.observations, contentW);
    doc.text(obsLines, margin, y);
  }

  // ── PAGES 3+: NONCONFORMANCES ────────────────────────────
  const allItems = template.sections.flatMap(s => s.items);
  const nonCompliant = responses.filter(r => r.result === 'not_complies');

  if (nonCompliant.length > 0) {
    doc.addPage();
    y = margin;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...primaryColor);
    doc.text('NÃO CONFORMIDADES IDENTIFICADAS', margin, y);
    y += 2;
    doc.setDrawColor(...primaryColor);
    doc.line(margin, y, margin + contentW, y);
    y += 8;

    let ncNum = 1;
    for (const response of nonCompliant) {
      const item = allItems.find(i => i.id === response.itemId);
      if (!item) continue;

      if (y > pageH - 60) { doc.addPage(); y = margin; }

      // NC header
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, y - 4, contentW, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text(`[NC-${String(ncNum).padStart(3, '0')}] ${item.description.substring(0, 90)}`, margin + 2, y);
      y += 5;
      if (item.description.length > 90) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const rest = doc.splitTextToSize(item.description.substring(90), contentW - 4);
        doc.text(rest, margin + 2, y);
        y += rest.length * 4;
      }

      if (item.legislation) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(80, 80, 80);
        const legText = `Base legal: ${item.legislation}`;
        const legLines = doc.splitTextToSize(legText, contentW - 4);
        doc.text(legLines, margin + 2, y);
        y += legLines.length * 4;
        
        if (item.isCritical) {
          doc.setFillColor(254, 226, 226); // red-100
          doc.roundedRect(margin + 2, y, 30, 5, 2, 2, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.setTextColor(185, 28, 28); // red-700
          doc.text('ITEM CRÍTICO', margin + 7, y + 3.5);
          y += 6;
        } else {
          y += 2;
        }
      }

      if (response.situationDescription) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(180, 50, 50);
        doc.text('Situação encontrada:', margin + 2, y);
        y += 4;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 30, 30);
        const lines = doc.splitTextToSize(response.situationDescription, contentW - 4);
        doc.text(lines, margin + 2, y);
        y += lines.length * 4 + 2;
      }

      if (response.correctiveAction) {
        if (y > pageH - 40) { doc.addPage(); y = margin; }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(30, 90, 60);
        doc.text('Ação corretiva:', margin + 2, y);
        y += 4;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 30, 30);
        const lines = doc.splitTextToSize(response.correctiveAction, contentW - 4);
        doc.text(lines, margin + 2, y);
        y += lines.length * 4 + 2;
      }

      // Photos
      if (response.photos.length > 0) {
        if (y > pageH - 60) { doc.addPage(); y = margin; }
        const maxImgW = (contentW - 5) / 2;
        const maxImgH = maxImgW * 0.75;
        let col = 0;
        let currentRowMaxH = 0;
        
        for (const photo of response.photos) {
          try {
            const img = new Image();
            img.src = photo.dataUrl;
            await new Promise(resolve => img.onload = resolve);
            
            const ratio = img.height / img.width;
            let drawW = maxImgW;
            let drawH = drawW * ratio;
            
            if (drawH > maxImgH) {
              drawH = maxImgH;
              drawW = drawH / ratio;
            }
            
            const x = margin + col * (maxImgW + 5) + (maxImgW - drawW) / 2; 
            if (col === 0 && y + maxImgH > pageH - 20) { doc.addPage(); y = margin; }
            
            doc.addImage(photo.dataUrl, 'JPEG', x, y, drawW, drawH);
            currentRowMaxH = Math.max(currentRowMaxH, drawH);
            
            col++;
            if (col === 2) { 
              col = 0; 
              y += currentRowMaxH + 3; 
              currentRowMaxH = 0;
            }
          } catch (_) { /* skip */ }
        }
        if (col > 0) y += currentRowMaxH + 3;
      }

      y += 6;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y - 2, margin + contentW, y - 2);
      ncNum++;
    }
    
    // ── PAGE: PLANO DE AÇÃO (SUMMARY TABLE) ─────────────────
    doc.addPage();
    y = margin;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('PLANO DE AÇÃO CORRETIVA', margin, y);
    y += 8;

    autoTable(doc, {
      startY: y,
      head: [['Item', 'Irregularidade / Ação Corretiva', 'Responsável', 'Prazo']],
      body: nonCompliant.map((r, idx) => {
        const item = allItems.find(i => i.id === r.itemId);
        const itemDesc = r.itemId.startsWith('extra|') ? r.customDescription : item?.description;
        return [
          idx + 1,
          { 
            content: `ITEM: ${itemDesc?.substring(0, 150)}${itemDesc && itemDesc.length > 150 ? '...' : ''}\n\nSITUAÇÃO: ${r.situationDescription}\n\nAÇÃO: ${r.correctiveAction}`,
            styles: { fontSize: 8 }
          },
          r.responsible || 'Direção',
          r.deadline || 'Imediato'
        ];
      }),
      headStyles: { fillColor: secondaryColor, fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 100 },
        2: { cellWidth: 35 },
        3: { cellWidth: 25 },
      },
      theme: 'grid',
      margin: { left: margin, right: margin },
    });

    y = (doc as any).lastAutoTable.finalY + 20;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, margin + 80, y);
    y += 5;
    doc.setFontSize(8);
    doc.text(`Ciente do Plano de Ação: ${inspection.accompanistName || 'Representante do Estabelecimento'}`, margin, y);
  }

  // ── PAGES: EXCELÊNCIA E MELHORIAS ──────────────────────
  const excellenceItems = responses.filter(r => 
    r.result === 'complies' && (r.situationDescription || r.correctiveAction || r.photos.length > 0)
  );

  if (excellenceItems.length > 0) {
    doc.addPage();
    y = margin;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...secondaryColor);
    doc.text('PONTOS DE EXCELÊNCIA E SUGESTÕES DE MELHORIA', margin, y);
    y += 2;
    doc.setDrawColor(...secondaryColor);
    doc.line(margin, y, margin + contentW, y);
    y += 8;

    let exNum = 1;
    for (const response of excellenceItems) {
      const item = allItems.find(i => i.id === response.itemId);
      if (!item) continue;

      if (y > pageH - 50) { doc.addPage(); y = margin; }

      // EX header
      doc.setFillColor(240, 245, 250);
      doc.rect(margin, y - 4, contentW, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text(`[EX-${String(exNum).padStart(3, '0')}] ${item.description.substring(0, 90)}`, margin + 2, y);
      y += 5;
      
      if (item.description.length > 90) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const rest = doc.splitTextToSize(item.description.substring(90), contentW - 4);
        doc.text(rest, margin + 2, y);
        y += rest.length * 4;
      }

      if (response.situationDescription) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...secondaryColor);
        doc.text('Destaque / Observação:', margin + 2, y);
        y += 4;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 30, 30);
        const lines = doc.splitTextToSize(response.situationDescription, contentW - 4);
        doc.text(lines, margin + 2, y);
        y += lines.length * 4 + 2;
      }

      if (response.correctiveAction) {
        if (y > pageH - 30) { doc.addPage(); y = margin; }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(30, 90, 60);
        doc.text('Sugestão de Alto Padrão:', margin + 2, y);
        y += 4;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 30, 30);
        const lines = doc.splitTextToSize(response.correctiveAction, contentW - 4);
        doc.text(lines, margin + 2, y);
        y += lines.length * 4 + 2;
      }

      // Photos
      if (response.photos.length > 0) {
        if (y > pageH - 60) { doc.addPage(); y = margin; }
        const maxImgW = (contentW - 5) / 2;
        const maxImgH = maxImgW * 0.75;
        let col = 0;
        let currentRowMaxH = 0;
        
        for (const photo of response.photos) {
          try {
            const img = new Image();
            img.src = photo.dataUrl;
            await new Promise(resolve => img.onload = resolve);
            
            const ratio = img.height / img.width;
            let drawW = maxImgW;
            let drawH = drawW * ratio;
            
            if (drawH > maxImgH) {
              drawH = maxImgH;
              drawW = drawH / ratio;
            }
            
            const x = margin + col * (maxImgW + 5) + (maxImgW - drawW) / 2; 
            if (col === 0 && y + maxImgH > pageH - 20) { doc.addPage(); y = margin; }
            
            doc.addImage(photo.dataUrl, 'JPEG', x, y, drawW, drawH);
            currentRowMaxH = Math.max(currentRowMaxH, drawH);
            
            col++;
            if (col === 2) { 
              col = 0; 
              y += currentRowMaxH + 3; 
              currentRowMaxH = 0;
            }
          } catch (_) { /* skip */ }
        }
        if (col > 0) y += currentRowMaxH + 3;
      }

      y += 6;
      doc.setDrawColor(220, 230, 240);
      doc.line(margin, y - 2, margin + contentW, y - 2);
      exNum++;
    }
  }

  // ── LAST PAGE: SIGNATURE & METHODOLOGY ───────────────────
  doc.addPage();
  y = margin;
  
  // Methodology Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('NOTAS TÉCNICAS E METODOLOGIA (MARP)', margin, y);
  y += 6;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  
  const methodologyText = [
    'Este relatório utiliza a Metodologia de Avaliação de Risco Potencial (MARP), baseada no Roteiro de Inspeção Federal. ',
    '',
    '1. ÍNDICE CRÍTICO (IC): Calculado via MÉDIA GEOMÉTRICA das pontuações dos itens críticos (pesos binários 0 ou 3). Por ser geométrica, a falha em um único item crítico penaliza severamente o índice (Peso 0.6 no cálculo global).',
    '2. ÍNDICE NÃO CRÍTICO (INC): Calculado via MÉDIA ARITMÉTICA PONDERADA dos itens não críticos, considerando pesos normatizados (1, 2, 5 e 10) conforme impacto na segurança sanitária (Peso 0.4 no cálculo global).',
    '3. COEFICIENTE DE RISCO (CR): Média ponderada entre IC e INC.',
    '4. RISCO POTENCIAL (RP): Valor final do CR escalonado de 0 a 15.',
    '',
    'CLASSIFICAÇÕES: Alto Padrão (RP ≥ 13.5) | Aceitável (12 ≤ RP < 13.5) | Tolerável (9 ≤ RP < 12) | Inaceitável (RP < 9).'
  ].join('\n');

  const methLines = doc.splitTextToSize(methodologyText, contentW);
  doc.text(methLines, margin, y);
  y += methLines.length * 4 + 10;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  const disclaimer = 'Este relatório foi elaborado com base nas legislações sanitárias vigentes, durante visita técnica realizada na data indicada.';
  const dLines = doc.splitTextToSize(disclaimer, contentW);
  doc.text(dLines, margin, y);
  y += 20;
  // Accomplice Signature
  if (inspection.signatureDataUrl) {
    try {
      doc.addImage(inspection.signatureDataUrl, 'PNG', margin, y - 15, 60, 15);
    } catch (_) { /* skip */ }
  }

  doc.text(inspection.accompanistName || '—', margin, y);
  if (inspection.accompanistRole) {
    y += 5;
    doc.text(inspection.accompanistRole, margin, y);
  }
  
  y += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, margin + 80, y);
  y += 5;
  doc.text(settings.name, margin, y);
  if (settings.professionalId) {
    y += 5;
    doc.text(`${settings.professionalIdLabel || 'Registro'}: ${settings.professionalId}`, margin, y);
  }

  // Add footers
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  const filename = `Inspecao_${(inspection.clientName || 'cliente').replace(/\s+/g, '_')}_${formatDate(inspection.inspectionDate).replace(/\//g, '-')}.pdf`;
  doc.save(filename);
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [30, 107, 94];
}
