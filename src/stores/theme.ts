import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { StorageEnum, ThemeMode } from '@/types/enum'

type ThemeModeValue = typeof ThemeMode.Light | typeof ThemeMode.Dark

type ThemeStore = {
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

export const useThemeStore = create<ThemeStore>()(
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
      name: StorageEnum.Theme,
      onRehydrateStorage: () => state => {
        // Apply theme on app startup after rehydration
        if (state?.themeMode) {
          applyTheme(state.themeMode)
        }
      },
    }
  )
)

export const useThemeMode = () => useThemeStore(state => state.themeMode)
export const useToggleTheme = () => useThemeStore(state => state.toggleTheme)
export const useSetThemeMode = () => useThemeStore(state => state.setThemeMode)
