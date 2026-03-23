// ============================================================
// Fixtures compartilhadas entre todos os testes
// ============================================================

import type { ClientCategory, FoodEstablishmentType } from '../types';

export const TENANTS = {
  admin: {
    id: 'tenant-001',
    name: 'C&C Consultoria',
    slug: 'cc-consultoria',
    created_by: 'user-admin-001',
    created_at: '2024-01-01T00:00:00Z',
  },
  client: {
    id: 'tenant-002',
    name: 'Salão Bella',
    slug: 'salao-bella',
    created_by: 'user-admin-001',
    created_at: '2024-01-15T00:00:00Z',
  },
  other: {
    id: 'tenant-999',
    name: 'Outro Tenant',
    slug: 'outro-tenant',
    created_by: 'user-other-001',
    created_at: '2024-01-20T00:00:00Z',
  },
};

export const USERS = {
  admin: {
    id: 'user-admin-001',
    email: 'ester@cconsultoria.com.br',
    role: 'admin' as const,
    tenant_id: 'tenant-001',
  },
  consultant: {
    id: 'user-consultant-001',
    email: 'consultora@cconsultoria.com.br',
    role: 'consultant' as const,
    tenant_id: 'tenant-001',
  },
  client: {
    id: 'user-client-001',
    email: 'dono@salaobella.com.br',
    role: 'client' as const,
    tenant_id: 'tenant-002',
  },
  clientOther: {
    id: 'user-other-001',
    email: 'outro@outrotenant.com',
    role: 'client' as const,
    tenant_id: 'tenant-999',
  },
};

export const CHECKLIST_ACCESS = [
  { id: 'access-001', tenant_id: 'tenant-002', checklist_type: 'estetica' as ClientCategory },
  { id: 'access-002', tenant_id: 'tenant-002', checklist_type: 'ilpi' as ClientCategory },
  // 'alimentos' não está liberado para tenant-002
];

export const CLIENTS = [
  {
    id: 'client-001',
    tenant_id: 'tenant-002',
    name: 'Salão de Beleza A',
    category: 'estetica' as ClientCategory,
    email: 'contato@salaoa.com',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'client-002',
    tenant_id: 'tenant-002',
    name: 'ILPI Casa Feliz',
    category: 'ilpi' as ClientCategory,
    email: 'contato@casafeliz.com',
    createdAt: new Date('2024-01-12'),
  },
];

export const INSPECTIONS = [
  {
    id: 'inspection-001',
    tenant_id: 'tenant-002',
    clientId: 'client-001',
    templateId: 'template-estetica',
    consultantName: 'Ester',
    inspectionDate: new Date('2024-01-20'),
    status: 'completed' as const,
    createdAt: new Date('2024-01-20'),
    responses: [],
  },
  {
    id: 'inspection-002',
    tenant_id: 'tenant-002',
    clientId: 'client-001',
    templateId: 'template-ilpi',
    consultantName: 'Ester',
    inspectionDate: new Date('2024-01-21'),
    status: 'in_progress' as const,
    createdAt: new Date('2024-01-21'),
    responses: [],
  },
];
