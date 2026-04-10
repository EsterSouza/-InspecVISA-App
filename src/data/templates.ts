// ============================================================
// src/data/templates.ts
// ROTEIROS REAIS — C&C CONSULTORIA SANITÁRIA
// Gerado automaticamente a partir dos ROIs originais
// Estética: V. atual (114 itens) | ILPI: V.11/2024 (81 itens)
// ============================================================

import type { ChecklistTemplate, Client } from '../types';
import { templateIlpiGoiasSuplement } from './templates-ilpi-goias-supplement';


// ── MAPEAMENTO DE PESOS ──────────────────────────────────────
// Estética:  Imprescindível=10 | Necessário=5 | Recomendado=2 | Sugerido=1
// ILPI:      Imprescindível=10 | Necessário=5 | Recomendável=2
// isCritical = true apenas para Imprescindível
// ─────────────────────────────────────────────────────────────

export const templates: ChecklistTemplate[] = [

  // ════════════════════════════════════════════════════════════
  // TEMPLATE 1 — ESTÉTICA E BELEZA
  // Base: RDC 63/2011, RDC 15/2012, RDC 222/2018, RDC 751/2022,
  //       RDC 36/2013, RDC 50/2002, NR 32 e legislações complementares
  // ════════════════════════════════════════════════════════════
  {
    id: 'tpl-estetica-v1',
    name: 'Roteiro de Inspeção — Estética e Beleza',
    category: 'estetica',
    version: '2024',
    sections: [

      // ── SEÇÃO 1 ─────────────────────────────────────────────
      {
        id: 'sec-est-01',
        title: 'Documentação e Regularização',
        order: 1,
        items: [
          { id: 'est-001', sectionId: 'sec-est-01', order: 1, description: 'Possui Alvará ou Licença Sanitária vigente, compatível com as atividades declaradas e afixada em local visível ao público.', legislation: 'Legislação Sanitária Federal e Local', weight: 10, isCritical: true },
          { id: 'est-002', sectionId: 'sec-est-01', order: 2, description: 'Possui CNPJ e o CNAE é compatível com os serviços prestados.', legislation: 'Legislação Tributária e Sanitária', weight: 10, isCritical: true },
          { id: 'est-003', sectionId: 'sec-est-01', order: 3, description: 'Possui Responsável Técnico (RT) de nível superior e legalmente habilitado, com comprovação de vínculo e certidão do conselho de classe.', legislation: 'Nota Técnica 02/2024/ANVISA; Resoluções de Conselhos Profissionais', weight: 10, isCritical: true },
          { id: 'est-004', sectionId: 'sec-est-01', order: 4, description: 'Apresenta o Plano de Gerenciamento de Resíduos de Serviços de Saúde (PGRSS) implementado e seguido na prática.', legislation: 'RDC nº 222/2018', weight: 10, isCritical: true },
          { id: 'est-005', sectionId: 'sec-est-01', order: 5, description: 'Apresenta o Plano de Segurança do Paciente (PSP) implantado, com os 6 protocolos básicos estabelecidos.', legislation: 'RDC nº 36/2013', weight: 10, isCritical: true },
          { id: 'est-006', sectionId: 'sec-est-01', order: 6, description: 'Possui Manual de Rotinas e Procedimentos (ou Manual de Biossegurança) contemplando todos os processos e condutas em caso de acidentes.', legislation: 'RDC nº 63/2011; NR 32', weight: 10, isCritical: true },
          { id: 'est-007', sectionId: 'sec-est-01', order: 7, description: 'Possui Procedimentos Operacionais Padrão (POPs) para todas as atividades críticas (limpeza, esterilização, uso de equipamentos, etc.).', legislation: 'RDC nº 63/2011', weight: 10, isCritical: true },
          { id: 'est-008', sectionId: 'sec-est-01', order: 8, description: 'Apresenta prontuários dos pacientes preenchidos adequadamente, sem rasuras, com assinatura do profissional e arquivados de forma a garantir sigilo e segurança.', legislation: 'RDC 63/2011; LGPD', weight: 10, isCritical: true },
          { id: 'est-009', sectionId: 'sec-est-01', order: 9, description: 'Apresenta Termo de Consentimento Livre e Esclarecido (TCLE) específico para cada procedimento invasivo realizado.', legislation: 'Resolução CNS nº 466/2012; Código de Ética Profissional', weight: 5, isCritical: false },
          { id: 'est-010', sectionId: 'sec-est-01', order: 10, description: 'Possui Projeto Básico de Arquitetura (PBA) ou Laudo Técnico de Avaliação (LTA) aprovado pela VISA, quando aplicável.', legislation: 'RDC nº 50/2002', weight: 10, isCritical: true },
          { id: 'est-011', sectionId: 'sec-est-01', order: 11, description: 'Apresenta relação formal de todos os profissionais que atuam no estabelecimento, com suas respectivas habilitações.', legislation: 'RDC 63/2011 art. 29 e 30', weight: 10, isCritical: true },
          { id: 'est-012', sectionId: 'sec-est-01', order: 12, description: 'Apresenta Memorial Descritivo detalhando todos os procedimentos, técnicas e tecnologias utilizadas no estabelecimento.', legislation: 'Boas Práticas de Gestão', weight: 5, isCritical: false },
          { id: 'est-013', sectionId: 'sec-est-01', order: 13, description: 'Apresenta uma lista formal de todos os equipamentos, incluindo marca, modelo e número de registro na ANVISA.', legislation: 'RDC 63/2011; RDC 751/2022', weight: 5, isCritical: false },
          { id: 'est-014', sectionId: 'sec-est-01', order: 14, description: 'Possui contratos e licenças sanitárias de todas as empresas terceirizadas (coleta de resíduos, controle de pragas, lavanderia, ar-condicionado etc.).', legislation: 'RDC nº 63/2011', weight: 10, isCritical: true },
          { id: 'est-015', sectionId: 'sec-est-01', order: 15, description: 'Possui processo de qualificação de fornecedores para insumos críticos, mantendo arquivada a documentação legal de cada um (Alvará Sanitário, AFE) e notas fiscais de compra.', legislation: 'Boas Práticas de Gestão', weight: 5, isCritical: false },
          { id: 'est-016', sectionId: 'sec-est-01', order: 16, description: 'Apresenta Laudo de Aterramento Elétrico para equipamentos de grande porte ou que emitam energia (ex: lasers, ultrassom).', legislation: 'NR 10; Manuais do Fabricante; ABNT NBR 13534', weight: 2, isCritical: false },
        ],
      },

      // ── SEÇÃO 2 ─────────────────────────────────────────────
      {
        id: 'sec-est-02',
        title: 'Saúde e Segurança do Trabalhador',
        order: 2,
        items: [
          { id: 'est-017', sectionId: 'sec-est-02', order: 1, description: 'Apresenta PCMSO (Programa de Controle Médico de Saúde Ocupacional), obrigatório para estabelecimentos com funcionários CLT.', legislation: 'NR-7', weight: 1, isCritical: false },
          { id: 'est-018', sectionId: 'sec-est-02', order: 2, description: 'Apresenta PGR (Programa de Gerenciamento de Riscos), incluindo Mapa de Risco do estabelecimento, obrigatório para estabelecimentos com funcionários CLT.', legislation: 'NR-1', weight: 1, isCritical: false },
          { id: 'est-019', sectionId: 'sec-est-02', order: 3, description: 'Possui registro de entrega de EPIs para todos os funcionários, com o devido Certificado de Aprovação (CA).', legislation: 'NR-6', weight: 1, isCritical: false },
          { id: 'est-020', sectionId: 'sec-est-02', order: 4, description: 'Apresenta comprovação de vacinação dos profissionais (ex: Hepatite B e Tétano) e controle de saúde (exame Anti-HBs).', legislation: 'NR-32', weight: 2, isCritical: false },
          { id: 'est-021', sectionId: 'sec-est-02', order: 5, description: 'Existe um programa de educação permanente documentado para todos os funcionários, com cronograma definido.', legislation: 'RDC 63/2011 art. 32', weight: 5, isCritical: false },
          { id: 'est-022', sectionId: 'sec-est-02', order: 6, description: 'Possui vestiário com armários individuais para guarda de pertences dos funcionários, e copa ou local para descanso e refeições.', legislation: 'NR 24; RDC 50/2002', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 3 ─────────────────────────────────────────────
      {
        id: 'sec-est-03',
        title: 'Infraestrutura Física',
        order: 3,
        items: [
          { id: 'est-023', sectionId: 'sec-est-03', order: 1, description: 'Pisos, paredes e tetos de todas as áreas são de material liso, lavável, impermeável e estão em bom estado de conservação.', legislation: 'RDC nº 50/2002', weight: 10, isCritical: true },
          { id: 'est-024', sectionId: 'sec-est-03', order: 2, description: 'Todo o mobiliário (macas, bancadas, carrinhos, armários) é de material liso, lavável, impermeável, íntegro e resistente.', legislation: 'RDC nº 63/2011', weight: 10, isCritical: true },
          { id: 'est-025', sectionId: 'sec-est-03', order: 3, description: 'As instalações (elétricas, hidráulicas) estão embutidas ou protegidas por calhas e em bom estado, sem fios expostos.', legislation: 'RDC nº 50/2002; NR-10', weight: 10, isCritical: true },
          { id: 'est-026', sectionId: 'sec-est-03', order: 4, description: 'A iluminação e ventilação (natural ou artificial) são adequadas em todas as áreas, incluindo a sala de espera.', legislation: 'RDC nº 50/2002', weight: 10, isCritical: true },
          { id: 'est-027', sectionId: 'sec-est-03', order: 5, description: 'Possui sanitários para funcionários e público, distintos, completos e em bom estado de funcionamento.', legislation: 'RDC nº 50/2002', weight: 10, isCritical: true },
          { id: 'est-028', sectionId: 'sec-est-03', order: 6, description: 'A sala de procedimentos é exclusiva para este fim, com dimensões adequadas e devidamente identificada.', legislation: 'RDC nº 50/2002', weight: 10, isCritical: true },
          { id: 'est-029', sectionId: 'sec-est-03', order: 7, description: 'Possui lavatório para higiene das mãos na sala de procedimento, de uso exclusivo, dotado de todos os insumos (sabonete, papel, lixeira com pedal).', legislation: 'RDC nº 63/2011; RDC 50/2002', weight: 10, isCritical: true },
          { id: 'est-030', sectionId: 'sec-est-03', order: 8, description: 'Possui Depósito de Material de Limpeza (DML) com tanque e local exclusivo para guarda de saneantes.', legislation: 'RDC nº 50/2002', weight: 10, isCritical: true },
          { id: 'est-031', sectionId: 'sec-est-03', order: 9, description: 'O estabelecimento está organizado, limpo e livre de materiais em desuso ou alheios à atividade.', legislation: 'Legislação Sanitária Local', weight: 10, isCritical: true },
          { id: 'est-032', sectionId: 'sec-est-03', order: 10, description: 'O estabelecimento promove acessibilidade para pessoas com deficiência ou mobilidade reduzida.', legislation: 'NBR 9050', weight: 10, isCritical: true },
          { id: 'est-033', sectionId: 'sec-est-03', order: 11, description: 'A área de recepção/espera é separada das áreas de procedimento e oferece condições de conforto e higiene.', legislation: 'RDC 50/2002', weight: 10, isCritical: true },
          { id: 'est-034', sectionId: 'sec-est-03', order: 12, description: 'As janelas das áreas críticas possuem tela milimétrica para proteção contra vetores.', legislation: 'RDC 50/2002', weight: 2, isCritical: false },
          { id: 'est-035', sectionId: 'sec-est-03', order: 13, description: 'Os ralos, se existentes em áreas críticas, possuem sistema de fechamento (grelha ou similar).', legislation: 'RDC 50/2002', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 4 ─────────────────────────────────────────────
      {
        id: 'sec-est-04',
        title: 'Processamento de Artigos (CME)',
        order: 4,
        items: [
          { id: 'est-036', sectionId: 'sec-est-04', order: 1, description: 'Possui Central de Material e Esterilização (CME) ou área de processamento com barreira física e fluxo unidirecional (sujo/limpo).', legislation: 'RDC nº 15/2012', weight: 10, isCritical: true },
          { id: 'est-037', sectionId: 'sec-est-04', order: 2, description: 'A limpeza de instrumentais utiliza detergente enzimático regularizado na ANVISA, em cuba de imersão ou lavadora ultrassônica.', legislation: 'RDC nº 15/2012', weight: 10, isCritical: true },
          { id: 'est-038', sectionId: 'sec-est-04', order: 3, description: 'A pia de lavagem de instrumentais (expurgo) é exclusiva para este fim, com cuba profunda e separada da área limpa.', legislation: 'RDC nº 15/2012; RDC 50/2002', weight: 10, isCritical: true },
          { id: 'est-039', sectionId: 'sec-est-04', order: 4, description: 'A esterilização de artigos críticos é feita exclusivamente por autoclave com registro na ANVISA, instalada em bancada apropriada.', legislation: 'RDC nº 15/2012', weight: 10, isCritical: true },
          { id: 'est-040', sectionId: 'sec-est-04', order: 5, description: 'Apresenta validação (qualificação de instalação, operação e desempenho) da autoclave, realizada por empresa especializada.', legislation: 'RDC 15/2012 art. 95-97', weight: 10, isCritical: true },
          { id: 'est-041', sectionId: 'sec-est-04', order: 6, description: 'Realiza monitoramento do processo de esterilização com indicadores químicos (em todos os pacotes) e biológicos (frequência mínima semanal).', legislation: 'RDC nº 15/2012', weight: 10, isCritical: true },
          { id: 'est-042', sectionId: 'sec-est-04', order: 7, description: 'Mantém registros de todos os ciclos de esterilização e dos testes de monitoramento, garantindo rastreabilidade.', legislation: 'RDC nº 15/2012', weight: 10, isCritical: true },
          { id: 'est-043', sectionId: 'sec-est-04', order: 8, description: 'Os materiais esterilizados possuem etiqueta com data de esterilização, validade, lote e responsável pelo preparo.', legislation: 'RDC 15/2012 art. 83', weight: 10, isCritical: true },
          { id: 'est-044', sectionId: 'sec-est-04', order: 9, description: 'O armazenamento de material estéril é feito em armário fechado, exclusivo, limpo, seco e de acesso restrito.', legislation: 'RDC nº 15/2012', weight: 10, isCritical: true },
          { id: 'est-045', sectionId: 'sec-est-04', order: 10, description: 'Os artigos de uso único são descartados após o uso, sendo proibido seu reprocessamento.', legislation: 'RDC nº 156/2006; RE 2605/2006', weight: 10, isCritical: true },
          { id: 'est-046', sectionId: 'sec-est-04', order: 11, description: 'As embalagens utilizadas para esterilização (grau cirúrgico) são apropriadas e regularizadas na ANVISA.', legislation: 'RDC 15/2012', weight: 10, isCritical: true },
          { id: 'est-047', sectionId: 'sec-est-04', order: 12, description: 'Possui registro da limpeza e desinfecção periódica da área de processamento de artigos (CME).', legislation: 'RDC 15/2012 art. 65', weight: 5, isCritical: false },
        ],
      },

      // ── SEÇÃO 5 ─────────────────────────────────────────────
      {
        id: 'sec-est-05',
        title: 'Biossegurança',
        order: 5,
        items: [
          { id: 'est-048', sectionId: 'sec-est-05', order: 1, description: 'Os profissionais não comem, bebem ou guardam alimentos nos postos de trabalho (bancadas e salas de procedimento).', legislation: 'NR 32', weight: 10, isCritical: true },
          { id: 'est-049', sectionId: 'sec-est-05', order: 2, description: 'Os profissionais utilizam EPIs completos e adequados para cada tipo de procedimento.', legislation: 'NR 32; RDC 63/2011', weight: 10, isCritical: true },
          { id: 'est-050', sectionId: 'sec-est-05', order: 3, description: 'Possui protocolo de Higiene das Mãos implantado e disponibiliza preparação alcoólica em pontos estratégicos.', legislation: 'RDC nº 36/2013; RDC 42/2010', weight: 5, isCritical: false },
          { id: 'est-051', sectionId: 'sec-est-05', order: 4, description: 'É realizada a desinfecção de superfícies (macas, bancadas, equipamentos) entre um paciente e outro.', legislation: 'RDC 63/2011', weight: 10, isCritical: true },
          { id: 'est-052', sectionId: 'sec-est-05', order: 5, description: 'Materiais perfurocortantes são descartados em coletores rígidos, localizados em suporte seguro e substituídos ao atingir o limite.', legislation: 'RDC nº 222/2018; NR 32', weight: 10, isCritical: true },
          { id: 'est-053', sectionId: 'sec-est-05', order: 6, description: 'É utilizada barreira de proteção descartável (lençol, filme PVC) em equipamentos e mobiliário que entram em contato com o paciente.', legislation: 'Princípios de Biossegurança', weight: 10, isCritical: true },
          { id: 'est-054', sectionId: 'sec-est-05', order: 7, description: 'Os calçados utilizados pelos profissionais na área de procedimento são fechados.', legislation: 'NR 32', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 6 ─────────────────────────────────────────────
      {
        id: 'sec-est-06',
        title: 'Segurança do Paciente',
        order: 6,
        items: [
          { id: 'est-055', sectionId: 'sec-est-06', order: 1, description: 'O estabelecimento (se aplicável) possui Núcleo de Segurança do Paciente (NSP) formalmente instituído.', legislation: 'RDC nº 36/2013', weight: 2, isCritical: false },
          { id: 'est-056', sectionId: 'sec-est-06', order: 2, description: 'Possui protocolo para manejo de intercorrências e emergências, com plano de encaminhamento definido.', legislation: 'RDC nº 63/2011; Nota Técnica 02/2024/ANVISA', weight: 10, isCritical: true },
          { id: 'est-057', sectionId: 'sec-est-06', order: 3, description: 'Possui Maleta de Intercorrências equipada para suporte básico de vida, com materiais e medicamentos essenciais, controle de validade e em local de fácil acesso.', legislation: 'RDC 63/2011; Resoluções de Conselhos Profissionais', weight: 5, isCritical: false },
          { id: 'est-058', sectionId: 'sec-est-06', order: 4, description: 'Realiza a notificação de eventos adversos e queixas técnicas de produtos e equipamentos no sistema NOTIVISA.', legislation: 'RDC nº 36/2013; RDC 751/2022; RDC 864/2024', weight: 2, isCritical: false },
          { id: 'est-059', sectionId: 'sec-est-06', order: 5, description: 'Adota o protocolo de identificação do paciente para garantir que o procedimento seja realizado na pessoa correta.', legislation: 'RDC nº 36/2013', weight: 10, isCritical: true },
          { id: 'est-060', sectionId: 'sec-est-06', order: 6, description: 'Adota o protocolo de cirurgia segura (quando aplicável), com checagem de lateralidade, procedimento e materiais.', legislation: 'RDC nº 36/2013', weight: 2, isCritical: false },
          { id: 'est-061', sectionId: 'sec-est-06', order: 7, description: 'As instruções pós-procedimento são fornecidas por escrito aos pacientes, com orientações claras e contatos de emergência.', legislation: 'Código de Defesa do Consumidor; Boas Práticas', weight: 10, isCritical: true },
          { id: 'est-062', sectionId: 'sec-est-06', order: 8, description: 'É realizada a rastreabilidade dos produtos (lote, validade) e equipamentos utilizados em cada paciente, vinculada ao prontuário.', legislation: 'RDC 63/2011; RDC 36/2013', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 7 ─────────────────────────────────────────────
      {
        id: 'sec-est-07',
        title: 'Equipamentos e Produtos',
        order: 7,
        items: [
          { id: 'est-063', sectionId: 'sec-est-07', order: 1, description: 'Todos os equipamentos possuem registro ou notificação na ANVISA e são utilizados estritamente para a finalidade aprovada.', legislation: 'RDC nº 751/2022', weight: 10, isCritical: true },
          { id: 'est-064', sectionId: 'sec-est-07', order: 2, description: 'Possui o manual de instruções de todos os equipamentos em português e acessível aos operadores.', legislation: 'RDC nº 751/2022', weight: 1, isCritical: false },
          { id: 'est-065', sectionId: 'sec-est-07', order: 3, description: 'Apresenta registros de manutenção preventiva e calibração periódica dos equipamentos, conforme manual do fabricante.', legislation: 'RDC nº 63/2011', weight: 10, isCritical: true },
          { id: 'est-066', sectionId: 'sec-est-07', order: 4, description: 'Os saneantes utilizados para limpeza e desinfecção são regularizados na ANVISA e utilizados conforme a diluição e tempo corretos.', legislation: 'Lei nº 6.360/1976', weight: 10, isCritical: true },
          { id: 'est-067', sectionId: 'sec-est-07', order: 5, description: 'Todos os cosméticos e produtos para saúde são regularizados na ANVISA, estão no prazo de validade e armazenados corretamente.', legislation: 'Lei nº 6.360/1976', weight: 10, isCritical: true },
          { id: 'est-068', sectionId: 'sec-est-07', order: 6, description: 'Os produtos expostos à venda (cosméticos, etc.) estão regularizados junto à ANVISA e armazenados de forma segregada dos de uso profissional.', legislation: 'Legislação Municipal / Sanitária', weight: 10, isCritical: true },
          { id: 'est-069', sectionId: 'sec-est-07', order: 7, description: 'É proibido o fracionamento de produtos, exceto se especificado pelo fabricante e seguindo critérios técnicos de biossegurança.', legislation: 'Boas Práticas', weight: 10, isCritical: true },
          { id: 'est-070', sectionId: 'sec-est-07', order: 8, description: 'Produtos abertos ou fracionados possuem identificação com nome, data de abertura e nova data de validade.', legislation: 'RDC nº 63/2011', weight: 10, isCritical: true },
          { id: 'est-071', sectionId: 'sec-est-07', order: 9, description: 'Possui refrigerador exclusivo para medicamentos e termolábeis, com controle e registro diário de temperatura (mínima e máxima).', legislation: 'RDC 63/2011; Boas Práticas de Armazenamento', weight: 10, isCritical: true },
          { id: 'est-072', sectionId: 'sec-est-07', order: 10, description: 'Possui plano de contingência para o armazenamento de produtos termolábeis em caso de falta de energia.', legislation: 'Boas Práticas de Armazenamento', weight: 2, isCritical: false },
          { id: 'est-073', sectionId: 'sec-est-07', order: 11, description: 'Caso utilize medicamentos sujeitos a controle especial (Portaria 344/98), apresenta a Autorização de Funcionamento Especial (AFE).', legislation: 'Portaria SVS/MS nº 344/98', weight: 1, isCritical: false },
          { id: 'est-074', sectionId: 'sec-est-07', order: 12, description: 'O local de armazenamento de medicamentos controlados é exclusivo, trancado com chave e de acesso restrito.', legislation: 'Portaria SVS/MS nº 344/98', weight: 1, isCritical: false },
          { id: 'est-075', sectionId: 'sec-est-07', order: 13, description: 'Realiza e mantém os registros do Balanço de Substâncias Psicoativas e Outras (BSPO), conforme legislação.', legislation: 'Portaria SVS/MS nº 344/98', weight: 1, isCritical: false },
          { id: 'est-076', sectionId: 'sec-est-07', order: 14, description: 'Há controle de temperatura e integridade para amostras grátis de medicamentos, sob responsabilidade do prescritor.', legislation: 'Boas Práticas de Armazenamento', weight: 10, isCritical: true },
          { id: 'est-077', sectionId: 'sec-est-07', order: 15, description: 'Os medicamentos manipulados possuem rótulo com os dados da farmácia de manipulação e do paciente/clínica.', legislation: 'RDC 67/2007', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 8 ─────────────────────────────────────────────
      {
        id: 'sec-est-08',
        title: 'Gestão de Resíduos',
        order: 8,
        items: [
          { id: 'est-078', sectionId: 'sec-est-08', order: 1, description: 'Apresenta contrato com empresa licenciada para coleta, transporte e destinação final de resíduos de saúde (Grupos A, B, E).', legislation: 'RDC nº 222/2018', weight: 10, isCritical: true },
          { id: 'est-079', sectionId: 'sec-est-08', order: 2, description: 'A segregação dos resíduos (infectante, químico, perfurocortante, comum) é realizada corretamente no momento e local de sua geração.', legislation: 'RDC nº 222/2018', weight: 10, isCritical: true },
          { id: 'est-080', sectionId: 'sec-est-08', order: 3, description: 'Os recipientes de descarte (lixeiras) são adequados ao tipo de resíduo, com tampa de acionamento por pedal e simbologia correta.', legislation: 'RDC nº 222/2018', weight: 10, isCritical: true },
          { id: 'est-081', sectionId: 'sec-est-08', order: 4, description: 'Os sacos de lixo utilizados correspondem à cor padronizada para cada tipo de resíduo.', legislation: 'RDC nº 222/2018', weight: 10, isCritical: true },
          { id: 'est-082', sectionId: 'sec-est-08', order: 5, description: 'Os resíduos são retirados das salas de procedimento quando o recipiente atingir 2/3 da capacidade ou no mínimo a cada 48h.', legislation: 'RDC 222/2018 art. 14', weight: 10, isCritical: true },
          { id: 'est-083', sectionId: 'sec-est-08', order: 6, description: 'Possui abrigo externo de resíduos, em conformidade com a RDC 222/2018 (separado, identificado, protegido, com ponto de água).', legislation: 'RDC nº 222/2018', weight: 10, isCritical: true },
          { id: 'est-084', sectionId: 'sec-est-08', order: 7, description: 'O descarte de medicamentos e químicos é realizado conforme o PGRSS, em conformidade com a RDC 222/2018.', legislation: 'RDC 222/2018', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 9 ─────────────────────────────────────────────
      {
        id: 'sec-est-09',
        title: 'Controle de Vetores e Qualidade da Água',
        order: 9,
        items: [
          { id: 'est-085', sectionId: 'sec-est-09', order: 1, description: 'Apresenta comprovante de controle de vetores e pragas urbanas, realizado por empresa licenciada e dentro da validade.', legislation: 'RDC 63/2011 art. 23', weight: 10, isCritical: true },
          { id: 'est-086', sectionId: 'sec-est-09', order: 2, description: 'Apresenta comprovante de limpeza e desinfecção do reservatório de água, com periodicidade mínima semestral.', legislation: 'RDC 63/2011 art. 39', weight: 10, isCritical: true },
          { id: 'est-087', sectionId: 'sec-est-09', order: 3, description: 'Apresenta laudos de potabilidade da água, conforme periodicidade semestral.', legislation: 'Portaria GM/MS Nº 888/2021', weight: 10, isCritical: true },
        ],
      },

      // ── SEÇÃO 10 ────────────────────────────────────────────
      {
        id: 'sec-est-10',
        title: 'Lavanderia',
        order: 10,
        items: [
          { id: 'est-088', sectionId: 'sec-est-10', order: 1, description: 'As roupas limpas são armazenadas em local separado, limpo e fechado.', legislation: 'RDC 63/2011', weight: 1, isCritical: false },
          { id: 'est-089', sectionId: 'sec-est-10', order: 2, description: 'As roupas sujas são acondicionadas em sacos impermeáveis e transportadas separadamente das limpas.', legislation: 'RDC 63/2011', weight: 1, isCritical: false },
          { id: 'est-090', sectionId: 'sec-est-10', order: 3, description: 'Se o processamento de roupas é terceirizado, apresenta contrato com lavanderia que possua licença sanitária.', legislation: 'Boas Práticas', weight: 1, isCritical: false },
          { id: 'est-091', sectionId: 'sec-est-10', order: 4, description: 'As toalhas de tecido, se utilizadas, são de cor clara e de uso individual.', legislation: 'Legislação Municipal; Resoluções de Conselhos', weight: 1, isCritical: false },
        ],
      },

      // ── SEÇÃO 11 ────────────────────────────────────────────
      {
        id: 'sec-est-11',
        title: 'Considerações Gerais',
        order: 11,
        items: [
          { id: 'est-092', sectionId: 'sec-est-11', order: 1, description: 'A publicidade e propaganda do estabelecimento não são enganosas e respeitam as normas dos conselhos profissionais.', legislation: 'Código de Defesa do Consumidor; Resoluções de Conselhos', weight: 2, isCritical: false },
          { id: 'est-093', sectionId: 'sec-est-11', order: 2, description: 'É proibido o uso de equipamentos de bronzeamento artificial com emissão de UV.', legislation: 'RDC 56/2009', weight: 10, isCritical: true },
          { id: 'est-094', sectionId: 'sec-est-11', order: 3, description: 'Os profissionais executam apenas os procedimentos para os quais estão legalmente habilitados.', legislation: 'Lei do Exercício Profissional; Resoluções de Conselhos', weight: 10, isCritical: true },
          { id: 'est-095', sectionId: 'sec-est-11', order: 4, description: 'O estabelecimento possui extintores de incêndio com carga e validade em dia e em locais sinalizados.', legislation: 'Normas do Corpo de Bombeiros', weight: 5, isCritical: false },
          { id: 'est-096', sectionId: 'sec-est-11', order: 5, description: 'As saídas de emergência estão desobstruídas e sinalizadas.', legislation: 'Normas do Corpo de Bombeiros', weight: 2, isCritical: false },
          { id: 'est-097', sectionId: 'sec-est-11', order: 6, description: 'É proibido fumar no interior do estabelecimento.', legislation: 'Lei Federal nº 9.294/1996', weight: 10, isCritical: true },
          { id: 'est-098', sectionId: 'sec-est-11', order: 7, description: 'Há bebedouro com água potável disponível para funcionários e clientes, com manutenção em dia.', legislation: 'Boas Práticas', weight: 10, isCritical: true },
          { id: 'est-099', sectionId: 'sec-est-11', order: 8, description: 'O ar condicionado, se existente, possui plano de manutenção e registros de limpeza dos filtros.', legislation: 'Lei Federal nº 13.589/2018', weight: 10, isCritical: true },
          { id: 'est-100', sectionId: 'sec-est-11', order: 9, description: 'A validade dos produtos saneantes é controlada e os mesmos são armazenados em local próprio (DML).', legislation: 'RDC 63/2011', weight: 10, isCritical: true },
          { id: 'est-101', sectionId: 'sec-est-11', order: 10, description: 'Os uniformes dos funcionários estão limpos, em bom estado de conservação e são de uso exclusivo nas dependências do serviço.', legislation: 'RDC 63/2011', weight: 2, isCritical: false },
          { id: 'est-102', sectionId: 'sec-est-11', order: 11, description: 'A empresa possui Livro de Reclamações do Consumidor, conforme exigência local.', legislation: 'Legislação do Consumidor', weight: 10, isCritical: true },
          { id: 'est-103', sectionId: 'sec-est-11', order: 12, description: 'A empresa notifica compulsoriamente os agravos à saúde de acordo com a legislação.', legislation: 'Portaria de Consolidação nº 4/2017 (GM/MS)', weight: 10, isCritical: true },
          { id: 'est-104', sectionId: 'sec-est-11', order: 13, description: 'O descarte de embalagens de produtos é realizado de forma a inutilizá-las para evitar o reuso.', legislation: 'Boas Práticas', weight: 10, isCritical: true },
          { id: 'est-105', sectionId: 'sec-est-11', order: 14, description: 'Existe rotina de limpeza periódica de todos os equipamentos (parte externa).', legislation: 'RDC 63/2011', weight: 10, isCritical: true },
          { id: 'est-106', sectionId: 'sec-est-11', order: 15, description: 'O estabelecimento possui um local seguro para a guarda de pertences de clientes/pacientes.', legislation: 'Boas Práticas de Atendimento', weight: 2, isCritical: false },
          { id: 'est-107', sectionId: 'sec-est-11', order: 16, description: 'O estabelecimento possui toda a sinalização visível (nome do RT, telefones de emergência, direitos do paciente, etc.).', legislation: 'Legislação Local; Boas Práticas', weight: 1, isCritical: false },
          { id: 'est-108', sectionId: 'sec-est-11', order: 17, description: 'Os certificados de calibração dos equipamentos estão disponíveis e dentro da validade.', legislation: 'RDC 63/2011', weight: 10, isCritical: true },
          { id: 'est-109', sectionId: 'sec-est-11', order: 18, description: 'O estabelecimento possui e implementa um programa de gerenciamento de tecnologias em saúde.', legislation: 'RDC 63/2011', weight: 2, isCritical: false },
        ],
      },

      // ── SEÇÃO 12 ────────────────────────────────────────────
      {
        id: 'sec-est-12',
        title: 'Gestão da Qualidade',
        order: 12,
        items: [
          { id: 'est-110', sectionId: 'sec-est-12', order: 1, description: 'A instituição avalia periodicamente seus processos e indicadores de qualidade e segurança.', legislation: 'RDC 63/2011', weight: 2, isCritical: false },
          { id: 'est-111', sectionId: 'sec-est-12', order: 2, description: 'Existe uma política institucional documentada que proíbe o reprocessamento de artigos de uso único.', legislation: 'RDC 63/2011; RE 2605/2006', weight: 10, isCritical: true },
          { id: 'est-112', sectionId: 'sec-est-12', order: 3, description: 'O serviço realiza a vigilância epidemiológica de eventos adversos, incluindo surtos e infecções relacionadas à assistência.', legislation: 'RDC 36/2013; Portaria 2616/98', weight: 5, isCritical: false },
          { id: 'est-113', sectionId: 'sec-est-12', order: 4, description: 'Os profissionais possuem descrição de cargo com suas atribuições, responsabilidades e autoridades.', legislation: 'RDC 63/2011', weight: 2, isCritical: false },
          { id: 'est-114', sectionId: 'sec-est-12', order: 5, description: 'A direção do serviço promove uma cultura de segurança, incentivando a comunicação e a notificação de incidentes sem caráter punitivo.', legislation: 'RDC 36/2013', weight: 2, isCritical: false },
        ],
      },
    ],
  },


  // ════════════════════════════════════════════════════════════
  // TEMPLATE 2 — ROTEIRO ILPI : BASE FEDERAL (BRASIL)
  // Base: RDC ANVISA nº 502/2021 (norma principal de ILPI)
  //   Lei Federal nº 10.741/2003 (Estatuto da Pessoa Idosa)
  //   RDC ANVISA nº 216/2004 (Boas Práticas de Alimentação)
  //   RDC ANVISA nº 222/2018 (Gerenciamento de Resíduos)
  //   RDC ANVISA nº 63/2011 (Boas Práticas em Serviços de Saúde)
  //   Portaria SVS/MS nº 344/1998 (Medicamentos Controlados)
  //   Portaria de Consolidação MS nº 4/2017 (DNC)
  //   Normas Regulamentadoras (NR 32, NR 7, NR 6, NR 24)
  // Classificação: I=Imprescindível | N=Necessário | R=Recomendável
  // ════════════════════════════════════════════════════════════
  {
    id: 'tpl-ilpi-federal-v1',
    name: 'Roteiro de Inspeção — ILPI (Base Federal)',
    category: 'ilpi',
    version: '06/2026',
    sections: [

      // SEÇÃO 1 _______________________________________
      {
        id: 'sec-fed-01',
        title: 'Estrutura Física : Geral',
        order: 1,
        items: [
          { id: 'fed-001', sectionId: 'sec-fed-01', order: 1, description: 'O funcionamento da ILPI é autorizado mediante Alvará/Licença Sanitária vigente expedida pelo órgão sanitário local, em conformidade com a Lei Federal nº 6.437/1977.', legislation: 'Art. 8º da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-001a', sectionId: 'sec-fed-01', order: 2, description: 'Possui Projeto Básico de Arquitetura (planta baixa) aprovado pela autoridade sanitária local, em caso de construção, reforma ou adaptação.', legislation: 'Art. 19 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-001b', sectionId: 'sec-fed-01', order: 3, description: 'As instalações prediais de proteção e combate a incêndio atendem às exigências locais (possui Certificado/Laudo do Corpo de Bombeiros vigente).', legislation: 'Art. 23 da RDC 502/2021; legislação estadual', weight: 10, isCritical: true },
          { id: 'fed-002', sectionId: 'sec-fed-01', order: 4, description: 'A infraestrutura física atende aos requisitos de habitabilidade, higiene, salubridade, segurança e garante a independência e mobilidade dos residentes.', legislation: 'Art. 21 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-003', sectionId: 'sec-fed-01', order: 5, description: 'Quando o terreno apresenta desníveis, a edificação é dotada de rampas com corrimãos para facilitar o acesso e a movimentação dos residentes, em conformidade com a ABNT NBR 9050.', legislation: 'Art. 22 da RDC 502/2021; ABNT NBR 9050', weight: 10, isCritical: true },
          { id: 'fed-004', sectionId: 'sec-fed-01', order: 6, description: 'As circulações internas principais possuem largura mínima de 1,50m e as secundárias, no mínimo 1,00m, garantindo a passagem de cadeiras de rodas e macas.', legislation: 'Art. 25 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-005', sectionId: 'sec-fed-01', order: 7, description: 'Em caso de edificação com mais de um pavimento que não possua rampa com especificações da ABNT, dispõe de elevador.', legislation: 'Art. 26 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-006', sectionId: 'sec-fed-01', order: 8, description: 'Todas as portas possuem vão livre com largura mínima de 1,10m e travamento simples, sem o uso de trancas ou chaves, permitindo abertura imediata em situação de emergência.', legislation: 'Art. 27 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-007', sectionId: 'sec-fed-01', order: 9, description: 'Janelas e guarda-corpos possuem peitoris com altura mínima de 1,00m, garantindo a segurança dos residentes contra quedas.', legislation: 'Art. 28 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-008', sectionId: 'sec-fed-01', order: 10, description: 'Possui sala de convivência com área mínima de 1,3 m² (um vírgula três metros quadrados) por residente.', legislation: 'Art. 29, Inciso II da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-009', sectionId: 'sec-fed-01', order: 11, description: 'Possui ambiente para guarda de material de limpeza (DML), provido de tanque e área para guarda de saneantes e utensílios.', legislation: 'Art. 29, Inciso XI da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-010', sectionId: 'sec-fed-01', order: 12, description: 'Possui sala para atividades de assistência individualizada e sigilosa (assistência social, psicológica, saúde, etc).', legislation: 'Art. 29, Inciso II, item 3, da RDC 502/2021', weight: 5, isCritical: false },
          { id: 'fed-011', sectionId: 'sec-fed-01', order: 13, description: 'Possui espaço destinado para os serviços administrativos da instituição.', legislation: 'Art. 29, Inciso XII da RDC 502/2021', weight: 5, isCritical: false },
          { id: 'fed-012', sectionId: 'sec-fed-01', order: 14, description: 'As instalações elétricas não apresentam fiação exposta ou componentes danificados que ofereçam risco aos residentes e trabalhadores.', legislation: 'NR-10; Art. 21 da RDC 502/2021', weight: 10, isCritical: true },
        ],
      },

      // SEÇÃO 2 _______________________________________
      {
        id: 'sec-fed-02',
        title: 'Dormitórios',
        order: 2,
        items: [
          { id: 'fed-013', sectionId: 'sec-fed-02', order: 1, description: 'Dormitórios são separados por sexo e possuem no máximo 4 (quatro) camas por ambiente.', legislation: 'Alínea "a", Inciso I do Art. 29 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-014', sectionId: 'sec-fed-02', order: 2, description: 'Dormitórios para 1 (uma) pessoa possuem área mínima de 7,50 m² (sete vírgula cinquenta metros quadrados).', legislation: 'Alínea "a.1", Inciso I do Art. 29 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-015', sectionId: 'sec-fed-02', order: 3, description: 'Dormitórios de 2 a 4 pessoas possuem área mínima de 5,50 m² (cinco vírgula cinquenta metros quadrados) por cama.', legislation: 'Alínea "a.2", Inciso I do Art. 29 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-016', sectionId: 'sec-fed-02', order: 4, description: 'Dormitórios são dotados de luz de vigília e campainha de alarme próximos a cada cama.', legislation: 'Alínea "b", Inciso I do Art. 29 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-016a', sectionId: 'sec-fed-02', order: 5, description: 'Os colchões, colchonetes e demais mobiliários almofadados são revestidos de material lavável e impermeável, sem furos ou rasgos.', legislation: 'Art. 29 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-017', sectionId: 'sec-fed-02', order: 6, description: 'Existe distância mínima de 0,80m (oitenta centímetros) entre duas camas.', legislation: 'Alínea "c", Inciso I do Art. 29 da RDC 502/2021', weight: 10, isCritical: true },
        ],
      },

      // SEÇÃO 3  _______________________________________
      {
        id: 'sec-fed-03',
        title: 'Banheiros',
        order: 3,
        items: [
          { id: 'fed-018', sectionId: 'sec-fed-03', order: 1, description: 'Os banheiros possuem área mínima de 3,60 m².', legislation: 'Art. 29 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-019', sectionId: 'sec-fed-03', order: 2, description: 'Cada banheiro é provido, no mínimo, de 1 bacia sanitária, 1 lavatório e 1 chuveiro, garantindo a privacidade do residente.', legislation: 'Alínea "a", Inciso IV do Art. 29 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-020', sectionId: 'sec-fed-03', order: 3, description: 'O piso do banheiro é projetado sem desnível em forma de degrau, utilizando caimento para escoamento da água.', legislation: 'Alínea "b", Inciso IV do Art. 29 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-021', sectionId: 'sec-fed-03', order: 4, description: 'Possui barras de apoio instaladas no lavatório, na bacia sanitária e no chuveiro.', legislation: 'Alínea "c", Inciso IV do Art. 29 da RDC 502/2021', weight: 10, isCritical: true },
        ],
      },

      // SEÇÃO 4 
      {
        id: 'sec-fed-04',
        title: 'Medicamentos',
        order: 4,
        items: [
          { id: 'fed-022', sectionId: 'sec-fed-04', order: 1, description: 'Os medicamentos em uso pelos idosos estão sob responsabilidade do Responsável Técnico (RT), respeitando os regulamentos de vigilância sanitária quanto à guarda, sendo vedado o estoque sem prescrição médica.', legislation: 'Art. 40 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-023', sectionId: 'sec-fed-04', order: 2, description: 'Medicamentos sujeitos a controle especial (psicotrópicos) são obrigatoriamente guardados sob chave ou outro dispositivo que ofereça segurança, em local exclusivo, com registros de controle.', legislation: 'Art. 67 da Portaria SVS/MS 344/1998', weight: 10, isCritical: true },
          { id: 'fed-024', sectionId: 'sec-fed-04', order: 3, description: 'Possui geladeira exclusiva com termômetro e planilha de registro para controle diário de temperatura de medicamentos termolábeis.', legislation: 'Art. 40 da RDC 502/2021; RDC ANVISA nº 430/2020', weight: 10, isCritical: true },
        ],
      },

      // SEÇÃO 5 _______________________________________
      {
        id: 'sec-fed-05',
        title: 'Serviço de Nutrição',
        order: 5,
        items: [
          { id: 'fed-025', sectionId: 'sec-fed-05', order: 1, description: 'É garantido aos residentes o fornecimento de, no mínimo, 6 (seis) refeições diárias.', legislation: 'Art. 44 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-026', sectionId: 'sec-fed-05', order: 2, description: 'A alimentação é fornecida de acordo com as necessidades nutricionais e condições de saúde dos residentes.', legislation: 'Art. 44 e Art. 45 da RDC 502/2021; RDC 216/2004', weight: 5, isCritical: false },
          { id: 'fed-027', sectionId: 'sec-fed-05', order: 3, description: 'O serviço possui e implementa o Manual de Boas Práticas e os Procedimentos Operacionais Padronizados (POPs), mantendo-os acessíveis aos funcionários envolvidos e à autoridade sanitária.', legislation: 'Itens 4.11.1 e 4.11.2 da RDC 216/2004', weight: 10, isCritical: true },
          { id: 'fed-028', sectionId: 'sec-fed-05', order: 4, description: 'Caso realize preparo de Terapia de Nutrição Enteral (TNE) no local, possui área exclusiva e adequada para esta manipulação.', legislation: 'Arts. 1º e 101 da RDC ANVISA nº 503/2021', weight: 5, isCritical: false },
          { id: 'fed-029', sectionId: 'sec-fed-05', order: 5, description: 'Instalações físicas (piso, parede e teto) possuem revestimento liso, impermeável, lavável e em bom estado de conservação.', legislation: 'Item 4.1.3 da RDC 216/2004', weight: 5, isCritical: false },
          { id: 'fed-030', sectionId: 'sec-fed-05', order: 6, description: 'Acessos às áreas de preparação de alimentos são controlados e independentes, não sendo utilizados como passagem.', legislation: 'Item 4.1.1 da RDC 216/2004', weight: 5, isCritical: false },
          { id: 'fed-031', sectionId: 'sec-fed-05', order: 7, description: 'Portas externas possuem fechamento automático e protetor de rodapé. Janelas e aberturas são dotadas de telas milimétricas removíveis para facilitar a limpeza.', legislation: 'Item 4.1.4 da RDC 216/2004', weight: 5, isCritical: false },
          { id: 'fed-032', sectionId: 'sec-fed-05', order: 8, description: 'Dispõe de lavatório exclusivo para lavagem das mãos na área de manipulação, provido obrigatoriamente de sabonete líquido inodoro, toalha de papel não reciclado e lixeira com tampa de acionamento sem contato manual.', legislation: 'Item 4.1.14 da RDC 216/2004', weight: 10, isCritical: true },
          { id: 'fed-033', sectionId: 'sec-fed-05', order: 9, description: 'Existem cartazes de orientação sobre a correta higienização das mãos afixados em locais de fácil visualização, inclusive nas instalações sanitárias e lavatórios.', legislation: 'Item 4.6.5 da RDC 216/2004', weight: 5, isCritical: false },
          { id: 'fed-034', sectionId: 'sec-fed-05', order: 10, description: 'Os resíduos são frequentemente coletados e estocados em local fechado e isolado da área de preparação, evitando a contaminação cruzada e atração de pragas.', legislation: 'Item 4.5.2 da RDC 216/2004', weight: 10, isCritical: true },
          { id: 'fed-035', sectionId: 'sec-fed-05', order: 11, description: 'Manipuladores de alimentos que apresentam lesões ou sintomas de enfermidades que possam comprometer a segurança dos alimentos são afastados da atividade de manipulação.', legislation: 'Item 4.6.1 da RDC 216/2004', weight: 10, isCritical: true },
          { id: 'fed-036', sectionId: 'sec-fed-05', order: 12, description: 'Manipuladores de alimentos apresentam-se com uniformes compatíveis à atividade, conservados e limpos, cabelos protegidos por redes ou toucas, unhas curtas e sem adornos.', legislation: 'Itens 4.6.3 e 4.6.6 da RDC 216/2004', weight: 5, isCritical: false },
          { id: 'fed-037', sectionId: 'sec-fed-05', order: 13, description: 'Equipamentos e utensílios que entram em contato com alimentos são lisos, impermeáveis, laváveis e mantidos em adequado estado de conservação.', legislation: 'Item 4.1.17 da RDC 216/2004', weight: 5, isCritical: false },
          { id: 'fed-038', sectionId: 'sec-fed-05', order: 14, description: 'Os utensílios utilizados na higienização (esponjas, escovas) são próprios para a atividade, conservados e limpos, sem utilização de materiais que retenham resíduos ou liberem fragmentos físicos (como palha de aço).', legislation: 'Item 4.1.11 da RDC 216/2004', weight: 10, isCritical: true },
          { id: 'fed-039', sectionId: 'sec-fed-05', order: 15, description: 'Ausência de objetos em desuso ou estranhos ao ambiente na área de preparação de alimentos.', legislation: 'Item 4.1.7 da RDC 216/2004', weight: 5, isCritical: false },
          { id: 'fed-040', sectionId: 'sec-fed-05', order: 16, description: 'O fluxo de preparo e os procedimentos adotados evitam o contato direto ou indireto entre alimentos crus, semipreparados e prontos para o consumo, minimizando o risco de contaminação cruzada.', legislation: 'Item 4.8.4 da RDC 216/2004', weight: 10, isCritical: true },
          { id: 'fed-041', sectionId: 'sec-fed-05', order: 17, description: 'Utiliza saneantes regularizados no Ministério da Saúde para a higienização de hortifrutícolas.', legislation: 'Item 4.8.2 da RDC 216/2004', weight: 10, isCritical: true },
          { id: 'fed-042n', sectionId: 'sec-fed-05', order: 18, description: 'O descongelamento de alimentos é efetuado em condições de refrigeração à temperatura inferior a 5ºC ou em forno micro-ondas, sendo vedado o descongelamento à temperatura ambiente.', legislation: 'Item 4.8.14 da RDC 216/2004', weight: 10, isCritical: true },
          { id: 'fed-043n', sectionId: 'sec-fed-05', order: 19, description: 'Os alimentos preparados conservados a quente são mantidos à temperatura superior a 60ºC (sessenta graus Celsius) por, no máximo, 6 (seis) horas.', legislation: 'Item 4.8.15 da RDC 216/2004', weight: 10, isCritical: true },
          { id: 'fed-044n', sectionId: 'sec-fed-05', order: 20, description: 'A Instituição dispõe de condições para armazenamento, mantendo matérias-primas em temperatura recomendada pelo fabricante.', legislation: 'Art. 45 da RDC 502/2021; Item 4.8.1 da RDC 216/2004', weight: 10, isCritical: true },
          { id: 'fed-045n', sectionId: 'sec-fed-05', order: 21, description: 'Matérias-primas e ingredientes que não forem utilizados em sua totalidade estão adequadamente acondicionados e identificados com data de fracionamento e novo prazo de validade após a abertura.', legislation: 'Item 4.7.4 da RDC 216/2004', weight: 10, isCritical: true },
          { id: 'fed-046n', sectionId: 'sec-fed-05', order: 22, description: 'Alimentos armazenados em local limpo, organizado, dispostos sobre paletes, estrados ou prateleiras adequadas, distantes do piso, paredes e teto.', legislation: 'Item 4.7.5 da RDC 216/2004', weight: 5, isCritical: false },
        ],
      },

      // SEÇÃO 6 _______________________________________
      {
        id: 'sec-fed-06',
        title: 'Refeitório',
        order: 6,
        items: [
          { id: 'fed-042', sectionId: 'sec-fed-06', order: 1, description: 'Refeitório possui área mínima de 1,00 m² por usuário, acrescido de local para guarda de lanches, lavatório para higienização das mãos e luz de vigília.', legislation: 'Art. 29, Inciso VII da RDC 502/2021', weight: 5, isCritical: false },
        ],
      },

      // SEÇÃO 7  _______________________________________
      {
        id: 'sec-fed-07',
        title: 'Lavanderia',
        order: 7,
        items: [
          { id: 'fed-043', sectionId: 'sec-fed-07', order: 1, description: 'Quando houver processamento de roupas na Instituição, possui ambientes distintos para lavagem e para guarda de roupas.', legislation: 'Art. 29, Inciso IX e X, da RDC 502/2021', weight: 5, isCritical: false },
          { id: 'fed-044', sectionId: 'sec-fed-07', order: 2, description: 'As roupas de uso pessoal dos residentes estão devidamente identificadas, visando a manutenção da individualidade e humanização.', legislation: 'Art. 49 da RDC 502/2021', weight: 5, isCritical: false },
          { id: 'fed-044b', sectionId: 'sec-fed-07', order: 3, description: 'A Instituição mantém disponíveis as rotinas técnicas (POPs) do processamento de roupas de uso pessoal e coletivo, contemplando separação, processamento e guarda e troca de roupas de uso coletivo.', legislation: 'Art. 47 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-044c', sectionId: 'sec-fed-07', order: 4, description: 'A Instituição possibilita aos idosos com grau de dependência I (independentes) efetuarem o processamento de suas próprias roupas de uso pessoal.', legislation: 'Art. 48 da RDC 502/2021', weight: 2, isCritical: false },
          { id: 'fed-045', sectionId: 'sec-fed-07', order: 5, description: 'Nos casos de terceirização do serviço de lavanderia, a Instituição possui contrato formal e mantém cópia do alvará sanitário da empresa contratada.', legislation: 'Art. 14 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-046', sectionId: 'sec-fed-07', order: 6, description: 'Utiliza exclusivamente produtos saneantes devidamente regularizados na Anvisa.', legislation: 'Art. 50 da RDC 502/2021', weight: 10, isCritical: true },
        ],
      },

      // SEÇÃO 8
      {
        id: 'sec-fed-08',
        title: 'Assistência Integral ao Residente',
        order: 8,
        items: [
          { id: 'fed-048', sectionId: 'sec-fed-08', order: 1, description: 'O Responsável Técnico institui e mantém prontuário individual do residente, organizado e atualizado, contendo dados de identificação, evolução e intercorrências.', legislation: 'Art. 33 da RDC 502/2021; Art. 50, Inciso XV, da Lei Federal nº 10.741/2003', weight: 10, isCritical: true },
          { id: 'fed-049', sectionId: 'sec-fed-08', order: 2, description: 'Mantém o cartão de vacinação dos residentes atualizado, em conformidade com o calendário do Programa Nacional de Imunizações (PNI).', legislation: 'Art. 39 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-050', sectionId: 'sec-fed-08', order: 3, description: 'A ILPI desenvolve atividades físicas, recreativas e de lazer, com base no PAISI e nas condições dos residentes.', legislation: 'Art. 32 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-051', sectionId: 'sec-fed-08', order: 4, description: 'A instituição realiza a notificação compulsória de agravos e doenças à vigilância epidemiológica e sanitária.', legislation: 'Art. 54 da RDC 502/2021; Portaria de Consolidação MS nº 4/2017', weight: 10, isCritical: true },
          { id: 'fed-052', sectionId: 'sec-fed-08', order: 5, description: 'Possui registro e realiza a notificação à autoridade sanitária local da ocorrência de eventos sentinela (ex: quedas com lesões graves).', legislation: 'Art. 55 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-053', sectionId: 'sec-fed-08', order: 6, description: 'Garante a convivência familiar e comunitária, assegurando horários e dias flexíveis para visitas.', legislation: 'Art. 6º, Inciso I, da RDC 502/2021; Art. 49, Inciso II, da Lei Federal nº 10.741/2003', weight: 10, isCritical: true },
          { id: 'fed-054', sectionId: 'sec-fed-08', order: 7, description: 'Em caso de intercorrência médica, o Responsável Técnico providencia o encaminhamento imediato do idoso ao serviço de saúde de referência.', legislation: 'Art. 42 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-054a', sectionId: 'sec-fed-08', order: 8, description: 'A instituição comunica à Secretaria Municipal de Assistência Social ou congênere, bem como ao Ministério Público, a situação de abandono familiar do idoso ou a ausência de identificação civil.', legislation: 'Art. 34 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-054b', sectionId: 'sec-fed-08', order: 9, description: 'A instituição elabora a cada 2 (dois) anos e avalia anualmente o Plano de Atenção Integral à Saúde dos Residentes (PAISI) para cada idoso.', legislation: 'Arts. 36 e 38 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-054c', sectionId: 'sec-fed-08', order: 10, description: 'Possui arquivo de anotações (livro de ocorrências/plantão) contendo data e circunstâncias do atendimento diário e intercorrências de cada residente.', legislation: 'Art. 50, Inciso XV da Lei 10.741/2003; Art. 33 da RDC 502/2021', weight: 10, isCritical: true },
        ],
      },

      // SEÇÃO 9
      {
        id: 'sec-fed-09',
        title: 'Saúde e Segurança do Trabalhador',
        order: 9,
        items: [
          { id: 'fed-058a', sectionId: 'sec-fed-09', order: 1, description: 'A instituição garante aos trabalhadores a avaliação de saúde admissional, periódica e demissional, implementando o PCMSO e PGR.', legislation: 'NR-7; NR-1', weight: 5, isCritical: false },
          { id: 'fed-058b', sectionId: 'sec-fed-09', order: 2, description: 'A instituição fornece aos trabalhadores os Equipamentos de Proteção Individual (EPI), adequados aos riscos das atividades desenvolvidas.', legislation: 'NR-6; NR-32', weight: 10, isCritical: true },
          { id: 'fed-058c', sectionId: 'sec-fed-09', order: 3, description: 'Existe comprovação do esquema de vacinação atualizado dos profissionais da instituição.', legislation: 'NR-32', weight: 5, isCritical: false },
          { id: 'fed-058d', sectionId: 'sec-fed-09', order: 4, description: 'A instituição dispõe de instalações sanitárias, vestiários e locais para refeições exclusivos para os trabalhadores.', legislation: 'NR-24', weight: 5, isCritical: false },
        ],
      },

      // SEÇÃO 10
      {
        id: 'sec-fed-10',
        title: 'Gestão de Resíduos (PGRSS)',
        order: 10,
        items: [
          { id: 'fed-059', sectionId: 'sec-fed-10', order: 1, description: 'O serviço elaborou, implantou e mantém atualizado o Plano de Gerenciamento de Resíduos de Serviços de Saúde (PGRSS).', legislation: 'Art. 5º da RDC 222/2018', weight: 10, isCritical: true },
          { id: 'fed-060', sectionId: 'sec-fed-10', order: 2, description: 'Possui abrigo de resíduos sólidos externo à edificação para armazenamento temporário.', legislation: 'Art. 29, Inciso XIV, da RDC 502/2021; RDC 222/2018', weight: 10, isCritical: true },
          { id: 'fed-061', sectionId: 'sec-fed-10', order: 3, description: 'Os materiais perfurocortantes são descartados no local de geração em recipientes rígidos, providos de tampa.', legislation: 'RDC 222/2018', weight: 10, isCritical: true },
          { id: 'fed-062', sectionId: 'sec-fed-10', order: 4, description: 'Os recipientes para coleta interna de resíduos possuem tampa provida de sistema de abertura sem contato manual e são identificados.', legislation: 'RDC 222/2018', weight: 5, isCritical: false },
          { id: 'fed-063', sectionId: 'sec-fed-10', order: 5, description: 'A instituição possui contrato formal com empresa licenciada para coleta, tratamento e destinação final de resíduos infectantes e perfurocortantes.', legislation: 'RDC 222/2018', weight: 10, isCritical: true },
        ],
      },

      // SEÇÃO 11
      {
        id: 'sec-fed-11',
        title: 'Água e Controle de Pragas',
        order: 11,
        items: [
          { id: 'fed-064', sectionId: 'sec-fed-11', order: 1, description: 'A instituição utiliza água potável para consumo e preparo de alimentos, e o reservatório de água é higienizado no mínimo a cada 6 (seis) meses, mantendo-se o registro da operação.', legislation: 'Art. 46 da RDC 502/2021; Item 4.3 da RDC 216/2004', weight: 10, isCritical: true },
          { id: 'fed-065', sectionId: 'sec-fed-11', order: 2, description: 'Possui programa de controle de vetores e pragas urbanas executado por empresa especializada e licenciada.', legislation: 'Art. 46 da RDC 502/2021; Item 4.4.2 da RDC 216/2004', weight: 10, isCritical: true },
          { id: 'fed-066', sectionId: 'sec-fed-11', order: 3, description: 'A edificação, as instalações e os equipamentos são mantidos livres de vetores e pragas urbanas, sendo adotadas medidas preventivas como o uso de telas e ralos sifonados.', legislation: 'Item 4.4.1 da RDC 216/2004', weight: 5, isCritical: false },
        ],
      },

      // SEÇÃO 12
      {
        id: 'sec-fed-12',
        title: 'Recursos Humanos',
        order: 12,
        items: [
          { id: 'fed-067', sectionId: 'sec-fed-12', order: 1, description: 'A ILPI conta com Responsável Técnico (RT) com formação de nível superior, vínculo formal de trabalho e carga horária mínima de 20 (vinte) horas semanais.', legislation: 'Arts. 10 e 11 e 16 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-068', sectionId: 'sec-fed-12', order: 2, description: 'A proporção de cuidadores para residentes de Grau de Dependência I atende ao mínimo exigido: 1 (um) cuidador para cada 20 (vinte) residentes, com carga horária de 8h/dia.', legislation: 'Alínea "a", Inciso I do Art. 16 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-069', sectionId: 'sec-fed-12', order: 3, description: 'A proporção de cuidadores para residentes de Grau de Dependência II atende ao mínimo exigido: 1 (um) cuidador para cada 10 (dez) residentes, por turno.', legislation: 'Alínea "b", Inciso I do Art. 16 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-070', sectionId: 'sec-fed-12', order: 4, description: 'A proporção de cuidadores para residentes de Grau de Dependência III atende ao mínimo exigido: 1 (um) cuidador para cada 6 (seis) residentes, por turno.', legislation: 'Alínea "c", Inciso I do Art. 16 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-071', sectionId: 'sec-fed-12', order: 5, description: 'A instituição dispõe de 1 (um) profissional para atividades de lazer para cada 40 (quarenta) residentes, com carga horária de 12 (doze) horas semanais.', legislation: 'Inciso III do Art. 16 da RDC 502/2021', weight: 5, isCritical: false },
          { id: 'fed-072', sectionId: 'sec-fed-12', order: 6, description: 'A instituição dispõe de 1 (um) profissional de limpeza para cada 100m² (cem metros quadrados) de área interna ou fração, por turno, diariamente.', legislation: 'Inciso IV do Art. 16 da RDC 502/2021', weight: 5, isCritical: false },
          { id: 'fed-072b', sectionId: 'sec-fed-12', order: 7, description: 'Quando o serviço de lavanderia for realizado internamente, a instituição dispõe de 1 (um) profissional para cada 30 (trinta) residentes ou fração, diariamente.', legislation: 'Inciso VI do Art. 16 da RDC 502/2021', weight: 2, isCritical: false },
          { id: 'fed-073', sectionId: 'sec-fed-12', order: 8, description: 'A instituição dispõe de 1 (um) profissional no serviço de alimentação para cada 20 (vinte) residentes, garantindo a cobertura de 2 (dois) turnos de 8 (oito) horas.', legislation: 'Inciso V do Art. 16 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-074', sectionId: 'sec-fed-12', order: 9, description: 'A ILPI garante a capacitação e a educação permanente dos profissionais envolvidos na prestação dos serviços, mantendo registros dessa capacitação.', legislation: 'Art. 18 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-075a', sectionId: 'sec-fed-12', order: 10, description: 'Apresenta contratos que comprovem o vínculo formal de trabalho de todos os recursos humanos atuantes na instituição.', legislation: 'Art. 16 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-076a', sectionId: 'sec-fed-12', order: 11, description: 'Apresenta escala de trabalho atualizada comprovando o quantitativo mínimo de cuidadores por turno exigido para o Grau I (1:20), Grau II (1:10) e Grau III (1:6).', legislation: 'Art. 16 da RDC 502/2021', weight: 10, isCritical: true },
        ],
      },

      // SEÇÃO 13
      {
        id: 'sec-fed-13',
        title: 'Documentação Administrativa',
        order: 13,
        items: [
          { id: 'fed-075', sectionId: 'sec-fed-13', order: 1, description: 'Possui Estatuto ou Contrato Social e ata de eleição da diretoria atual (quando aplicável).', legislation: 'Incisos I e II do Art. 9º da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-076', sectionId: 'sec-fed-13', order: 2, description: 'Possui Regimento Interno.', legislation: 'Inciso III do Art. 9º da RDC 502/2021', weight: 5, isCritical: false },
          { id: 'fed-077', sectionId: 'sec-fed-13', order: 3, description: 'A instituição de longa permanência possui inscrição e registro de seus programas junto ao Conselho Municipal da Pessoa Idosa (CMDI) ou Estadual (CEDI).', legislation: 'Art. 48 da Lei 10.741/2003', weight: 10, isCritical: true },
          { id: 'fed-078', sectionId: 'sec-fed-13', order: 4, description: 'A ILPI celebra contrato formal e escrito de prestação de serviços com o residente ou com seu representante legal, estabelecendo direitos, deveres, valores e forma de reajuste.', legislation: 'Art. 12 da RDC 502/2021; Art. 35 da Lei 10.741/2003', weight: 10, isCritical: true },
          { id: 'fed-079', sectionId: 'sec-fed-13', order: 5, description: 'A ILPI possui Procedimentos Operacionais Padrão (POP) escritos, atualizados e implantados referentes a todas as atividades desenvolvidas na instituição.', legislation: 'Art. 41 da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-080', sectionId: 'sec-fed-13', order: 6, description: 'A instituição possui Plano de Trabalho compatível com os princípios do Estatuto da Pessoa Idosa, apresentado no ato de inscrição no conselho competente.', legislation: 'Parágrafo único do Art. 48 da Lei 10.741/2003', weight: 10, isCritical: true },
          { id: 'fed-081', sectionId: 'sec-fed-13', order: 7, description: 'A instituição realiza avaliação continuada de desempenho levando em conta, no mínimo, os indicadores de taxa de mortalidade, e incidência de DDA, escabiose, desidratação, úlcera de decúbito e desnutrição.', legislation: 'Art. 59 e Anexo da RDC 502/2021', weight: 10, isCritical: true },
          { id: 'fed-082', sectionId: 'sec-fed-13', order: 8, description: 'A Instituição encaminha à Vigilância Sanitária local, todo mês de janeiro, o consolidado dos indicadores referentes ao ano anterior.', legislation: 'Art. 60 da RDC 502/2021', weight: 10, isCritical: true },
        ],
      },
    ],
  },
];

export function getTemplates(): ChecklistTemplate[] {
  return templates;
}

export function getTemplatesByCategory(category: string): ChecklistTemplate[] {
  return templates.filter(t => t.category === category);
}

export function getTemplateById(id: string): ChecklistTemplate | undefined {
  return templates.find(t => t.id === id);
}

/**
 * Enriches a base template with regional supplements based on client info.
 * Logic:
 * - If ILPI and state is GO -> Merge with templateIlpiGoiasSuplement
 */
export function enrichTemplate(template: ChecklistTemplate, client: Client): ChecklistTemplate {
  // 1. ILPI GOIAS Logic
  if (template.id === 'tpl-ilpi-federal-v1' && client.state === 'GO') {
    const supplement = templateIlpiGoiasSuplement;
    
    // Create a deep copy of sections to avoid mutating the base template
    const sections = JSON.parse(JSON.stringify(template.sections));

    // A. Apply Section Additions (Items that go into existing sections)
    supplement.sectionAdditions.forEach(addition => {
      const targetSection = sections.find((s: any) => s.id === addition.targetSectionId);
      if (targetSection) {
        // Merge items (preventing duplicate IDs if any)
        const existingIds = new Set(targetSection.items.map((i: any) => i.id));
        addition.items.forEach(newItem => {
          if (!existingIds.has(newItem.id)) {
            targetSection.items.push(newItem);
          }
        });
        // Sort items by order
        targetSection.items.sort((a: any, b: any) => a.order - b.order);
      }
    });

    // B. Apply New Sections
    if (supplement.newSections) {
      supplement.newSections.forEach(newSec => {
        if (!sections.find((s: any) => s.id === newSec.id)) {
          sections.push(newSec);
        }
      });
    }

    return {
      ...template,
      name: `${template.name} (+ Suplemento GO)`,
      sections: sections.sort((a: any, b: any) => a.order - b.order)
    };
  }

  // 2. RJ Items (Alimentos) are already baked into separate templates for now, 
  // but we could add dynamic logic here too if needed.

  return template;
}

export function getTotalItems(template: ChecklistTemplate): number {
  return template.sections.reduce((sum, s) => sum + s.items.length, 0);
}

export function getCriticalItemsCount(template: ChecklistTemplate): number {
  return template.sections.reduce(
    (sum, s) => sum + s.items.filter(i => i.isCritical).length, 0
  );
}

