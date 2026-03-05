import { Monitor, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/stores/theme'

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()

  const cycleTheme = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  return (
    <Button variant='ghost' size='icon' onClick={cycleTheme}>
      <Sun
        className={cn(
          'h-5 w-5 transition-all',
          theme === 'dark' && 'rotate-90 scale-0',
          theme === 'light' && 'rotate-0 scale-100',
          theme === 'system' && 'rotate-90 scale-0'
        )}
      />
      <Moon
        className={cn(
          'absolute h-5 w-5 transition-all',
          theme === 'dark' && 'rotate-0 scale-100',
          theme === 'light' && 'rotate-90 scale-0',
          theme === 'system' && 'rotate-90 scale-0'
        )}
      />
      <Monitor
        className={cn(
          'absolute h-5 w-5 transition-all',
          theme === 'system' && 'rotate-0 scale-100',
          (theme === 'light' || theme === 'dark') && 'rotate-90 scale-0'
        )}
      />
      <span className='sr-only'>切换主题</span>
    </Button>
  )
}
