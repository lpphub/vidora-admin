import { create } from 'zustand'
import { type PersistStorage, persist } from 'zustand/middleware'
import type { LanguageCode } from '@/locales'
import { StorageKey } from '@/shared/lib/constants'

export interface LocaleState {
  language: LanguageCode
  setLanguage: (language: LanguageCode) => void
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    set => ({
      language: 'zh',
      setLanguage: language => set({ language }),
    }),
    {
      name: StorageKey.Locale,
      storage: {
        getItem: (name: string) => {
          const value = localStorage.getItem(name)
          if (value) {
            return { state: { language: value } }
          }
          return null
        },
        setItem: (name: string, value: { state: LocaleState }) => {
          localStorage.setItem(name, value.state.language)
        },
        removeItem: (name: string) => localStorage.removeItem(name),
      } as PersistStorage<LocaleState>,
    }
  )
)

// Hooks for convenience
export const useLanguage = () => useLocaleStore(state => state.language)
export const useSetLanguage = () => useLocaleStore(state => state.setLanguage)
