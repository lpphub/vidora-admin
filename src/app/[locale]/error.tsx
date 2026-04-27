'use client'

import { ServerCrash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className='min-h-svh flex items-center justify-center bg-background p-4'>
      <div className='relative w-full max-w-md'>
        <div className='absolute inset-0 -z-10 overflow-hidden'>
          <div className='absolute -top-40 -right-40 h-80 w-80 rounded-full bg-destructive/10 blur-3xl' />
          <div className='absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-destructive/5 blur-3xl' />
        </div>
        <div className='text-center space-y-8'>
          <div className='relative'>
            <span className='text-[10rem] font-bold leading-none select-none bg-linear-to-br from-destructive/30 via-destructive/20 to-transparent bg-clip-text text-transparent dark:from-destructive/20 dark:via-destructive/10'>
              500
            </span>
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='p-4 rounded-full bg-destructive/10 text-destructive dark:bg-destructive/20'>
                <ServerCrash size={48} strokeWidth={1.5} />
              </div>
            </div>
          </div>
          <div className='space-y-3'>
            <h1 className='text-2xl font-semibold text-foreground'>服务器错误</h1>
            <p className='text-muted-foreground max-w-sm mx-auto'>
              抱歉，服务器遇到了问题。请稍后重试或联系管理员。
            </p>
          </div>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <Button onClick={reset} size='lg'>刷新页面</Button>
            <Link href='/dashboard'>
              <Button variant='outline' size='lg'>返回首页</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
