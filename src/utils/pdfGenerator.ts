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

  // ── PAGE 1: CAPA (Action Pro Design) ─────────────────────
  y += 5;
  const scorePercent = Math.round(score.scorePercentage);
  const getScoreColor = (p: number) => {
    if (p >= 85) return [34, 197, 94]; // Green
    if (p >= 70) return [245, 158, 11]; // Yellow
    return [239, 68, 68]; // Red
  };
  const rgb = getScoreColor(scorePercent);
  
  // Score Box
  doc.setFillColor(...(rgb as [number, number, number]));
  doc.roundedRect(margin, y, contentW, 35, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.text(`${scorePercent}%`, margin + contentW / 2, y + 16, { align: 'center' });
  doc.setFontSize(10);
  doc.text('ADEQUAÇÃO SANITÁRIA GERAL', margin + contentW / 2, y + 24, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${score.evaluatedItems} de ${score.totalItems} itens avaliados nesta visita`, margin + contentW / 2, y + 30, { align: 'center' });

  y += 42;
  // Progress Bar under score box
  doc.setDrawColor(230, 230, 230);
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(margin, y, contentW, 3, 1.5, 1.5, 'F');
  doc.setFillColor(...(rgb as [number, number, number]));
  doc.roundedRect(margin, y, (contentW * scorePercent) / 100, 3, 1.5, 1.5, 'F');
  y += 10;


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

  y = (doc as any).lastAutoTable.finalY + 15;

  // ── NEW PAGE: PLANO DE AÇÃO RECOMENDADO ──────────────────
  doc.addPage();
  y = margin;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text('PLANO DE AÇÃO RECOMENDADO', margin, y);
  y += 8;

  const allItemsList = template.sections.flatMap(s => s.items);
  const nonCompliantItems = responses.filter(r => r.result === 'not_complies');
  
  // Urgent Actions (Critical Weight 10)
  const urgentItems = nonCompliantItems.filter(r => {
    const it = allItemsList.find(i => i.id === r.itemId);
    return it?.isCritical;
  });

  // Important Actions (Necessary Weight 5+)
  const importantItems = nonCompliantItems.filter(r => {
    const it = allItemsList.find(i => i.id === r.itemId);
    return !it?.isCritical && (it?.weight || 0) >= 5;
  });

  const drawActionTable = (title: string, items: any[], rowColor: [number, number, number], defaultDeadline: string) => {
    doc.setFontSize(10);
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);
    doc.text(title.toUpperCase(), margin, y);
    y += 4;
    
    autoTable(doc, {
      startY: y,
      head: [['Nº', 'Descrição da Ação (O que resolver)', 'Seção', 'Prazo', 'Responsável']],
      body: items.map((r, idx) => {
        const it = allItemsList.find(i => i.id === r.itemId);
        const section = template.sections.find(s => s.id === it?.sectionId);
        return [
          idx + 1,
          it?.description || r.customDescription || '',
          section?.title || '—',
          r.deadline || defaultDeadline,
          r.responsible || 'RT / Gestor'
        ];
      }),
      headStyles: { fillColor: rgb as [number, number, number], fontSize: 8 },
      bodyStyles: { fontSize: 8, fillColor: rowColor as [number, number, number] },
      columnStyles: { 
        0: { cellWidth: 8 }, 
        1: { cellWidth: 90 },
        2: { cellWidth: 30 },
        3: { cellWidth: 20 },
        4: { cellWidth: 22 }
      },
      margin: { left: margin, right: margin },
      theme: 'grid'
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  };

  if (urgentItems.length > 0) {
    drawActionTable('GRUPO 1 — AÇÕES URGENTES (ITENS CRÍTICOS)', urgentItems, [254, 242, 242], '15 dias');
  }

  if (importantItems.length > 0) {
    drawActionTable('GRUPO 2 — AÇÕES IMPORTANTES (NECESSÁRIO)', importantItems, [255, 251, 235], '60 dias');
  }

  // Summary of Conformance
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(34, 197, 94);
  doc.text('GRUPO 3 — ITENS EM CONFORMIDADE', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text(`${score.compliesCount} itens foram verificados e encontram-se em conformidade na data desta inspeção.`, margin, y);
  y += 15;

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

  if (nonCompliantItems.length > 0) {
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
    for (const response of nonCompliantItems) {
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

  y += 10;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  const disclaimer = 'Este relatório foi elaborado com base nas legislações sanitárias vigentes, durante visita técnica realizada na data indicada.';
  const dLines = doc.splitTextToSize(disclaimer, contentW);
  doc.text(dLines, margin, y);
  y += 25;
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

  // Draw Legislation References as a separate page at the very end (before saving)
  drawLegislationPage(doc, responses);

  const filename = `Inspecao_${(inspection.clientName || 'cliente').replace(/\s+/g, '_')}_${formatDate(inspection.inspectionDate).replace(/\//g, '-')}.pdf`;
  doc.save(filename);
}

function drawLegislationPage(doc: jsPDF, results: InspectionResponse[]) {
  // Adding a new page for references
  doc.addPage();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.setFillColor(243, 244, 246);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(17, 24, 39);
  doc.text('REFERÊNCIAS LEGISLATIVAS', 20, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('Base legal utilizada para fundamentar os itens de inspeção avaliados.', 20, 34);

  let y = 60;
  
  // These are the most common laws in TreinaVISA ROIs
  const uniqueLaws = [
    'RDC Nº 63/2011 - Requisitos de Boas Práticas de Funcionamento para Serviços de Saúde',
    'RDC Nº 15/2012 - Requisitos de Boas Práticas para o Processamento de Produtos para Saúde',
    'RDC Nº 222/2018 - Boas Práticas de Gerenciamento dos Resíduos de Serviços de Saúde',
    'RDC Nº 50/2002 - Regulamento Técnico para planejamento, programação... de EAS',
    'RDC Nº 36/2013 - Institui ações para a segurança do paciente em serviços de saúde',
    'NR 32 - Segurança e Saúde no Trabalho em Serviços de Saúde',
    'Lei Federal nº 6.437/1977 - Configura infrações à legislação sanitária federal e estabelece sanções'
  ];

  uniqueLaws.forEach((law, idx) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text(`${idx + 1}.`, 20, y);
    
    doc.setFont('helvetica', 'normal');
    const splitLaw = doc.splitTextToSize(law, pageWidth - 60);
    doc.text(splitLaw, 30, y);
    y += (splitLaw.length * 6) + 4;
    
    if (y > 270) {
      doc.addPage();
      y = 30;
    }
  });

  // Footer text
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(156, 163, 175);
  doc.text('Este relatório baseia-se nas normas vigentes na data da inspeção.', 20, 285);
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [30, 107, 94];
}
