// ============================================================
// src/data/templates_alimentos.ts
// ROTEIROS DE ALIMENTOS — DOIS TEMPLATES
//
// Atualizado: Março/2026
// Base legal:
//   - RDC 216/2004 (ANVISA) — boas práticas serviços alimentos
//   - RDC 218/2005 (ANVISA) — vegetais
//   - Portaria IVISA-RIO nº 002/2020 — Município RJ
//   - Decreto-Rio nº 45.585/2018
//   - Resolução SMS nº 2119/2013
//
// ─────────────────────────────────────────────────────────────
// ❌  BUG ANTERIOR (corrigido aqui):
//     A versão anterior do template RJ tinha apenas 82 itens,
//     MENOS do que os 97 do template federal. Isso é
//     logicamente impossível: a legislação municipal SOMA à
//     federal, jamais a substitui ou reduz.
//     Causa: o template RJ foi escrito do zero em vez de
//     partir dos 97 itens federais e acrescentar os extras.
//
// ✅  ARQUITETURA CORRETA (esta versão — verificado em mar/2026):
//     Template federal  → 97 itens  (grep 'ali-f-' = 97)
//     Template RJ       → 114 itens (grep 'rj-f-\|rj-exc-' = 114)
//
//     O template RJ contém TODOS os 97 itens federais
//     (reformulados com referência dupla RDC 216/2004 +
//     Portaria IVISA-RIO 002/2020) MAIS 17 itens exclusivos
//     do Município do Rio de Janeiro, distribuídos assim:
//
//       • 5 itens exclusivos RJ embutidos nas seções 7, 9 e 11:
//           rj-f-072  — Proibição de ovo cru / maionese caseira
//                        (Portaria IVISA-RIO 002/2020, Art. 74)
//           rj-f-084  — Vedação de embalagem monodose de molhos
//                        (Decreto-Rio 45585/18 item 5.5.11)
//           rj-f-085  — Canudo de papel biodegradável obrigatório
//                        (Decreto-Rio 45585/18 item 5.5.12)
//           rj-f-086  — Sinalização de glúten obrigatória
//                        (Decreto-Rio 45585/18 item 5.5.13)
//           rj-f-102  — Contrato INEA para coleta de óleo vegetal
//                        (Portaria IVISA-RIO 002/2020, Art. 51)
//
//       • 12 itens exclusivos RJ na Seção 12 (EPI, segurança,
//           responsabilidade técnica municipal):
//           rj-exc-001 a rj-exc-012
//
//     Total RJ: 97 federais + 17 exclusivos RJ = 114 itens
//
// ─────────────────────────────────────────────────────────────
// Template 1: tpl-alimentos-federal-v1
//   → Qualquer estabelecimento no Brasil
//   → 97 itens em 11 seções
//
// Template 2: tpl-alimentos-rj-v1
//   → APENAS para o Município do Rio de Janeiro
//   → Contém TODOS os 97 itens federais + 17 exclusivos RJ
//   → 114 itens em 12 seções  ← sempre maior que o federal
//
// Pesos: Imprescindível = 10, isCritical: true
//        Necessário     = 5,  isCritical: false
//        Recomendável   = 2,  isCritical: false
// ============================================================

import { ChecklistTemplate } from '../types';

export const alimentosTemplates: ChecklistTemplate[] = [

  // ════════════════════════════════════════════════════════
  // TEMPLATE 1 — FEDERAL (qualquer município do Brasil)
  // ════════════════════════════════════════════════════════
  {
    id: 'tpl-alimentos-federal-v1',
    name: 'Roteiro de Inspeção — Serviços de Alimentação (Nacional)',
    category: 'alimentos',
    version: '2026',
    sections: [

      // ── SEÇÃO 1 ────────────────────────────────────────
      {
        id: 'sec-ali-fed-01',
        title: 'Edificação e Instalações',
        order: 1,
        items: [
          { id: 'ali-f-001', sectionId: 'sec-ali-fed-01', order: 1,  description: 'Áreas internas e externas livres de objetos em desuso ou estranhos ao ambiente; dependências sem presença de animais e não utilizadas como habitação ou dormitório.', legislation: 'RDC 216/2004 item 4.1.1', weight: 5, isCritical: false },
          { id: 'ali-f-002', sectionId: 'sec-ali-fed-01', order: 2,  description: 'Piso de material liso, resistente e de fácil higienização, em adequado estado de conservação, com ralos com tampas escamoteáveis sifonados e/ou grelhas para facilitar escoamento e proteger contra pragas.', legislation: 'RDC 216/2004 item 4.1.2', weight: 5, isCritical: false },
          { id: 'ali-f-003', sectionId: 'sec-ali-fed-01', order: 3,  description: 'Tetos, paredes e divisórias com acabamento liso, impermeável, de cor clara, em adequado estado de conservação e de fácil higienização.', legislation: 'RDC 216/2004 item 4.1.3', weight: 5, isCritical: false },
          { id: 'ali-f-004', sectionId: 'sec-ali-fed-01', order: 4,  description: 'Portas com acabamento liso, ajustadas aos batentes, em adequado estado de conservação. Portas externas com fechamento automático (mola) e barreiras adequadas contra vetores (telas milimétricas ou outro sistema).', legislation: 'RDC 216/2004 item 4.1.4', weight: 5, isCritical: false },
          { id: 'ali-f-005', sectionId: 'sec-ali-fed-01', order: 5,  description: 'Janelas e outras aberturas com superfície lisa, de fácil higienização, ajustadas aos batentes, com telas milimétricas e em adequado estado de conservação.', legislation: 'RDC 216/2004 item 4.1.5', weight: 5, isCritical: false },
          { id: 'ali-f-006', sectionId: 'sec-ali-fed-01', order: 6,  description: 'Escadas, elevadores de serviço, montacargas e estruturas auxiliares de material resistente, liso e impermeável, em adequado estado de conservação e não servindo de fonte de contaminação.', legislation: 'RDC 216/2004 item 4.1.6', weight: 5, isCritical: false },
          { id: 'ali-f-007', sectionId: 'sec-ali-fed-01', order: 7,  description: 'Iluminação suficiente e luminárias com proteção adequada contra queda acidental e explosão (exceto LED), em adequado estado de conservação e higiene.', legislation: 'RDC 216/2004 item 4.1.7', weight: 5, isCritical: false },
          { id: 'ali-f-008', sectionId: 'sec-ali-fed-01', order: 8,  description: 'Instalações elétricas embutidas ou, quando exteriores, revestidas por tubulações isolantes e presas a paredes e tetos.', legislation: 'RDC 216/2004 item 4.1.8', weight: 5, isCritical: false },
          { id: 'ali-f-009', sectionId: 'sec-ali-fed-01', order: 9,  description: 'Sistema de climatização instalado com conforto térmico adequado, em bom estado de conservação e higiene.', legislation: 'RDC 216/2004 item 4.1.9', weight: 5, isCritical: false },
          { id: 'ali-f-010', sectionId: 'sec-ali-fed-01', order: 10, description: 'O fluxo de ar NÃO incide diretamente sobre os alimentos.', legislation: 'RDC 216/2004 item 4.1.9', weight: 10, isCritical: true },
          { id: 'ali-f-011', sectionId: 'sec-ali-fed-01', order: 11, description: 'Pontos de cocção (fogões, fritadeiras, chapas, etc.) instalados sob coifa com adequado sistema de exaustão e troca de ar capaz de prevenir contaminações e garantir conforto térmico.', legislation: 'RDC 216/2004 item 4.1.10', weight: 5, isCritical: false },
          { id: 'ali-f-012', sectionId: 'sec-ali-fed-01', order: 12, description: 'Instalações sanitárias sem comunicação direta com áreas de produção/manipulação/armazenamento de alimentos, com portas de fechamento automático e providas de papel higiênico.', legislation: 'RDC 216/2004 item 4.1.11', weight: 5, isCritical: false },
          { id: 'ali-f-013', sectionId: 'sec-ali-fed-01', order: 13, description: 'Sanitários com piso, paredes e teto liso, resistente e impermeável, dotados de ralo sifonado com tampa, ventilação e iluminação adequadas e telas nas aberturas.', legislation: 'RDC 216/2004 item 4.1.11', weight: 5, isCritical: false },
          { id: 'ali-f-014', sectionId: 'sec-ali-fed-01', order: 14, description: 'Vasos sanitários e mictórios com descarga, íntegros, em nº suficiente e em bom estado de funcionamento. Vasos com assentos e tampas.', legislation: 'RDC 216/2004 item 4.1.11', weight: 5, isCritical: false },
          { id: 'ali-f-015', sectionId: 'sec-ali-fed-01', order: 15, description: 'Sanitários com pia, sabonete líquido antisséptico e toalha de papel não reciclado para higienização das mãos.', legislation: 'RDC 216/2004 item 4.1.11', weight: 10, isCritical: true },
          { id: 'ali-f-016', sectionId: 'sec-ali-fed-01', order: 16, description: 'Sanitários com avisos sobre procedimentos para lavagem das mãos.', legislation: 'RDC 216/2004 item 4.1.11', weight: 5, isCritical: false },
          { id: 'ali-f-017', sectionId: 'sec-ali-fed-01', order: 17, description: 'Sanitários com lixeiras com tampas sem acionamento manual, revestidas com sacos apropriados e coleta frequente dos resíduos.', legislation: 'RDC 216/2004 item 4.1.11', weight: 5, isCritical: false },
          { id: 'ali-f-018', sectionId: 'sec-ali-fed-01', order: 18, description: 'Vestiários com armários organizados, em número suficiente e em bom estado de conservação.', legislation: 'RDC 216/2004 item 4.1.11', weight: 5, isCritical: false },
          { id: 'ali-f-019', sectionId: 'sec-ali-fed-01', order: 19, description: 'Lavatórios na área de produção adequados ao fluxo, dotados de sabonete líquido antisséptico, toalhas de papel não reciclado e lixeiras com tampas sem acionamento manual.', legislation: 'RDC 216/2004 item 4.1.12', weight: 10, isCritical: true },
          { id: 'ali-f-020', sectionId: 'sec-ali-fed-01', order: 20, description: 'Avisos com procedimentos para lavagem das mãos afixados nos lavatórios da área de produção.', legislation: 'RDC 216/2004 item 4.1.12', weight: 5, isCritical: false },
          { id: 'ali-f-021', sectionId: 'sec-ali-fed-01', order: 21, description: 'Ausência de vetores e pragas urbanas ou seus vestígios.', legislation: 'RDC 216/2004 item 4.1.13', weight: 10, isCritical: true },
          { id: 'ali-f-022', sectionId: 'sec-ali-fed-01', order: 22, description: 'Medidas preventivas e corretivas adotadas para impedir a atração, abrigo, acesso e/ou proliferação de vetores e pragas urbanas.', legislation: 'RDC 216/2004 item 4.1.13', weight: 5, isCritical: false },
          { id: 'ali-f-023', sectionId: 'sec-ali-fed-01', order: 23, description: 'No caso de controle químico de pragas, comprovante de execução do serviço por empresa credenciada ao órgão ambiental estadual competente.', legislation: 'RDC 216/2004 item 4.1.13', weight: 5, isCritical: false },
          { id: 'ali-f-024', sectionId: 'sec-ali-fed-01', order: 24, description: 'Produtos químicos utilizados no controle de roedores ficam protegidos.', legislation: 'RDC 216/2004 item 4.1.13', weight: 10, isCritical: true },
          { id: 'ali-f-025', sectionId: 'sec-ali-fed-01', order: 25, description: 'Sistema de abastecimento ligado à rede pública, ou fonte alternativa com documentação de potabilidade da água.', legislation: 'RDC 216/2004 item 4.1.14', weight: 5, isCritical: false },
          { id: 'ali-f-026', sectionId: 'sec-ali-fed-01', order: 26, description: 'Reservatório de água acessível, dotado de tampas, em satisfatória condição de uso, livre de vazamentos, infiltrações e descascamentos.', legislation: 'RDC 216/2004 item 4.1.14', weight: 10, isCritical: true },
          { id: 'ali-f-027', sectionId: 'sec-ali-fed-01', order: 27, description: 'Gelo produzido com água potável, fabricado, manipulado e estocado sob condições sanitárias satisfatórias. Quando industrializado, embalado e devidamente rotulado.', legislation: 'RDC 216/2004 item 4.1.14', weight: 10, isCritical: true },
          { id: 'ali-f-028', sectionId: 'sec-ali-fed-01', order: 28, description: 'Recipientes para coleta de resíduos com tampas acionadas sem contato manual, devidamente identificados e higienizados; uso de sacos de lixo apropriados.', legislation: 'RDC 216/2004 item 4.1.15', weight: 5, isCritical: false },
          { id: 'ali-f-029', sectionId: 'sec-ali-fed-01', order: 29, description: 'Retirada frequente dos resíduos da área de processamento, mantidos em local fechado e isolados das áreas de preparação e armazenamento.', legislation: 'RDC 216/2004 item 4.1.15', weight: 10, isCritical: true },
          { id: 'ali-f-030', sectionId: 'sec-ali-fed-01', order: 30, description: 'Caixas de gordura e de esgoto em adequado estado de conservação e funcionamento, localizadas fora das áreas de preparação e armazenamento.', legislation: 'RDC 216/2004 item 4.1.16', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 2 ────────────────────────────────────────
      {
        id: 'sec-ali-fed-02',
        title: 'Equipamentos, Móveis e Utensílios',
        order: 2,
        items: [
          { id: 'ali-f-031', sectionId: 'sec-ali-fed-02', order: 1, description: 'Equipamentos suficientes ao processo de trabalho, em bom estado de conservação e funcionamento, dispostos de forma a permitir fácil acesso e higienização adequada.', legislation: 'RDC 216/2004 item 4.2.1', weight: 5, isCritical: false },
          { id: 'ali-f-032', sectionId: 'sec-ali-fed-02', order: 2, description: 'Superfícies em contato com alimentos lisas, íntegras, impermeáveis, resistentes à corrosão, de fácil higienização, de material não contaminante e em adequado estado de conservação.', legislation: 'RDC 216/2004 item 4.2.1', weight: 5, isCritical: false },
          { id: 'ali-f-033', sectionId: 'sec-ali-fed-02', order: 3, description: 'Equipamentos de conservação dos alimentos (refrigeradores, congeladores, câmaras frigoríficas) e de processamento térmico em adequado funcionamento.', legislation: 'RDC 216/2004 item 4.2.1', weight: 10, isCritical: true },
          { id: 'ali-f-034', sectionId: 'sec-ali-fed-02', order: 4, description: 'Câmaras frias com dispositivo que possibilite abertura das portas pelo interior, alarme ou sistema de comunicação que possa ser acionado em caso de emergência.', legislation: 'RDC 216/2004 item 4.2.1', weight: 5, isCritical: false },
          { id: 'ali-f-035', sectionId: 'sec-ali-fed-02', order: 5, description: 'Móveis em número suficiente, de material apropriado, resistentes, impermeáveis, em adequado estado de conservação, com superfícies lisas e íntegras, sem rugosidades e frestas.', legislation: 'RDC 216/2004 item 4.2.2', weight: 5, isCritical: false },
          { id: 'ali-f-036', sectionId: 'sec-ali-fed-02', order: 6, description: 'Utensílios de material não contaminante, resistentes à corrosão, de fácil higienização, em adequado estado de conservação, em número suficiente e armazenados em local apropriado.', legislation: 'RDC 216/2004 item 4.2.3', weight: 5, isCritical: false },
          { id: 'ali-f-037', sectionId: 'sec-ali-fed-02', order: 7, description: 'Superfícies de corte constituídas por material atóxico e de fácil higienização.', legislation: 'RDC 216/2004 item 4.2.3', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 3 ────────────────────────────────────────
      {
        id: 'sec-ali-fed-03',
        title: 'Higienização',
        order: 3,
        items: [
          { id: 'ali-f-038', sectionId: 'sec-ali-fed-03', order: 1, description: 'Produtos de higienização disponíveis e regularizados pelo Ministério da Saúde, armazenados em local adequado separado de alimentos. Utensílios disponíveis, adequados e em bom estado.', legislation: 'RDC 216/2004 item 4.3.1', weight: 5, isCritical: false },
          { id: 'ali-f-039', sectionId: 'sec-ali-fed-03', order: 2, description: 'Não são utilizados panos convencionais (panos de prato) para secagem das mãos e utensílios.', legislation: 'RDC 216/2004 item 4.3.1', weight: 5, isCritical: false },
          { id: 'ali-f-040', sectionId: 'sec-ali-fed-03', order: 3, description: 'Utensílios diferentes daqueles usados para a higienização de móveis e equipamentos.', legislation: 'RDC 216/2004 item 4.3.1', weight: 5, isCritical: false },
          { id: 'ali-f-041', sectionId: 'sec-ali-fed-03', order: 4, description: 'Possui água corrente em quantidade suficiente para higienização de equipamentos e utensílios.', legislation: 'RDC 216/2004 item 4.3.2', weight: 10, isCritical: true },
          { id: 'ali-f-042', sectionId: 'sec-ali-fed-03', order: 5, description: 'Frequência de higienização das instalações adequada.', legislation: 'RDC 216/2004 item 4.3.2', weight: 10, isCritical: true },
          { id: 'ali-f-043', sectionId: 'sec-ali-fed-03', order: 6, description: 'Bancadas, móveis, equipamentos e utensílios higienizados adequadamente, sem acúmulo de sujidades, gordura ou resíduos, antes das atividades e após o término do trabalho.', legislation: 'RDC 216/2004 item 4.3.3', weight: 10, isCritical: true },
          { id: 'ali-f-044', sectionId: 'sec-ali-fed-03', order: 7, description: 'Não são utilizadas escovas de metal, lã de aço ou outros materiais abrasivos na limpeza de equipamentos e utensílios.', legislation: 'RDC 216/2004 item 4.3.3', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 4 ────────────────────────────────────────
      {
        id: 'sec-ali-fed-04',
        title: 'Manipuladores',
        order: 4,
        items: [
          { id: 'ali-f-045', sectionId: 'sec-ali-fed-04', order: 1, description: 'Utilização de uniforme de trabalho adequado à atividade, de cor clara, exclusivo para a área de produção.', legislation: 'RDC 216/2004 item 4.4.1', weight: 5, isCritical: false },
          { id: 'ali-f-046', sectionId: 'sec-ali-fed-04', order: 2, description: 'Uniformes limpos e em adequado estado de conservação, com sapatos fechados e adequados à função.', legislation: 'RDC 216/2004 item 4.4.1', weight: 10, isCritical: true },
          { id: 'ali-f-047', sectionId: 'sec-ali-fed-04', order: 3, description: 'Asseio pessoal: mãos limpas, unhas curtas, sem esmalte, sem adornos (anéis, pulseiras, brincos, etc.); manipuladores barbeados ou com proteção e cabelos protegidos com touca.', legislation: 'RDC 216/2004 item 4.4.1', weight: 10, isCritical: true },
          { id: 'ali-f-048', sectionId: 'sec-ali-fed-04', order: 4, description: 'Manipuladores evitam comportamentos incorretos (fumar, tossir sobre os alimentos, cuspir, manipular dinheiro, usar celular) durante a manipulação.', legislation: 'RDC 216/2004 item 4.4.1', weight: 10, isCritical: true },
          { id: 'ali-f-049', sectionId: 'sec-ali-fed-04', order: 5, description: 'Lavagem cuidadosa das mãos ao início do trabalho, após qualquer interrupção e depois do uso de sanitários.', legislation: 'RDC 216/2004 item 4.4.1', weight: 10, isCritical: true },
          { id: 'ali-f-050', sectionId: 'sec-ali-fed-04', order: 6, description: 'Manipuladores são afastados quando apresentam afecções cutâneas, feridas e supurações; sintomas e infecções respiratórias, gastrointestinais e oculares.', legislation: 'RDC 216/2004 item 4.4.1', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 5 ────────────────────────────────────────
      {
        id: 'sec-ali-fed-05',
        title: 'Recepção de Matérias-Primas e Ingredientes',
        order: 5,
        items: [
          { id: 'ali-f-051', sectionId: 'sec-ali-fed-05', order: 1, description: 'Matérias-primas, ingredientes e embalagens inspecionados na recepção (integridade, validade, temperatura). Embalagens secundárias retiradas e produtos reprovados devolvidos imediatamente.', legislation: 'RDC 216/2004 item 4.5.1', weight: 5, isCritical: false },
          { id: 'ali-f-052', sectionId: 'sec-ali-fed-05', order: 2, description: 'Transporte das matérias-primas e ingredientes realizado em condições adequadas de higiene e conservação.', legislation: 'RDC 216/2004 item 4.5.1', weight: 10, isCritical: true },
          { id: 'ali-f-053', sectionId: 'sec-ali-fed-05', order: 3, description: 'Rótulos da matéria-prima e ingredientes atendem à legislação.', legislation: 'RDC 216/2004 item 4.5.1', weight: 10, isCritical: true },
          { id: 'ali-f-054', sectionId: 'sec-ali-fed-05', order: 4, description: 'Produtos de origem animal armazenados e/ou utilizados são provenientes de estabelecimentos devidamente registrados no órgão competente (SIF/SIE/SIM).', legislation: 'RDC 216/2004 item 4.5.1; Decreto 9.013/2017 RIISPOA', weight: 10, isCritical: true },
          { id: 'ali-f-055', sectionId: 'sec-ali-fed-05', order: 5, description: 'Matérias-primas fracionadas adequadamente acondicionadas e identificadas com: designação do produto, data de fracionamento e prazo de validade após abertura.', legislation: 'RDC 216/2004 item 4.5.1', weight: 10, isCritical: true },
          { id: 'ali-f-056', sectionId: 'sec-ali-fed-05', order: 6, description: 'Matérias-primas e ingredientes com características sensoriais adequadas (textura, odor, cor) e prazo de validade observado com critério PVPS (primeiro que vence, primeiro que sai).', legislation: 'RDC 216/2004 item 4.5.1', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 6 ────────────────────────────────────────
      {
        id: 'sec-ali-fed-06',
        title: 'Armazenamento',
        order: 6,
        items: [
          { id: 'ali-f-057', sectionId: 'sec-ali-fed-06', order: 1, description: 'Armazenamento em local adequado e organizado, sobre estrados ou paletes distantes do piso, afastados das paredes e do teto, permitindo higienização, iluminação e circulação de ar. Estrados de material liso, resistente, impermeável e lavável.', legislation: 'RDC 216/2004 item 4.5.2', weight: 5, isCritical: false },
          { id: 'ali-f-058', sectionId: 'sec-ali-fed-06', order: 2, description: 'Rede de frio adequada ao volume e aos diferentes tipos de matérias-primas e ingredientes.', legislation: 'RDC 216/2004 item 4.5.2', weight: 5, isCritical: false },
          { id: 'ali-f-059', sectionId: 'sec-ali-fed-06', order: 3, description: 'Produtos armazenados separados por gênero, protegidos e identificados.', legislation: 'RDC 216/2004 item 4.5.2', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 7 ────────────────────────────────────────
      {
        id: 'sec-ali-fed-07',
        title: 'Produção e Fluxo de Alimentos',
        order: 7,
        items: [
          { id: 'ali-f-060', sectionId: 'sec-ali-fed-07', order: 1,  description: 'Fluxo de produção ordenado, linear e sem cruzamento, com locais para pré-preparo ("área suja") isolados da área de preparo por barreira física ou técnica.', legislation: 'RDC 216/2004 item 4.5.3', weight: 10, isCritical: true },
          { id: 'ali-f-061', sectionId: 'sec-ali-fed-07', order: 2,  description: 'Na manipulação de produto de origem animal em temperatura ambiente, respeita-se o prazo máximo de 30 minutos, ou até 2h em temperatura climatizada entre 12°C e 18°C.', legislation: 'RDC 216/2004 item 4.5.3', weight: 5, isCritical: false },
          { id: 'ali-f-062', sectionId: 'sec-ali-fed-07', order: 3,  description: 'Matérias-primas e ingredientes perecíveis expostos à temperatura ambiente somente pelo tempo mínimo necessário para preparação.', legislation: 'RDC 216/2004 item 4.5.3', weight: 5, isCritical: false },
          { id: 'ali-f-063', sectionId: 'sec-ali-fed-07', order: 4,  description: 'Evita-se o contato direto ou indireto entre alimentos crus, semipreparados e prontos para o consumo.', legislation: 'RDC 216/2004 item 4.5.3', weight: 10, isCritical: true },
          { id: 'ali-f-064', sectionId: 'sec-ali-fed-07', order: 5,  description: 'Funcionários que manipulam alimentos crus higienizam as mãos antes de manusear alimentos preparados.', legislation: 'RDC 216/2004 item 4.5.3', weight: 10, isCritical: true },
          { id: 'ali-f-065', sectionId: 'sec-ali-fed-07', order: 6,  description: 'O tratamento térmico garante que o centro geométrico do alimento atinja mínimo 70°C por 2 min, ou 74°C em todas as partes, ou combinação equivalente de tempo/temperatura.', legislation: 'RDC 216/2004 item 4.5.3', weight: 5, isCritical: false },
          { id: 'ali-f-066', sectionId: 'sec-ali-fed-07', order: 7,  description: 'A eficácia do tratamento térmico é avaliada pela verificação de temperatura e tempo, além da mudança na textura e cor na parte central do alimento.', legislation: 'RDC 216/2004 item 4.5.3', weight: 5, isCritical: false },
          { id: 'ali-f-067', sectionId: 'sec-ali-fed-07', order: 8,  description: 'Óleos e gorduras aquecidos a temperaturas não superiores a 180°C; substituídos imediatamente ao apresentar alterações físico-químicas ou sensoriais.', legislation: 'RDC 216/2004 item 4.5.3', weight: 5, isCritical: false },
          { id: 'ali-f-068', sectionId: 'sec-ali-fed-07', order: 9,  description: 'Descongelamento efetuado sob refrigeração a temperatura inferior a 5°C ou em micro-ondas quando o alimento for imediatamente submetido à cocção.', legislation: 'RDC 216/2004 item 4.5.3', weight: 5, isCritical: false },
          { id: 'ali-f-069', sectionId: 'sec-ali-fed-07', order: 10, description: 'Alimentos descongelados mantidos sob refrigeração se não forem imediatamente utilizados. Não são recongelados.', legislation: 'RDC 216/2004 item 4.5.3', weight: 10, isCritical: true },
          { id: 'ali-f-070', sectionId: 'sec-ali-fed-07', order: 11, description: 'Hortifrutícolas consumidos crus submetidos a processo de higienização com produto registrado no Ministério da Saúde.', legislation: 'RDC 216/2004 item 4.5.3; RDC 218/2005', weight: 10, isCritical: true },
          { id: 'ali-f-071', sectionId: 'sec-ali-fed-07', order: 12, description: 'Temperatura do alimento preparado durante resfriamento reduzida de 60°C a 10°C em até duas horas.', legislation: 'RDC 216/2004 item 4.5.3', weight: 5, isCritical: false },
          { id: 'ali-f-072', sectionId: 'sec-ali-fed-07', order: 13, description: 'Após cocção, alimentos mantidos a temperatura superior a 60°C por no máximo 6 horas.', legislation: 'RDC 216/2004 item 4.5.3', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 8 ────────────────────────────────────────
      {
        id: 'sec-ali-fed-08',
        title: 'Rotulagem e Armazenamento pós-preparo',
        order: 8,
        items: [
          { id: 'ali-f-073', sectionId: 'sec-ali-fed-08', order: 1, description: 'Produtos de fabricação própria adequadamente acondicionados e identificados com: designação do produto, data de fabricação e prazo de validade.', legislation: 'RDC 216/2004 item 4.5.4', weight: 10, isCritical: true },
          { id: 'ali-f-074', sectionId: 'sec-ali-fed-08', order: 2, description: 'Após cocção, alimento conservado sob refrigeração a temperaturas inferiores a 5°C, ou congelado à temperatura igual ou inferior a -18°C.', legislation: 'RDC 216/2004 item 4.5.4', weight: 10, isCritical: true },
          { id: 'ali-f-075', sectionId: 'sec-ali-fed-08', order: 3, description: 'Alimentos preparados conservados a 4°C ou inferior possuem prazo máximo de consumo de 5 dias.', legislation: 'RDC 216/2004 item 4.5.4', weight: 5, isCritical: false },
          { id: 'ali-f-076', sectionId: 'sec-ali-fed-08', order: 4, description: 'Embalagens prontas para uso dispostas em local próprio, protegidas e em número suficiente apenas para o uso diário.', legislation: 'RDC 216/2004 item 4.5.4', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 9 ────────────────────────────────────────
      {
        id: 'sec-ali-fed-09',
        title: 'Exposição ao Consumo',
        order: 9,
        items: [
          { id: 'ali-f-077', sectionId: 'sec-ali-fed-09', order: 1, description: 'Equipamento de exposição do alimento preparado dispõe de barreiras de proteção que previnam contaminação pelo consumidor.', legislation: 'RDC 216/2004 item 4.5.5', weight: 5, isCritical: false },
          { id: 'ali-f-078', sectionId: 'sec-ali-fed-09', order: 2, description: 'Equipamentos, móveis e utensílios compatíveis com as atividades, em número suficiente e em adequado estado de conservação e higiene.', legislation: 'RDC 216/2004 item 4.5.5', weight: 10, isCritical: true },
          { id: 'ali-f-079', sectionId: 'sec-ali-fed-09', order: 3, description: 'Manipuladores adotam procedimentos que minimizam o risco de contaminação (antissepsia das mãos ou uso de utensílios/luvas descartáveis).', legislation: 'RDC 216/2004 item 4.5.5', weight: 10, isCritical: true },
          { id: 'ali-f-080', sectionId: 'sec-ali-fed-09', order: 4, description: 'Alimentos quentes expostos a temperatura superior a 60°C por no máximo 6 horas, ou abaixo de 60°C por prazo máximo de 1 hora.', legislation: 'RDC 216/2004 item 4.5.5', weight: 10, isCritical: true },
          { id: 'ali-f-081', sectionId: 'sec-ali-fed-09', order: 5, description: 'Alimentos resfriados expostos a temperatura de no máximo 5°C.', legislation: 'RDC 216/2004 item 4.5.5', weight: 10, isCritical: true },
          { id: 'ali-f-082', sectionId: 'sec-ali-fed-09', order: 6, description: 'Utensílios de consumação (pratos, copos, talheres) devidamente higienizados e armazenados em local protegido.', legislation: 'RDC 216/2004 item 4.5.5', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 10 ───────────────────────────────────────
      {
        id: 'sec-ali-fed-10',
        title: 'Transporte de Alimentos',
        order: 10,
        items: [
          { id: 'ali-f-083', sectionId: 'sec-ali-fed-10', order: 1, description: 'Armazenamento e transporte em condições de tempo e temperatura que não comprometam a qualidade higiênico-sanitária, com controle/registro de temperaturas.', legislation: 'RDC 216/2004 item 4.5.6', weight: 5, isCritical: false },
          { id: 'ali-f-084', sectionId: 'sec-ali-fed-10', order: 2, description: 'Veículos utilizados para transporte de alimentos devidamente licenciados pelo órgão competente de vigilância sanitária.', legislation: 'RDC 216/2004 item 4.5.6', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 11 ───────────────────────────────────────
      {
        id: 'sec-ali-fed-11',
        title: 'Documentação e Registros',
        order: 11,
        items: [
          { id: 'ali-f-085', sectionId: 'sec-ali-fed-11', order: 1,  description: 'Possui e cumpre o Manual de Boas Práticas específico para a empresa.', legislation: 'RDC 216/2004 item 4.6.1', weight: 5, isCritical: false },
          { id: 'ali-f-086', sectionId: 'sec-ali-fed-11', order: 2,  description: 'Possui e cumpre os Procedimentos Operacionais Padronizados (POP): higienização de instalações, móveis e utensílios; controle integrado de vetores e pragas; higienização dos reservatórios; higiene e saúde dos manipuladores.', legislation: 'RDC 216/2004 item 4.6.1', weight: 5, isCritical: false },
          { id: 'ali-f-087', sectionId: 'sec-ali-fed-11', order: 3,  description: 'Possui planilhas de controle de temperatura de câmaras, balcões, congeladores e equipamentos térmicos.', legislation: 'RDC 216/2004 item 4.6.1', weight: 5, isCritical: false },
          { id: 'ali-f-088', sectionId: 'sec-ali-fed-11', order: 4,  description: 'Possui planilhas de registro da troca periódica dos elementos filtrantes (filtros, bebedouros, máquina de gelo, etc.).', legislation: 'RDC 216/2004 item 4.6.1', weight: 5, isCritical: false },
          { id: 'ali-f-089', sectionId: 'sec-ali-fed-11', order: 5,  description: 'Possui planilhas de registro de tempo × temperatura dos balcões expositores.', legislation: 'RDC 216/2004 item 4.6.1', weight: 5, isCritical: false },
          { id: 'ali-f-090', sectionId: 'sec-ali-fed-11', order: 6,  description: 'Possui planilhas de registro da recepção dos alimentos (condições do transporte, características sensoriais e temperatura).', legislation: 'RDC 216/2004 item 4.6.1', weight: 5, isCritical: false },
          { id: 'ali-f-091', sectionId: 'sec-ali-fed-11', order: 7,  description: 'Possui registros de manutenção preventiva dos equipamentos e calibração dos instrumentos de medição.', legislation: 'RDC 216/2004 item 4.6.1', weight: 5, isCritical: false },
          { id: 'ali-f-092', sectionId: 'sec-ali-fed-11', order: 8,  description: 'Possui registros de capacitação adequada e contínua dos manipuladores relacionados à higiene pessoal, boas práticas e uso de EPI.', legislation: 'RDC 216/2004 item 4.6.1', weight: 5, isCritical: false },
          { id: 'ali-f-093', sectionId: 'sec-ali-fed-11', order: 9,  description: 'Possui comprovante atualizado de higienização semestral do reservatório de água por empresa habilitada.', legislation: 'RDC 216/2004 item 4.6.2', weight: 10, isCritical: true },
          { id: 'ali-f-094', sectionId: 'sec-ali-fed-11', order: 10, description: 'Possui laudo de potabilidade da água, inclusive se de fonte alternativa (poço, mina ou caminhão pipa).', legislation: 'RDC 216/2004 item 4.6.2', weight: 5, isCritical: false },
          { id: 'ali-f-095', sectionId: 'sec-ali-fed-11', order: 11, description: 'Possui comprovante atualizado de execução do serviço de controle de pragas por empresa habilitada, informando produtos utilizados, métodos e registro no Ministério da Saúde.', legislation: 'RDC 216/2004 item 4.6.3', weight: 5, isCritical: false },
          { id: 'ali-f-096', sectionId: 'sec-ali-fed-11', order: 12, description: 'Possui contrato com empresa para destinação adequada do lixo comum e Programa de Gerenciamento de Resíduos.', legislation: 'RDC 216/2004 item 4.6.4', weight: 5, isCritical: false },
          { id: 'ali-f-097', sectionId: 'sec-ali-fed-11', order: 13, description: 'Responsável por todas as atividades com alimentos foi comprovadamente submetido a curso de capacitação com temas: contaminantes alimentares, DTAs, manipulação higiênica e boas práticas.', legislation: 'RDC 216/2004 item 4.7', weight: 5, isCritical: false },
        ],
      },
    ],
  },


  // ════════════════════════════════════════════════════════
  // TEMPLATE 2 — MUNICÍPIO DO RIO DE JANEIRO
  // ⚠️  USAR APENAS quando o estabelecimento for do RJ
  //
  // Contém TODOS os 97 itens federais (com referência
  // dupla: RDC 216/2004 + Portaria IVISA-RIO 002/2020)
  // MAIS 17 itens exclusivos do Município do RJ:
  //   • 5 embutidos nas seções 7, 9 e 11 (marcados com
  //     "EXCLUSIVO MUNICÍPIO DO RJ" na descrição)
  //   • 12 na Seção 12 (rj-exc-001 a rj-exc-012)
  // Total: 114 itens em 12 seções ← sempre > federal (97)
  // ════════════════════════════════════════════════════════
  {
    id: 'tpl-alimentos-rj-v1',
    name: 'Roteiro de Inspeção — Serviços de Alimentação (Município RJ)',
    category: 'alimentos',
    version: '2026-RJ',
    sections: [

      // ── SEÇÃO 1 (RJ) ───────────────────────────────────
      {
        id: 'sec-ali-rj-01',
        title: 'Edificação e Instalações',
        order: 1,
        items: [
          { id: 'rj-f-001', sectionId: 'sec-ali-rj-01', order: 1,  description: 'Áreas internas e externas livres de objetos em desuso ou estranhos ao ambiente; dependências sem presença de animais e não utilizadas como habitação ou dormitório. Vedado instalar área de armazenamento ou preparo ao ar livre ou sem cobertura e paredes rígidas.', legislation: 'RDC 216/2004 item 4.1.1; Portaria IVISA-RIO 002/2020, Arts. 33 e 28 §5º', weight: 5, isCritical: false },
          { id: 'rj-f-002', sectionId: 'sec-ali-rj-01', order: 2,  description: 'Piso de material liso, antiderrapante, resistente e de fácil higienização, em adequado estado de conservação, com inclinação em direção aos ralos com tampas escamoteáveis sifonadas. Proibido o uso de papelão, tapetes ou carpetes.', legislation: 'RDC 216/2004 item 4.1.2; Portaria IVISA-RIO 002/2020, Arts. 30 §2º e §4º', weight: 5, isCritical: false },
          { id: 'rj-f-003', sectionId: 'sec-ali-rj-01', order: 3,  description: 'Tetos, paredes e divisórias com revestimento liso, impermeável, lavável, de cor clara, íntegros, livres de rachaduras, descascamentos, bolores e infiltrações.', legislation: 'RDC 216/2004 item 4.1.3; Portaria IVISA-RIO 002/2020, Art. 30', weight: 5, isCritical: false },
          { id: 'rj-f-004', sectionId: 'sec-ali-rj-01', order: 4,  description: 'Portas com acabamento liso, ajustadas aos batentes, em adequado estado de conservação. Portas externas com fechamento automático e telas milimétricas removíveis.', legislation: 'RDC 216/2004 item 4.1.4; Portaria IVISA-RIO 002/2020, Art. 34', weight: 5, isCritical: false },
          { id: 'rj-f-005', sectionId: 'sec-ali-rj-01', order: 5,  description: 'Janelas e outras aberturas com superfície lisa, de fácil higienização, ajustadas aos batentes, com telas milimétricas removíveis e em adequado estado de conservação.', legislation: 'RDC 216/2004 item 4.1.5; Portaria IVISA-RIO 002/2020, Art. 34 §2º', weight: 5, isCritical: false },
          { id: 'rj-f-006', sectionId: 'sec-ali-rj-01', order: 6,  description: 'Escadas, elevadores de serviço, montacargas e estruturas auxiliares de material resistente, liso e impermeável, em adequado estado de conservação.', legislation: 'RDC 216/2004 item 4.1.6; Portaria IVISA-RIO 002/2020, Art. 28', weight: 5, isCritical: false },
          { id: 'rj-f-007', sectionId: 'sec-ali-rj-01', order: 7,  description: 'Iluminação suficiente e luminárias com proteção adequada contra queda acidental e explosão (exceto LED), em adequado estado. Vedada a instalação de armadilhas luminosas de eletrocussão de insetos.', legislation: 'RDC 216/2004 item 4.1.7; Portaria IVISA-RIO 002/2020, Art. 44 e Art. 28 §5º IV', weight: 5, isCritical: false },
          { id: 'rj-f-008', sectionId: 'sec-ali-rj-01', order: 8,  description: 'Instalações elétricas embutidas ou, quando exteriores, revestidas por tubulações isolantes e presas a paredes e tetos.', legislation: 'RDC 216/2004 item 4.1.8; Portaria IVISA-RIO 002/2020, Art. 35', weight: 5, isCritical: false },
          { id: 'rj-f-009', sectionId: 'sec-ali-rj-01', order: 9,  description: 'Sistema de climatização instalado com conforto térmico adequado, em bom estado de conservação e higiene. Equipamentos e filtros conservados; limpeza e troca de filtros registradas conforme Portaria MS 3.523/1998.', legislation: 'RDC 216/2004 item 4.1.9; Portaria IVISA-RIO 002/2020, Art. 40', weight: 5, isCritical: false },
          { id: 'rj-f-010', sectionId: 'sec-ali-rj-01', order: 10, description: 'O fluxo de ar NÃO incide diretamente sobre os alimentos.', legislation: 'RDC 216/2004 item 4.1.9; Portaria IVISA-RIO 002/2020, Art. 43', weight: 10, isCritical: true },
          { id: 'rj-f-011', sectionId: 'sec-ali-rj-01', order: 11, description: 'Pontos de cocção instalados sob coifa com sistema de exaustão mecânica suficientemente dimensionado abrangendo todos os equipamentos. Coifas, filtros e sistema de exaustão conservados com manutenção registrada.', legislation: 'RDC 216/2004 item 4.1.10; Portaria IVISA-RIO 002/2020, Arts. 40, 41 e 42', weight: 5, isCritical: false },
          { id: 'rj-f-012', sectionId: 'sec-ali-rj-01', order: 12, description: 'Instalações sanitárias sem comunicação direta com áreas de produção/manipulação/armazenamento de alimentos, com portas de fechamento automático e providas de papel higiênico.', legislation: 'RDC 216/2004 item 4.1.11; Portaria IVISA-RIO 002/2020, Art. 45', weight: 5, isCritical: false },
          { id: 'rj-f-013', sectionId: 'sec-ali-rj-01', order: 13, description: 'Sanitários com piso, paredes e teto liso, resistente e impermeável, dotados de ralo sifonado com tampa, ventilação e iluminação adequadas e telas nas aberturas.', legislation: 'RDC 216/2004 item 4.1.11; Portaria IVISA-RIO 002/2020, Art. 45 §1º', weight: 5, isCritical: false },
          { id: 'rj-f-014', sectionId: 'sec-ali-rj-01', order: 14, description: 'Vasos sanitários e mictórios com descarga, íntegros, em nº suficiente e em bom estado de funcionamento. Vasos com tampo e sobretampo.', legislation: 'RDC 216/2004 item 4.1.11; Portaria IVISA-RIO 002/2020, Art. 45 §3º a)', weight: 5, isCritical: false },
          { id: 'rj-f-015', sectionId: 'sec-ali-rj-01', order: 15, description: 'Sanitários com pia, sabonete líquido antisséptico e toalha de papel não reciclado. Coletor de papel com tampa acionada sem contato manual.', legislation: 'RDC 216/2004 item 4.1.11; Portaria IVISA-RIO 002/2020, Art. 45 §3º', weight: 10, isCritical: true },
          { id: 'rj-f-016', sectionId: 'sec-ali-rj-01', order: 16, description: 'Sanitários com avisos sobre procedimentos para lavagem das mãos.', legislation: 'RDC 216/2004 item 4.1.11; Portaria IVISA-RIO 002/2020, Art. 6 §2º', weight: 5, isCritical: false },
          { id: 'rj-f-017', sectionId: 'sec-ali-rj-01', order: 17, description: 'Sanitários com lixeiras com tampas sem acionamento manual, revestidas com sacos apropriados e coleta frequente dos resíduos.', legislation: 'RDC 216/2004 item 4.1.11; Portaria IVISA-RIO 002/2020, Art. 45 §3º f)', weight: 5, isCritical: false },
          { id: 'rj-f-018', sectionId: 'sec-ali-rj-01', order: 18, description: 'Vestiários com armários organizados, em número suficiente e em bom estado de conservação.', legislation: 'RDC 216/2004 item 4.1.11; Portaria IVISA-RIO 002/2020, Art. 45', weight: 5, isCritical: false },
          { id: 'rj-f-019', sectionId: 'sec-ali-rj-01', order: 19, description: 'Lavatórios na área de produção adequados ao fluxo, dotados de sabonete líquido antisséptico, toalhas de papel não reciclado e lixeiras com tampas sem acionamento manual. Junto a cada lavatório: dispensador de sabonete + toalheiro + coletor com tampa.', legislation: 'RDC 216/2004 item 4.1.12; Portaria IVISA-RIO 002/2020, Art. 38 §1º', weight: 10, isCritical: true },
          { id: 'rj-f-020', sectionId: 'sec-ali-rj-01', order: 20, description: 'Avisos com procedimentos para lavagem das mãos afixados nos lavatórios da área de produção.', legislation: 'RDC 216/2004 item 4.1.12; Portaria IVISA-RIO 002/2020, Art. 6 §2º', weight: 5, isCritical: false },
          { id: 'rj-f-021', sectionId: 'sec-ali-rj-01', order: 21, description: 'Ausência de vetores e pragas urbanas ou seus vestígios.', legislation: 'RDC 216/2004 item 4.1.13; Portaria IVISA-RIO 002/2020, Art. 81', weight: 10, isCritical: true },
          { id: 'rj-f-022', sectionId: 'sec-ali-rj-01', order: 22, description: 'Medidas preventivas e corretivas adotadas para impedir a atração, abrigo, acesso e/ou proliferação de vetores e pragas urbanas.', legislation: 'RDC 216/2004 item 4.1.13; Portaria IVISA-RIO 002/2020, Art. 81', weight: 5, isCritical: false },
          { id: 'rj-f-023', sectionId: 'sec-ali-rj-01', order: 23, description: 'No caso de controle químico de pragas, comprovante de execução do serviço por empresa credenciada ao INEA (RJ), com produtos utilizados, métodos, registro MS e assinatura do RT.', legislation: 'RDC 216/2004 item 4.1.13; Portaria IVISA-RIO 002/2020, Art. 82; Decreto-Rio 45585/18 item 1.11.3', weight: 5, isCritical: false },
          { id: 'rj-f-024', sectionId: 'sec-ali-rj-01', order: 24, description: 'Produtos químicos utilizados no controle de roedores ficam protegidos.', legislation: 'RDC 216/2004 item 4.1.13; Decreto-Rio 45585/18 item 1.11.5', weight: 10, isCritical: true },
          { id: 'rj-f-025', sectionId: 'sec-ali-rj-01', order: 25, description: 'Sistema de abastecimento ligado à rede pública, ou fonte alternativa com documentação de potabilidade da água.', legislation: 'RDC 216/2004 item 4.1.14; Portaria IVISA-RIO 002/2020, Arts. 36 e 37', weight: 5, isCritical: false },
          { id: 'rj-f-026', sectionId: 'sec-ali-rj-01', order: 26, description: 'Reservatório de água acessível, dotado de tampas, em satisfatória condição de uso, livre de vazamentos, infiltrações e descascamentos.', legislation: 'RDC 216/2004 item 4.1.14; Portaria IVISA-RIO 002/2020, Art. 37', weight: 10, isCritical: true },
          { id: 'rj-f-027', sectionId: 'sec-ali-rj-01', order: 27, description: 'Gelo produzido com água potável, fabricado, manipulado e estocado sob condições sanitárias satisfatórias. Quando industrializado, embalado e devidamente rotulado. Filtro de água instalado nas áreas de preparo de bebidas, gelo e alimentos de consumo direto.', legislation: 'RDC 216/2004 item 4.1.14; Portaria IVISA-RIO 002/2020, Arts. 38 §3º e 37', weight: 10, isCritical: true },
          { id: 'rj-f-028', sectionId: 'sec-ali-rj-01', order: 28, description: 'Recipientes para coleta de resíduos com tampas acionadas sem contato manual, devidamente identificados e higienizados; uso de sacos de lixo apropriados.', legislation: 'RDC 216/2004 item 4.1.15; Portaria IVISA-RIO 002/2020, Art. 78', weight: 5, isCritical: false },
          { id: 'rj-f-029', sectionId: 'sec-ali-rj-01', order: 29, description: 'Retirada frequente dos resíduos da área de processamento, mantidos em local fechado e isolados das áreas de preparação e armazenamento.', legislation: 'RDC 216/2004 item 4.1.15; Portaria IVISA-RIO 002/2020, Art. 78', weight: 10, isCritical: true },
          { id: 'rj-f-030', sectionId: 'sec-ali-rj-01', order: 30, description: 'Caixas de gordura e de esgoto em adequado estado de conservação e funcionamento, localizadas fora das áreas de preparação e armazenamento.', legislation: 'RDC 216/2004 item 4.1.16; Portaria IVISA-RIO 002/2020, Art. 39', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 2 (RJ) ───────────────────────────────────
      {
        id: 'sec-ali-rj-02',
        title: 'Equipamentos, Móveis e Utensílios',
        order: 2,
        items: [
          { id: 'rj-f-031', sectionId: 'sec-ali-rj-02', order: 1, description: 'Equipamentos suficientes ao processo de trabalho, em bom estado de conservação e funcionamento, dispostos de forma a permitir fácil acesso e higienização adequada.', legislation: 'RDC 216/2004 item 4.2.1; Portaria IVISA-RIO 002/2020, Art. 32', weight: 5, isCritical: false },
          { id: 'rj-f-032', sectionId: 'sec-ali-rj-02', order: 2, description: 'Superfícies em contato com alimentos lisas, íntegras, impermeáveis, resistentes à corrosão, de fácil higienização, de material não contaminante. Vedado o uso de madeira ou material poroso.', legislation: 'RDC 216/2004 item 4.2.1; Portaria IVISA-RIO 002/2020, Art. 32 §3º', weight: 5, isCritical: false },
          { id: 'rj-f-033', sectionId: 'sec-ali-rj-02', order: 3, description: 'Equipamentos frigoríficos em adequado funcionamento. Câmaras frias com: interruptor externo de segurança, termômetro de leitura externa calibrado, dispositivo de abertura interna, prateleiras impermeáveis e laváveis, iluminação interna protegida.', legislation: 'RDC 216/2004 item 4.2.1; Portaria IVISA-RIO 002/2020, Art. 31 §1º', weight: 10, isCritical: true },
          { id: 'rj-f-034', sectionId: 'sec-ali-rj-02', order: 4, description: 'Câmaras frias com dispositivo que possibilite abertura das portas pelo interior e alarme ou sistema de comunicação acionável em caso de emergência.', legislation: 'RDC 216/2004 item 4.2.1; Portaria IVISA-RIO 002/2020, Art. 31 §1º III', weight: 5, isCritical: false },
          { id: 'rj-f-035', sectionId: 'sec-ali-rj-02', order: 5, description: 'Móveis em número suficiente, de material liso, resistente, impermeável e lavável, em adequado estado de conservação, sem rugosidades e frestas.', legislation: 'RDC 216/2004 item 4.2.2; Portaria IVISA-RIO 002/2020, Art. 32', weight: 5, isCritical: false },
          { id: 'rj-f-036', sectionId: 'sec-ali-rj-02', order: 6, description: 'Utensílios de material não contaminante, resistentes à corrosão, de fácil higienização, em adequado estado de conservação e armazenados em local apropriado. Cubas de aço inoxidável com dispositivo retentor de resíduos.', legislation: 'RDC 216/2004 item 4.2.3; Portaria IVISA-RIO 002/2020, Art. 32 §2º', weight: 5, isCritical: false },
          { id: 'rj-f-037', sectionId: 'sec-ali-rj-02', order: 7, description: 'Superfícies de corte constituídas por material atóxico e de fácil higienização.', legislation: 'RDC 216/2004 item 4.2.3; Portaria IVISA-RIO 002/2020, Art. 32', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 3 (RJ) ───────────────────────────────────
      {
        id: 'sec-ali-rj-03',
        title: 'Higienização',
        order: 3,
        items: [
          { id: 'rj-f-038', sectionId: 'sec-ali-rj-03', order: 1, description: 'Produtos de higienização disponíveis e regularizados pelo Ministério da Saúde, armazenados em local adequado separado de alimentos. Identificados; diluição e tempo de contato conforme fabricante.', legislation: 'RDC 216/2004 item 4.3.1; Portaria IVISA-RIO 002/2020, Art. 48', weight: 5, isCritical: false },
          { id: 'rj-f-039', sectionId: 'sec-ali-rj-03', order: 2, description: 'Não são utilizados panos convencionais (panos de prato) para secagem das mãos e utensílios. Panos tipo multiuso para bancadas descartados após cada uso.', legislation: 'RDC 216/2004 item 4.3.1; Portaria IVISA-RIO 002/2020, Art. 50', weight: 5, isCritical: false },
          { id: 'rj-f-040', sectionId: 'sec-ali-rj-03', order: 3, description: 'Utensílios diferentes daqueles usados para a higienização de móveis e equipamentos.', legislation: 'RDC 216/2004 item 4.3.1; Portaria IVISA-RIO 002/2020, Art. 50 §1º', weight: 5, isCritical: false },
          { id: 'rj-f-041', sectionId: 'sec-ali-rj-03', order: 4, description: 'Possui água corrente em quantidade suficiente para higienização de equipamentos e utensílios.', legislation: 'RDC 216/2004 item 4.3.2; Portaria IVISA-RIO 002/2020, Art. 47', weight: 10, isCritical: true },
          { id: 'rj-f-042', sectionId: 'sec-ali-rj-03', order: 5, description: 'Frequência de higienização das instalações adequada. As operações de higienização são registradas rotineiramente.', legislation: 'RDC 216/2004 item 4.3.2; Portaria IVISA-RIO 002/2020, Art. 47 §2º e §3º', weight: 10, isCritical: true },
          { id: 'rj-f-043', sectionId: 'sec-ali-rj-03', order: 6, description: 'Bancadas, móveis, equipamentos e utensílios higienizados adequadamente, sem acúmulo de sujidades, gordura ou resíduos, antes das atividades e após o término do trabalho.', legislation: 'RDC 216/2004 item 4.3.3; Portaria IVISA-RIO 002/2020, Art. 47 §2º', weight: 10, isCritical: true },
          { id: 'rj-f-044', sectionId: 'sec-ali-rj-03', order: 7, description: 'Não são utilizadas escovas de metal, lã de aço ou outros materiais abrasivos na limpeza de equipamentos e utensílios.', legislation: 'RDC 216/2004 item 4.3.3; Decreto-Rio 45585/18 item 3.3.4', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 4 (RJ) ───────────────────────────────────
      {
        id: 'sec-ali-rj-04',
        title: 'Manipuladores',
        order: 4,
        items: [
          { id: 'rj-f-045', sectionId: 'sec-ali-rj-04', order: 1, description: 'Uniforme de trabalho de cor clara, exclusivo para a área de produção: camisa de manga, calça comprida, avental impermeável, calçado fechado impermeável antiderrapante e protetor para o cabelo. Uniformes usados somente no interior da área de manipulação.', legislation: 'RDC 216/2004 item 4.4.1; Portaria IVISA-RIO 002/2020, Art. 5 §1º', weight: 5, isCritical: false },
          { id: 'rj-f-046', sectionId: 'sec-ali-rj-04', order: 2, description: 'Uniformes limpos e em adequado estado de conservação, com sapatos fechados e adequados à função.', legislation: 'RDC 216/2004 item 4.4.1; Portaria IVISA-RIO 002/2020, Art. 5', weight: 10, isCritical: true },
          { id: 'rj-f-047', sectionId: 'sec-ali-rj-04', order: 3, description: 'Asseio pessoal: banho diário, barba raspada ou protegida, unhas curtas, limpas e sem esmalte, ausência de maquiagem, ausência de adornos (anéis, pulseiras, brincos, piercing visível, etc.), cabelos totalmente protegidos.', legislation: 'RDC 216/2004 item 4.4.1; Portaria IVISA-RIO 002/2020, Arts. 4 e 5 §4º', weight: 10, isCritical: true },
          { id: 'rj-f-048', sectionId: 'sec-ali-rj-04', order: 4, description: 'Manipuladores evitam comportamentos incorretos: fumar, tossir ou cuspir sobre alimentos, manipular dinheiro, usar celular, mascar goma, enxugar suor com as mãos ou peças de uniforme, varrer a seco.', legislation: 'RDC 216/2004 item 4.4.1; Portaria IVISA-RIO 002/2020, Art. 46', weight: 10, isCritical: true },
          { id: 'rj-f-049', sectionId: 'sec-ali-rj-04', order: 5, description: 'Lavagem cuidadosa das mãos ao início do trabalho, após qualquer interrupção e depois do uso de sanitários. Procedimento correto: molhar, sabonete antisséptico, esfregar por 3 min, enxaguar, secar com papel toalha.', legislation: 'RDC 216/2004 item 4.4.1; Portaria IVISA-RIO 002/2020, Art. 6 §3º', weight: 10, isCritical: true },
          { id: 'rj-f-050', sectionId: 'sec-ali-rj-04', order: 6, description: 'Manipuladores afastados quando apresentam: patologias/lesões de pele, feridas nas mãos, infecções oculares, pulmonares, orofaríngeas ou gastrintestinais. Atestado de saúde ocupacional admissional e periódico comprovado.', legislation: 'RDC 216/2004 item 4.4.1; Portaria IVISA-RIO 002/2020, Art. 4 §1º, §2º e §3º', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 5 (RJ) ───────────────────────────────────
      {
        id: 'sec-ali-rj-05',
        title: 'Recepção de Matérias-Primas e Ingredientes',
        order: 5,
        items: [
          { id: 'rj-f-051', sectionId: 'sec-ali-rj-05', order: 1, description: 'Matérias-primas, ingredientes e embalagens inspecionados na recepção (integridade, validade, temperatura). Embalagens secundárias (caixas de papelão, madeira) retiradas antes do armazenamento. Produtos reprovados devolvidos imediatamente.', legislation: 'RDC 216/2004 item 4.5.1; Portaria IVISA-RIO 002/2020, Arts. 52 e 53', weight: 5, isCritical: false },
          { id: 'rj-f-052', sectionId: 'sec-ali-rj-05', order: 2, description: 'Transporte das matérias-primas e ingredientes realizado em condições adequadas de higiene e conservação. Veículos exclusivos para alimentos e licenciados pelo órgão de VISA.', legislation: 'RDC 216/2004 item 4.5.1; Portaria IVISA-RIO 002/2020, Art. 77', weight: 10, isCritical: true },
          { id: 'rj-f-053', sectionId: 'sec-ali-rj-05', order: 3, description: 'Rótulos da matéria-prima e ingredientes atendem à legislação vigente.', legislation: 'RDC 216/2004 item 4.5.1; Portaria IVISA-RIO 002/2020, Arts. 20 a 22', weight: 10, isCritical: true },
          { id: 'rj-f-054', sectionId: 'sec-ali-rj-05', order: 4, description: 'Produtos de origem animal armazenados e/ou utilizados são provenientes de estabelecimentos devidamente registrados no órgão competente (SIF/SIE/SIM).', legislation: 'RDC 216/2004 item 4.5.1; Portaria IVISA-RIO 002/2020, Art. 12; Decreto 9.013/2017 RIISPOA', weight: 10, isCritical: true },
          { id: 'rj-f-055', sectionId: 'sec-ali-rj-05', order: 5, description: 'Matérias-primas fracionadas adequadamente acondicionadas e identificadas com: designação do produto, data de fracionamento e prazo de validade após abertura.', legislation: 'RDC 216/2004 item 4.5.1; Portaria IVISA-RIO 002/2020, Art. 56 §1º', weight: 10, isCritical: true },
          { id: 'rj-f-056', sectionId: 'sec-ali-rj-05', order: 6, description: 'Matérias-primas e ingredientes com características sensoriais adequadas (textura, odor, cor) e prazo de validade observado com critério PVPS (primeiro que vence, primeiro que sai).', legislation: 'RDC 216/2004 item 4.5.1; Portaria IVISA-RIO 002/2020, Art. 14', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 6 (RJ) ───────────────────────────────────
      {
        id: 'sec-ali-rj-06',
        title: 'Armazenamento',
        order: 6,
        items: [
          { id: 'rj-f-057', sectionId: 'sec-ali-rj-06', order: 1, description: 'Armazenamento organizado, sobre estrados/prateleiras, afastados das paredes (10 cm), do chão (25 cm) e do teto (60 cm). Estrados de material liso, resistente, impermeável e lavável.', legislation: 'RDC 216/2004 item 4.5.2; Portaria IVISA-RIO 002/2020, Art. 56', weight: 5, isCritical: false },
          { id: 'rj-f-058', sectionId: 'sec-ali-rj-06', order: 2, description: 'Rede de frio adequada ao volume e diferentes tipos. Temperaturas obrigatórias: estoque seco ≤25°C; carnes ≤5°C; pescado ≤4°C; embutidos/laticínios ≤5°C; frutas/legumes/ovos ≤10°C; congelados -12°C a -18°C.', legislation: 'RDC 216/2004 item 4.5.2; Portaria IVISA-RIO 002/2020, Art. 54 §1º', weight: 5, isCritical: false },
          { id: 'rj-f-059', sectionId: 'sec-ali-rj-06', order: 3, description: 'Produtos armazenados separados por gênero, protegidos e identificados. No interior das câmaras: industrializados embaixo, crus nas prateleiras centrais, alimentos preparados nas prateleiras superiores.', legislation: 'RDC 216/2004 item 4.5.2; Portaria IVISA-RIO 002/2020, Art. 54 §3º', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 7 (RJ) ───────────────────────────────────
      {
        id: 'sec-ali-rj-07',
        title: 'Produção e Fluxo de Alimentos',
        order: 7,
        items: [
          { id: 'rj-f-060', sectionId: 'sec-ali-rj-07', order: 1,  description: 'Fluxo de produção ordenado, linear e sem cruzamento, com locais para pré-preparo ("área suja") isolados da área de preparo por barreira física ou técnica.', legislation: 'RDC 216/2004 item 4.5.3; Portaria IVISA-RIO 002/2020, Art. 49', weight: 10, isCritical: true },
          { id: 'rj-f-061', sectionId: 'sec-ali-rj-07', order: 2,  description: 'Na manipulação de produto de origem animal em temperatura ambiente, respeita-se o prazo máximo de 30 minutos, ou até 2h em temperatura climatizada entre 12°C e 18°C.', legislation: 'RDC 216/2004 item 4.5.3; Portaria IVISA-RIO 002/2020, Art. 60', weight: 5, isCritical: false },
          { id: 'rj-f-062', sectionId: 'sec-ali-rj-07', order: 3,  description: 'Matérias-primas e ingredientes perecíveis expostos à temperatura ambiente somente pelo tempo mínimo necessário para preparação.', legislation: 'RDC 216/2004 item 4.5.3; Portaria IVISA-RIO 002/2020, Art. 60', weight: 5, isCritical: false },
          { id: 'rj-f-063', sectionId: 'sec-ali-rj-07', order: 4,  description: 'Evita-se o contato direto ou indireto entre alimentos crus, semipreparados e prontos para o consumo.', legislation: 'RDC 216/2004 item 4.5.3; Portaria IVISA-RIO 002/2020, Art. 59', weight: 10, isCritical: true },
          { id: 'rj-f-064', sectionId: 'sec-ali-rj-07', order: 5,  description: 'Funcionários que manipulam alimentos crus higienizam as mãos antes de manusear alimentos preparados.', legislation: 'RDC 216/2004 item 4.5.3; Portaria IVISA-RIO 002/2020, Art. 59', weight: 10, isCritical: true },
          { id: 'rj-f-065', sectionId: 'sec-ali-rj-07', order: 6,  description: 'O tratamento térmico garante que o centro geométrico do alimento atinja mínimo 70°C por 2 min, ou 74°C em todas as partes.', legislation: 'RDC 216/2004 item 4.5.3; Portaria IVISA-RIO 002/2020, Art. 62', weight: 5, isCritical: false },
          { id: 'rj-f-066', sectionId: 'sec-ali-rj-07', order: 7,  description: 'A eficácia do tratamento térmico é avaliada pela verificação de temperatura e tempo, além da mudança na textura e cor na parte central do alimento.', legislation: 'RDC 216/2004 item 4.5.3; Portaria IVISA-RIO 002/2020, Art. 62 §1º', weight: 5, isCritical: false },
          { id: 'rj-f-067', sectionId: 'sec-ali-rj-07', order: 8,  description: 'Óleos e gorduras aquecidos a temperaturas não superiores a 180°C; substituídos imediatamente ao apresentar alterações. Proibida a reutilização em outros alimentos.', legislation: 'RDC 216/2004 item 4.5.3; Portaria IVISA-RIO 002/2020, Art. 63', weight: 5, isCritical: false },
          { id: 'rj-f-068', sectionId: 'sec-ali-rj-07', order: 9,  description: 'Descongelamento efetuado sob refrigeração <5°C ou em micro-ondas com cocção imediata. Proibido descongelar à temperatura ambiente, submerso em água ou sob corrente direta de ar. Alimentos descongelados NÃO são recongelados.', legislation: 'RDC 216/2004 item 4.5.3; Portaria IVISA-RIO 002/2020, Art. 65 §4º', weight: 10, isCritical: true },
          { id: 'rj-f-069', sectionId: 'sec-ali-rj-07', order: 10, description: 'Hortifrutícolas consumidos crus submetidos a processo de higienização com produto registrado no MS: (1) lavagem individual em água corrente; (2) imersão em solução sanitizante por 20 min; (3) enxague em água corrente filtrada.', legislation: 'RDC 216/2004 item 4.5.3; RDC 218/2005; Portaria IVISA-RIO 002/2020, Art. 72', weight: 10, isCritical: true },
          { id: 'rj-f-070', sectionId: 'sec-ali-rj-07', order: 11, description: 'Temperatura do alimento preparado durante resfriamento reduzida de 60°C a 10°C em até duas horas.', legislation: 'RDC 216/2004 item 4.5.3; Portaria IVISA-RIO 002/2020, Art. 68', weight: 5, isCritical: false },
          { id: 'rj-f-071', sectionId: 'sec-ali-rj-07', order: 12, description: 'Após cocção, alimentos mantidos a temperatura superior a 60°C por no máximo 6 horas. Abaixo de 60°C: consumo em até 1 hora.', legislation: 'RDC 216/2004 item 4.5.3; Portaria IVISA-RIO 002/2020, Art. 66 §único', weight: 5, isCritical: false },
          { id: 'rj-f-072', sectionId: 'sec-ali-rj-07', order: 13, description: 'É VEDADA a entrega ao consumo de alimentos prontos à base de ovo cru e maionese caseira. Substituir por ovo líquido pasteurizado, liofilizado ou produto industrializado equivalente.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 74 — EXCLUSIVO MUNICÍPIO DO RJ', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 8 (RJ) ───────────────────────────────────
      {
        id: 'sec-ali-rj-08',
        title: 'Rotulagem e Armazenamento pós-preparo',
        order: 8,
        items: [
          { id: 'rj-f-073', sectionId: 'sec-ali-rj-08', order: 1, description: 'Produtos de fabricação própria adequadamente acondicionados e identificados com: designação do produto, data de fabricação e prazo de validade.', legislation: 'RDC 216/2004 item 4.5.4; Portaria IVISA-RIO 002/2020, Art. 71', weight: 10, isCritical: true },
          { id: 'rj-f-074', sectionId: 'sec-ali-rj-08', order: 2, description: 'Após cocção, alimento conservado sob refrigeração a temperaturas inferiores a 5°C, ou congelado à temperatura igual ou inferior a -18°C.', legislation: 'RDC 216/2004 item 4.5.4; Portaria IVISA-RIO 002/2020, Art. 69', weight: 10, isCritical: true },
          { id: 'rj-f-075', sectionId: 'sec-ali-rj-08', order: 3, description: 'Alimentos preparados conservados a 4°C ou inferior possuem prazo máximo de consumo de 5 dias.', legislation: 'RDC 216/2004 item 4.5.4; Portaria IVISA-RIO 002/2020, Art. 67', weight: 5, isCritical: false },
          { id: 'rj-f-076', sectionId: 'sec-ali-rj-08', order: 4, description: 'Embalagens prontas para uso dispostas em local próprio, protegidas e em número suficiente apenas para o uso diário.', legislation: 'RDC 216/2004 item 4.5.4; Decreto-Rio 45585/18 item 5.4.4', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 9 (RJ) ───────────────────────────────────
      {
        id: 'sec-ali-rj-09',
        title: 'Exposição ao Consumo',
        order: 9,
        items: [
          { id: 'rj-f-077', sectionId: 'sec-ali-rj-09', order: 1,  description: 'Equipamento de exposição do alimento preparado dispõe de barreiras de proteção que previnam contaminação pelo consumidor.', legislation: 'RDC 216/2004 item 4.5.5; Portaria IVISA-RIO 002/2020, Art. 89', weight: 5, isCritical: false },
          { id: 'rj-f-078', sectionId: 'sec-ali-rj-09', order: 2,  description: 'Equipamentos, móveis e utensílios compatíveis com as atividades, em número suficiente e em adequado estado de conservação e higiene.', legislation: 'RDC 216/2004 item 4.5.5; Portaria IVISA-RIO 002/2020, Art. 89', weight: 10, isCritical: true },
          { id: 'rj-f-079', sectionId: 'sec-ali-rj-09', order: 3,  description: 'Manipuladores adotam procedimentos que minimizam o risco de contaminação (antissepsia das mãos ou uso de utensílios/luvas descartáveis).', legislation: 'RDC 216/2004 item 4.5.5; Decreto-Rio 45585/18 item 5.5.3', weight: 10, isCritical: true },
          { id: 'rj-f-080', sectionId: 'sec-ali-rj-09', order: 4,  description: 'Alimentos quentes expostos a temperatura superior a 60°C por no máximo 6 horas, ou abaixo de 60°C por prazo máximo de 1 hora.', legislation: 'RDC 216/2004 item 4.5.5; Portaria IVISA-RIO 002/2020, Art. 66; Decreto-Rio 45585/18 item 5.5.4', weight: 10, isCritical: true },
          { id: 'rj-f-081', sectionId: 'sec-ali-rj-09', order: 5,  description: 'Alimentos resfriados expostos a temperatura de no máximo 5°C.', legislation: 'RDC 216/2004 item 4.5.5; Decreto-Rio 45585/18 item 5.5.5', weight: 10, isCritical: true },
          { id: 'rj-f-082', sectionId: 'sec-ali-rj-09', order: 6,  description: 'Utensílios de consumação (pratos, copos, talheres) devidamente higienizados, desinfetados, secos e armazenados em local protegido. Sem imperfeições, rachaduras ou lascas.', legislation: 'RDC 216/2004 item 4.5.5; Portaria IVISA-RIO 002/2020, Art. 90', weight: 10, isCritical: true },
          { id: 'rj-f-083', sectionId: 'sec-ali-rj-09', order: 7,  description: 'Funcionários responsáveis por recebimento de pagamento NÃO manipulam alimentos preparados. Área de caixa reservada.', legislation: 'Decreto-Rio 45585/18 item 5.5.8', weight: 5, isCritical: false },
          { id: 'rj-f-084', sectionId: 'sec-ali-rj-09', order: 8,  description: 'NÃO são utilizadas embalagens devassáveis (monodose) de molhos e temperos de mesa. — EXCLUSIVO MUNICÍPIO DO RJ', legislation: 'Decreto-Rio 45585/18 item 5.5.11; Portaria IVISA-RIO 002/2020', weight: 10, isCritical: true },
          { id: 'rj-f-085', sectionId: 'sec-ali-rj-09', order: 9,  description: 'Possui canudo de papel biodegradável e/ou reciclável embalado individualmente (quando aplicável ao tipo de bebida servida). — EXCLUSIVO MUNICÍPIO DO RJ', legislation: 'Decreto-Rio 45585/18 item 5.5.12; Portaria IVISA-RIO 002/2020', weight: 10, isCritical: true },
          { id: 'rj-f-086', sectionId: 'sec-ali-rj-09', order: 10, description: 'Possui placas ou qualquer outro dispositivo que informe sobre a presença de GLÚTEN nas preparações e/ou cardápios. — EXCLUSIVO MUNICÍPIO DO RJ', legislation: 'Decreto-Rio 45585/18 item 5.5.13; Portaria IVISA-RIO 002/2020', weight: 10, isCritical: true },
          { id: 'rj-f-087', sectionId: 'sec-ali-rj-09', order: 11, description: 'Não possui exposição de gêneros alimentícios fora da área física do estabelecimento.', legislation: 'Decreto-Rio 45585/18 item 5.5.14', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 10 (RJ) ──────────────────────────────────
      {
        id: 'sec-ali-rj-10',
        title: 'Transporte de Alimentos',
        order: 10,
        items: [
          { id: 'rj-f-088', sectionId: 'sec-ali-rj-10', order: 1, description: 'Armazenamento e transporte em condições de tempo e temperatura que não comprometam a qualidade higiênico-sanitária, com controle/registro de temperaturas. Refeições transportadas com rótulo contendo: nome, CNPJ, tipo de alimento, data, hora de produção, temperatura de manutenção e prazo de validade.', legislation: 'RDC 216/2004 item 4.5.6; Portaria IVISA-RIO 002/2020, Arts. 75 e 76', weight: 5, isCritical: false },
          { id: 'rj-f-089', sectionId: 'sec-ali-rj-10', order: 2, description: 'Veículos utilizados para transporte de alimentos devidamente licenciados pelo órgão de Vigilância Sanitária, exclusivos para alimentos, com carroceria fechada e em boas condições higiênico-sanitárias.', legislation: 'RDC 216/2004 item 4.5.6; Portaria IVISA-RIO 002/2020, Art. 77', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 11 (RJ) ──────────────────────────────────
      {
        id: 'sec-ali-rj-11',
        title: 'Documentação e Registros',
        order: 11,
        items: [
          { id: 'rj-f-090', sectionId: 'sec-ali-rj-11', order: 1,  description: 'Possui e cumpre o Manual de Boas Práticas específico para a empresa, aprovado, datado e assinado pelo RT.', legislation: 'RDC 216/2004 item 4.6.1; Portaria IVISA-RIO 002/2020, Art. 83', weight: 5, isCritical: false },
          { id: 'rj-f-091', sectionId: 'sec-ali-rj-11', order: 2,  description: 'Possui e cumpre POPs para: higiene/saúde dos manipuladores; higienização de instalações; controle de vetores e pragas; higienização do reservatório de água; manejo de resíduos; descarte de óleo saturado; controle de temperatura de equipamentos frigorificados; higienização de hortifrutícolas; controle de tempo/temperatura das preparações.', legislation: 'RDC 216/2004 item 4.6.1; Portaria IVISA-RIO 002/2020, Art. 84', weight: 5, isCritical: false },
          { id: 'rj-f-092', sectionId: 'sec-ali-rj-11', order: 3,  description: 'Possui planilhas de controle de temperatura de câmaras, balcões, congeladores e equipamentos térmicos, mantidas por mínimo 30 dias.', legislation: 'RDC 216/2004 item 4.6.1; Portaria IVISA-RIO 002/2020, Art. 84 §9º', weight: 5, isCritical: false },
          { id: 'rj-f-093', sectionId: 'sec-ali-rj-11', order: 4,  description: 'Possui planilhas de registro da troca periódica dos elementos filtrantes (filtros, bebedouros, máquina de gelo, etc.).', legislation: 'RDC 216/2004 item 4.6.1; Decreto-Rio 45585/18 item 6.1.4', weight: 5, isCritical: false },
          { id: 'rj-f-094', sectionId: 'sec-ali-rj-11', order: 5,  description: 'Possui planilhas de registro de tempo × temperatura dos balcões expositores.', legislation: 'RDC 216/2004 item 4.6.1; Decreto-Rio 45585/18 item 6.1.5', weight: 5, isCritical: false },
          { id: 'rj-f-095', sectionId: 'sec-ali-rj-11', order: 6,  description: 'Possui planilhas de registro da recepção dos alimentos (condições do transporte, características sensoriais e temperatura).', legislation: 'RDC 216/2004 item 4.6.1; Decreto-Rio 45585/18 item 6.1.6', weight: 5, isCritical: false },
          { id: 'rj-f-096', sectionId: 'sec-ali-rj-11', order: 7,  description: 'Possui registros de manutenção preventiva dos equipamentos e calibração dos instrumentos de medição.', legislation: 'RDC 216/2004 item 4.6.1; Portaria IVISA-RIO 002/2020, Art. 47 §4º', weight: 5, isCritical: false },
          { id: 'rj-f-097', sectionId: 'sec-ali-rj-11', order: 8,  description: 'Possui registros de capacitação contínua dos manipuladores, com carga horária, conteúdo programático, frequência e participação nominal.', legislation: 'RDC 216/2004 item 4.6.1; Portaria IVISA-RIO 002/2020, Art. 84 §3º', weight: 5, isCritical: false },
          { id: 'rj-f-098', sectionId: 'sec-ali-rj-11', order: 9,  description: 'Possui comprovante atualizado de higienização semestral do reservatório de água realizado por empresa habilitada pelo INEA, com certificação, ordem de serviço válida e laudo de potabilidade de laboratório certificado.', legislation: 'RDC 216/2004 item 4.6.2; Portaria IVISA-RIO 002/2020, Art. 84 §7º; Decreto-Rio 45585/18 item 6.2.1', weight: 10, isCritical: true },
          { id: 'rj-f-099', sectionId: 'sec-ali-rj-11', order: 10, description: 'Possui laudo de potabilidade da água, inclusive se de fonte alternativa (poço, mina ou caminhão pipa).', legislation: 'RDC 216/2004 item 4.6.2; Portaria IVISA-RIO 002/2020, Art. 37 §único', weight: 5, isCritical: false },
          { id: 'rj-f-100', sectionId: 'sec-ali-rj-11', order: 11, description: 'Possui comprovante atualizado de execução do serviço de controle de pragas por empresa credenciada ao INEA.', legislation: 'RDC 216/2004 item 4.6.3; Portaria IVISA-RIO 002/2020, Art. 82; Decreto-Rio 45585/18 item 6.3.1', weight: 5, isCritical: false },
          { id: 'rj-f-101', sectionId: 'sec-ali-rj-11', order: 12, description: 'Possui contrato com empresa para destinação adequada do lixo comum e Programa de Gerenciamento de Resíduos com manifestos do INEA.', legislation: 'RDC 216/2004 item 4.6.4; Portaria IVISA-RIO 002/2020, Art. 78; Decreto-Rio 45585/18 item 6.4.1', weight: 5, isCritical: false },
          { id: 'rj-f-102', sectionId: 'sec-ali-rj-11', order: 13, description: 'Possui contrato com empresa terceirizada credenciada no INEA para coleta do óleo vegetal saturado, com apresentação do manifesto de resíduos. — EXCLUSIVO MUNICÍPIO DO RJ', legislation: 'Portaria IVISA-RIO 002/2020, Art. 51; Decreto-Rio 45585/18 item 6.4.2', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 12 (RJ) — EXCLUSIVOS DO MUNICÍPIO ────────
      // Itens que NÃO existem no roteiro federal e são
      // exigidos somente pela legislação municipal do RJ.
      // 12 itens nesta seção + 5 exclusivos nas seções 7,
      // 9 e 11 = 17 exclusivos RJ no total.
      // 97 federais + 17 exclusivos RJ = 114 itens totais.
      {
        id: 'sec-ali-rj-12',
        title: 'Segurança, EPI e Responsabilidade Técnica — Exclusivos RJ',
        order: 12,
        items: [
          {
            id: 'rj-exc-001',
            sectionId: 'sec-ali-rj-12',
            order: 1,
            description: 'Área de atendimento com acesso e circulação livre e desobstruída, disposição adequada de equipamentos, fiações elétricas protegidas por conduites, interruptores e tomadas instalados adequadamente, sem objetos inservíveis ou alheios à atividade.',
            legislation: 'Portaria IVISA-RIO 002/2020, Art. 8; Decreto-Rio 45585/18 item 7.1',
            weight: 10,
            isCritical: true,
          },
          {
            id: 'rj-exc-002',
            sectionId: 'sec-ali-rj-12',
            order: 2,
            description: 'EPIs disponíveis em local de fácil acesso, limpos e em bom estado de conservação: calçado antiderrapante para áreas com fritura; luvas e avental para lavagem de utensílios; luvas térmicas para forno; mangote/braçadeira para manuseio na fritadeira; luva de malha de aço para corte de peças de carne; luva própria para manuseio de gelo; luvas e calçados próprios para atividades de limpeza e recolhimento de resíduos.',
            legislation: 'Portaria IVISA-RIO 002/2020, Art. 8 §1º a §6º; Decreto-Rio 45585/18 item 7.2',
            weight: 10,
            isCritical: true,
          },
          {
            id: 'rj-exc-003',
            sectionId: 'sec-ali-rj-12',
            order: 3,
            description: 'Câmaras frias com sistema de abertura pelo interior e oferta de roupa de proteção para exposição ao frio (vestimenta completa, casaco com capuz, luvas e botas térmicas impermeáveis).',
            legislation: 'Portaria IVISA-RIO 002/2020, Art. 8 §1º; Decreto-Rio 45585/18 item 7.3',
            weight: 5,
            isCritical: false,
          },
          {
            id: 'rj-exc-004',
            sectionId: 'sec-ali-rj-12',
            order: 4,
            description: 'Luva de borracha com cano longo é OBRIGATÓRIA na manipulação de produtos saneantes durante a higienização do ambiente, equipamentos e utensílios, coleta e transporte de lixo, higienização de contentores de lixo e limpeza de sanitários.',
            legislation: 'Portaria IVISA-RIO 002/2020, Art. 8 §6º',
            weight: 10,
            isCritical: true,
          },
          {
            id: 'rj-exc-005',
            sectionId: 'sec-ali-rj-12',
            order: 5,
            description: 'Não é permitido o funcionamento de equipamentos sem a proteção das partes de maior risco de acidentes (motor, prensa, peça cortante, sucção, correia entre outros).',
            legislation: 'Portaria IVISA-RIO 002/2020, Art. 8 §5º',
            weight: 10,
            isCritical: true,
          },
          {
            id: 'rj-exc-006',
            sectionId: 'sec-ali-rj-12',
            order: 6,
            description: 'O responsável pelas atividades relacionadas a alimentos foi comprovadamente submetido a curso de capacitação com os temas municipais obrigatórios: qualidade da água e controle de pragas; qualidade sanitária no armazenamento e manipulação; procedimentos de higienização de instalações; segurança e saúde do manipulador.',
            legislation: 'Portaria IVISA-RIO 002/2020, Art. 9 §único',
            weight: 5,
            isCritical: false,
          },
          {
            id: 'rj-exc-007',
            sectionId: 'sec-ali-rj-12',
            order: 7,
            description: 'O responsável técnico exerce efetivamente suas atividades no local, está habilitado para acompanhar o processo de produção, implementar boas práticas, capacitar manipuladores, elaborar/atualizar MBP e POPs, e notificar surtos ao órgão sanitário municipal.',
            legislation: 'Portaria IVISA-RIO 002/2020, Art. 10',
            weight: 5,
            isCritical: false,
          },
          {
            id: 'rj-exc-008',
            sectionId: 'sec-ali-rj-12',
            order: 8,
            description: 'Substâncias odorizantes e desodorantes NÃO são utilizadas nas áreas de preparação e armazenamento dos alimentos.',
            legislation: 'Portaria IVISA-RIO 002/2020, Art. 48 §1º',
            weight: 5,
            isCritical: false,
          },
          {
            id: 'rj-exc-009',
            sectionId: 'sec-ali-rj-12',
            order: 9,
            description: 'Em caso de refluxo ou extravasamento de águas servidas ou resíduos oriundos de caixas de gordura ou tubulações de esgoto, o funcionamento do estabelecimento é imediatamente suspenso, retornando somente após resolução do problema e limpeza e higienização completa do local.',
            legislation: 'Portaria IVISA-RIO 002/2020, Art. 39 §2º',
            weight: 10,
            isCritical: true,
          },
          {
            id: 'rj-exc-010',
            sectionId: 'sec-ali-rj-12',
            order: 10,
            description: 'Sistema de recepção de utensílios sujos separado do ponto de distribuição de alimentos.',
            legislation: 'Decreto-Rio 45585/18 item 5.5.9',
            weight: 5,
            isCritical: false,
          },
          {
            id: 'rj-exc-011',
            sectionId: 'sec-ali-rj-12',
            order: 11,
            description: 'Os estabelecimentos de serviços de alimentação possuem identificação ao cliente sobre o franqueamento à visitação da cozinha (quando aplicável).',
            legislation: 'Decreto-Rio 45585/18 item 5.5.10',
            weight: 5,
            isCritical: false,
          },
          {
            id: 'rj-exc-012',
            sectionId: 'sec-ali-rj-12',
            order: 12,
            description: 'Os visitantes ao estabelecimento são orientados a proteger os cabelos e barba, lavar as mãos e não tocar em nada ao acessar a área de manipulação. Os agentes da fiscalização sanitária têm acesso irrestrito a todas as dependências.',
            legislation: 'Portaria IVISA-RIO 002/2020, Art. 7',
            weight: 2,
            isCritical: false,
          },
        ],
      },
    ],
  },
];
