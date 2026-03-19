// ============================================================
// SEÇÕES ADICIONAIS POR SEGMENTO DE ESTABELECIMENTO
// src/data/templates_alimentos_segmentos.ts
//
// Atualizado: Março/2026
// Base legal atualizada:
//   - RDC 216/2004 (base geral)
//   - IN 211/2023 + RDC 778/2023 (aditivos — lista positiva)
//   - RDC 975/2025 (rótulos: prazo 31/03/2026)
//   - RDC 429/2020 (rotulagem frontal — em vigor pleno out/2025)
//   - RDC 724/2022 + IN 161/2022 (padrões microbiológicos)
//   - IN 351/2025 (altera parâmetros contaminantes)
//   - RDC 843/2024 + IN 281/2024 (marco de regularização)
//   - RDC 779/2023 (fermentos para panificação)
//   - Decreto 9.013/2017 + 10.468/2020 — RIISPOA (MAPA)
//   - Portaria IVISA-RIO 002/2020 (RJ — items marcados)
//
// ─────────────────────────────────────────────────────────────
// ❌  BUG CORRIGIDO EM templates_alimentos.ts:
//
//     O app mostrava o template RJ com apenas 82 itens,
//     MENOS do que os 97 do federal. Isso é logicamente
//     impossível — a legislação municipal SOMA à federal.
//
//     O template RJ correto (em templates_alimentos.ts) tem:
//       • 97 itens federais (todos incluídos, com ref. dupla)
//       • + 17 itens exclusivos do Município do RJ
//       • = 114 itens em 12 seções
//
//     Este arquivo (segmentos) contém SEÇÕES EXTRAS por tipo
//     de estabelecimento, adicionadas em cima do template base
//     (federal ou RJ). Não substituem o template base.
//
// ─────────────────────────────────────────────────────────────
// COMO USAR NO APP:
//   const baseTemplate  = getTemplate(client.city === 'Rio de Janeiro' && client.state === 'RJ'
//                           ? 'tpl-alimentos-rj-v1'
//                           : 'tpl-alimentos-federal-v1');
//   const extraSections = getExtraSections(client.serviceTypes, client.state);
//   const fullTemplate  = [...baseTemplate.sections, ...extraSections];
//
// ⚠️  TARTRAZINA (padaria):
//   Proibição FEDERAL implícita: IN 211/2023, lista positiva —
//   tartrazina NÃO consta na categoria 07.1 "Panificação".
//   No RJ: proibição EXPLÍCITA (Portaria IVISA-RIO 002/2020
//   Art. 23 §2º). Cobre qualquer padaria no Brasil inteiro.
//
// ⚠️  PRAZO CRÍTICO:
//   RDC 975/2025: a partir de 01/04/2026 produtos com
//   numeração INS ou nomes de aditivos desatualizados estão
//   irregulares. Prazo: encerrado em 01/04/2026.
// ============================================================

import { ChecklistSection, ChecklistItem } from '../types';

// ── HELPER ──────────────────────────────────────────────────
// Mapeia serviceType → IDs das seções extras a carregar
export const segmentSectionMap: Record<string, string[]> = {
  'restaurante_lanchonete': [],            // apenas roteiro base
  'sorveteria':             ['sec-extra-sorveteria'],
  'padaria_confeitaria':    ['sec-extra-padaria'],
  'mercado_hortifruti':     ['sec-extra-mercado'],
  'acougue_peixaria':       ['sec-extra-acougue', 'sec-extra-peixaria'],
  'japones_pescado_cru':    ['sec-extra-japones'],
  'dark_kitchen_delivery':  ['sec-extra-delivery'],
  'buffet_catering':        ['sec-extra-buffet'],
  'industria_artesanal':    ['sec-extra-artesanal'],
};

// ── SEÇÕES ADICIONAIS ────────────────────────────────────────
export const extraSections: ChecklistSection[] = [

  // ══════════════════════════════════════════════════════════
  // 1. PADARIA / CONFEITARIA
  // Base adicional:
  //   - IN 211/2023 (Anexo III): lista positiva de aditivos
  //     → tartrazina NÃO autorizada em categoria 07.1 (pães)
  //   - RDC 779/2023: fermentos para panificação
  //   - RDC 975/2025: prazo adequação rótulos (31/03/2026)
  //   - RDC 429/2020: rotulagem frontal obrigatória
  //   - Portaria IVISA-RIO 002/2020, Art. 23 §2º (apenas RJ)
  // ══════════════════════════════════════════════════════════
  {
    id: 'sec-extra-padaria',
    title: 'Padaria / Confeitaria — Itens Específicos',
    order: 50,
    isExtraSection: true,
    segmentKey: 'padaria_confeitaria',
    items: [
      {
        id: 'pad-001',
        sectionId: 'sec-extra-padaria',
        order: 1,
        description: 'ADITIVOS — Ausência de tartrazina (INS 102) em pães e produtos de panificação. A tartrazina NÃO consta na lista positiva de aditivos autorizados para a categoria "Produtos de Panificação" (cap. 07.1) da IN 211/2023. Sua presença torna o produto impróprio para consumo. [No RJ: vedação explícita pela Portaria IVISA-RIO 002/2020, Art. 23 §2º].',
        legislation: 'IN 211/2023 ANVISA, Anexo III (lista positiva); Portaria IVISA-RIO 002/2020, Art. 23 §2º (RJ)',
        weight: 10,
        isCritical: true,
        isRJOnly: false, // crítico em todo Brasil; no RJ há norma explícita adicional
      },
      {
        id: 'pad-002',
        sectionId: 'sec-extra-padaria',
        order: 2,
        description: 'ADITIVOS — Os demais corantes artificiais utilizados em produtos de panificação (quando aplicável em categorias que os admitem como biscoitos, coberturas e recheios) estão autorizados na IN 211/2023, Anexo III. Verificar se o produto/categoria consta na lista positiva. Produtos com aditivos não autorizados para a categoria são impróprios para consumo.',
        legislation: 'IN 211/2023 ANVISA, Anexo III (lista positiva); RDC 778/2023',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'pad-003',
        sectionId: 'sec-extra-padaria',
        order: 3,
        description: 'RÓTULOS (⚠️ prazo 31/03/2026) — Produtos embalados com aditivos alimentares possuem os números INS e nomes atualizados conforme IN 211/2023. A partir de 01/04/2026, produtos com numeração INS desatualizada são irregulares. Verificar lista de ingredientes nos rótulos dos produtos expostos embalados.',
        legislation: 'RDC 975/2025; IN 211/2023 ANVISA; RDC 778/2023',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'pad-004',
        sectionId: 'sec-extra-padaria',
        order: 4,
        description: 'ROTULAGEM FRONTAL — Produtos embalados na ausência do consumidor (vendidos embalados) com alto teor de sódio, açúcar adicionado ou gordura saturada possuem os selos de advertência obrigatórios (lupa). A rotulagem frontal é obrigatória desde outubro/2022 para grandes fabricantes e desde outubro/2025 para todos os portes.',
        legislation: 'RDC 429/2020 ANVISA; IN 75/2020',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'pad-005',
        sectionId: 'sec-extra-padaria',
        order: 5,
        description: 'FERMENTOS — Os fermentos biológicos e químicos utilizados na produção atendem à RDC 779/2023 e só contêm substâncias autorizadas no Anexo III da IN 211/2023 para a função tecnológica de fermento. Fermentos biológicos possuem poder fermentativo adequado. Embalagens de fermentos industrializados com prazo de validade vigente.',
        legislation: 'RDC 779/2023 ANVISA; IN 211/2023 Anexo III e IV',
        weight: 5,
        isCritical: false,
      },
      {
        id: 'pad-006',
        sectionId: 'sec-extra-padaria',
        order: 6,
        description: 'FARINHA — Local específico e exclusivo para guarda da farinha (depósito seco), ventilado, livre de umidade e calor, sobre estrados e separado de outros alimentos. Recipientes identificados com designação do produto, lote, data de abertura e validade. Farinha peneirada antes do uso para eliminar partículas estranhas.',
        legislation: 'RDC 216/2004, item 5.2.5; RDC 216/2004 item 5.1.5',
        weight: 5,
        isCritical: false,
      },
      {
        id: 'pad-007',
        sectionId: 'sec-extra-padaria',
        order: 7,
        description: 'EQUIPAMENTOS — Fornos turbo e demais equipamentos de panificação em boas condições, higienizados periodicamente. Coifa exclusiva sobre pontos de cocção. Equipamentos adequados à NR 12 (proteção de partes móveis, motor, cintas). Registro de manutenção preventiva.',
        legislation: 'RDC 216/2004, item 4.2.1; NR 12 (MTE)',
        weight: 5,
        isCritical: false,
      },
      {
        id: 'pad-008',
        sectionId: 'sec-extra-padaria',
        order: 8,
        description: 'EXPOSIÇÃO CONFEITARIA — Produtos de confeitaria com recheios/cremes (bolos, tortas, salgados) expostos em vitrine refrigerada a temperatura ≤5°C. Prazo máximo de exposição de 72h identificado na embalagem ou etiqueta de cada produto. Produtos prontos protegidos por vitrine fechada; exposição a granel não permitida sem proteção salivar.',
        legislation: 'RDC 216/2004, item 4.5.5; Portaria IVISA-RIO 002/2020 (RJ)',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'pad-009',
        sectionId: 'sec-extra-padaria',
        order: 9,
        description: 'IDENTIFICAÇÃO — Todos os produtos produzidos internamente (pães, bolos, salgados, doces) identificados com: designação do produto, data de fabricação/fracionamento e prazo de validade. Etiquetagem padronizada e legível.',
        legislation: 'RDC 216/2004, itens 5.1.5 e 5.4.1',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'pad-010',
        sectionId: 'sec-extra-padaria',
        order: 10,
        description: 'CONSERVANTES EM PÃO — Conservante ácido propiônico/propionato de cálcio (INS 282), se utilizado, dentro do limite "quantum satis" (sem valor máximo numérico para pães, conforme IN 211/2023 cap. 07.1). Produto rotulado corretamente com o nome do conservante na lista de ingredientes.',
        legislation: 'IN 211/2023 ANVISA, Anexo III, cap. 07.1',
        weight: 5,
        isCritical: false,
      },
    ],
  },


  // ══════════════════════════════════════════════════════════
  // 2. SORVETERIA / LANCHONETE / CAFÉ
  // Base adicional:
  //   - RDC 216/2004 (cobre integralmente)
  //   - RDC 429/2020 (rotulagem frontal)
  //   - Portaria IVISA-RIO 002/2020, Art. 5.5.12 (canudo — RJ)
  // ══════════════════════════════════════════════════════════
  {
    id: 'sec-extra-sorveteria',
    title: 'Sorveteria / Lanchonete / Café — Itens Específicos',
    order: 51,
    isExtraSection: true,
    segmentKey: 'sorveteria',
    items: [
      {
        id: 'sor-001',
        sectionId: 'sec-extra-sorveteria',
        order: 1,
        description: 'COLHERES/BOLEADORES — A água dos recipientes para enxague das colheres ou boleadores para sorvetes e similares é trocada no máximo a cada 2 horas e sempre que necessário.',
        legislation: 'RDC 216/2004 item 4.5.5 (boas práticas); Portaria SES-RS 799/2023 item 12.6',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'sor-002',
        sectionId: 'sec-extra-sorveteria',
        order: 2,
        description: 'EXPOSIÇÃO — Sorvetes e gelados artesanais em balcão expositor refrigerado a temperatura ≤-5°C (sorvetes) ou conforme especificação do fabricante. Balcão expositor com protetor salivar. Temperatura verificada e registrada diariamente.',
        legislation: 'RDC 216/2004, itens 4.5.5 e 4.2.1',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'sor-003',
        sectionId: 'sec-extra-sorveteria',
        order: 3,
        description: 'CANUDO BIODEGRADÁVEL [RJ] — Possui canudo de papel biodegradável e/ou reciclável embalado individualmente disponível para o consumidor.',
        legislation: 'Decreto-Rio 45585/18, item 5.5.12; Portaria IVISA-RIO 002/2020',
        weight: 10,
        isCritical: true,
        isRJOnly: true,
      },
      {
        id: 'sor-004',
        sectionId: 'sec-extra-sorveteria',
        order: 4,
        description: 'INSUMOS — Coberturas, caldas, frutas e demais insumos utilizados no preparo dos gelados comestíveis armazenados em temperatura adequada, identificados com data de abertura e validade. Não reutilizar coberturas que retornaram do balcão de atendimento.',
        legislation: 'RDC 216/2004, itens 5.1.5 e 5.3.4',
        weight: 5,
        isCritical: false,
      },
    ],
  },


  // ══════════════════════════════════════════════════════════
  // 3. MERCADO / HORTIFRÚTI
  // Base adicional:
  //   - RDC 218/2005 (vegetais)
  //   - RDC 216/2004
  //   - RDC 724/2022 + IN 161/2022 (padrões microbiológicos)
  //   - RDC 727/2022 (rotulagem alergênicos)
  //   - RDC 429/2020 (rotulagem frontal)
  //   - RDC 975/2025 (prazo rótulos 31/03/2026)
  // ══════════════════════════════════════════════════════════
  {
    id: 'sec-extra-mercado',
    title: 'Mercado / Hortifrúti — Itens Específicos',
    order: 52,
    isExtraSection: true,
    segmentKey: 'mercado_hortifruti',
    items: [
      {
        id: 'mer-001',
        sectionId: 'sec-extra-mercado',
        order: 1,
        description: 'HORTIFRÚTI — Local exclusivo e higienizado para higienização de hortifrutícolas (3 etapas obrigatórias): (1) lavagem individual em água corrente para remoção mecânica de sujidades; (2) imersão em solução sanitizante registrada no MS pelo tempo indicado pelo fabricante; (3) enxague em água corrente filtrada. Instruções visíveis afixadas no local.',
        legislation: 'RDC 218/2005 ANVISA; RDC 216/2004, item 4.5.3.11',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'mer-002',
        sectionId: 'sec-extra-mercado',
        order: 2,
        description: 'TEMPERATURA HORTIFRÚTI — Frutas, legumes, verduras e ovos armazenados a até 10°C em câmara frigorífica ou balcão refrigerado. Temperatura monitorada e registrada diariamente.',
        legislation: 'Portaria IVISA-RIO 002/2020, Art. 54 §1º IV; RDC 216/2004',
        weight: 5,
        isCritical: false,
      },
      {
        id: 'mer-003',
        sectionId: 'sec-extra-mercado',
        order: 3,
        description: 'ROTULAGEM — Produtos embalados possuem rotulagem completa e legível: denominação de venda, lista de ingredientes, conteúdo líquido, CNPJ/endereço do fabricante, lote, prazo de validade, registro ANVISA/MAPA quando exigido. Produtos com prazo vencido retirados imediatamente de circulação.',
        legislation: 'RDC 727/2022 ANVISA (alergênicos obrigatórios); RDC 429/2020 (rotulagem frontal); RDC 975/2025',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'mer-004',
        sectionId: 'sec-extra-mercado',
        order: 4,
        description: 'ALERGÊNICOS — Produtos embalados possuem declaração obrigatória de alergênicos conforme RDC 727/2022 (glúten, leite, ovos, amendoim, frutos do mar, entre outros). Produtos sem esta declaração são irregulares independentemente do prazo de validade.',
        legislation: 'RDC 727/2022 ANVISA (em vigor desde 09/04/2023)',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'mer-005',
        sectionId: 'sec-extra-mercado',
        order: 5,
        description: 'ROTULAGEM FRONTAL — Produtos embalados com alto teor de sódio, açúcar adicionado ou gorduras saturadas possuem os selos de advertência frontais obrigatórios (RDC 429/2020). A partir de outubro/2025 a exigência é universal para todos os portes de fabricantes.',
        legislation: 'RDC 429/2020 ANVISA',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'mer-006',
        sectionId: 'sec-extra-mercado',
        order: 6,
        description: 'ATUALIZAÇÃO DE INS/RÓTULOS (⚠️ prazo 31/03/2026) — Produtos embalados com aditivos alimentares possuem os números INS atualizados e nomes conforme IN 211/2023. Após 31/03/2026, produtos com numeração INS desatualizada são irregulares. Verificar data de fabricação × prazo de adequação.',
        legislation: 'RDC 975/2025 ANVISA; IN 211/2023',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'mer-007',
        sectionId: 'sec-extra-mercado',
        order: 7,
        description: 'FRACIONAMENTO — Produtos fracionados no estabelecimento (queijos, frios, carnes) identificados com: designação do produto, data de fracionamento e prazo de validade. Embalagens adequadas ao produto (transparentes, herméticas). Balança calibrada com certificado de calibração vigente.',
        legislation: 'RDC 216/2004, item 5.1.5; Portaria INMETRO vigente',
        weight: 10,
        isCritical: true,
      },
    ],
  },


  // ══════════════════════════════════════════════════════════
  // 4. AÇOUGUE / PEIXARIA
  // Base adicional OBRIGATÓRIA:
  //   - Decreto 9.013/2017 — RIISPOA (MAPA)
  //   - Decreto 10.468/2020 (atualiza RIISPOA)
  //   - Lei 1.283/1950 e Lei 7.889/1989
  //   - RDC 727/2022 (alergênicos; instrução de preparo suíno/aves)
  //   - RDC 724/2022 + IN 161/2022 (padrões microbiológicos)
  //   - RDC 216/2004 (boas práticas varejo)
  // ══════════════════════════════════════════════════════════
  {
    id: 'sec-extra-acougue',
    title: 'Açougue / Carnes — Itens Específicos (MAPA + ANVISA)',
    order: 53,
    isExtraSection: true,
    segmentKey: 'acougue_peixaria',
    items: [
      {
        id: 'aço-001',
        sectionId: 'sec-extra-acougue',
        order: 1,
        description: 'INSPEÇÃO OFICIAL — TODOS os produtos de origem animal expostos (carnes, embutidos, miúdos, frios) possuem Selo de Inspeção: SIF (federal), SIE (estadual) ou SIM (municipal). A ausência do selo de inspeção torna o produto impróprio para consumo e configura infração sanitária grave.',
        legislation: 'Lei 1.283/1950; Lei 7.889/1989; Decreto 9.013/2017 (RIISPOA), Art. 5º; Decreto 10.468/2020',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'aço-002',
        sectionId: 'sec-extra-acougue',
        order: 2,
        description: 'TEMPERATURA — Carnes bovinas, suínas e de aves armazenadas e expostas à temperatura máxima de 5°C. Carne moída preparada na hora ou identificada com prazo ≤24h sob refrigeração. Congelados a ≤-18°C. Temperatura verificada e registrada diariamente.',
        legislation: 'Portaria IVISA-RIO 002/2020, Art. 54 §1º; RDC 216/2004',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'aço-003',
        sectionId: 'sec-extra-acougue',
        order: 3,
        description: 'CÂMARA FRIA — Câmara frigorífica exclusiva para carnes, com: interruptor externo de segurança, termômetro de leitura externa calibrado, dispositivo de abertura interna, prateleiras de material impermeável e lavável, iluminação interna protegida.',
        legislation: 'Decreto 9.013/2017 (RIISPOA); Portaria IVISA-RIO 002/2020, Art. 31 §1º',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'aço-004',
        sectionId: 'sec-extra-acougue',
        order: 4,
        description: 'LUVA DE MALHA DE AÇO — Disponível e utilizada durante o corte e a desossa de carnes. EPIs em número suficiente, limpos e em bom estado.',
        legislation: 'Decreto 9.013/2017 (RIISPOA); Portaria IVISA-RIO 002/2020, Art. 8 §2º; NR 32',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'aço-005',
        sectionId: 'sec-extra-acougue',
        order: 5,
        description: 'SUPERFÍCIES DE CORTE — Tábuas e bancadas de corte de material atóxico, sem fissuras e de fácil higienização. Proibido o uso de tábuas de madeira. Higienizadas entre o manejo de espécies diferentes.',
        legislation: 'RDC 216/2004, item 4.2.3; Decreto 9.013/2017',
        weight: 5,
        isCritical: false,
      },
      {
        id: 'aço-006',
        sectionId: 'sec-extra-acougue',
        order: 6,
        description: 'RASTREABILIDADE — Produtos embalados possuem rotulagem completa com: denominação de venda, lote, data de fabricação/validade, CNPJ do fabricante e Selo de Inspeção. Para carnes suínas cruas e de aves, obrigatória a declaração de instruções de preparo/conservação no rótulo.',
        legislation: 'RDC 727/2022 ANVISA, Art. 34 (instrução preparo suíno/aves); Decreto 9.013/2017, Cap. III',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'aço-007',
        sectionId: 'sec-extra-acougue',
        order: 7,
        description: 'SEPARAÇÃO POR ESPÉCIE — Carnes de diferentes espécies (bovino, suíno, aves) armazenadas separadamente, em recipientes identificados. Produtos crus separados de industrializados/embutidos.',
        legislation: 'Portaria IVISA-RIO 002/2020, Art. 54 §2º; Decreto 9.013/2017',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'aço-008',
        sectionId: 'sec-extra-acougue',
        order: 8,
        description: 'UNIFORMES ESPECÍFICOS — Manipuladores com avental impermeável de cor clara, botas, luvas adequadas às atividades. Uniforme exclusivo para área de manipulação de carnes.',
        legislation: 'RDC 216/2004, item 4.4.1; Portaria IVISA-RIO 002/2020, Art. 5',
        weight: 5,
        isCritical: false,
      },
    ],
  },

  {
    id: 'sec-extra-peixaria',
    title: 'Peixaria / Pescado — Itens Específicos (MAPA + ANVISA)',
    order: 54,
    isExtraSection: true,
    segmentKey: 'acougue_peixaria',
    items: [
      {
        id: 'pei-001',
        sectionId: 'sec-extra-peixaria',
        order: 1,
        description: 'INSPEÇÃO OFICIAL PESCADO — Todo pescado exposto (peixe fresco, resfriado, congelado, frutos do mar) possui Selo de Inspeção SIF/SIE/SIM. A ausência do selo torna o produto impróprio para consumo.',
        legislation: 'Lei 1.283/1950; Decreto 9.013/2017 (RIISPOA), Art. 5º; Decreto 10.468/2020',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'pei-002',
        sectionId: 'sec-extra-peixaria',
        order: 2,
        description: 'TEMPERATURA PESCADO — Pescado fresco/resfriado armazenado a ≤4°C (em gelo ou refrigeração mecânica). Pescado congelado a ≤-18°C. Câmara/balcão exclusivo para pescado. Temperatura verificada e registrada diariamente.',
        legislation: 'Portaria IVISA-RIO 002/2020, Art. 54 §1º II e §2º; Decreto 9.013/2017',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'pei-003',
        sectionId: 'sec-extra-peixaria',
        order: 3,
        description: 'EQUIPAMENTO EXCLUSIVO — Câmara frigorífica/balcão expositor exclusivo para pescado, separado de carnes. Pescado armazenado em equipamento unicamente destinado a essa finalidade para evitar contaminação cruzada por odor e microbiota.',
        legislation: 'Portaria IVISA-RIO 002/2020, Art. 87 §único; RDC 216/2004',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'pei-004',
        sectionId: 'sec-extra-peixaria',
        order: 4,
        description: 'AVALIAÇÃO SENSORIAL — Pescado fresco apresenta características sensoriais adequadas: olhos brilhantes e salientes, guelras avermelhadas e sem odor forte, escamas aderidas, carne firme. Presença de alterações sensoriais (odor amoniacal, textura mole, olhos opacos) indica produto impróprio.',
        legislation: 'Decreto 9.013/2017 (RIISPOA), Art. 14 §4º; RDC 216/2004',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'pei-005',
        sectionId: 'sec-extra-peixaria',
        order: 5,
        description: 'GELO — Gelo utilizado na exposição do pescado produzido com água potável e em condições sanitárias adequadas. Quando industrializado, embalado e rotulado com registro. Caixas/bandejas de exposição higienizadas entre lotes.',
        legislation: 'RDC 216/2004, item 4.1.14; Decreto 9.013/2017',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'pei-006',
        sectionId: 'sec-extra-peixaria',
        order: 6,
        description: 'LUVA PARA MANUSEIO DE GELO — EPI específico (luva própria para gelo) disponível e utilizado no manuseio de gelo para aplicação sobre o pescado.',
        legislation: 'Decreto-Rio 45585/18, item 7.2; Portaria IVISA-RIO 002/2020, Art. 8',
        weight: 5,
        isCritical: false,
      },
    ],
  },


  // ══════════════════════════════════════════════════════════
  // 5. JAPONÊS / PESCADOS CRUS (SUSHI, SASHIMI, TEMAKI, ETC.)
  // Base adicional OBRIGATÓRIA:
  //   - RDC 216/2004 (aplicada com rigor máximo)
  //   - RDC 724/2022 + IN 161/2022 (padrões microbiológicos
  //     para pescado cru — substituem RDC 12/2001)
  //   - Decreto 9.013/2017 — RIISPOA (origem do pescado)
  //   - Portaria IVISA-RIO 002/2020, Art. 87 §único +
  //     Subseção III (RJ — exigências específicas orientais)
  // ══════════════════════════════════════════════════════════
  {
    id: 'sec-extra-japones',
    title: 'Japonês / Pescados Crus — Itens Específicos',
    order: 55,
    isExtraSection: true,
    segmentKey: 'japones_pescado_cru',
    items: [
      {
        id: 'jap-001',
        sectionId: 'sec-extra-japones',
        order: 1,
        description: 'ORIGEM E INSPEÇÃO DO PESCADO — Todo pescado utilizado cru ou parcialmente cozido é proveniente de estabelecimento com Selo de Inspeção SIF/SIE/SIM. Nota fiscal/laudo do fornecedor disponível para consulta.',
        legislation: 'Decreto 9.013/2017 (RIISPOA), Art. 5º; RDC 216/2004, item 5.1.4',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'jap-002',
        sectionId: 'sec-extra-japones',
        order: 2,
        description: 'CONGELAMENTO ANTI-PARASITÁRIO — Pescado oriundo de captura em alto mar e destinado ao consumo cru foi submetido a congelamento de -20°C por no mínimo 7 dias, ou -35°C por no mínimo 15 horas, para eliminação de parasitas (Anisakis e similares). Comprovante documental do fornecedor (certificado ou laudo) disponível e arquivado.',
        legislation: 'Decreto 9.013/2017 (RIISPOA); Portaria SMS Porto Alegre 17754-792/2022, Art. 2º; Portaria SMS Fortaleza sushi/sashimi',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'jap-003',
        sectionId: 'sec-extra-japones',
        order: 3,
        description: 'PESCADO DE CATIVEIRO — Quando o pescado é oriundo de aquicultura/cativeiro (ex.: salmão de cativeiro), pode ser recebido resfriado entre -0,5°C e 4°C, pois o risco de contaminação por parasitas é desprezível. Deve ser comprovada a origem de cativeiro na documentação do fornecedor.',
        legislation: 'Decreto 9.013/2017 (RIISPOA); Portaria SMS Porto Alegre 17754-792/2022',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'jap-004',
        sectionId: 'sec-extra-japones',
        order: 4,
        description: 'CLIMATIZAÇÃO OBRIGATÓRIA — Área de manipulação de pescado cru (sushiman, corte de peixes) obrigatoriamente climatizada, com temperatura entre 12°C e 18°C. Ambiente climatizado reduz a multiplicação microbiana durante a manipulação.',
        legislation: 'RDC 216/2004, item 4.5.3; Portaria IVISA-RIO 002/2020, Art. 70',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'jap-005',
        sectionId: 'sec-extra-japones',
        order: 5,
        description: 'TEMPERATURA DE EXPOSIÇÃO — Pescados crus, peixes e demais ingredientes perecíveis (ovas, maionese, cream cheese) expostos no balcão refrigerado (Netabako) a temperatura ≤5°C. Prazo máximo de exposição: 24 horas. Produtos não consumidos após 24h descartados.',
        legislation: 'RDC 216/2004, item 4.5.5; Portaria IVISA-RIO 002/2020, Art. 87; Portaria SMS Porto Alegre',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'jap-006',
        sectionId: 'sec-extra-japones',
        order: 6,
        description: 'ARROZ TEMPERADO — Receita do arroz temperado padronizada e documentada. Todos os lotes submetidos a amostragem laboratorial de pH ≤4,5, com laudo arquivado. Arroz preparado com vinagre, açúcar e sal até pH ≤4,5 pode ser mantido em temperatura ambiente por até 24 horas. Data e hora de produção e validade identificadas no recipiente. Excedente manipulado/utilizado descartado.',
        legislation: 'Portaria SMS Porto Alegre 17754-792/2022, Arts. 4º e 5º; Portaria SMS Fortaleza sushi/sashimi',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'jap-007',
        sectionId: 'sec-extra-japones',
        order: 7,
        description: 'PADRÕES MICROBIOLÓGICOS — As preparações à base de pescado cru (sushi, sashimi, temaki) atendem à RDC 724/2022 e IN 161/2022 (padrões microbiológicos para pescado cru e alimentos prontos para consumo). Controle de temperatura e higiene rigorosos para Vibrio parahaemolyticus, Listeria monocytogenes e Salmonella sp. (ausência em 25g).',
        legislation: 'RDC 724/2022 + IN 161/2022 ANVISA (substituem RDC 12/2001)',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'jap-008',
        sectionId: 'sec-extra-japones',
        order: 8,
        description: 'UTENSÍLIOS EXCLUSIVOS — Facas, tábuas e utensílios utilizados no corte do pescado cru são exclusivos para essa finalidade, higienizados e sanitizados entre preparações. Tábuas de material atóxico e sem fissuras. Proibido o uso de madeira.',
        legislation: 'RDC 216/2004, item 4.2.3',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'jap-009',
        sectionId: 'sec-extra-japones',
        order: 9,
        description: 'EPI SUSHIMAN — Sushiman com touca/bandana cobrindo todo o cabelo e barba raspada ou protegida. Luvas descartáveis ou antissepsia rigorosa das mãos entre preparações. Avental de cor clara e limpo.',
        legislation: 'RDC 216/2004, item 4.4.1; Portaria IVISA-RIO 002/2020, Arts. 4 e 5',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'jap-010',
        sectionId: 'sec-extra-japones',
        order: 10,
        description: 'CÂMARA/BALCÃO EXCLUSIVO PESCADO — Equipamento frigorífico exclusivo para armazenamento e guarda do pescado, separado de outros alimentos.',
        legislation: 'Portaria IVISA-RIO 002/2020, Art. 87 §único; RDC 216/2004',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'jap-011',
        sectionId: 'sec-extra-japones',
        order: 11,
        description: 'OVO CRU / MAIONESE CASEIRA [RJ] — É vedada a entrega ao consumo de preparações à base de ovo cru (incluindo maionese caseira). Utilizar ovo líquido pasteurizado ou industrializado similar.',
        legislation: 'Portaria IVISA-RIO 002/2020, Art. 74',
        weight: 10,
        isCritical: true,
        isRJOnly: true,
      },
    ],
  },


  // ══════════════════════════════════════════════════════════
  // 6. DARK KITCHEN / DELIVERY
  // Base adicional:
  //   - RDC 216/2004 (base integral, sem norma federal
  //     específica para dark kitchen confirmada até mar/2026)
  //   - RDC 216/2004 itens 4.5.6 (transporte)
  //   - Portaria IVISA-RIO 002/2020, Arts. 75 a 77 (RJ)
  // ══════════════════════════════════════════════════════════
  {
    id: 'sec-extra-delivery',
    title: 'Dark Kitchen / Delivery — Itens Específicos',
    order: 56,
    isExtraSection: true,
    segmentKey: 'dark_kitchen_delivery',
    items: [
      {
        id: 'del-001',
        sectionId: 'sec-extra-delivery',
        order: 1,
        description: 'VEÍCULO LICENCIADO — Veículos utilizados para entrega de alimentos preparados devidamente licenciados pelo órgão de Vigilância Sanitária competente. Licença disponível para consulta.',
        legislation: 'RDC 216/2004, item 4.5.6; Portaria IVISA-RIO 002/2020, Art. 77',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'del-002',
        sectionId: 'sec-extra-delivery',
        order: 2,
        description: 'EMBALAGEM DE ENTREGA — Alimentos acondicionados em recipiente hermeticamente vedado, de material atóxico, em perfeito estado de higiene e conservação. Embalagem com identificação mínima: nome do estabelecimento, CNPJ, tipo de alimento, data, hora de produção, temperatura de manutenção e prazo de validade.',
        legislation: 'RDC 216/2004, item 4.5.6; Portaria IVISA-RIO 002/2020, Art. 76 §1º',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'del-003',
        sectionId: 'sec-extra-delivery',
        order: 3,
        description: 'CONTROLE DE TEMPERATURA NA ENTREGA — Temperatura dos alimentos preparados monitorada e registrada em planilha no momento da expedição (saída da cozinha). Alimentos quentes mantidos >60°C; alimentos resfriados mantidos <5°C durante todo o transporte. Bag isotérmico, caixa frigorificada ou veículo refrigerado conforme a categoria do alimento.',
        legislation: 'RDC 216/2004, itens 4.5.5 e 4.5.6; Portaria IVISA-RIO 002/2020, Art. 76 §2º',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'del-004',
        sectionId: 'sec-extra-delivery',
        order: 4,
        description: 'TEMPO DE ENTREGA — Controle do binômio tempo × temperatura. Alimentos quentes mantidos abaixo de 60°C por no máximo 1 hora total desde a saída da cozinha até o consumo. Registros de hora de despacho disponíveis.',
        legislation: 'RDC 216/2004, item 4.5.5; Portaria IVISA-RIO 002/2020, Art. 66 §único',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'del-005',
        sectionId: 'sec-extra-delivery',
        order: 5,
        description: 'INTEGRIDADE DA EMBALAGEM — Embalagens de entrega lacradas (lacre inviolável ou embalagem selada) para garantir integridade do alimento ao consumidor. Veículo de entrega exclusivo para alimentos, sem produtos químicos, de limpeza ou outras cargas.',
        legislation: 'RDC 216/2004, item 4.5.6; Portaria IVISA-RIO 002/2020, Art. 77',
        weight: 5,
        isCritical: false,
      },
      {
        id: 'del-006',
        sectionId: 'sec-extra-delivery',
        order: 6,
        description: 'LICENÇA SANITÁRIA — Estabelecimento com Licença/Alvará Sanitário vigente, mesmo sem atendimento presencial ao público. O modelo dark kitchen (sem salão) não isenta do licenciamento sanitário.',
        legislation: 'RDC 216/2004; Lei nº 6.437/1977; legislação municipal vigente',
        weight: 10,
        isCritical: true,
      },
    ],
  },


  // ══════════════════════════════════════════════════════════
  // 7. BUFFET / CATERING (incluindo eventos)
  // Base adicional:
  //   - RDC 216/2004
  //   - RDC 656/2022 (eventos de massa >1.000 pessoas/dia)
  //   - Portaria IVISA-RIO 002/2020 (RJ — Subseção II autosserviço)
  // ══════════════════════════════════════════════════════════
  {
    id: 'sec-extra-buffet',
    title: 'Buffet / Catering — Itens Específicos',
    order: 57,
    isExtraSection: true,
    segmentKey: 'buffet_catering',
    items: [
      {
        id: 'buf-001',
        sectionId: 'sec-extra-buffet',
        order: 1,
        description: 'PROTETOR SALIVAR — Todos os balcões de distribuição (bufê a quente, bufê de saladas, sobremesas, sorveteria e similares) equipados com protetor salivar de fácil higienização, disposto de modo a prevenir contaminação por partículas de saliva, tosse, espirro, cabelo ou objetos dos consumidores.',
        legislation: 'RDC 216/2004, item 4.5.5; Portaria SES-RS 799/2023; Portaria IVISA-RIO 002/2020',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'buf-002',
        sectionId: 'sec-extra-buffet',
        order: 2,
        description: 'UTENSÍLIOS DE SERVIR — Conjunto de talheres, garfos, colheres, pratos e copos higienizados e dispostos de modo a minimizar contaminação pelas mãos do cliente. Utensílios de uso contínuo higienizados, desinfetados e secos após cada uso. Sem imperfeições, rachaduras ou lascas.',
        legislation: 'RDC 216/2004, item 4.5.5; Portaria IVISA-RIO 002/2020, Arts. 90 e 91',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'buf-003',
        sectionId: 'sec-extra-buffet',
        order: 3,
        description: 'TRANSPORTE DE REFEIÇÕES — Refeições prontas transportadas em recipientes hermeticamente fechados, de material atóxico, com capacidade de manter temperatura >60°C (quentes) ou <5°C (frios). Temperatura monitorada e registrada na expedição e no recebimento. Veículo exclusivo e licenciado.',
        legislation: 'RDC 216/2004, itens 4.5.5 e 4.5.6; Portaria IVISA-RIO 002/2020, Arts. 75 e 76',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'buf-004',
        sectionId: 'sec-extra-buffet',
        order: 4,
        description: 'EVENTOS DE MASSA (>1.000 pessoas/dia) — Para eventos com mais de 1.000 pessoas diárias: notificação prévia à autoridade sanitária local; profissional habilitado supervisionando as atividades de manipulação no evento; coleta e manutenção de amostras de alimentos preparados (mínimo 100g por preparação, identificadas e mantidas sob refrigeração por 72h).',
        legislation: 'RDC 656/2022 ANVISA, Arts. 1º, 6º e 7º',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'buf-005',
        sectionId: 'sec-extra-buffet',
        order: 5,
        description: 'ESTRUTURAS PROVISÓRIAS EM EVENTOS — Quando montadas estruturas provisórias para manipulação de alimentos em eventos: pias com água corrente e sabonete antisséptico; descarte adequado de resíduos; equipamentos de conservação de temperatura adequados; fluxo ordenado sem cruzamento.',
        legislation: 'RDC 656/2022 ANVISA, Art. 16',
        weight: 10,
        isCritical: true,
      },
    ],
  },


  // ══════════════════════════════════════════════════════════
  // 8. INDÚSTRIA ARTESANAL
  // Base adicional OBRIGATÓRIA:
  //   - RDC 843/2024 + IN 281/2024 (marco regularização 2024)
  //   - RDC 429/2020 (rotulagem frontal)
  //   - RDC 727/2022 (alergênicos)
  //   - RDC 975/2025 (prazo rótulos 31/03/2026)
  //   - IN 211/2023 (lista positiva aditivos)
  //   - Decreto 9.013/2017 — RIISPOA (se produto de origem
  //     animal: SIF/SIE/SIM obrigatório)
  //   - IN MAPA 16/2015 (agroindústria pequeno porte animal)
  // ══════════════════════════════════════════════════════════
  {
    id: 'sec-extra-artesanal',
    title: 'Indústria Artesanal — Itens Específicos',
    order: 58,
    isExtraSection: true,
    segmentKey: 'industria_artesanal',
    items: [
      {
        id: 'art-001',
        sectionId: 'sec-extra-artesanal',
        order: 1,
        description: 'REGULARIZAÇÃO DO PRODUTO (RDC 843/2024) — Produtos industrializados para venda FORA do próprio estabelecimento possuem a regularização adequada: registro (Anexo I da IN 281/2024), notificação (Anexo II) ou comunicação de início de fabricação (Anexo III), conforme categoria de risco. Produtos sem regularização adequada são irregulares. [EXCEÇÃO: produtos vendidos diretamente no balcão do próprio produtor ao consumidor final estão dispensados — IN 281/2024, Anexo IV].',
        legislation: 'RDC 843/2024 ANVISA; IN 281/2024 ANVISA (vigência: 01/09/2024)',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'art-002',
        sectionId: 'sec-extra-artesanal',
        order: 2,
        description: 'ROTULAGEM COMPLETA — Produtos embalados para venda possuem todos os elementos obrigatórios: denominação de venda, lista de ingredientes, conteúdo líquido, CNPJ/razão social/endereço do fabricante, identificação do lote, prazo de validade, instruções de conservação, número de registro/notificação quando exigido, tabela nutricional, declaração de alergênicos.',
        legislation: 'RDC 727/2022 ANVISA (alergênicos); RDC 429/2020 (rotulagem nutricional frontal); RDC 975/2025 (INS atualizados)',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'art-003',
        sectionId: 'sec-extra-artesanal',
        order: 3,
        description: 'ROTULAGEM FRONTAL — Produtos embalados que possuem alto teor de sódio, açúcar adicionado ou gorduras saturadas exibem o selo de advertência obrigatório (lupa) na parte frontal da embalagem. Desde outubro/2025, obrigatório para todos os portes de fabricantes.',
        legislation: 'RDC 429/2020 ANVISA',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'art-004',
        sectionId: 'sec-extra-artesanal',
        order: 4,
        description: 'ATUALIZAÇÃO INS NOS RÓTULOS (⚠️ prazo 31/03/2026) — Produtos com aditivos alimentares possuem os números INS e nomes atualizados conforme IN 211/2023. Após 31/03/2026, produtos fabricados com numeração INS desatualizada são irregulares. Produtos fabricados antes desta data podem ser comercializados até o fim do prazo de validade, desde que a data de fabricação esteja declarada.',
        legislation: 'RDC 975/2025 ANVISA; IN 211/2023',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'art-005',
        sectionId: 'sec-extra-artesanal',
        order: 5,
        description: 'ADITIVOS ALIMENTARES — Os aditivos utilizados constam na lista positiva da IN 211/2023 para a categoria de produto fabricado. Um aditivo não listado para a categoria é aditivo não autorizado, tornando o produto impróprio para consumo. Verificar o painel de consultas da ANVISA (anvisa.gov.br).',
        legislation: 'IN 211/2023 ANVISA, Anexo III (lista positiva); RDC 778/2023',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'art-006',
        sectionId: 'sec-extra-artesanal',
        order: 6,
        description: 'PRODUTO DE ORIGEM ANIMAL — Se o produto artesanal envolve carnes, pescado, laticínios, mel ou ovos beneficiados: exige Selo de Inspeção (SIF para comércio interestadual; SIE para comércio estadual; SIM para comércio local/municipal). Sem o selo, o produto é impróprio para comercialização.',
        legislation: 'Lei 1.283/1950; Lei 7.889/1989; Decreto 9.013/2017 (RIISPOA); IN MAPA 16/2015 (agroindústria pequeno porte)',
        weight: 10,
        isCritical: true,
      },
      {
        id: 'art-007',
        sectionId: 'sec-extra-artesanal',
        order: 7,
        description: 'RASTREABILIDADE E LOTE — Cada lote fabricado possui: código de lote, data de fabricação, registro de matérias-primas utilizadas (fornecedores, datas de validade), quantidade produzida. Sistema de rastreabilidade permite identificar e recall de produto em caso de necessidade.',
        legislation: 'RDC 843/2024 ANVISA; Decreto 9.013/2017 (se origem animal)',
        weight: 5,
        isCritical: false,
      },
      {
        id: 'art-008',
        sectionId: 'sec-extra-artesanal',
        order: 8,
        description: 'BPF DOCUMENTADA — Manual de Boas Práticas de Fabricação elaborado, datado e assinado pelo responsável. POPs implementados para: higiene dos manipuladores; higienização de instalações e equipamentos; controle de pragas; higienização do reservatório de água.',
        legislation: 'RDC 216/2004 (se serviço de alimentação); RDC 843/2024',
        weight: 5,
        isCritical: false,
      },
    ],
  },

];

// ── FUNÇÃO AUXILIAR PARA O APP ───────────────────────────────
/**
 * Retorna as seções extras para o estabelecimento conforme
 * os tipos de serviço e o estado.
 *
 * @param serviceTypes - array com os tipos selecionados no cadastro
 * @param state - UF do estabelecimento (ex: 'RJ')
 * @returns ChecklistSection[] filtradas e prontas para uso
 */
export function getExtraSections(
  serviceTypes: string[],
  state?: string
): ChecklistSection[] {
  const isRJ = state === 'RJ';
  const sectionIds = new Set<string>();

  for (const type of serviceTypes) {
    const ids = segmentSectionMap[type] ?? [];
    ids.forEach(id => sectionIds.add(id));
  }

  return extraSections
    .filter(sec => sectionIds.has(sec.id))
    .map(sec => ({
      ...sec,
      items: sec.items.filter(item => {
        // itens marcados isRJOnly só aparecem para RJ
        if ((item as any).isRJOnly && !isRJ) return false;
        return true;
      }),
    }));
}

// ── TIPOS ESTENDIDOS (adicionar em src/types/index.ts) ───────
// Se ainda não existir em types, adicionar:
//
// export interface ChecklistSection {
//   ...campos existentes...
//   isExtraSection?: boolean;
//   segmentKey?: string;
// }
//
// export interface ChecklistItem {
//   ...campos existentes...
//   isRJOnly?: boolean;
// }
