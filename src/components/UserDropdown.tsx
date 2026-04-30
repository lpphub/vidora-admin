'use client'

import { LogOut, Settings, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function UserDropdown() {
  const t = useTranslations('common')
  const router = useRouter()
  const [user, setUser] = useState<{ username: string; email: string } | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.code === 0) setUser(data.data)
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
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
        <DropdownMenuItem onClick={() => router.push('/profile')}>
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
