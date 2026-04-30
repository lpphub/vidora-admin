import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { StorageKey } from '@/lib/constants'
import type { User } from '@/types/auth'

export interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      setUser: user => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: StorageKey.Auth,
      partialize: state => ({
        user: state.user,
      }),
    }
  )
)

// isAuthenticated is derived from user presence, not stored separately
export const useIsAuthenticated = () => useAuthStore(state => state.user !== null)
