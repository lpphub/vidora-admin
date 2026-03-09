import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ReturnButtonProps {
  onClick?: () => void
}

export function ReturnButton({ onClick }: ReturnButtonProps) {
  return (
    <Button variant='link' onClick={onClick} className='w-full cursor-pointer'>
      <ArrowLeft className='size-4' />
      <span className='text-sm'>返回登录</span>
    </Button>
  )
}
