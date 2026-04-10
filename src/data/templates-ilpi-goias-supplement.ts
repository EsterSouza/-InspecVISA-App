// ============================================================
// src/data/templates-ilpi-goias-supplement.ts
// SUPLEMENTO ILPI — GOIÁS / SENADOR CANEDO
// C&C CONSULTORIA SANITÁRIA
//
// PROPÓSITO:
//   Este arquivo NÃO duplica o roteiro federal.
//   Ele contém APENAS os itens que:
//     (a) derivam de legislação estadual ou municipal local, OU
//     (b) existem no federal de forma genérica e aqui ganham
//         a referência normativa local exata.
//
//   O roteiro final de Goiás/Senador Canedo é gerado pelo app
//   como: templateIlpiFederal + templateIlpiGoiasSuplement
//
// BASE NORMATIVA LOCAL:
//   Municipal : Lei Ordinária nº 1.812/2014 — Código Sanitário
//               de Senador Canedo (Cap. XV, Arts. 276–280 — ILPIs)
//   Estadual  : Goiás adota o ROI ANVISA desde 2023 (SES-GO/SVISA)
//               Não há lei estadual específica de ILPI em Goiás.
//               Prevalece integralmente a RDC 502/2021.
//   CBMGO     : Legislação estadual de prevenção e combate a
//               incêndio — Corpo de Bombeiros Militar de Goiás
//   MP-GO     : Roteiro UTPSS/MPGO — Unidade Técnico-Pericial em
//               Serviço Social (fiscalização extrajudicial)
//   CMAS      : Lei Federal 8.742/1993 — LOAS (inscrição de
//               entidades filantrópicas no conselho municipal)
//
// COMO USAR NO APP:
//   import { templateIlpiFederal } from './templates-ilpi-federal';
//   import { templateIlpiGoiasSuplement } from './templates-ilpi-goias-supplement';
//
//   function buildGoiasChecklist() {
//     return mergeTemplateWithSupplement(
//       templateIlpiFederal,
//       templateIlpiGoiasSuplement
//     );
//   }
//
// FUNÇÃO mergeTemplateWithSupplement (sugestão de implementação):
//   — Para cada sectionAddition do supplement:
//       encontrar a seção federal pelo targetSectionId e
//       concatenar os items ao final dela.
//   — Para cada newSection do supplement:
//       adicionar a seção ao final do array de sections,
//       reordenando pelo campo order.
//
// Pesos: Imprescindível=10 (isCritical:true) | Necessário=5 |
//        Recomendável=2 | Sugerido=1
// ============================================================

import type { ChecklistItem, Section, ChecklistSupplement } from '../types';

// ─── TIPO NOVO — adicionar em types.ts ──────────────────────
//
// export interface SectionAddition {
//   targetSectionId: string;    // ID da seção federal receptora
//   targetSectionTitle: string; // legibilidade no código
//   items: ChecklistItem[];
// }
//
// export interface ChecklistSupplement {
//   id: string;
//   baseTemplateId: string;
//   state: string;
//   municipality?: string;
//   name: string;
//   version: string;
//   sectionAdditions: SectionAddition[];
//   newSections?: ChecklistSection[];
// }
//
// ─────────────────────────────────────────────────────────────

export const templateIlpiGoiasSuplement = {

  id: 'tpl-ilpi-goias-supplement-v1',
  baseTemplateId: 'tpl-ilpi-federal-v1',
  state: 'GO',
  municipality: 'Senador Canedo',
  name: 'Suplemento — ILPI | Goiás / Senador Canedo',
  version: '2025',

  sectionAdditions: [

    // ── BLOCO 1 ───────────────────────────────────────────────
    // Adições à seção federal: Documentação Administrativa
    // Seção federal receptora: sec-fed-13
    //
    // O federal já cobre (NÃO repetir aqui):
    //   fed-075 — Estatuto / Contrato Social
    //   fed-076 — Regimento Interno
    //   fed-077 — Inscrição genérica no Conselho do Idoso
    //   fed-078 — Contrato com residente
    //   fed-079 — POPs escritos (Art. 41)
    //   fed-080 — Plano de Trabalho (Art. 48 pu Lei 10.741)
    //   fed-082 — Envio de indicadores à VISA em janeiro
    //
    // Entram aqui apenas os itens com fundamento EXCLUSIVAMENTE
    // local ou que adicionam especificidade municipal/estadual
    // a um requisito federal genérico.
    // ─────────────────────────────────────────────────────────
    {
      targetSectionId: 'sec-fed-13',
      targetSectionTitle: 'Documentação Administrativa',
      items: [

        {
          // Alvará de Funcionamento da Prefeitura de Senador Canedo.
          // O federal (fed-001) exige o Alvará Sanitário da VISA.
          // Este item exige o Alvará Municipal da Prefeitura — documento
          // distinto, emitido pela Secretaria de Desenvolvimento Econômico
          // ou órgão equivalente do município.
          id: 'go-sup-doc-001',
          sectionId: 'sec-fed-13',
          order: 101,
          description: 'Possui Alvará de Funcionamento da Prefeitura Municipal de Senador Canedo vigente, emitido pelo órgão municipal competente, compatível com a atividade de ILPI.',
          legislation: 'Art. 276, Lei Ordinária nº 1.812/2014 — Código Sanitário de Senador Canedo',
          weight: 10,
          isCritical: true,
        },

        {
          // CNPJ ativo com CNAE compatível. O federal não exige este
          // item explicitamente — ele emerge do ROI MPGO/UTPSS, que
          // verifica a regularidade fiscal e a compatibilidade da
          // atividade econômica declarada.
          id: 'go-sup-doc-002',
          sectionId: 'sec-fed-13',
          order: 102,
          description: 'Apresenta CNPJ ativo e o CNAE principal ou secundário declarado na Receita Federal é compatível com a atividade de Instituição de Longa Permanência para Idosos (CNAE 8711-5/01 ou equivalente).',
          legislation: 'Roteiro UTPSS/MPGO; Lei Complementar nº 123/2006',
          weight: 10,
          isCritical: true,
        },

        {
          // Laudo do CBMGO. O federal (fed-001b) exige apenas que as
          // instalações de combate a incêndio "atendam às exigências dos
          // códigos de obras" (Art. 23 RDC 502/2021). O CBMGO é o órgão
          // estadual responsável em Goiás — este item especifica o
          // documento exigido localmente.
          id: 'go-sup-doc-003',
          sectionId: 'sec-fed-13',
          order: 103,
          description: 'Possui Laudo ou Certificado de Conformidade do Corpo de Bombeiros Militar de Goiás (CBMGO) vigente, emitido para o endereço da ILPI, abrangendo as atividades declaradas.',
          legislation: 'Legislação estadual de prevenção e combate a incêndio — CBMGO; Art. 23 da RDC 502/2021',
          weight: 10,
          isCritical: true,
        },

        {
          // Inscrição no CMI de Senador Canedo ou CEI-GO. O federal
          // (fed-001c) exige inscrição no "Conselho do Idoso" de forma
          // genérica. Este item nomeia o órgão local exato e estabelece
          // a hierarquia: primeiro o municipal, na falta deste o estadual.
          // Distingue-se do fed-001c por referenciar explicitamente
          // o Art. 276 da Lei 1.812/2014 como obrigação local adicional.
          id: 'go-sup-doc-004',
          sectionId: 'sec-fed-13',
          order: 104,
          description: 'Comprova inscrição de seus programas junto ao Conselho Municipal do Idoso (CMI) de Senador Canedo ou, na ausência de CMI ativo no município, junto ao Conselho Estadual do Idoso de Goiás (CEI-GO).',
          legislation: 'Art. 48, parágrafo único, Lei Federal nº 10.741/2003; Art. 276, Lei Municipal nº 1.812/2014; Roteiro UTPSS/MPGO',
          weight: 10,
          isCritical: true,
        },

        {
          // Inscrição no CMAS de Senador Canedo. Aplicável apenas a
          // entidades sem fins lucrativos. O federal não contempla este
          // item — ele decorre da LOAS e do ROI MPGO/UTPSS, que verifica
          // a regularidade da entidade no sistema de assistência social.
          id: 'go-sup-doc-005',
          sectionId: 'sec-fed-13',
          order: 105,
          description: 'Entidades sem fins lucrativos (filantrópicas, associações, fundações) apresentam inscrição vigente no Conselho Municipal de Assistência Social (CMAS) de Senador Canedo.',
          legislation: 'Lei Federal nº 8.742/1993 (LOAS), Arts. 9º e 36; Roteiro UTPSS/MPGO',
          weight: 5,
          isCritical: false,
        },

        {
          // Planta baixa aprovada pela VISA local. O federal (fed-001a)
          // cobre "projeto aprovado pela autoridade sanitária local" de
          // forma genérica. Este item acrescenta o fundamento expresso
          // na Lei Municipal 1.812/2014, que exige planta com memorial
          // descritivo como condição para o Alvará Sanitário local.
          id: 'go-sup-doc-006',
          sectionId: 'sec-fed-13',
          order: 106,
          description: 'Possui planta baixa com memorial descritivo das atividades e das obras aprovada pela Vigilância Sanitária de Senador Canedo, arquivada no processo do Alvará Sanitário.',
          legislation: 'Art. 276, Inciso IV, Lei Ordinária nº 1.812/2014; Art. 19 da RDC 502/2021',
          weight: 10,
          isCritical: true,
        },

      ],
    },

    // ── BLOCO 2 ───────────────────────────────────────────────
    // Adições à seção federal: Estrutura Física Geral
    // Seção federal receptora: sec-fed-01
    //
    // O federal já cobre (NÃO repetir aqui):
    //   ilpi-002 — habitabilidade, higiene, salubridade (Art. 21)
    //   ilpi-003 — rampas em desníveis (Art. 22 + ABNT NBR 9050)
    //   ilpi-004 — largura das circulações (Art. 25)
    //   ilpi-005 — elevador (Art. 26)
    //   ilpi-006 — portas com vão livre 1,10m (Art. 27)
    //   ilpi-007 — peitoris/guarda-corpos 1,00m (Art. 28)
    //   ilpi-009 — DML com tanque (Art. 29 Inc. XI)
    //   ilpi-012 — fiação elétrica (NR-10 + Art. 21)
    //
    // Entram aqui apenas os itens com fundamento em legislação
    // local ou que adicionam exigência não coberta pelo federal.
    // ─────────────────────────────────────────────────────────
    {
      targetSectionId: 'sec-fed-01',
      targetSectionTitle: 'Estrutura Física Geral',
      items: [

        {
          // Ausência de tapetes, carpetes e objetos soltos que
          // provoquem quedas. O federal não prevê esta vedação
          // expressamente — ela emerge do Roteiro MPGO/UTPSS como
          // critério de inspeção de infraestrutura e está alinhada
          // ao dever geral de segurança do Art. 21 da RDC 502/2021,
          // mas vai além do texto literal.
          id: 'go-sup-estr-001',
          sectionId: 'sec-fed-01',
          order: 201,
          description: 'Não há tapetes, carpetes, capachos ou objetos soltos no chão das circulações e dormitórios que possam causar quedas nos residentes.',
          legislation: 'Roteiro UTPSS/MPGO — Infraestrutura; Art. 21 da RDC 502/2021',
          weight: 10,
          isCritical: true,
        },

        {
          // Área coberta para recreação. O federal (Art. 29 Inc. XV)
          // exige apenas "área externa DESCOBERTA" (solarium). O
          // Art. 289 da Lei Municipal 1.812/2014 exige TAMBÉM uma
          // área coberta com estrutura fixa, piso antiderrapante,
          // mesas e bancos — requisito adicional exclusivamente local.
          // Atenção: Art. 289 formalmente integra o Cap. XVI (creches)
          // da Lei 1.812/2014, mas é aplicado por analogia integrativa
          // às ILPIs pelo Roteiro MPGO/UTPSS e pela VISA de Senador
          // Canedo. Conferir interpretação atualizada antes de autuar.
          id: 'go-sup-estr-002',
          sectionId: 'sec-fed-01',
          order: 202,
          description: 'Possui área externa COBERTA com estrutura fixa, piso antiderrapante, mesas e bancos confortáveis, para realização de atividades ao ar livre com proteção de sol e chuva.',
          legislation: 'Art. 289, Lei Ordinária nº 1.812/2014 (aplicação por analogia integrativa — Roteiro MPGO/UTPSS)',
          weight: 5,
          isCritical: false,
        },

        {
          // Sala administrativa com guarda segura de prontuários.
          // O federal prevê "espaço destinado aos serviços
          // administrativos" (Art. 29 Inc. XII) de forma genérica.
          // O Roteiro MPGO/UTPSS especifica que prontuários devem
          // ser guardados em local com acesso restrito, garantindo
          // confidencialidade — exigência que o federal não detalha.
          id: 'go-sup-estr-003',
          sectionId: 'sec-fed-01',
          order: 203,
          description: 'A área administrativa destinada à guarda de prontuários individuais e documentos sigilosos dos residentes tem acesso restrito, garantindo a confidencialidade das informações.',
          legislation: 'Roteiro UTPSS/MPGO — Documentação; Art. 29, Inciso XII, da RDC 502/2021; Art. 11 da LGPD (Lei Federal nº 13.709/2018)',
          weight: 5,
          isCritical: false,
        },

        {
          // Câmeras nas áreas coletivas. Não existe no federal.
          // O Roteiro MPGO/UTPSS recomenda como medida de proteção
          // dos residentes. A LGPD se aplica ao tratamento das
          // imagens. Peso 2 (recomendável), não crítico.
          id: 'go-sup-estr-004',
          sectionId: 'sec-fed-01',
          order: 204,
          description: 'Possui sistema de monitoramento por câmeras nas áreas coletivas (corredores, sala de convivência, refeitório), sem cobertura de dormitórios e banheiros, respeitando a privacidade dos residentes.',
          legislation: 'Roteiro UTPSS/MPGO; Lei Federal nº 13.709/2018 (LGPD)',
          weight: 2,
          isCritical: false,
        },

      ],
    },

    // ── BLOCO 3 ───────────────────────────────────────────────
    // Adições à seção federal: Assistência Integral ao Residente
    // Seção federal receptora: sec-fed-08
    //
    // O federal já cobre (NÃO repetir aqui):
    //   ilpi-048 — prontuário individual (Art. 33)
    //   ilpi-049 — vacinação / PNI (Art. 39)
    //   ilpi-050 — atividades físicas e lazer (Art. 32)
    //   ilpi-051 — notificação DNC (Art. 54 + Portaria MS 4/2017)
    //   ilpi-052 — eventos sentinela (Art. 55)
    //   ilpi-053 — convivência familiar (Art. 6º I + Lei 10.741)
    //   ilpi-054 — encaminhamento em intercorrência (Art. 42)
    //   ilpi-054a — abandono familiar ao MP (Art. 34)
    //   ilpi-054b — PAISI elaborado a cada 2 anos (Arts. 36 e 38)
    //   ilpi-054c — livro de ocorrências (Art. 33 + Lei 10.741)
    // ─────────────────────────────────────────────────────────
    {
      targetSectionId: 'sec-fed-08',
      targetSectionTitle: 'Assistência Integral ao Residente',
      items: [

        {
          // Contrato de serviço de remoção (transporte de urgência).
          // Art. 43 da RDC 502/2021 exige contrato formal com serviço
          // de remoção quando a ILPI não dispõe de veículo próprio.
          // O federal não tem item específico para isso — o fed-054
          // cobre o encaminhamento em si, não a formalização contratual.
          id: 'go-sup-ass-001',
          sectionId: 'sec-fed-08',
          order: 301,
          description: 'A instituição possui contrato formalizado com serviço de remoção (transporte de urgência/emergência) de idosos, ou comprova disponibilidade de veículo próprio adaptado para essa finalidade.',
          legislation: 'Art. 43 da RDC 502/2021; Roteiro UTPSS/MPGO',
          weight: 10,
          isCritical: true,
        },

        {
          // Articulação com a ESF/UBS de referência. O federal prevê
          // elaboração do PAISI "em articulação com o gestor local de
          // saúde" (Art. 36), mas não verifica se o vínculo está
          // operacional. O Roteiro MPGO/UTPSS verifica nominalmente
          // a UBS/ESF de referência e se os residentes estão inscritos.
          id: 'go-sup-ass-002',
          sectionId: 'sec-fed-08',
          order: 302,
          description: 'A ILPI comprova articulação ativa com a Unidade Básica de Saúde (UBS) ou Estratégia Saúde da Família (ESF) de referência do território, com residentes devidamente inscritos no serviço de saúde local.',
          legislation: 'Art. 36 da RDC 502/2021; Roteiro UTPSS/MPGO — Atenção à Saúde',
          weight: 10,
          isCritical: true,
        },

        {
          // Registro de participação dos residentes nas atividades de
          // lazer e fisioterapia. O federal (fed-050) exige que as
          // atividades existam (Art. 32), mas não exige registro de
          // participação. O MPGO verifica o registro como evidência
          // de que as atividades são efetivamente realizadas.
          id: 'go-sup-ass-003',
          sectionId: 'sec-fed-08',
          order: 303,
          description: 'Existe registro documentado da participação dos residentes nas atividades físicas (fisioterapia), recreativas e de lazer, com assinatura ou rubrica do profissional responsável.',
          legislation: 'Art. 32 da RDC 502/2021; Roteiro UTPSS/MPGO — Assistência',
          weight: 5,
          isCritical: false,
        },

      ],
    },

    // ── BLOCO 4 ───────────────────────────────────────────────
    // Adições à seção federal: Recursos Humanos
    // Seção federal receptora: sec-fed-12
    //
    // O federal já cobre (NÃO repetir aqui):
    //   ilpi-067 — RT nível superior, 20h/semana (Arts. 10, 11 e 16 I)
    //   ilpi-068 — cuidadores Grau I 1:20 (Art. 16 I-a)
    //   ilpi-069 — cuidadores Grau II 1:10 (Art. 16 I-b)
    //   ilpi-070 — cuidadores Grau III 1:6 (Art. 16 I-c)
    //   ilpi-071 — lazer 1:40 / 12h sem (Art. 16 III)
    //   ilpi-072 — limpeza 1:100m²/turno (Art. 16 IV)
    //   ilpi-072b — lavanderia 1:30/dia (Art. 16 VI)
    //   ilpi-073 — alimentação 1:20 / 2 turnos (Art. 16 V)
    //   ilpi-074 — educação permanente em gerontologia (Art. 18)
    //   ilpi-075a — vínculo formal de todos os RH (Art. 16)
    //   ilpi-076a — escala de trabalho (Art. 16)
    // ─────────────────────────────────────────────────────────
    {
      targetSectionId: 'sec-fed-12',
      targetSectionTitle: 'Recursos Humanos',
      items: [

        {
          // Conselhos de classe específicos de Goiás. O federal
          // (Art. 17 RDC 502/2021) exige registro no conselho de
          // classe sem nomear o estado. O Art. 276 I da Lei Municipal
          // 1.812/2014 e o Roteiro MPGO/UTPSS verificam nominalmente
          // os conselhos regionais de Goiás (CRM-GO, COREN-GO etc.).
          id: 'go-sup-rh-001',
          sectionId: 'sec-fed-12',
          order: 401,
          description: 'Todos os profissionais de saúde da ILPI possuem registro ativo no respectivo Conselho Regional de Goiás: médicos no CRM-GO, enfermeiros e técnicos no COREN-GO, nutricionistas no CRN-GO, fisioterapeutas no CREFITO-GO, psicólogos no CRP-GO, assistentes sociais no CRESS-GO.',
          legislation: 'Art. 17 da RDC 502/2021; Art. 276, Inciso I, Lei Ordinária nº 1.812/2014; legislação específica de cada conselho profissional',
          weight: 10,
          isCritical: true,
        },

        {
          // Frequência mínima semestral das capacitações. O federal
          // (fed-074, Art. 18) exige "atividades de educação permanente
          // em gerontologia" sem definir periodicidade. O Art. 276 III
          // da Lei Municipal 1.812/2014 fixa frequência mínima
          // semestral — adição exclusivamente local.
          id: 'go-sup-rh-002',
          sectionId: 'sec-fed-12',
          order: 402,
          description: 'As capacitações em gerontologia são realizadas com frequência mínima semestral, com registro de conteúdo programático, data, carga horária e assinatura de todos os participantes.',
          legislation: 'Art. 18 da RDC 502/2021; Art. 276, Inciso III, Lei Ordinária nº 1.812/2014',
          weight: 5,
          isCritical: false,
        },

        {
          // Evolução multiprofissional registrada no prontuário.
          // O federal (fed-048, Art. 33) exige "registro atualizado
          // de cada idoso". O Roteiro MPGO/UTPSS verifica se cada
          // profissional registra sua própria evolução — evidência
          // de cuidado multiprofissional efetivo que o federal não
          // desdobra em item específico.
          id: 'go-sup-rh-003',
          sectionId: 'sec-fed-12',
          order: 403,
          description: 'Cada profissional de saúde registra sua própria evolução no prontuário multiprofissional do residente, com assinatura, número do conselho e data, comprovando a atuação interdisciplinar efetiva.',
          legislation: 'Art. 33 da RDC 502/2021; COFEN nº 736/2024 (Processo de Enfermagem); Roteiro UTPSS/MPGO — Prontuário',
          weight: 10,
          isCritical: true,
        },

      ],
    },

    // ── BLOCO 5 ───────────────────────────────────────────────
    // Adições à seção federal: Documentação Administrativa
    // Seção federal receptora: sec-fed-13
    // (segunda rodada — complementa o Bloco 1 desta seção)
    //
    // O federal já cobre (NÃO repetir aqui):
    //   ilpi-075 — Estatuto / Contrato Social (Art. 9º I e II)
    //   ilpi-076 — Regimento Interno (Art. 9º III)
    //   ilpi-077 — inscrição no Conselho do Idoso (genérico)
    //   ilpi-078 — contrato com residente (Art. 12)
    //   ilpi-079 — POPs escritos (Art. 41)
    //   ilpi-080 — Plano de Trabalho (Art. 48 pu Lei 10.741)
    //   ilpi-081 — avaliação de desempenho com indicadores (Art. 59)
    //   ilpi-082 — envio de indicadores em janeiro (Art. 60)
    // ─────────────────────────────────────────────────────────
    {
      targetSectionId: 'sec-fed-13',
      targetSectionTitle: 'Documentação Administrativa (complemento)',
      items: [

        {
          // Livro de registro de entradas e saídas de residentes.
          // Não existe no federal. O Roteiro MPGO/UTPSS verifica
          // esse livro para rastrear o fluxo de institucionalização,
          // altas, transferências e óbitos.
          id: 'go-sup-doc2-001',
          sectionId: 'sec-fed-13',
          order: 501,
          description: 'Possui livro de registro atualizado de entradas e saídas de residentes, contendo data de admissão, grau de dependência, e registro de altas, transferências e óbitos.',
          legislation: 'Art. 17 da RDC 502/2021; Roteiro UTPSS/MPGO — Controle de Residentes',
          weight: 5,
          isCritical: false,
        },

        {
          // Listagem atualizada de graus de dependência. O federal
          // define os graus (Art. 3º) mas não exige item de
          // verificação de listagem atualizada. O ROI ANVISA e o
          // MPGO verificam esse documento para cruzar com o
          // dimensionamento de cuidadores da escala.
          id: 'go-sup-doc2-002',
          sectionId: 'sec-fed-13',
          order: 502,
          description: 'Mantém listagem atualizada com o grau de dependência (I, II ou III) de todos os residentes, disponível para cruzamento com a escala de cuidadores no momento da inspeção.',
          legislation: 'Art. 3º da RDC 502/2021; ROI ANVISA ILPI Documento 11.1; Roteiro UTPSS/MPGO',
          weight: 10,
          isCritical: true,
        },

        {
          // Arquivo de registros de eventos sentinela. O federal
          // (fed-052) cobre a notificação imediata à VISA (Art. 55).
          // Este item verifica se os registros ficam arquivados na
          // ILPI para consulta posterior — exigência do ROI ANVISA
          // e MPGO que o federal não desdobra em item de arquivo.
          id: 'go-sup-doc2-003',
          sectionId: 'sec-fed-13',
          order: 503,
          description: 'Registros individuais de cada evento sentinela (queda com lesão, tentativa de suicídio) estão arquivados na ILPI, com data, circunstância, profissional que atendeu e comprovante de notificação enviado à VISA local.',
          legislation: 'Art. 55 da RDC 502/2021; ROI ANVISA ILPI Documento 11.1; Roteiro UTPSS/MPGO',
          weight: 10,
          isCritical: true,
        },

        {
          // Cálculo mensal dos indicadores de desempenho. O federal
          // (fed-082, Art. 60) exige envio do consolidado anual à
          // VISA em janeiro. O ROI ANVISA e o Roteiro MPGO verificam
          // o cálculo mensal interno dos indicadores — frequência
          // maior que a exigida pelo federal.
          id: 'go-sup-doc2-004',
          sectionId: 'sec-fed-13',
          order: 504,
          description: 'Os indicadores de desempenho do Anexo da RDC 502/2021 (mortalidade, DDA, escabiose, desidratação, lesão por pressão, desnutrição) são calculados e registrados mensalmente, com consolidado anual enviado à VISA local em janeiro.',
          legislation: 'Arts. 58, 59 e 60 da RDC 502/2021; ROI ANVISA ILPI Documento 11.1',
          weight: 5,
          isCritical: false,
        },

        {
          // Instrução de higienização das mãos afixada. A RDC 36/2013
          // (segurança do paciente em serviços de saúde) exige cartazes
          // de higiene de mãos. Embora o ROI ANVISA a aplique em ILPI,
          // ela não é citada no federal do template. Item recomendável.
          id: 'go-sup-doc2-005',
          sectionId: 'sec-fed-13',
          order: 505,
          description: 'Instruções padronizadas de higienização das mãos (técnica dos 7 passos da OMS) estão afixadas em locais visíveis: banheiros, cozinha, posto de enfermagem, ponto de acesso a medicamentos.',
          legislation: 'RDC ANVISA nº 36/2013; ROI ANVISA ILPI; Roteiro UTPSS/MPGO',
          weight: 2,
          isCritical: false,
        },

        {
          // Registro diário assinado pelo responsável do turno.
          // O federal (fed-054c) exige "arquivo de anotações com
          // data e circunstâncias do atendimento". Este item adiciona
          // a exigência de assinatura por turno — verificação do
          // Roteiro MPGO/UTPSS que responsabiliza nominalmente o
          // profissional de plantão por cada registro.
          id: 'go-sup-doc2-006',
          sectionId: 'sec-fed-13',
          order: 506,
          description: 'O livro de ocorrências contém registro diário de intercorrências por turno, com identificação e assinatura do profissional responsável por cada turno, garantindo rastreabilidade do cuidado.',
          legislation: 'Art. 33 da RDC 502/2021; Art. 50, Inciso XV, Lei Federal nº 10.741/2003; Roteiro UTPSS/MPGO',
          weight: 10,
          isCritical: true,
        },

        {
          // Arquivo de notificações de DNC. O federal (fed-051)
          // cobre a notificação em si (Art. 54). O MPGO verifica
          // se as fichas de notificação foram arquivadas na ILPI
          // — evidência de que o processo foi de fato realizado
          // e não apenas comunicado verbalmente.
          id: 'go-sup-doc2-007',
          sectionId: 'sec-fed-13',
          order: 507,
          description: 'Fichas de notificação de Doenças de Notificação Compulsória (DNC) enviadas à Vigilância Epidemiológica estão arquivadas na ILPI, com protocolo de recebimento ou comprovante de envio.',
          legislation: 'Art. 54 da RDC 502/2021; Portaria de Consolidação MS nº 4/2017; Roteiro UTPSS/MPGO',
          weight: 10,
          isCritical: true,
        },

      ],
    },

  ],

  // ── SEÇÃO NOVA ────────────────────────────────────────────
  // Direitos e Convivência dos Residentes
  //
  // Esta seção NÃO existe no roteiro federal. Ela é exigida
  // exclusivamente pelo Roteiro MPGO/UTPSS e pela Lei Federal
  // 10.741/2003, que atribuem ao MP-GO fiscalização dos direitos
  // fundamentais dos residentes para além das condições sanitárias.
  // A VISA de Senador Canedo adota essa seção por orientação do
  // ROI ANVISA ILPI e da parceria VISA/MP-GO.
  // ─────────────────────────────────────────────────────────

  newSections: [
    {
      id: 'sec-go-sup-direitos',
      title: 'Direitos e Convivência dos Residentes',
      order: 14,
      items: [

        {
          id: 'go-sup-dir-001',
          sectionId: 'sec-go-sup-direitos',
          order: 1,
          description: 'Os residentes têm liberdade de ir e vir assegurada. Eventuais restrições de saída estão formalmente justificadas no Plano de Atenção à Saúde (PAISI) individual e comunicadas à família ou representante legal.',
          legislation: 'Art. 6º, Inciso I, da RDC 502/2021; Arts. 10 e 15 da Lei Federal nº 10.741/2003; Roteiro UTPSS/MPGO',
          weight: 10,
          isCritical: true,
        },

        {
          id: 'go-sup-dir-002',
          sectionId: 'sec-go-sup-direitos',
          order: 2,
          description: 'A identidade e a privacidade de cada residente são preservadas: dados pessoais e de saúde não são expostos sem consentimento, e os dormitórios garantem condições de dignidade.',
          legislation: 'Art. 6º, Inciso II, da RDC 502/2021; Art. 17 da Lei Federal nº 10.741/2003; Lei Federal nº 13.709/2018 (LGPD); Roteiro UTPSS/MPGO',
          weight: 10,
          isCritical: true,
        },

        {
          id: 'go-sup-dir-003',
          sectionId: 'sec-go-sup-direitos',
          order: 3,
          description: 'Cada residente tem acesso a vestuário individual adequado e higienizado e a produtos de higiene pessoal (sabonete, shampoo, escova e pasta dental, absorvente quando necessário).',
          legislation: 'Art. 5º da RDC 502/2021; Art. 50, Inciso IV, da Lei Federal nº 10.741/2003; Roteiro UTPSS/MPGO',
          weight: 10,
          isCritical: true,
        },

        {
          id: 'go-sup-dir-004',
          sectionId: 'sec-go-sup-direitos',
          order: 4,
          description: 'A instituição garante horários amplos e flexíveis para recepção de visitas de familiares e pessoas próximas, sem restrição arbitrária de acesso.',
          legislation: 'Art. 49, Inciso II, da Lei Federal nº 10.741/2003; Art. 5º da RDC 502/2021; Roteiro UTPSS/MPGO',
          weight: 5,
          isCritical: false,
        },

        {
          id: 'go-sup-dir-005',
          sectionId: 'sec-go-sup-direitos',
          order: 5,
          description: 'São realizadas atividades que fortalecem vínculos familiares e comunitários: saídas acompanhadas, contatos telefônicos facilitados, participação de familiares em eventos da ILPI.',
          legislation: 'Art. 32 da RDC 502/2021; Arts. 3º e 49 da Lei Federal nº 10.741/2003; Roteiro UTPSS/MPGO',
          weight: 5,
          isCritical: false,
        },

        {
          id: 'go-sup-dir-006',
          sectionId: 'sec-go-sup-direitos',
          order: 6,
          description: 'Não há evidências de violência física, psicológica, negligência, abandono, maus-tratos ou discriminação contra qualquer residente. A equipe conhece os canais de denúncia.',
          legislation: 'Arts. 4º, 19 e 20 da Lei Federal nº 10.741/2003; Art. 5º da RDC 502/2021; Roteiro UTPSS/MPGO',
          weight: 10,
          isCritical: true,
        },

        {
          id: 'go-sup-dir-007',
          sectionId: 'sec-go-sup-direitos',
          order: 7,
          description: 'A ILPI atende apenas os graus de dependência (I, II, III) expressamente autorizados no Alvará Sanitário vigente. Nenhum residente com grau de complexidade superior ao habilitado está institucionalizado.',
          legislation: 'Art. 8º da RDC 502/2021; ROI ANVISA ILPI Documento 11.1; Roteiro UTPSS/MPGO',
          weight: 10,
          isCritical: true,
        },

      ],
    },
  ],

};
