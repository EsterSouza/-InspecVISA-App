// ============================================================
// ADIÇÃO AO src/data/templates.ts
// ROTEIROS DE ALIMENTOS — DOIS TEMPLATES
//
// Como usar: adicionar os dois objetos abaixo dentro do
// array `templates` existente em src/data/templates.ts
//
// Template 1: tpl-alimentos-federal-v1
//   → Aplicável a QUALQUER estabelecimento no Brasil
//   → Base: RDC 216/2004 (ANVISA) + RDC 218/2005
//   → 78 itens em 11 seções
//
// Template 2: tpl-alimentos-rj-v1
//   → Específico para o Município do Rio de Janeiro
//   → Usar APENAS quando o estabelecimento for do RJ
//   → Base: Portaria IVISA-RIO nº 002/2020 +
//            Decreto-Rio nº 45.585/2018 +
//            Resolução SMS nº 2119/2013 +
//            RDC 216/2004
//   → 97 itens em 12 seções (inclui todos os federais
//     + itens exclusivos municipais)
//
// Pesos: Imprescindível=10,isCritical:true |
//        Necessário=5,isCritical:false |
//        Recomendável=2,isCritical:false
// ============================================================

import type { ChecklistTemplate } from '../types';

export const alimentosTemplates: ChecklistTemplate[] = [

  // ════════════════════════════════════════════════════════════
  // TEMPLATE 3 — SERVIÇOS DE ALIMENTAÇÃO (FEDERAL)
  // Aplicável a qualquer estabelecimento no Brasil
  // Base legal: RDC 216/2004, RDC 218/2005 (ANVISA)
  // ════════════════════════════════════════════════════════════
  {
    id: 'tpl-alimentos-federal-v1',
    name: 'Roteiro de Inspeção — Serviços de Alimentação (Nacional)',
    category: 'alimentos',
    version: '2024',
    sections: [

      // ── SEÇÃO 1 ─────────────────────────────────────────────
      {
        id: 'sec-ali-fed-01',
        title: 'Edificação e Instalações',
        order: 1,
        items: [
          { id: 'ali-f-001', sectionId: 'sec-ali-fed-01', order: 1,  description: 'Áreas internas e externas livres de objetos em desuso ou estranhos ao ambiente; dependências sem presença de animais e não utilizadas como habitação ou dormitório.', legislation: 'RDC 216/2004 – item 4.1.1', weight: 5, isCritical: false },
          { id: 'ali-f-002', sectionId: 'sec-ali-fed-01', order: 2,  description: 'Piso de material liso, resistente e de fácil higienização, em adequado estado de conservação, com ralos com tampas escamoteáveis sifonados e/ou grelhas para facilitar escoamento e proteger contra pragas.', legislation: 'RDC 216/2004 – item 4.1.2', weight: 5, isCritical: false },
          { id: 'ali-f-003', sectionId: 'sec-ali-fed-01', order: 3,  description: 'Tetos, paredes e divisórias com acabamento liso, impermeável, de cor clara, em adequado estado de conservação e de fácil higienização.', legislation: 'RDC 216/2004 – item 4.1.3', weight: 5, isCritical: false },
          { id: 'ali-f-004', sectionId: 'sec-ali-fed-01', order: 4,  description: 'Portas com acabamento liso, ajustadas aos batentes, em adequado estado de conservação. Portas externas com fechamento automático (mola) e barreiras adequadas contra vetores (telas milimétricas ou outro sistema).', legislation: 'RDC 216/2004 – item 4.1.4', weight: 5, isCritical: false },
          { id: 'ali-f-005', sectionId: 'sec-ali-fed-01', order: 5,  description: 'Janelas e outras aberturas com superfície lisa, de fácil higienização, ajustadas aos batentes, com telas milimétricas e em adequado estado de conservação.', legislation: 'RDC 216/2004 – item 4.1.5', weight: 5, isCritical: false },
          { id: 'ali-f-006', sectionId: 'sec-ali-fed-01', order: 6,  description: 'Escadas, elevadores de serviço, montacargas e estruturas auxiliares de material resistente, liso e impermeável, em adequado estado de conservação e não servindo de fonte de contaminação.', legislation: 'RDC 216/2004 – item 4.1.6', weight: 5, isCritical: false },
          { id: 'ali-f-007', sectionId: 'sec-ali-fed-01', order: 7,  description: 'Iluminação suficiente e luminárias com proteção adequada contra queda acidental e explosão (exceto LED), em adequado estado de conservação e higiene.', legislation: 'RDC 216/2004 – item 4.1.7', weight: 5, isCritical: false },
          { id: 'ali-f-008', sectionId: 'sec-ali-fed-01', order: 8,  description: 'Instalações elétricas embutidas ou, quando exteriores, revestidas por tubulações isolantes e presas a paredes e tetos.', legislation: 'RDC 216/2004 – item 4.1.8', weight: 5, isCritical: false },
          { id: 'ali-f-009', sectionId: 'sec-ali-fed-01', order: 9,  description: 'Sistema de climatização instalado com conforto térmico adequado, em bom estado de conservação e higiene.', legislation: 'RDC 216/2004 – item 4.1.9', weight: 5, isCritical: false },
          { id: 'ali-f-010', sectionId: 'sec-ali-fed-01', order: 10, description: 'O fluxo de ar NÃO incide diretamente sobre os alimentos.', legislation: 'RDC 216/2004 – item 4.1.9', weight: 10, isCritical: true },
          { id: 'ali-f-011', sectionId: 'sec-ali-fed-01', order: 11, description: 'Pontos de cocção (fogões, fritadeiras, chapas, etc.) instalados sob coifa com adequado sistema de exaustão e troca de ar capaz de prevenir contaminações e garantir conforto térmico.', legislation: 'RDC 216/2004 – item 4.1.10', weight: 5, isCritical: false },
          { id: 'ali-f-012', sectionId: 'sec-ali-fed-01', order: 12, description: 'Instalações sanitárias sem comunicação direta com áreas de produção/manipulação/armazenamento de alimentos, com portas de fechamento automático e providas de papel higiênico.', legislation: 'RDC 216/2004 – item 4.1.11', weight: 5, isCritical: false },
          { id: 'ali-f-013', sectionId: 'sec-ali-fed-01', order: 13, description: 'Sanitários com piso, paredes e teto liso, resistente e impermeável, dotados de ralo sifonado com tampa, ventilação e iluminação adequadas e telas nas aberturas.', legislation: 'RDC 216/2004 – item 4.1.11', weight: 5, isCritical: false },
          { id: 'ali-f-014', sectionId: 'sec-ali-fed-01', order: 14, description: 'Vasos sanitários e mictórios com descarga, íntegros, em nº suficiente e em bom estado de funcionamento. Vasos com assentos e tampas.', legislation: 'RDC 216/2004 – item 4.1.11', weight: 5, isCritical: false },
          { id: 'ali-f-015', sectionId: 'sec-ali-fed-01', order: 15, description: 'Sanitários com pia, sabonete líquido antisséptico e toalha de papel não reciclado para higienização das mãos.', legislation: 'RDC 216/2004 – item 4.1.11', weight: 10, isCritical: true },
          { id: 'ali-f-016', sectionId: 'sec-ali-fed-01', order: 16, description: 'Sanitários com avisos sobre procedimentos para lavagem das mãos.', legislation: 'RDC 216/2004 – item 4.1.11', weight: 5, isCritical: false },
          { id: 'ali-f-017', sectionId: 'sec-ali-fed-01', order: 17, description: 'Sanitários com lixeiras com tampas sem acionamento manual, revestidas com sacos apropriados e coleta frequente dos resíduos.', legislation: 'RDC 216/2004 – item 4.1.11', weight: 5, isCritical: false },
          { id: 'ali-f-018', sectionId: 'sec-ali-fed-01', order: 18, description: 'Vestiários com armários organizados, em número suficiente e em bom estado de conservação.', legislation: 'RDC 216/2004 – item 4.1.11', weight: 5, isCritical: false },
          { id: 'ali-f-019', sectionId: 'sec-ali-fed-01', order: 19, description: 'Lavatórios na área de produção adequados ao fluxo, dotados de sabonete líquido antisséptico, toalhas de papel não reciclado e lixeiras com tampas sem acionamento manual.', legislation: 'RDC 216/2004 – item 4.1.12', weight: 10, isCritical: true },
          { id: 'ali-f-020', sectionId: 'sec-ali-fed-01', order: 20, description: 'Avisos com procedimentos para lavagem das mãos afixados nos lavatórios da área de produção.', legislation: 'RDC 216/2004 – item 4.1.12', weight: 5, isCritical: false },
          { id: 'ali-f-021', sectionId: 'sec-ali-fed-01', order: 21, description: 'Ausência de vetores e pragas urbanas ou seus vestígios.', legislation: 'RDC 216/2004 – item 4.1.13', weight: 10, isCritical: true },
          { id: 'ali-f-022', sectionId: 'sec-ali-fed-01', order: 22, description: 'Medidas preventivas e corretivas adotadas para impedir a atração, abrigo, acesso e/ou proliferação de vetores e pragas urbanas.', legislation: 'RDC 216/2004 – item 4.1.13', weight: 5, isCritical: false },
          { id: 'ali-f-023', sectionId: 'sec-ali-fed-01', order: 23, description: 'No caso de controle químico de pragas, comprovante de execução do serviço por empresa credenciada ao órgão ambiental estadual competente.', legislation: 'RDC 216/2004 – item 4.1.13', weight: 5, isCritical: false },
          { id: 'ali-f-024', sectionId: 'sec-ali-fed-01', order: 24, description: 'Produtos químicos utilizados no controle de roedores ficam protegidos.', legislation: 'RDC 216/2004 – item 4.1.13', weight: 10, isCritical: true },
          { id: 'ali-f-025', sectionId: 'sec-ali-fed-01', order: 25, description: 'Sistema de abastecimento ligado à rede pública, ou fonte alternativa com documentação de potabilidade da água.', legislation: 'RDC 216/2004 – item 4.1.14', weight: 5, isCritical: false },
          { id: 'ali-f-026', sectionId: 'sec-ali-fed-01', order: 26, description: 'Reservatório de água acessível, dotado de tampas, em satisfatória condição de uso, livre de vazamentos, infiltrações e descascamentos.', legislation: 'RDC 216/2004 – item 4.1.14', weight: 10, isCritical: true },
          { id: 'ali-f-027', sectionId: 'sec-ali-fed-01', order: 27, description: 'Gelo produzido com água potável, fabricado, manipulado e estocado sob condições sanitárias satisfatórias. Quando industrializado, embalado e devidamente rotulado.', legislation: 'RDC 216/2004 – item 4.1.14', weight: 10, isCritical: true },
          { id: 'ali-f-028', sectionId: 'sec-ali-fed-01', order: 28, description: 'Recipientes para coleta de resíduos de fácil higienização e transporte, com tampas acionadas sem contato manual, devidamente identificados e higienizados; uso de sacos de lixo apropriados.', legislation: 'RDC 216/2004 – item 4.1.15', weight: 5, isCritical: false },
          { id: 'ali-f-029', sectionId: 'sec-ali-fed-01', order: 29, description: 'Retirada frequente dos resíduos da área de processamento, mantidos em local fechado e isolados das áreas de preparação e armazenamento.', legislation: 'RDC 216/2004 – item 4.1.15', weight: 10, isCritical: true },
          { id: 'ali-f-030', sectionId: 'sec-ali-fed-01', order: 30, description: 'Caixas de gordura e de esgoto em adequado estado de conservação e funcionamento, localizadas fora das áreas de preparação e armazenamento.', legislation: 'RDC 216/2004 – item 4.1.16', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 2 ─────────────────────────────────────────────
      {
        id: 'sec-ali-fed-02',
        title: 'Equipamentos, Móveis e Utensílios',
        order: 2,
        items: [
          { id: 'ali-f-031', sectionId: 'sec-ali-fed-02', order: 1, description: 'Equipamentos suficientes ao processo de trabalho, em bom estado de conservação e funcionamento, dispostos de forma a permitir fácil acesso e higienização adequada.', legislation: 'RDC 216/2004 – item 4.2.1', weight: 5, isCritical: false },
          { id: 'ali-f-032', sectionId: 'sec-ali-fed-02', order: 2, description: 'Superfícies em contato com alimentos lisas, íntegras, impermeáveis, resistentes à corrosão, de fácil higienização, de material não contaminante e em adequado estado de conservação.', legislation: 'RDC 216/2004 – item 4.2.1', weight: 5, isCritical: false },
          { id: 'ali-f-033', sectionId: 'sec-ali-fed-02', order: 3, description: 'Equipamentos de conservação dos alimentos (refrigeradores, congeladores, câmaras frigoríficas) e de processamento térmico em adequado funcionamento.', legislation: 'RDC 216/2004 – item 4.2.1', weight: 10, isCritical: true },
          { id: 'ali-f-034', sectionId: 'sec-ali-fed-02', order: 4, description: 'Câmaras frias com dispositivo que possibilite abertura das portas pelo interior, alarme ou sistema de comunicação que possa ser acionado em caso de emergência.', legislation: 'RDC 216/2004 – item 4.2.1', weight: 5, isCritical: false },
          { id: 'ali-f-035', sectionId: 'sec-ali-fed-02', order: 5, description: 'Móveis em número suficiente, de material apropriado, resistentes, impermeáveis, em adequado estado de conservação, com superfícies lisas e íntegras, sem rugosidades e frestas.', legislation: 'RDC 216/2004 – item 4.2.2', weight: 5, isCritical: false },
          { id: 'ali-f-036', sectionId: 'sec-ali-fed-02', order: 6, description: 'Utensílios de material não contaminante, resistentes à corrosão, de fácil higienização, em adequado estado de conservação, em número suficiente e armazenados em local apropriado.', legislation: 'RDC 216/2004 – item 4.2.3', weight: 5, isCritical: false },
          { id: 'ali-f-037', sectionId: 'sec-ali-fed-02', order: 7, description: 'Superfícies de corte constituídas por material atóxico e de fácil higienização.', legislation: 'RDC 216/2004 – item 4.2.3', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 3 ─────────────────────────────────────────────
      {
        id: 'sec-ali-fed-03',
        title: 'Higienização',
        order: 3,
        items: [
          { id: 'ali-f-038', sectionId: 'sec-ali-fed-03', order: 1, description: 'Produtos de higienização disponíveis e regularizados pelo Ministério da Saúde, armazenados em local adequado separado de alimentos. Utensílios disponíveis, adequados e em bom estado.', legislation: 'RDC 216/2004 – item 4.3.1', weight: 5, isCritical: false },
          { id: 'ali-f-039', sectionId: 'sec-ali-fed-03', order: 2, description: 'Não são utilizados panos convencionais (panos de prato) para secagem das mãos e utensílios.', legislation: 'RDC 216/2004 – item 4.3.1', weight: 5, isCritical: false },
          { id: 'ali-f-040', sectionId: 'sec-ali-fed-03', order: 3, description: 'Utensílios diferentes daqueles usados para a higienização de móveis e equipamentos.', legislation: 'RDC 216/2004 – item 4.3.1', weight: 5, isCritical: false },
          { id: 'ali-f-041', sectionId: 'sec-ali-fed-03', order: 4, description: 'Possui água corrente em quantidade suficiente para higienização de equipamentos e utensílios.', legislation: 'RDC 216/2004 – item 4.3.2', weight: 10, isCritical: true },
          { id: 'ali-f-042', sectionId: 'sec-ali-fed-03', order: 5, description: 'Frequência de higienização das instalações adequada.', legislation: 'RDC 216/2004 – item 4.3.2', weight: 10, isCritical: true },
          { id: 'ali-f-043', sectionId: 'sec-ali-fed-03', order: 6, description: 'Bancadas, móveis, equipamentos e utensílios higienizados adequadamente, sem acúmulo de sujidades, gordura ou resíduos, antes das atividades e após o término do trabalho.', legislation: 'RDC 216/2004 – item 4.3.3', weight: 10, isCritical: true },
          { id: 'ali-f-044', sectionId: 'sec-ali-fed-03', order: 7, description: 'Não são utilizadas escovas de metal, lã de aço ou outros materiais abrasivos na limpeza de equipamentos e utensílios.', legislation: 'RDC 216/2004 – item 4.3.3', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 4 ─────────────────────────────────────────────
      {
        id: 'sec-ali-fed-04',
        title: 'Manipuladores',
        order: 4,
        items: [
          { id: 'ali-f-045', sectionId: 'sec-ali-fed-04', order: 1, description: 'Utilização de uniforme de trabalho adequado à atividade, de cor clara, exclusivo para a área de produção.', legislation: 'RDC 216/2004 – item 4.4.1', weight: 5, isCritical: false },
          { id: 'ali-f-046', sectionId: 'sec-ali-fed-04', order: 2, description: 'Uniformes limpos e em adequado estado de conservação, com sapatos fechados e adequados à função.', legislation: 'RDC 216/2004 – item 4.4.1', weight: 10, isCritical: true },
          { id: 'ali-f-047', sectionId: 'sec-ali-fed-04', order: 3, description: 'Asseio pessoal: mãos limpas, unhas curtas, sem esmalte, sem adornos (anéis, pulseiras, brincos, etc.); manipuladores barbeados ou com proteção e cabelos protegidos com touca.', legislation: 'RDC 216/2004 – item 4.4.1', weight: 10, isCritical: true },
          { id: 'ali-f-048', sectionId: 'sec-ali-fed-04', order: 4, description: 'Manipuladores evitam comportamentos incorretos (fumar, tossir sobre os alimentos, cuspir, manipular dinheiro, usar celular) durante a manipulação.', legislation: 'RDC 216/2004 – item 4.4.1', weight: 10, isCritical: true },
          { id: 'ali-f-049', sectionId: 'sec-ali-fed-04', order: 5, description: 'Lavagem cuidadosa das mãos ao início do trabalho, após qualquer interrupção e depois do uso de sanitários.', legislation: 'RDC 216/2004 – item 4.4.1', weight: 10, isCritical: true },
          { id: 'ali-f-050', sectionId: 'sec-ali-fed-04', order: 6, description: 'Manipuladores são afastados quando apresentam afecções cutâneas, feridas e supurações; sintomas e infecções respiratórias, gastrointestinais e oculares.', legislation: 'RDC 216/2004 – item 4.4.1', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 5 ─────────────────────────────────────────────
      {
        id: 'sec-ali-fed-05',
        title: 'Recepção de Matérias-Primas e Ingredientes',
        order: 5,
        items: [
          { id: 'ali-f-051', sectionId: 'sec-ali-fed-05', order: 1, description: 'Matérias-primas, ingredientes e embalagens inspecionados na recepção (integridade, validade, temperatura). Embalagens secundárias retiradas e produtos reprovados devolvidos imediatamente.', legislation: 'RDC 216/2004 – item 4.5.1', weight: 5, isCritical: false },
          { id: 'ali-f-052', sectionId: 'sec-ali-fed-05', order: 2, description: 'Transporte das matérias-primas e ingredientes realizado em condições adequadas de higiene e conservação.', legislation: 'RDC 216/2004 – item 4.5.1', weight: 10, isCritical: true },
          { id: 'ali-f-053', sectionId: 'sec-ali-fed-05', order: 3, description: 'Rótulos da matéria-prima e ingredientes atendem à legislação.', legislation: 'RDC 216/2004 – item 4.5.1', weight: 10, isCritical: true },
          { id: 'ali-f-054', sectionId: 'sec-ali-fed-05', order: 4, description: 'Produtos de origem animal armazenados e/ou utilizados são provenientes de estabelecimentos devidamente registrados no órgão competente.', legislation: 'RDC 216/2004 – item 4.5.1', weight: 10, isCritical: true },
          { id: 'ali-f-055', sectionId: 'sec-ali-fed-05', order: 5, description: 'Matérias-primas fracionadas adequadamente acondicionadas e identificadas com: designação do produto, data de fracionamento e prazo de validade após abertura.', legislation: 'RDC 216/2004 – item 4.5.1', weight: 10, isCritical: true },
          { id: 'ali-f-056', sectionId: 'sec-ali-fed-05', order: 6, description: 'Matérias-primas e ingredientes com características sensoriais adequadas (textura, odor, cor) e prazo de validade observado com critério PVPS (primeiro que vence, primeiro que sai).', legislation: 'RDC 216/2004 – item 4.5.1', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 6 ─────────────────────────────────────────────
      {
        id: 'sec-ali-fed-06',
        title: 'Armazenamento',
        order: 6,
        items: [
          { id: 'ali-f-057', sectionId: 'sec-ali-fed-06', order: 1, description: 'Armazenamento em local adequado e organizado, sobre estrados ou paletes distantes do piso, afastados das paredes e do teto, permitindo higienização, iluminação e circulação de ar. Estrados de material liso, resistente, impermeável e lavável.', legislation: 'RDC 216/2004 – item 4.5.2', weight: 5, isCritical: false },
          { id: 'ali-f-058', sectionId: 'sec-ali-fed-06', order: 2, description: 'Rede de frio adequada ao volume e aos diferentes tipos de matérias-primas e ingredientes.', legislation: 'RDC 216/2004 – item 4.5.2', weight: 5, isCritical: false },
          { id: 'ali-f-059', sectionId: 'sec-ali-fed-06', order: 3, description: 'Produtos armazenados separados por gênero, protegidos e identificados.', legislation: 'RDC 216/2004 – item 4.5.2', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 7 ─────────────────────────────────────────────
      {
        id: 'sec-ali-fed-07',
        title: 'Produção e Fluxo de Alimentos',
        order: 7,
        items: [
          { id: 'ali-f-060', sectionId: 'sec-ali-fed-07', order: 1,  description: 'Fluxo de produção ordenado, linear e sem cruzamento, com locais para pré-preparo ("área suja") isolados da área de preparo por barreira física ou técnica.', legislation: 'RDC 216/2004 – item 4.5.3', weight: 10, isCritical: true },
          { id: 'ali-f-061', sectionId: 'sec-ali-fed-07', order: 2,  description: 'Na manipulação de produto de origem animal em temperatura ambiente, respeita-se o prazo máximo de 30 minutos, ou até 2h em temperatura climatizada entre 12°C e 18°C.', legislation: 'RDC 216/2004 – item 4.5.3', weight: 5, isCritical: false },
          { id: 'ali-f-062', sectionId: 'sec-ali-fed-07', order: 3,  description: 'Matérias-primas e ingredientes perecíveis expostos à temperatura ambiente somente pelo tempo mínimo necessário para preparação.', legislation: 'RDC 216/2004 – item 4.5.3', weight: 5, isCritical: false },
          { id: 'ali-f-063', sectionId: 'sec-ali-fed-07', order: 4,  description: 'Evita-se o contato direto ou indireto entre alimentos crus, semipreparados e prontos para o consumo.', legislation: 'RDC 216/2004 – item 4.5.3', weight: 10, isCritical: true },
          { id: 'ali-f-064', sectionId: 'sec-ali-fed-07', order: 5,  description: 'Funcionários que manipulam alimentos crus higienizam as mãos antes de manusear alimentos preparados.', legislation: 'RDC 216/2004 – item 4.5.3', weight: 10, isCritical: true },
          { id: 'ali-f-065', sectionId: 'sec-ali-fed-07', order: 6,  description: 'O tratamento térmico garante que o centro geométrico do alimento atinja mínimo 70°C por 2 min, ou 74°C em todas as partes, ou combinação equivalente de tempo/temperatura.', legislation: 'RDC 216/2004 – item 4.5.3', weight: 5, isCritical: false },
          { id: 'ali-f-066', sectionId: 'sec-ali-fed-07', order: 7,  description: 'A eficácia do tratamento térmico é avaliada pela verificação de temperatura e tempo, além da mudança na textura e cor na parte central do alimento.', legislation: 'RDC 216/2004 – item 4.5.3', weight: 5, isCritical: false },
          { id: 'ali-f-067', sectionId: 'sec-ali-fed-07', order: 8,  description: 'Óleos e gorduras aquecidos a temperaturas não superiores a 180°C; substituídos imediatamente ao apresentar alterações físico-químicas ou sensoriais.', legislation: 'RDC 216/2004 – item 4.5.3', weight: 5, isCritical: false },
          { id: 'ali-f-068', sectionId: 'sec-ali-fed-07', order: 9,  description: 'Descongelamento efetuado sob refrigeração a temperatura inferior a 5°C ou em micro-ondas quando o alimento for imediatamente submetido à cocção.', legislation: 'RDC 216/2004 – item 4.5.3', weight: 5, isCritical: false },
          { id: 'ali-f-069', sectionId: 'sec-ali-fed-07', order: 10, description: 'Alimentos descongelados mantidos sob refrigeração se não forem imediatamente utilizados. Não são recongelados.', legislation: 'RDC 216/2004 – item 4.5.3', weight: 10, isCritical: true },
          { id: 'ali-f-070', sectionId: 'sec-ali-fed-07', order: 11, description: 'Hortifrutícolas consumidos crus submetidos a processo de higienização com produto registrado no Ministério da Saúde.', legislation: 'RDC 216/2004 – item 4.5.3; RDC 218/2005', weight: 10, isCritical: true },
          { id: 'ali-f-071', sectionId: 'sec-ali-fed-07', order: 12, description: 'Temperatura do alimento preparado durante resfriamento reduzida de 60°C a 10°C em até duas horas.', legislation: 'RDC 216/2004 – item 4.5.3', weight: 5, isCritical: false },
          { id: 'ali-f-072', sectionId: 'sec-ali-fed-07', order: 13, description: 'Após cocção, alimentos mantidos a temperatura superior a 60°C por no máximo 6 horas.', legislation: 'RDC 216/2004 – item 4.5.3', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 8 ─────────────────────────────────────────────
      {
        id: 'sec-ali-fed-08',
        title: 'Rotulagem e Armazenamento pós-preparo',
        order: 8,
        items: [
          { id: 'ali-f-073', sectionId: 'sec-ali-fed-08', order: 1, description: 'Produtos de fabricação própria adequadamente acondicionados e identificados com: designação do produto, data de fabricação e prazo de validade.', legislation: 'RDC 216/2004 – item 4.5.4', weight: 10, isCritical: true },
          { id: 'ali-f-074', sectionId: 'sec-ali-fed-08', order: 2, description: 'Após cocção, alimento conservado sob refrigeração a temperaturas inferiores a 5°C, ou congelado à temperatura igual ou inferior a -18°C.', legislation: 'RDC 216/2004 – item 4.5.4', weight: 10, isCritical: true },
          { id: 'ali-f-075', sectionId: 'sec-ali-fed-08', order: 3, description: 'Alimentos preparados conservados a 4°C ou inferior possuem prazo máximo de consumo de 5 dias.', legislation: 'RDC 216/2004 – item 4.5.4', weight: 5, isCritical: false },
          { id: 'ali-f-076', sectionId: 'sec-ali-fed-08', order: 4, description: 'Embalagens prontas para uso dispostas em local próprio, protegidas e em número suficiente apenas para o uso diário.', legislation: 'RDC 216/2004 – item 4.5.4', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 9 ─────────────────────────────────────────────
      {
        id: 'sec-ali-fed-09',
        title: 'Exposição ao Consumo',
        order: 9,
        items: [
          { id: 'ali-f-077', sectionId: 'sec-ali-fed-09', order: 1, description: 'Equipamento de exposição do alimento preparado dispõe de barreiras de proteção que previnam contaminação pelo consumidor.', legislation: 'RDC 216/2004 – item 4.5.5', weight: 5, isCritical: false },
          { id: 'ali-f-078', sectionId: 'sec-ali-fed-09', order: 2, description: 'Equipamentos, móveis e utensílios compatíveis com as atividades, em número suficiente e em adequado estado de conservação e higiene.', legislation: 'RDC 216/2004 – item 4.5.5', weight: 10, isCritical: true },
          { id: 'ali-f-079', sectionId: 'sec-ali-fed-09', order: 3, description: 'Manipuladores adotam procedimentos que minimizam o risco de contaminação (antissepsia das mãos ou uso de utensílios/luvas descartáveis).', legislation: 'RDC 216/2004 – item 4.5.5', weight: 10, isCritical: true },
          { id: 'ali-f-080', sectionId: 'sec-ali-fed-09', order: 4, description: 'Alimentos quentes expostos a temperatura superior a 60°C por no máximo 6 horas, ou abaixo de 60°C por prazo máximo de 1 hora.', legislation: 'RDC 216/2004 – item 4.5.5', weight: 10, isCritical: true },
          { id: 'ali-f-081', sectionId: 'sec-ali-fed-09', order: 5, description: 'Alimentos resfriados expostos a temperatura de no máximo 5°C.', legislation: 'RDC 216/2004 – item 4.5.5', weight: 10, isCritical: true },
          { id: 'ali-f-082', sectionId: 'sec-ali-fed-09', order: 6, description: 'Utensílios de consumação (pratos, copos, talheres) devidamente higienizados e armazenados em local protegido.', legislation: 'RDC 216/2004 – item 4.5.5', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 10 ────────────────────────────────────────────
      {
        id: 'sec-ali-fed-10',
        title: 'Transporte de Alimentos',
        order: 10,
        items: [
          { id: 'ali-f-083', sectionId: 'sec-ali-fed-10', order: 1, description: 'Armazenamento e transporte em condições de tempo e temperatura que não comprometam a qualidade higiênico-sanitária, com controle/registro de temperaturas.', legislation: 'RDC 216/2004 – item 4.5.6', weight: 5, isCritical: false },
          { id: 'ali-f-084', sectionId: 'sec-ali-fed-10', order: 2, description: 'Veículos utilizados para transporte de alimentos devidamente licenciados pelo órgão competente de vigilância sanitária.', legislation: 'RDC 216/2004 – item 4.5.6', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 11 ────────────────────────────────────────────
      {
        id: 'sec-ali-fed-11',
        title: 'Documentação e Registros',
        order: 11,
        items: [
          { id: 'ali-f-085', sectionId: 'sec-ali-fed-11', order: 1,  description: 'Possui e cumpre o Manual de Boas Práticas específico para a empresa.', legislation: 'RDC 216/2004 – item 4.6.1', weight: 5, isCritical: false },
          { id: 'ali-f-086', sectionId: 'sec-ali-fed-11', order: 2,  description: 'Possui e cumpre os Procedimentos Operacionais Padronizados (POP): higienização de instalações, móveis e utensílios; controle integrado de vetores e pragas; higienização dos reservatórios; higiene e saúde dos manipuladores.', legislation: 'RDC 216/2004 – item 4.6.1', weight: 5, isCritical: false },
          { id: 'ali-f-087', sectionId: 'sec-ali-fed-11', order: 3,  description: 'Possui planilhas de controle de temperatura de câmaras, balcões, congeladores e equipamentos térmicos.', legislation: 'RDC 216/2004 – item 4.6.1', weight: 5, isCritical: false },
          { id: 'ali-f-088', sectionId: 'sec-ali-fed-11', order: 4,  description: 'Possui planilhas de registro da troca periódica dos elementos filtrantes (filtros, bebedouros, máquina de gelo, etc.).', legislation: 'RDC 216/2004 – item 4.6.1', weight: 5, isCritical: false },
          { id: 'ali-f-089', sectionId: 'sec-ali-fed-11', order: 5,  description: 'Possui planilhas de registro de tempo × temperatura dos balcões expositores.', legislation: 'RDC 216/2004 – item 4.6.1', weight: 5, isCritical: false },
          { id: 'ali-f-090', sectionId: 'sec-ali-fed-11', order: 6,  description: 'Possui planilhas de registro da recepção dos alimentos (condições do transporte, características sensoriais e temperatura).', legislation: 'RDC 216/2004 – item 4.6.1', weight: 5, isCritical: false },
          { id: 'ali-f-091', sectionId: 'sec-ali-fed-11', order: 7,  description: 'Possui registros de manutenção preventiva dos equipamentos e calibração dos instrumentos de medição.', legislation: 'RDC 216/2004 – item 4.6.1', weight: 5, isCritical: false },
          { id: 'ali-f-092', sectionId: 'sec-ali-fed-11', order: 8,  description: 'Possui registros de capacitação adequada e contínua dos manipuladores relacionados à higiene pessoal, boas práticas e uso de EPI.', legislation: 'RDC 216/2004 – item 4.6.1', weight: 5, isCritical: false },
          { id: 'ali-f-093', sectionId: 'sec-ali-fed-11', order: 9,  description: 'Possui comprovante atualizado de higienização do reservatório de água realizado semestralmente por empresa habilitada.', legislation: 'RDC 216/2004 – item 4.6.2', weight: 10, isCritical: true },
          { id: 'ali-f-094', sectionId: 'sec-ali-fed-11', order: 10, description: 'Possui laudo de potabilidade da água, inclusive se de fonte alternativa (poço, mina ou caminhão pipa).', legislation: 'RDC 216/2004 – item 4.6.2', weight: 5, isCritical: false },
          { id: 'ali-f-095', sectionId: 'sec-ali-fed-11', order: 11, description: 'Possui comprovante atualizado de execução do serviço de controle de pragas por empresa habilitada, informando produtos utilizados, métodos e registro no Ministério da Saúde.', legislation: 'RDC 216/2004 – item 4.6.3', weight: 5, isCritical: false },
          { id: 'ali-f-096', sectionId: 'sec-ali-fed-11', order: 12, description: 'Possui contrato com empresa para destinação adequada do lixo comum e Programa de Gerenciamento de Resíduos.', legislation: 'RDC 216/2004 – item 4.6.4', weight: 5, isCritical: false },
          { id: 'ali-f-097', sectionId: 'sec-ali-fed-11', order: 13, description: 'Responsável por todas as atividades com alimentos foi comprovadamente submetido a curso de capacitação com temas: contaminantes alimentares, DTAs, manipulação higiênica e boas práticas.', legislation: 'RDC 216/2004 – item 4.7', weight: 5, isCritical: false },
        ],
      },
    ],
  },


  // ════════════════════════════════════════════════════════════
  // TEMPLATE 4 — SERVIÇOS DE ALIMENTAÇÃO (RIO DE JANEIRO)
  // Específico para o Município do Rio de Janeiro
  // ⚠️  USAR APENAS quando o estabelecimento for do RJ
  // Base: Portaria IVISA-RIO nº 002/2020 +
  //       Decreto-Rio nº 45.585/2018 +
  //       Resolução SMS nº 2119/2013 +
  //       RDC 216/2004 (ANVISA)
  // Contém TODOS os itens federais + itens municipais exclusivos
  // ════════════════════════════════════════════════════════════
  {
    id: 'tpl-alimentos-rj-v1',
    name: 'Roteiro de Inspeção — Serviços de Alimentação (Município RJ)',
    category: 'alimentos',
    version: '2024-RJ',
    sections: [

      // ── SEÇÃO 1 ─────────────────────────────────────────────
      {
        id: 'sec-ali-rj-01',
        title: 'Edificação e Instalações',
        order: 1,
        items: [
          { id: 'ali-rj-001', sectionId: 'sec-ali-rj-01', order: 1,  description: 'Áreas internas e externas livres de objetos em desuso ou estranhos ao ambiente; dependências sem presença de animais e não utilizadas como habitação ou dormitório.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 33; Decreto-Rio 45585/18', weight: 5, isCritical: false },
          { id: 'ali-rj-002', sectionId: 'sec-ali-rj-01', order: 2,  description: 'Piso de material liso, antiderrapante, resistente e de fácil higienização, em adequado estado de conservação, com inclinação em direção aos ralos, com tampas escamoteáveis sifonadas e/ou grelhas.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 30 §2; Decreto-Rio 45585/18 item 1.2.1', weight: 5, isCritical: false },
          { id: 'ali-rj-003', sectionId: 'sec-ali-rj-01', order: 3,  description: 'Tetos, paredes e divisórias com revestimento liso, impermeável, lavável, de cor clara, íntegros, livres de rachaduras, descascamentos, bolores e infiltrações.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 30; Decreto-Rio 45585/18 item 1.3.1', weight: 5, isCritical: false },
          { id: 'ali-rj-004', sectionId: 'sec-ali-rj-01', order: 4,  description: 'Portas com acabamento liso, ajustadas aos batentes, em adequado estado de conservação. Portas externas com fechamento automático e telas milimétricas. Vedação: papelão, tapetes e carpetes são PROIBIDOS no piso.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 30 §4 e Art. 34; Decreto-Rio 45585/18 item 1.4', weight: 5, isCritical: false },
          { id: 'ali-rj-005', sectionId: 'sec-ali-rj-01', order: 5,  description: 'Janelas e outras aberturas com superfície lisa, de fácil higienização, ajustadas aos batentes, com telas milimétricas removíveis e em adequado estado de conservação.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 34 §2; Decreto-Rio 45585/18 item 1.5.1', weight: 5, isCritical: false },
          { id: 'ali-rj-006', sectionId: 'sec-ali-rj-01', order: 6,  description: 'Iluminação suficiente com luminárias protegidas contra queda e explosão (exceto LED), em adequado estado.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 44; Decreto-Rio 45585/18 item 1.7.1', weight: 5, isCritical: false },
          { id: 'ali-rj-007', sectionId: 'sec-ali-rj-01', order: 7,  description: 'Instalações elétricas embutidas ou revestidas por tubulações externas resistentes e íntegras. É VEDADA a instalação de armadilhas luminosas de eletrocussão de insetos.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 35; Art. 28 §5 IV; Decreto-Rio 45585/18 item 1.7.2', weight: 5, isCritical: false },
          { id: 'ali-rj-008', sectionId: 'sec-ali-rj-01', order: 8,  description: 'Sistema de climatização em bom estado de conservação e higiene. O fluxo de ar NÃO incide diretamente sobre os alimentos.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 40 e Art. 43; Decreto-Rio 45585/18 itens 1.8.1 e 1.8.2', weight: 10, isCritical: true },
          { id: 'ali-rj-009', sectionId: 'sec-ali-rj-01', order: 9,  description: 'Pontos de cocção instalados sob coifa com sistema de exaustão mecânica suficientemente dimensionado, abrangendo todos os equipamentos. Coifas, filtros e sistema de exaustão conservados e com manutenção registrada.', legislation: 'Portaria IVISA-RIO 002/2020, Arts. 40 a 42; Decreto-Rio 45585/18 item 1.8.3', weight: 5, isCritical: false },
          { id: 'ali-rj-010', sectionId: 'sec-ali-rj-01', order: 10, description: 'Instalações sanitárias sem comunicação direta com áreas de produção/manipulação/armazenamento de alimentos, com portas de fechamento automático e papel higiênico.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 45; Decreto-Rio 45585/18 item 1.9.1', weight: 5, isCritical: false },
          { id: 'ali-rj-011', sectionId: 'sec-ali-rj-01', order: 11, description: 'Sanitários dotados de: vaso com tampo e sobretampo, papel higiênico, lavatório para as mãos, dispensador de sabonete líquido, toalheiro com papel não reciclado, coletor com tampa sem acionamento manual.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 45 §3; Decreto-Rio 45585/18 itens 1.9.2 a 1.9.4', weight: 10, isCritical: true },
          { id: 'ali-rj-012', sectionId: 'sec-ali-rj-01', order: 12, description: 'Sanitários com avisos sobre procedimentos para lavagem das mãos.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 6 §2; Decreto-Rio 45585/18 item 1.9.5', weight: 5, isCritical: false },
          { id: 'ali-rj-013', sectionId: 'sec-ali-rj-01', order: 13, description: 'Vestiários com armários organizados, em número suficiente e em bom estado de conservação.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 45; Decreto-Rio 45585/18 item 1.9.7', weight: 5, isCritical: false },
          { id: 'ali-rj-014', sectionId: 'sec-ali-rj-01', order: 14, description: 'Lavatórios na área de produção com sabonete líquido antisséptico, toalhas de papel não reciclado e lixeiras com tampas sem acionamento manual. Junto a cada lavatório: dispensador de sabonete + toalheiro + coletor com tampa.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 38 §1; Decreto-Rio 45585/18 item 1.10.1', weight: 10, isCritical: true },
          { id: 'ali-rj-015', sectionId: 'sec-ali-rj-01', order: 15, description: 'Avisos com procedimentos para lavagem das mãos afixados nos lavatórios da área de produção.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 6 §2; Decreto-Rio 45585/18 item 1.10.2', weight: 5, isCritical: false },
          { id: 'ali-rj-016', sectionId: 'sec-ali-rj-01', order: 16, description: 'Ausência de vetores e pragas urbanas ou seus vestígios. Medidas preventivas e corretivas adotadas para impedir atração, abrigo, acesso e/ou proliferação.', legislation: 'Portaria IVISA-RIO 002/2020, Arts. 81 e 82; Decreto-Rio 45585/18 itens 1.11.1 e 1.11.2', weight: 10, isCritical: true },
          { id: 'ali-rj-017', sectionId: 'sec-ali-rj-01', order: 17, description: 'Controle químico de pragas executado por empresa credenciada ao INEA, com comprovante de execução, produtos utilizados, métodos, registro MS e assinatura do RT.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 82; Decreto-Rio 45585/18 itens 1.11.3 e 1.11.5', weight: 5, isCritical: false },
          { id: 'ali-rj-018', sectionId: 'sec-ali-rj-01', order: 18, description: 'Abastecimento de água ligado à rede pública ou, se fonte alternativa, com documentação de potabilidade. Reservatório de água acessível, tampado, em boas condições, livre de vazamentos e descascamentos.', legislation: 'Portaria IVISA-RIO 002/2020, Arts. 36 e 37; Decreto-Rio 45585/18 itens 1.12.1 e 1.12.2', weight: 10, isCritical: true },
          { id: 'ali-rj-019', sectionId: 'sec-ali-rj-01', order: 19, description: 'Gelo produzido com água potável, fabricado, manipulado e estocado sob condições sanitárias satisfatórias. Quando industrializado, embalado e rotulado. Filtro de água instalado nas áreas de preparo de bebidas e gelo.', legislation: 'Portaria IVISA-RIO 002/2020, Arts. 38 §3 e Art. 37; Decreto-Rio 45585/18 item 1.12.3', weight: 10, isCritical: true },
          { id: 'ali-rj-020', sectionId: 'sec-ali-rj-01', order: 20, description: 'Recipientes para coleta de resíduos com tampas sem acionamento manual, identificados e higienizados; uso de sacos de lixo apropriados. Resíduos retirados frequentemente.', legislation: 'Portaria IVISA-RIO 002/2020, Arts. 78 a 80; Decreto-Rio 45585/18 itens 1.13.1 a 1.13.4', weight: 10, isCritical: true },
          { id: 'ali-rj-021', sectionId: 'sec-ali-rj-01', order: 21, description: 'Resíduos líquidos (óleo vegetal) coletados por empresa credenciada ao INEA com apresentação do manifesto de resíduo.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 51; Decreto-Rio 45585/18 item 1.13.4', weight: 5, isCritical: false },
          { id: 'ali-rj-022', sectionId: 'sec-ali-rj-01', order: 22, description: 'Caixas de gordura e de esgoto em adequado estado de conservação, localizadas fora das áreas de preparação e armazenamento.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 39; Decreto-Rio 45585/18 item 1.14.1', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 2 ─────────────────────────────────────────────
      {
        id: 'sec-ali-rj-02',
        title: 'Equipamentos, Móveis e Utensílios',
        order: 2,
        items: [
          { id: 'ali-rj-023', sectionId: 'sec-ali-rj-02', order: 1, description: 'Equipamentos suficientes, em bom estado e dispostos de forma a permitir fácil acesso e higienização. Superfícies em contato com alimentos lisas, íntegras, impermeáveis, resistentes à corrosão.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 32; Decreto-Rio 45585/18 itens 2.1.1 e 2.1.2', weight: 5, isCritical: false },
          { id: 'ali-rj-024', sectionId: 'sec-ali-rj-02', order: 2, description: 'Equipamentos frigoríficos em adequado funcionamento. Câmaras frias com: interruptor externo de segurança, termômetro de leitura externa, dispositivo de abertura interna, prateleiras impermeáveis, iluminação interna protegida.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 31; Decreto-Rio 45585/18 item 2.1.3 e 2.1.4', weight: 10, isCritical: true },
          { id: 'ali-rj-025', sectionId: 'sec-ali-rj-02', order: 3, description: 'Móveis em número suficiente, de material liso, resistente, impermeável e lavável. Vedado o uso de madeira ou materiais que possam contaminar os alimentos.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 32 §3; Decreto-Rio 45585/18 item 2.2.1', weight: 5, isCritical: false },
          { id: 'ali-rj-026', sectionId: 'sec-ali-rj-02', order: 4, description: 'Utensílios de material não contaminante, resistentes à corrosão, de fácil higienização. Superfícies de corte de material atóxico. Cubas de aço inoxidável com dispositivo retentor de resíduos.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 32 §2; Decreto-Rio 45585/18 itens 2.3.1 e 2.3.2', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 3 ─────────────────────────────────────────────
      {
        id: 'sec-ali-rj-03',
        title: 'Higienização',
        order: 3,
        items: [
          { id: 'ali-rj-027', sectionId: 'sec-ali-rj-03', order: 1, description: 'Produtos de higienização regularizados pelo Ministério da Saúde, armazenados em local adequado, separado de alimentos, identificados. Diluição e tempo de contato conforme fabricante.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 48; Decreto-Rio 45585/18 item 3.1.1', weight: 5, isCritical: false },
          { id: 'ali-rj-028', sectionId: 'sec-ali-rj-03', order: 2, description: 'Não são utilizados panos convencionais. Panos multiuso para bancadas são descartados após cada uso. Proibido uso de panos de tecido para higienização de bancadas e superfícies.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 50; Decreto-Rio 45585/18 itens 3.1.2 e 3.1.3', weight: 5, isCritical: false },
          { id: 'ali-rj-029', sectionId: 'sec-ali-rj-03', order: 3, description: 'Possui água corrente em quantidade suficiente para higienização. Frequência de higienização das instalações adequada.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 47; Decreto-Rio 45585/18 itens 3.2.1 e 3.2.2', weight: 10, isCritical: true },
          { id: 'ali-rj-030', sectionId: 'sec-ali-rj-03', order: 4, description: 'Bancadas, móveis, equipamentos e utensílios higienizados antes das atividades e após o término do trabalho. As operações de higienização devem ser registradas rotineiramente.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 47 §2 e §3; Decreto-Rio 45585/18 item 3.3.1', weight: 10, isCritical: true },
          { id: 'ali-rj-031', sectionId: 'sec-ali-rj-03', order: 5, description: 'Pia de lavagem de utensílios provida de água quente corrente. Não são utilizadas escovas de metal, lã de aço ou materiais abrasivos.', legislation: 'Decreto-Rio 45585/18 itens 3.3.3 e 3.3.4', weight: 2, isCritical: false },
        ],
      },

      // ── SEÇÃO 4 ─────────────────────────────────────────────
      {
        id: 'sec-ali-rj-04',
        title: 'Manipuladores',
        order: 4,
        items: [
          { id: 'ali-rj-032', sectionId: 'sec-ali-rj-04', order: 1, description: 'Uniforme de trabalho de cor clara, exclusivo para a área de produção, limpo e em bom estado: camisa de manga, calça comprida, avental impermeável, calçado fechado impermeável antiderrapante e protetor para o cabelo.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 5; Decreto-Rio 45585/18 itens 4.1.1 e 4.1.2', weight: 10, isCritical: true },
          { id: 'ali-rj-033', sectionId: 'sec-ali-rj-04', order: 2, description: 'Asseio pessoal: banho diário, barba raspada ou protegida, unhas curtas, limpas e sem esmalte, ausência de adornos (anéis, pulseiras, brincos, piercing visível, etc.), sem maquiagem, cabelos protegidos.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 4 e Art. 5; Decreto-Rio 45585/18 item 4.1.3', weight: 10, isCritical: true },
          { id: 'ali-rj-034', sectionId: 'sec-ali-rj-04', order: 3, description: 'Manipuladores evitam comportamentos incorretos: fumar, tossir, cuspir sobre alimentos, manipular dinheiro, usar celular, mascar goma, tocar partes do corpo, usar pano para secar suor.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 46; Decreto-Rio 45585/18 item 4.1.4', weight: 10, isCritical: true },
          { id: 'ali-rj-035', sectionId: 'sec-ali-rj-04', order: 4, description: 'Lavagem cuidadosa das mãos ao início do trabalho, após qualquer interrupção e depois do uso dos sanitários. Procedimento correto: molhar, sabonete antisséptico, esfregar por 3min, enxaguar, secar com papel toalha.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 6; Decreto-Rio 45585/18 item 4.1.5', weight: 10, isCritical: true },
          { id: 'ali-rj-036', sectionId: 'sec-ali-rj-04', order: 5, description: 'Manipuladores afastados quando apresentam: patologias/lesões de pele, feridas nas mãos, infecções oculares, pulmonares, orofaríngeas ou gastrintestinais. Comprovação de atestado de saúde ocupacional admissional e periódico.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 4 §1 e §2; Decreto-Rio 45585/18 item 4.1.6', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 5 ─────────────────────────────────────────────
      {
        id: 'sec-ali-rj-05',
        title: 'Recepção e Armazenamento de Matérias-Primas',
        order: 5,
        items: [
          { id: 'ali-rj-037', sectionId: 'sec-ali-rj-05', order: 1, description: 'Matérias-primas inspecionadas na recepção (integridade, validade, temperatura). Embalagens secundárias (caixas de papelão, madeira) retiradas antes do armazenamento. Produtos reprovados devolvidos imediatamente.', legislation: 'Portaria IVISA-RIO 002/2020, Arts. 52 e 53; Decreto-Rio 45585/18 item 5.1.1', weight: 5, isCritical: false },
          { id: 'ali-rj-038', sectionId: 'sec-ali-rj-05', order: 2, description: 'Transporte das matérias-primas em condições adequadas de higiene e conservação. Veículos licenciados pelo órgão competente.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 77; Decreto-Rio 45585/18 item 5.1.2', weight: 10, isCritical: true },
          { id: 'ali-rj-039', sectionId: 'sec-ali-rj-05', order: 3, description: 'Rótulos atendem à legislação. Produtos de origem animal provenientes de estabelecimentos registrados no órgão competente. Matérias-primas fracionadas identificadas com: produto, data de fracionamento e prazo de validade.', legislation: 'Portaria IVISA-RIO 002/2020, Arts. 20 a 22; Decreto-Rio 45585/18 itens 5.1.3 a 5.1.5', weight: 10, isCritical: true },
          { id: 'ali-rj-040', sectionId: 'sec-ali-rj-05', order: 4, description: 'Armazenamento organizado sobre estrados, afastados das paredes (10cm), do chão (25cm) e do teto (60cm). Estrados de material liso, resistente, impermeável e lavável.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 56; Decreto-Rio 45585/18 item 5.2.1', weight: 5, isCritical: false },
          { id: 'ali-rj-041', sectionId: 'sec-ali-rj-05', order: 5, description: 'Rede de frio adequada ao volume e diferentes tipos. Temperatura de armazenamento: estoque seco até 25°C; carnes até 5°C; pescado até 4°C; embutidos/laticínios até 5°C; frutas/legumes/ovos até 10°C; congelados -12°C a -18°C.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 54 §1; Decreto-Rio 45585/18 item 5.2.2', weight: 5, isCritical: false },
          { id: 'ali-rj-042', sectionId: 'sec-ali-rj-05', order: 6, description: 'Produtos armazenados separados por gênero, protegidos e identificados. No interior das câmaras: industrializados embaixo, crus nas prateleiras centrais, alimentos preparados nas prateleiras superiores.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 54 §3; Decreto-Rio 45585/18 item 5.2.3', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 6 ─────────────────────────────────────────────
      {
        id: 'sec-ali-rj-06',
        title: 'Produção e Fluxo de Alimentos',
        order: 6,
        items: [
          { id: 'ali-rj-043', sectionId: 'sec-ali-rj-06', order: 1,  description: 'Fluxo de produção ordenado, linear e sem cruzamento, com pré-preparo ("área suja") isolado da área de preparo por barreira física ou técnica.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 49; Decreto-Rio 45585/18 item 5.3.1', weight: 10, isCritical: true },
          { id: 'ali-rj-044', sectionId: 'sec-ali-rj-06', order: 2,  description: 'Produto de origem animal manipulado em temperatura ambiente por no máximo 30 minutos; ou até 2h em ambiente climatizado entre 12°C e 18°C.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 60; Decreto-Rio 45585/18 item 5.3.2', weight: 5, isCritical: false },
          { id: 'ali-rj-045', sectionId: 'sec-ali-rj-06', order: 3,  description: 'Evita-se o contato direto ou indireto entre alimentos crus, semipreparados e prontos para o consumo. Funcionários que manipulam crus higienizam as mãos antes de manusear preparados.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 59; Decreto-Rio 45585/18 itens 5.3.4 e 5.3.5', weight: 10, isCritical: true },
          { id: 'ali-rj-046', sectionId: 'sec-ali-rj-06', order: 4,  description: 'Tratamento térmico garante temperatura mínima de 70°C por 2 min ou 74°C em todas as partes. Eficácia avaliada pela temperatura, tempo, textura e cor.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 62; Decreto-Rio 45585/18 itens 5.3.6 e 5.3.7', weight: 5, isCritical: false },
          { id: 'ali-rj-047', sectionId: 'sec-ali-rj-06', order: 5,  description: 'Óleos e gorduras aquecidos a não superior 180°C; substituídos imediatamente ao apresentar alterações. PROIBIDA a reutilização de óleos em outros alimentos.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 63; Decreto-Rio 45585/18 item 5.3.8', weight: 5, isCritical: false },
          { id: 'ali-rj-048', sectionId: 'sec-ali-rj-06', order: 6,  description: 'Descongelamento sob refrigeração < 5°C ou em micro-ondas com cocção imediata. PROIBIDO descongelar à temperatura ambiente, em água corrente ou submerso. Alimentos descongelados NÃO são recongelados.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 65; Decreto-Rio 45585/18 itens 5.3.9 e 5.3.10', weight: 10, isCritical: true },
          { id: 'ali-rj-049', sectionId: 'sec-ali-rj-06', order: 7,  description: 'Hortifrutícolas consumidos crus submetidos ao processo de higienização: lavagem individual em água corrente + solução sanitizante registrada no Ministério da Saúde, submersão por 20 min, enxague em água filtrada.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 72; Decreto-Rio 45585/18 item 5.3.11', weight: 10, isCritical: true },
          { id: 'ali-rj-050', sectionId: 'sec-ali-rj-06', order: 8,  description: 'Temperatura do alimento preparado durante resfriamento reduzida de 60°C a 10°C em até duas horas. Após cocção, alimentos mantidos acima de 60°C por no máximo 6h. Abaixo de 60°C: consumo em até 1h.', legislation: 'Portaria IVISA-RIO 002/2020, Arts. 66 e 68; Decreto-Rio 45585/18 itens 5.3.12 e 5.3.13', weight: 5, isCritical: false },
          { id: 'ali-rj-051', sectionId: 'sec-ali-rj-06', order: 9,  description: 'PROIBIDA a entrega ao consumo de alimentos a base de ovo cru e maionese caseira. Substituir por ovo líquido pasteurizado, liofilizado ou produto industrializado equivalente.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 74', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 7 ─────────────────────────────────────────────
      {
        id: 'sec-ali-rj-07',
        title: 'Rotulagem e Armazenamento pós-preparo',
        order: 7,
        items: [
          { id: 'ali-rj-052', sectionId: 'sec-ali-rj-07', order: 1, description: 'Produtos de fabricação própria identificados com: designação do produto, data de fabricação e prazo de validade. Após cocção, conservados sob refrigeração < 5°C ou congelados ≤ -18°C.', legislation: 'Portaria IVISA-RIO 002/2020, Arts. 66 a 69; Decreto-Rio 45585/18 itens 5.4.1 e 5.4.2', weight: 10, isCritical: true },
          { id: 'ali-rj-053', sectionId: 'sec-ali-rj-07', order: 2, description: 'Alimentos preparados conservados a 4°C ou inferior possuem prazo máximo de consumo de 5 dias.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 67; Decreto-Rio 45585/18 item 5.4.3', weight: 5, isCritical: false },
          { id: 'ali-rj-054', sectionId: 'sec-ali-rj-07', order: 3, description: 'Embalagens prontas para uso em local próprio, protegidas e em número suficiente para uso diário.', legislation: 'Decreto-Rio 45585/18 item 5.4.4', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 8 ─────────────────────────────────────────────
      {
        id: 'sec-ali-rj-08',
        title: 'Exposição ao Consumo',
        order: 8,
        items: [
          { id: 'ali-rj-055', sectionId: 'sec-ali-rj-08', order: 1, description: 'Equipamento de exposição com barreiras de proteção que previnem contaminação pelo consumidor. Equipamentos, móveis e utensílios em número suficiente e adequado estado.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 89; Decreto-Rio 45585/18 itens 5.5.1 e 5.5.2', weight: 10, isCritical: true },
          { id: 'ali-rj-056', sectionId: 'sec-ali-rj-08', order: 2, description: 'Manipuladores adotam procedimentos que minimizam contaminação (antissepsia das mãos ou utensílios/luvas). Alimentos quentes expostos > 60°C por no máximo 6h ou < 60°C por no máximo 1h.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 66 §único; Decreto-Rio 45585/18 itens 5.5.3 e 5.5.4', weight: 10, isCritical: true },
          { id: 'ali-rj-057', sectionId: 'sec-ali-rj-08', order: 3, description: 'Alimentos resfriados expostos a temperatura máxima de 5°C. Utensílios de consumação (pratos, copos, talheres) higienizados, desinfetados, secos e armazenados em local protegido.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 90; Decreto-Rio 45585/18 itens 5.5.5 e 5.5.6', weight: 10, isCritical: true },
          { id: 'ali-rj-058', sectionId: 'sec-ali-rj-08', order: 4, description: 'Funcionários responsáveis por recebimento de pagamento NÃO manipulam alimentos preparados. Área de caixa reservada.', legislation: 'Decreto-Rio 45585/18 item 5.5.8', weight: 5, isCritical: false },
          { id: 'ali-rj-059', sectionId: 'sec-ali-rj-08', order: 5, description: 'NÃO são utilizadas embalagens devassáveis (monodose) de molhos e temperos de mesa.', legislation: 'Decreto-Rio 45585/18 item 5.5.11', weight: 10, isCritical: true },
          { id: 'ali-rj-060', sectionId: 'sec-ali-rj-08', order: 6, description: 'Possui canudo de papel biodegradável e/ou reciclável embalado individualmente (quando aplicável).', legislation: 'Decreto-Rio 45585/18 item 5.5.12', weight: 10, isCritical: true },
          { id: 'ali-rj-061', sectionId: 'sec-ali-rj-08', order: 7, description: 'Possui placas ou dispositivo informando sobre a presença de GLÚTEN nas preparações e/ou cardápios.', legislation: 'Decreto-Rio 45585/18 item 5.5.13', weight: 10, isCritical: true },
          { id: 'ali-rj-062', sectionId: 'sec-ali-rj-08', order: 8, description: 'Não possui exposição de gêneros alimentícios fora da área física do estabelecimento.', legislation: 'Decreto-Rio 45585/18 item 5.5.14', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 9 ─────────────────────────────────────────────
      {
        id: 'sec-ali-rj-09',
        title: 'Transporte de Alimentos',
        order: 9,
        items: [
          { id: 'ali-rj-063', sectionId: 'sec-ali-rj-09', order: 1, description: 'Transporte com controle e registro de temperaturas. Refeições prontas acondicionadas em recipiente hermeticamente vedado, com rótulo: nome, CNPJ, tipo de alimento, data, hora, temperatura e prazo de validade.', legislation: 'Portaria IVISA-RIO 002/2020, Arts. 75 e 76; Decreto-Rio 45585/18 item 5.6.1', weight: 5, isCritical: false },
          { id: 'ali-rj-064', sectionId: 'sec-ali-rj-09', order: 2, description: 'Veículos para transporte de alimentos devidamente licenciados pelo órgão de VISA, exclusivos para essa finalidade, com carroceria fechada, conservados e em boas condições higiênico-sanitárias.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 77; Decreto-Rio 45585/18 item 5.6.2', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 10 ────────────────────────────────────────────
      {
        id: 'sec-ali-rj-10',
        title: 'Documentação e Registros',
        order: 10,
        items: [
          { id: 'ali-rj-065', sectionId: 'sec-ali-rj-10', order: 1,  description: 'Possui e cumpre o Manual de Boas Práticas específico para a empresa, aprovado, datado e assinado pelo RT.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 83; Decreto-Rio 45585/18 item 6.1.1', weight: 5, isCritical: false },
          { id: 'ali-rj-066', sectionId: 'sec-ali-rj-10', order: 2,  description: 'Possui e cumpre POPs para: higiene/saúde dos manipuladores; higienização de instalações; controle de vetores e pragas; higienização do reservatório de água; manejo de resíduos sólidos; descarte de óleo saturado; controle de temperatura de equipamentos frigorificados; higienização de hortifrutícolas; controle de tempo/temperatura das preparações.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 84; Decreto-Rio 45585/18 item 6.1.2', weight: 5, isCritical: false },
          { id: 'ali-rj-067', sectionId: 'sec-ali-rj-10', order: 3,  description: 'Possui planilhas de controle de temperatura de câmaras, balcões, congeladores e equipamentos térmicos, mantidas por mínimo 30 dias.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 84 §9; Decreto-Rio 45585/18 item 6.1.3', weight: 5, isCritical: false },
          { id: 'ali-rj-068', sectionId: 'sec-ali-rj-10', order: 4,  description: 'Possui planilhas de registro da troca periódica dos elementos filtrantes (filtros, bebedouros, máquina de gelo, etc.).', legislation: 'Decreto-Rio 45585/18 item 6.1.4', weight: 5, isCritical: false },
          { id: 'ali-rj-069', sectionId: 'sec-ali-rj-10', order: 5,  description: 'Possui planilhas de registro de tempo × temperatura dos balcões expositores.', legislation: 'Decreto-Rio 45585/18 item 6.1.5', weight: 5, isCritical: false },
          { id: 'ali-rj-070', sectionId: 'sec-ali-rj-10', order: 6,  description: 'Possui planilhas de registro da recepção dos alimentos (condições do transporte, características sensoriais e temperatura).', legislation: 'Decreto-Rio 45585/18 item 6.1.6', weight: 5, isCritical: false },
          { id: 'ali-rj-071', sectionId: 'sec-ali-rj-10', order: 7,  description: 'Possui registros de manutenção preventiva dos equipamentos e calibração dos instrumentos de medição.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 47 §4; Decreto-Rio 45585/18 item 6.1.7', weight: 5, isCritical: false },
          { id: 'ali-rj-072', sectionId: 'sec-ali-rj-10', order: 8,  description: 'Possui registros de capacitação contínua dos manipuladores, com carga horária, conteúdo programático, frequência e participação nominal.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 84 §3; Decreto-Rio 45585/18 item 6.1.8', weight: 5, isCritical: false },
          { id: 'ali-rj-073', sectionId: 'sec-ali-rj-10', order: 9,  description: 'Possui comprovante atualizado de higienização semestral do reservatório de água por empresa habilitada pelo INEA, com certificação, ordem de serviço válida e laudo de potabilidade de laboratório certificado.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 84 §7; Decreto-Rio 45585/18 item 6.2.1', weight: 10, isCritical: true },
          { id: 'ali-rj-074', sectionId: 'sec-ali-rj-10', order: 10, description: 'Possui laudo de potabilidade da água, inclusive se de fonte alternativa (poço, mina ou caminhão pipa).', legislation: 'Portaria IVISA-RIO 002/2020, Art. 37 §único; Decreto-Rio 45585/18 item 6.2.2', weight: 5, isCritical: false },
          { id: 'ali-rj-075', sectionId: 'sec-ali-rj-10', order: 11, description: 'Possui comprovante atualizado de execução do serviço de controle de pragas por empresa credenciada ao INEA, com produtos utilizados, métodos, registro MS e assinatura do RT.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 82; Decreto-Rio 45585/18 item 6.3.1', weight: 5, isCritical: false },
          { id: 'ali-rj-076', sectionId: 'sec-ali-rj-10', order: 12, description: 'Possui contrato com empresa para destinação adequada do lixo comum e Programa de Gerenciamento de Resíduos com manifestos do INEA.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 78; Decreto-Rio 45585/18 item 6.4.1', weight: 5, isCritical: false },
          { id: 'ali-rj-077', sectionId: 'sec-ali-rj-10', order: 13, description: 'Possui contrato com empresa terceirizada, credenciada no INEA, para coleta do óleo vegetal com apresentação do manifesto de resíduos.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 51; Decreto-Rio 45585/18 item 6.4.2', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 11 ────────────────────────────────────────────
      // Específica do Município do Rio de Janeiro
      {
        id: 'sec-ali-rj-11',
        title: 'Segurança dos Manipuladores — EPI (exclusivo RJ)',
        order: 11,
        items: [
          { id: 'ali-rj-078', sectionId: 'sec-ali-rj-11', order: 1, description: 'Área de atendimento com acesso e circulação livre e desobstruída, disposição adequada de equipamentos, fiações protegidas por conduites, interruptores e tomadas instalados adequadamente, sem objetos inservíveis.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 8; Decreto-Rio 45585/18 item 7.1', weight: 10, isCritical: true },
          { id: 'ali-rj-079', sectionId: 'sec-ali-rj-11', order: 2, description: 'EPIs disponíveis em local de fácil acesso, limpos e em bom estado: calçado antiderrapante para áreas com fritura, luvas e avental para lavagem de utensílios, luvas térmicas para forno, mangote para fritadeira, luva de malha de aço para corte de carnes, luva para gelo, luvas e calçados para limpeza e recolhimento de resíduos.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 8; Decreto-Rio 45585/18 item 7.2', weight: 10, isCritical: true },
          { id: 'ali-rj-080', sectionId: 'sec-ali-rj-11', order: 3, description: 'Câmaras frias com sistema de abertura pelo interior e oferta de roupa de proteção para exposição ao frio (vestimenta, casaco com capuz, luvas e botas térmicas).', legislation: 'Portaria IVISA-RIO 002/2020, Art. 8 §1; Decreto-Rio 45585/18 item 7.3', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 12 ────────────────────────────────────────────
      // Específica do Município do Rio de Janeiro
      {
        id: 'sec-ali-rj-12',
        title: 'Responsabilidade Técnica (exclusivo RJ)',
        order: 12,
        items: [
          { id: 'ali-rj-081', sectionId: 'sec-ali-rj-12', order: 1, description: 'O responsável por todas as atividades relacionadas a alimentos é o proprietário ou funcionário designado, devidamente submetido a curso de capacitação com temas: qualidade da água e controle de pragas; qualidade sanitária no armazenamento e manipulação; procedimentos de higienização; segurança e saúde do manipulador.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 9; Decreto-Rio 45585/18 item 8.1', weight: 5, isCritical: false },
          { id: 'ali-rj-082', sectionId: 'sec-ali-rj-12', order: 2, description: 'O responsável técnico exerce efetivamente suas atividades no local, é capacitado para acompanhar integralmente o processo de produção e tem autoridade para implementar as boas práticas, capacitar manipuladores, elaborar/atualizar MBP e POPs, e notificar surtos ao órgão sanitário.', legislation: 'Portaria IVISA-RIO 002/2020, Art. 10; Decreto-Rio 45585/18 item 8.1', weight: 5, isCritical: false },
        ],
      },
    ],
  },
];

// ── INSTRUÇÃO DE USO ──────────────────────────────────────────
//
// No arquivo src/data/templates.ts, adicionar ao final do
// array `templates` existente:
//
//   import { alimentosTemplates } from './templates_alimentos';
//
//   export const templates: ChecklistTemplate[] = [
//     ...existingTemplates,
//     ...alimentosTemplates,
//   ];
//
// No app, ao criar inspeção para cliente de categoria 'alimentos':
//   - Se client.city === 'Rio de Janeiro' ou client.state === 'RJ':
//     → Oferecer AMBOS os templates e deixar a consultora escolher
//       (ou forçar o RJ por padrão e mostrar o federal como alternativa)
//   - Para qualquer outro estado:
//     → Usar somente o federal (tpl-alimentos-federal-v1)
//
// LÓGICA SUGERIDA no componente de seleção de roteiro:
//   const templates = getTemplatesByCategory('alimentos');
//   const isRJ = client.state === 'RJ' || client.city?.includes('Rio de Janeiro');
//   const filteredTemplates = isRJ ? templates : templates.filter(t => t.id !== 'tpl-alimentos-rj-v1');
//
// ─────────────────────────────────────────────────────────────
