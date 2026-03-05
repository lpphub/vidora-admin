import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

export interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  if (isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      theme: 'system',
      setTheme: theme => {
        applyTheme(theme)
        set({ theme })
      },
    }),
    {
      name: 'vidora-theme',
      partialize: state => ({ theme: state.theme }),
      onRehydrateStorage: () => state => {
        if (state) {
          applyTheme(state.theme)
        }
      },
    }
  )
)

// 监听系统主题变化
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', () => {
    const state = useThemeStore.getState()
    if (state.theme === 'system') {
      applyTheme('system')
    }
  })
}
