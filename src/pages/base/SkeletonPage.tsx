import { Skeleton } from '@/shared/components/ui/skeleton'

export function SkeletonPage() {
  return (
    <div className='p-6 space-y-4'>
      <Skeleton className='h-12 w-52' />
      <Skeleton className='h-96 w-full rounded-md' />
    </div>
  )
}
