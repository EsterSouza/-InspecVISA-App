// ============================================================
// src/types/index.ts — All TypeScript interfaces
// InspecVISA — C&C Consultoria Sanitária
// ============================================================

export type ClientCategory = 'estetica' | 'ilpi' | 'alimentos';

// Food establishment sub-types for modular inspection
export type FoodEstablishmentType =
  | 'servico_alimentacao'     // Restaurantes, lanchonetes, padarias (RDC 216)
  | 'panificacao_confeitaria' // Padarias com produção própria
  | 'mercado_varejo'          // Mercados, minimercados, hortifrúti
  | 'manipulacao_carnes'      // Açougue, peixaria, frios
  | 'pescados_crus'           // Japonês, sushi, sashimi
  | 'dark_kitchen'            // Cozinha virtual / delivery
  | 'bebidas_sorvetes'        // Sorveterias, cafés, açaí
  | 'catering_eventos'        // Buffet, catering, eventos
  | 'industria_artesanal';    // Produção artesanal registrada

export const FOOD_SEGMENT_LABELS: Record<FoodEstablishmentType, string> = {
  servico_alimentacao: 'Restaurante / Lanchonete',
  panificacao_confeitaria: 'Padaria / Confeitaria',
  mercado_varejo: 'Mercado / Hortifrúti',
  manipulacao_carnes: 'Açougue / Peixaria',
  pescados_crus: 'Japonês / Pescados Crus',
  dark_kitchen: 'Dark Kitchen / Delivery',
  bebidas_sorvetes: 'Sorveteria / Lanchonete / Café',
  catering_eventos: 'Buffet / Catering',
  industria_artesanal: 'Indústria Artesanal',
};

export interface Client {
  id: string;
  name: string;
  cnpj?: string;
  address?: string;
  city?: string;
  state?: string;
  category: ClientCategory;
  foodTypes?: FoodEstablishmentType[]; // only for 'alimentos'
  responsibleName?: string;
  phone?: string;
  email?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  tenantId?: string;
  synced?: number; // 0=pending, 1=synced
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  category: ClientCategory;
  version: string;
  sections: Section[];
}

export interface Section {
  id: string;
  title: string;
  order: number;
  // For alimentos: if set, section only shows when client has matching food types
  applicableFoodTypes?: FoodEstablishmentType[];
  isExtraSection?: boolean;
  segmentKey?: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  sectionId: string;
  order: number;
  description: string;
  legislation?: string;
  legislationUrl?: string;
  weight: number;
  isCritical: boolean;
  isRJOnly?: boolean;
}

export interface Inspection {
  id: string;
  clientId: string;
  templateId: string;
  consultantName: string;
  inspectionDate: Date;
  status: 'in_progress' | 'completed';
  observations?: string;
  createdAt: Date;
  completedAt?: Date;
  // Cached for display
  clientName?: string;
  clientCategory?: ClientCategory;
  foodTypes?: FoodEstablishmentType[];
  city?: string;
  state?: string;
  // P2: Advanced Metadata
  accompanistName?: string;
  accompanistRole?: string;
  // ILPI Specifics
  ilpiCapacity?: number;
  residentsTotal?: number;
  residentsMale?: number;
  residentsFemale?: number;
  dependencyLevel1?: number;
  dependencyLevel2?: number;
  dependencyLevel3?: number;
  signatureDataUrl?: string;
  updatedAt?: Date;
  deletedAt?: Date | null;
  tenantId?: string;
  synced?: number; // 0=pending, 1=synced
}

export type ResponseResult = 'complies' | 'not_complies' | 'not_applicable' | 'not_observed' | 'not_evaluated';

export interface InspectionResponse {
  id: string;
  inspectionId: string;
  itemId: string;
  result: ResponseResult;
  situationDescription?: string;
  correctiveAction?: string;
  responsible?: string;
  deadline?: string;
  customDescription?: string; // For ad-hoc items added by consultant
  photos: InspectionPhoto[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  tenantId?: string;
  synced?: number; // 0=pending, 1=synced
}

export interface InspectionPhoto {
  id: string;
  responseId: string;
  dataUrl: string; // base64 JPEG
  caption?: string;
  takenAt: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  tenantId?: string;
  synced?: number; // 0=pending, 1=synced
}

export interface SectionScore {
  sectionId: string;
  sectionTitle: string;
  totalItems: number;
  evaluatedItems: number;
  compliesCount: number;
  notCompliesCount: number;
  notApplicableCount: number;
  notObservedCount: number;
  scorePercentage: number;
}

export type ScoreClassification = 'critical' | 'regular' | 'good' | 'excellent';

export interface InspectionScore {
  totalItems: number;
  evaluatedItems: number;
  compliesCount: number;
  notCompliesCount: number;
  notApplicableCount: number;
  notObservedCount: number;
  notEvaluatedCount: number;
  scorePercentage: number;
  scoreBySection: SectionScore[];
  classification: ScoreClassification;
}

export interface ConsultantSettings {
  name: string;
  professionalId?: string; // CRF, CRBM, CRN, Coren, etc.
  professionalIdLabel?: string; // e.g. "CRN", "COREN"
  logoDataUrl?: string; // base64 PNG/JPG max 200KB
  theme: 'light' | 'dark';
  companyName?: string;
  phone?: string;
  consultantRole?: 'saude' | 'nutricao' | 'ambos'; // role filter for ILPI
}

export interface Schedule {
  id: string;
  clientId: string;
  clientName?: string;
  scheduledAt: Date;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
  user_id?: string;
  updatedAt?: Date;
  deletedAt?: Date | null;
  tenantId?: string;
  synced?: number; // 0=pending, 1=synced
}

export interface SyncLog {
  id?: number;
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  details?: any;
}
