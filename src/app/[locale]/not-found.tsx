import { SearchX } from 'lucide-react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'

export default async function NotFound() {
  const t = await getTranslations('common')

  return (
    <div className='min-h-svh flex items-center justify-center bg-background p-4'>
      <div className='relative w-full max-w-md'>
        <div className='absolute inset-0 -z-10 overflow-hidden'>
          <div className='absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl' />
          <div className='absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl' />
        </div>
        <div className='text-center space-y-8'>
          <div className='relative'>
            <span className='text-[10rem] font-bold leading-none select-none bg-linear-to-br from-primary/30 via-primary/20 to-transparent bg-clip-text text-transparent dark:from-primary/20 dark:via-primary/10'>
              404
            </span>
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='p-4 rounded-full bg-primary/10 text-primary dark:bg-primary/20'>
                <SearchX size={48} strokeWidth={1.5} />
              </div>
            </div>
          </div>
          <div className='space-y-3'>
            <h1 className='text-2xl font-semibold text-foreground'>{t('notFound.title')}</h1>
            <p className='text-muted-foreground max-w-sm mx-auto'>{t('notFound.description')}</p>
          </div>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <Link href='/dashboard'>
              <Button size='lg'>{t('notFound.backHome')}</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
