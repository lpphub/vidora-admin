import { Bell } from 'lucide-react'
import type { ReactNode } from 'react'
import { LanguageSwitcher } from '@/shared/components/common/LanguageSwitcher'
import { NavBreadcrumb } from '@/shared/components/common/NavBreadcrumb'
import { ThemeToggle } from '@/shared/components/common/ThemeToggle'
import { UserDropdown } from '@/shared/components/common/UserDropdown'
import { Button } from '@/shared/components/ui/button'
import { SidebarTrigger } from '@/shared/components/ui/sidebar'

interface HeaderProps {
  leftSlot?: ReactNode
}

export function Header({ leftSlot }: HeaderProps) {
  return (
    <header className='sticky top-0 z-30 flex items-center justify-between px-4 h-16 bg-background/80 backdrop-blur-xl'>
      <div className='flex items-center'>
        <SidebarTrigger />
        {leftSlot}
        <div className='hidden md:block ml-4'>
          <NavBreadcrumb />
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <LanguageSwitcher />
        <ThemeToggle className='rounded-full' />
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
