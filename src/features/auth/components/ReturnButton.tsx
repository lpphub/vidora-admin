import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui/button'

interface ReturnButtonProps {
  onClick?: () => void
}

export function ReturnButton({ onClick }: ReturnButtonProps) {
  const { t } = useTranslation('auth')
  return (
    <Button variant='link' onClick={onClick} className='w-full cursor-pointer'>
      <ArrowLeft className='size-4' />
      <span className='text-sm'>{t('resetPassword.backToLogin')}</span>
    </Button>
  )
}
