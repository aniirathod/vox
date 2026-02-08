import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GuestSession } from '@/types';
import { createGuest } from '@/services/guestService';

interface AuthStore {
  session: GuestSession | null;
  loading: boolean;
  error: string | null;
  createGuestSession: () => Promise<void>;
  setSession: (session: GuestSession) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: null,
      loading: false,
      error: null,

      createGuestSession: async () => {
        set({ loading: true, error: null });
        try {
          const session = await createGuest();
          set({ session, loading: false });
        } catch (error: any) {
          set({
            error: error.message || 'Failed to create guest session',
            loading: false,
          });
        }
      },

      setSession: (session) => set({ session }),

      clearSession: () => set({ session: null, error: null }),
    }),
    {
      name: 'vox-auth-storage',
      partialize: (state) => ({ session: state.session }),
    }
  )
);
