'use client'

import { Globe } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const supportedLanguages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
] as const

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleLanguageChange = (lang: string) => {
    startTransition(() => {
      const newPath = pathname.replace(`/${locale}`, `/${lang}`)
      router.replace(newPath)
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
