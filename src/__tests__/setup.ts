import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock do Supabase para não precisar de conexão real nos testes unitários
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://example.com/photo.jpg' } })),
      })),
    },
  },
}));

// Mock do Dexie/IndexedDB
vi.mock('../db/database', () => ({
  db: {
    clients: { toArray: vi.fn(), bulkPut: vi.fn(), delete: vi.fn(), where: vi.fn().mockReturnThis(), equals: vi.fn().mockReturnThis() },
    inspections: { toArray: vi.fn(), bulkPut: vi.fn(), delete: vi.fn(), where: vi.fn().mockReturnThis(), equals: vi.fn().mockReturnThis() },
    responses: { toArray: vi.fn(), bulkPut: vi.fn(), delete: vi.fn(), where: vi.fn().mockReturnThis(), equals: vi.fn().mockReturnThis() },
    schedules: { toArray: vi.fn(), bulkPut: vi.fn(), delete: vi.fn(), where: vi.fn().mockReturnThis(), equals: vi.fn().mockReturnThis() },
    photos: { toArray: vi.fn(), bulkPut: vi.fn(), delete: vi.fn(), where: vi.fn().mockReturnThis(), equals: vi.fn().mockReturnThis() },
  },
}));
