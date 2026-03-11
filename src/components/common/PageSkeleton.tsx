import { Skeleton } from '@/components/ui/skeleton'

export function PageSkeleton() {
  return (
    <div className='flex flex-col gap-4 p-6 w-full'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-8 w-32' />
        <Skeleton className='h-9 w-24' />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Skeleton className='h-32 w-full' />
        <Skeleton className='h-32 w-full' />
        <Skeleton className='h-32 w-full' />
        <Skeleton className='h-32 w-full' />
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <Skeleton className='lg:col-span-2 h-64' />
        <Skeleton className='h-64' />
      </div>
    </div>
  )
}
