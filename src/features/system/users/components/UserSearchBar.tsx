import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/components/ui/input'

interface UserSearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function UserSearchBar({ value, onChange }: UserSearchBarProps) {
  const { t } = useTranslation('users')

  return (
    <div className='relative flex-1 max-w-sm'>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
      <Input
        placeholder={t('search.placeholder')}
        value={value}
        onChange={e => onChange(e.target.value)}
        className='pl-9'
      />
    </div>
  )
}
