import { LogOut, Settings, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores'

export function UserDropdown() {
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
            <div className='text-sm font-medium'>{user?.username || '用户'}</div>
            <div className='text-xs text-gray-500'>{user?.email || ''}</div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings size={16} className='mr-2' />
          个人设置
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className='text-red-500'>
          <LogOut size={16} className='mr-2' />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
