import { create } from 'zustand'
import { type PersistStorage, persist } from 'zustand/middleware'
import { StorageKey, ThemeMode } from '@/shared/lib/constants'

type ThemeModeValue = typeof ThemeMode.Light | typeof ThemeMode.Dark

type ThemeState = {
  themeMode: ThemeModeValue
  setThemeMode: (mode: ThemeModeValue) => void
  toggleTheme: () => void
}

function applyTheme(mode: ThemeModeValue) {
  const root = document.documentElement
  if (mode === ThemeMode.Dark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeMode: ThemeMode.Light,
      setThemeMode: mode => {
        set({ themeMode: mode })
        applyTheme(mode)
      },
      toggleTheme: () => {
        const current = get().themeMode
        const newMode = current === ThemeMode.Light ? ThemeMode.Dark : ThemeMode.Light
        set({ themeMode: newMode })
        applyTheme(newMode)
      },
    }),
    {
      name: StorageKey.Theme,
      onRehydrateStorage: () => state => {
        if (state?.themeMode) {
          applyTheme(state.themeMode)
        }
      },
      storage: {
        getItem: (name: string) => {
          const value = localStorage.getItem(name)
          if (value) {
            return { state: { themeMode: value } }
          }
          return null
        },
        setItem: (name: string, value: { state: ThemeState }) => {
          localStorage.setItem(name, value.state.themeMode)
        },
        removeItem: (name: string) => localStorage.removeItem(name),
      } as PersistStorage<ThemeState>,
    }
  )
)

export const useThemeMode = () => useThemeStore(state => state.themeMode)
export const useToggleTheme = () => useThemeStore(state => state.toggleTheme)
export const useSetThemeMode = () => useThemeStore(state => state.setThemeMode)
