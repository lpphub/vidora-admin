import { SearchX, ServerCrash, ShieldX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'

interface ErrorPageProps {
  code: string
  title: string
  description: string
  icon: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

function ErrorPage({ code, title, description, icon, action, secondaryAction }: ErrorPageProps) {
  return (
    <div className='min-h-svh flex items-center justify-center bg-background p-4'>
      <div className='relative w-full max-w-md'>
        {/* Decorative background */}
        <div className='absolute inset-0 -z-10 overflow-hidden'>
          <div className='absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl' />
          <div className='absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl' />
        </div>

        <div className='text-center space-y-8'>
          {/* Error code */}
          <div className='relative'>
            <span
              className={cn(
                'text-[10rem] font-bold leading-none select-none',
                'bg-linear-to-br from-primary/30 via-primary/20 to-transparent',
                'bg-clip-text text-transparent',
                'dark:from-primary/20 dark:via-primary/10'
              )}
            >
              {code}
            </span>
            {/* Icon overlay */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='p-4 rounded-full bg-primary/10 text-primary dark:bg-primary/20'>
                {icon}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className='space-y-3'>
            <h1 className='text-2xl font-semibold text-foreground'>{title}</h1>
            <p className='text-muted-foreground max-w-sm mx-auto'>{description}</p>
          </div>

          {/* Actions */}
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            {action && (
              <Button onClick={action.onClick} size='lg'>
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button variant='outline' onClick={secondaryAction.onClick} size='lg'>
                {secondaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function NotFound() {
  const navigate = useNavigate()

  return (
    <ErrorPage
      code='404'
      title='页面不存在'
      description='抱歉，您访问的页面不存在或已被移除。请检查网址是否正确。'
      icon={<SearchX size={48} strokeWidth={1.5} />}
      action={{
        label: '返回首页',
        onClick: () => navigate('/', { replace: true }),
      }}
    />
  )
}

export function Unauthorized() {
  const navigate = useNavigate()

  return (
    <ErrorPage
      code='401'
      title='未授权访问'
      description='抱歉，您没有权限访问此页面。请登录后重试。'
      icon={<ShieldX size={48} strokeWidth={1.5} />}
      action={{
        label: '前往登录',
        onClick: () => navigate('/login', { replace: true }),
      }}
      secondaryAction={{
        label: '返回首页',
        onClick: () => navigate('/', { replace: true }),
      }}
    />
  )
}

export function ServerError() {
  const navigate = useNavigate()

  return (
    <ErrorPage
      code='500'
      title='服务器错误'
      description='抱歉，服务器遇到了问题。请稍后重试或联系管理员。'
      icon={<ServerCrash size={48} strokeWidth={1.5} />}
      action={{
        label: '刷新页面',
        onClick: () => window.location.reload(),
      }}
      secondaryAction={{
        label: '返回首页',
        onClick: () => navigate('/', { replace: true }),
      }}
    />
  )
}
