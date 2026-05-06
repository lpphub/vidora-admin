'use client'

import { Globe } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSetLanguage } from '@/stores/locale'

const supportedLanguages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
] as const

export function LanguageSwitcher() {
  const locale = useLocale()
  const setLanguage = useSetLanguage()
  const [isPending, startTransition] = useTransition()

  const handleLanguageChange = (lang: string) => {
    startTransition(() => {
      // Update localStorage via Zustand store
      setLanguage(lang as 'zh' | 'en')
      // Set cookie for middleware
      document.cookie = `locale=${lang};path=/;max-age=${60 * 60 * 24 * 365}`
      // Reload to pick up new locale
      window.location.reload()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='rounded-full' disabled={isPending}>
          <Globe size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='center'>
        {supportedLanguages.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={locale === lang.code ? 'bg-accent' : ''}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
