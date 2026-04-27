import { ThemeToggle } from '@/components/ThemeToggle'
import { LoginForm } from './_components/login-form'

export default function LoginPage() {
  return (
    <div className='relative grid min-h-svh lg:grid-cols-2 bg-background'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex justify-between gap-2'>
          <div className='flex items-center gap-2 font-medium cursor-pointer'>
            <span className='text-xl font-bold text-primary'>Vidora Admin</span>
          </div>
          <ThemeToggle />
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <LoginForm />
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
