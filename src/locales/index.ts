import en from './en'
import zh from './zh'

export const resources = {
  zh,
  en,
}

export const supportedLanguages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
] as const

export type LanguageCode = (typeof supportedLanguages)[number]['code']
