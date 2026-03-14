import { Skeleton } from '@/shared/components/ui/skeleton'

export function SkeletonPage() {
  return (
    <div className='p-6 space-y-4'>
      {/* 标题 */}
      <Skeleton className='h-6 w-32' />

      {/* 操作栏 */}
      <Skeleton className='h-10 w-36' />

      {/* 内容区 - 表格骨架 */}
      <div className='space-y-px'>
        {/* 表头 */}
        <div className='flex gap-4 p-3 bg-muted/50 rounded-t-md'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-4 w-20 ml-auto' />
        </div>

        {/* 表格行 */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className='flex gap-4 p-3 border-b'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-4 w-20 ml-auto' />
          </div>
        ))}
      </div>

      {/* 分页 */}
      <div className='flex items-center justify-between'>
        <Skeleton className='h-4 w-32' />
        <div className='flex gap-2'>
          <Skeleton className='h-8 w-20' />
          <Skeleton className='h-8 w-20' />
        </div>
      </div>
    </div>
  )
}
