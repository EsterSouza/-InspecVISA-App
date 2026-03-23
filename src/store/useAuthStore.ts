import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { getCurrentTenant, clearAuthCache } from '../services/authService';
import type { TenantInfo } from '../services/authService';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  tenantInfo: TenantInfo | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tenantInfo: null,
      loading: true,
      initialized: false,
      setUser: (user) => set({ user, loading: false }),
      signOut: async () => {
        await supabase.auth.signOut();
        clearAuthCache();
        set({ user: null, tenantInfo: null });
      },
      initialize: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user ?? null;
        const tenantInfo = user ? await getCurrentTenant() : null;
        set({ user, tenantInfo, loading: false, initialized: true });

        supabase.auth.onAuthStateChange(async (_event, session) => {
          const u = session?.user ?? null;
          const t = u ? await getCurrentTenant() : null;
          set({ user: u, tenantInfo: t });
        });
      },
    }),
    {
      name: 'inspec-visa-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
