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
    (set, get) => ({
      user: null,
      tenantInfo: null,
      loading: true,
      initialized: false,
      setUser: (user) => set({ user, loading: false }),
      signOut: async () => {
        await supabase.auth.signOut().catch(() => {});
        clearAuthCache();
        set({ user: null, tenantInfo: null });
      },
      initialize: async () => {
        // ✅ OFFLINE-FIRST: If we already have persisted (cached) user state,
        // mark as initialized immediately — app opens without waiting for network.
        const persisted = get();
        if (persisted.user) {
          set({ initialized: true, loading: false });

          // Validate session silently in background (non-blocking).
          Promise.resolve().then(async () => {
            try {
              const { data: { session } } = await supabase.auth.getSession();
              if (!session) {
                // Session expired — force re-login
                set({ user: null, tenantInfo: null });
              } else if (!persisted.tenantInfo) {
                const t = await getCurrentTenant().catch(() => null);
                set({ tenantInfo: t });
              }
            } catch {
              // Network unavailable — keep cached state as-is
            }
          });
        } else {
          // No cached user — must fetch from network
          try {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user ?? null;
            let tenantInfo = null;
            if (user) {
              tenantInfo = await getCurrentTenant().catch(() => null);
            }
            set({ user, tenantInfo, loading: false, initialized: true });
          } catch {
            // Network error and no cached state — show login page
            set({ user: null, tenantInfo: null, loading: false, initialized: true });
          }
        }

        // Listen for future auth state changes
        supabase.auth.onAuthStateChange(async (_event, session) => {
          const u = session?.user ?? null;
          let t: TenantInfo | null = null;
          if (u) {
            t = await getCurrentTenant().catch(() => null);
          }
          set({ user: u, tenantInfo: t });
        });
      },
    }),
    {
      name: 'inspec-visa-auth',
      partialize: (state) => ({
        user: state.user,
        tenantInfo: state.tenantInfo,
      }),
    }
  )
);
