import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { clearAuthCache } from '../services/authService';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
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
      loading: true,
      initialized: false,
      setUser: (user) => set({ user, loading: false }),
      signOut: async () => {
        await supabase.auth.signOut();
        clearAuthCache();
        set({ user: null });
      },
      initialize: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        set({ user: session?.user ?? null, loading: false, initialized: true });

        supabase.auth.onAuthStateChange((_event, session) => {
          set({ user: session?.user ?? null });
        });
      },
    }),
    {
      name: 'inspec-visa-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
