import { Moon, Sun } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore, useThemeMode, useToggleTheme } from '@/stores'
import LoginForm from './LoginForm'
import { LoginProvider } from './providers/LoginProvider'
import RegisterForm from './RegisterForm'
import ResetForm from './ResetForm'

function LoginPage() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const themeMode = useThemeMode()
  const toggleTheme = useToggleTheme()

  if (isAuthenticated) {
    return <Navigate to='/dashboard' replace />
  }

  return (
    <div className='relative grid min-h-svh lg:grid-cols-2 bg-background'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex justify-between gap-2'>
          <div className='flex items-center gap-2 font-medium cursor-pointer'>
            <span className='text-xl font-bold text-primary'>Vidora Admin</span>
          </div>
          <Button variant='ghost' size='icon' onClick={toggleTheme}>
            {themeMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <LoginProvider>
              <LoginForm />
              <RegisterForm />
              <ResetForm />
            </LoginProvider>
          </div>
        </div>
      </div>

      <div className='relative hidden bg-linear-to-br from-primary/20 to-primary/5 lg:flex items-center justify-center'>
        <div className='text-center space-y-4 p-8'>
          <h2 className='text-3xl font-bold text-foreground'>视频管理</h2>
          <p className='text-muted-foreground'>高效管理您的视频内容、分类和用户</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
