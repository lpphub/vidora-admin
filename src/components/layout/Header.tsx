import { Bell, LogOut, Search, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores'

export function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className='flex h-16 items-center justify-between bg-white dark:bg-gray-900 px-6'>
      <div className='flex items-center gap-4'>
        <div className='relative w-72'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
          <Input
            type='search'
            placeholder='搜索内容...'
            className='pl-9 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-emerald-500 focus:ring-emerald-500'
          />
        </div>
      </div>
      <div className='flex items-center gap-3'>
        <ThemeToggle />
        <Button
          variant='ghost'
          size='icon'
          className='relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer'
        >
          <Bell className='h-5 w-5' />
          <span className='absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white'>
            3
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='relative h-9 w-9 rounded-full cursor-pointer'>
              <Avatar className='h-9 w-9 border-2 border-gray-200 dark:border-gray-700'>
                <AvatarFallback className='bg-emerald-500 text-white font-medium'>
                  {user?.username?.charAt(0).toUpperCase() || <User className='h-4 w-4' />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-48 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
            align='end'
            forceMount
          >
            <DropdownMenuLabel className='font-normal'>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm font-medium leading-none text-gray-900 dark:text-gray-100'>
                  {user?.username || '用户'}
                </p>
                <p className='text-xs leading-none text-gray-500 dark:text-gray-400'>
                  {user?.email || ''}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className='bg-gray-200 dark:bg-gray-700' />
            <DropdownMenuItem
              onClick={() => navigate('/settings')}
              className='cursor-pointer text-gray-700 dark:text-gray-300 focus:bg-gray-100 dark:focus:bg-gray-700'
            >
              <User className='mr-2 h-4 w-4' />
              个人设置
            </DropdownMenuItem>
            <DropdownMenuSeparator className='bg-gray-200 dark:bg-gray-700' />
            <DropdownMenuItem
              onClick={handleLogout}
              className='cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20'
            >
              <LogOut className='mr-2 h-4 w-4' />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
