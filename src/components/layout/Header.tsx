import { Bell, Moon, Sun } from 'lucide-react'
import type { ReactNode } from 'react'
import { NavBreadcrumb } from '@/components/common/NavBreadcrumb'
import { UserDropdown } from '@/components/common/UserDropdown'
import { Button } from '@/components/ui/button'
import { useThemeMode, useToggleTheme } from '@/stores'

interface HeaderProps {
  leftSlot?: ReactNode
}

export function Header({ leftSlot }: HeaderProps) {
  const themeMode = useThemeMode()
  const toggleTheme = useToggleTheme()

  return (
    <header className='sticky top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-16 bg-background/80 backdrop-blur-xl'>
      <div className='flex items-center'>
        {leftSlot}
        <div className='hidden md:block ml-4'>
          <NavBreadcrumb />
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='icon' className='rounded-full' onClick={toggleTheme}>
          {themeMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </Button>
        <Button variant='ghost' size='icon' className='rounded-full relative'>
          <Bell size={20} />
          <span className='absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white'>
            3
          </span>
        </Button>
        <UserDropdown />
      </div>
    </header>
  )
}
