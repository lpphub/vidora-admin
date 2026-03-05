import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  children?: ReactNode
}

export function PageHeader({ title, description, action, children }: PageHeaderProps) {
  return (
    <div className='flex items-center justify-between space-y-2 pb-4'>
      <div className='space-y-1'>
        <h1 className='text-3xl font-bold tracking-tight'>{title}</h1>
        {description && <p className='text-sm text-muted-foreground'>{description}</p>}
        {children}
      </div>
      {action && <div className='flex items-center gap-2'>{action}</div>}
    </div>
  )
}
