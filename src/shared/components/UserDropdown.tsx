import { LogOut, Settings, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { useAuthStore } from '@/shared/stores/auth'

export function UserDropdown() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const userInitial = user?.username?.charAt(0).toUpperCase() || null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-7 w-7'>
            <AvatarFallback className='bg-emerald-500 text-white font-medium'>
              {userInitial || <User size={14} />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-48' align='end'>
        <div className='flex items-center gap-2 p-2'>
          <Avatar className='h-8 w-8'>
            <AvatarFallback className='bg-emerald-500 text-white font-medium'>
              {userInitial || <User size={14} />}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col items-start'>
            <div className='text-sm font-medium'>{user?.username || t('user.defaultName')}</div>
            <div className='text-xs text-gray-500'>{user?.email || ''}</div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <Settings size={16} className='mr-2' />
          {t('user.settings')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className='text-red-500'>
          <LogOut size={16} className='mr-2' />
          {t('user.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
