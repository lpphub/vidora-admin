import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { type LanguageCode, supportedLanguages } from '@/shared/locales'
import { useLanguage, useSetLanguage } from '@/shared/stores/locale'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const currentLanguage = useLanguage()
  const setLanguage = useSetLanguage()

  const handleLanguageChange = (lang: LanguageCode) => {
    i18n.changeLanguage(lang)
    setLanguage(lang)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='rounded-full'>
          <Globe size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='center'>
        {supportedLanguages.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={currentLanguage === lang.code ? 'bg-accent' : ''}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
