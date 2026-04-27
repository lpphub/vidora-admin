'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useThemeMode, useToggleTheme } from '@/stores/theme'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const themeMode = useThemeMode()
  const toggleTheme = useToggleTheme()

  return (
    <Button variant='ghost' size='icon' className={className} onClick={toggleTheme}>
      {themeMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </Button>
  )
}
