import { SearchX, ServerCrash, ShieldX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'

interface ErrorPageProps {
  type?: 'not-found' | 'server-error' | 'unauthorized'
  title?: string
  message?: string
}

const ERROR_CONFIG = {
  'not-found': {
    icon: SearchX,
    title: '页面不存在',
    message: '抱歉，您访问的页面不存在',
  },
  'server-error': {
    icon: ServerCrash,
    title: '服务器错误',
    message: '抱歉，服务器出现了问题，请稍后再试',
  },
  unauthorized: {
    icon: ShieldX,
    title: '无权限访问',
    message: '抱歉，您没有权限访问此页面',
  },
}

export function ErrorPage({ type = 'not-found', title, message }: ErrorPageProps) {
  const navigate = useNavigate()
  const config = ERROR_CONFIG[type]
  const Icon = config.icon

  return (
    <div className='flex min-h-[calc(100vh-200px)] w-full items-center justify-center'>
      <div className='flex flex-col items-center gap-4 text-center'>
        <Icon className='size-24 text-muted-foreground' />
        <h1 className='text-4xl font-bold tracking-tight'>{title || config.title}</h1>
        <p className='text-muted-foreground'>{message || config.message}</p>
        <div className='mt-4 flex gap-4'>
          <Button variant='outline' onClick={() => navigate(-1)}>
            返回
          </Button>
          <Button onClick={() => navigate('/')}>返回首页</Button>
        </div>
      </div>
    </div>
  )
}

export function NotFound({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex min-h-[calc(100vh-200px)] w-full items-center justify-center', className)}
      {...props}
    >
      <ErrorPage type='not-found' />
    </div>
  )
}

export function ServerError({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex min-h-[calc(100vh-200px)] w-full items-center justify-center', className)}
      {...props}
    >
      <ErrorPage type='server-error' />
    </div>
  )
}

export function Unauthorized({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex min-h-[calc(100vh-200px)] w-full items-center justify-center', className)}
      {...props}
    >
      <ErrorPage type='unauthorized' />
    </div>
  )
}
