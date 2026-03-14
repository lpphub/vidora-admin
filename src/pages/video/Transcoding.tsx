import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import {
  useCancelTask,
  useRetryTask,
  useTranscodingTasks,
} from '@/features/video/hooks/useTranscodingTasks'
import { TaskCard } from '@/features/video/transcoding/components/TaskCard'
import type { TranscodingTask } from '@/features/video/types'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'

type TaskStatus = TranscodingTask['status'] | 'all'

const statusTabs: { value: TaskStatus; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'processing', label: '处理中' },
  { value: 'pending', label: '排队中' },
  { value: 'completed', label: '已完成' },
  { value: 'failed', label: '失败' },
]

interface StatCardProps {
  label: string
  value: number
  color: string
}

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <Card>
      <CardContent className='p-4'>
        <div className='text-sm text-muted-foreground'>{label}</div>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
      </CardContent>
    </Card>
  )
}

function TaskCardSkeleton() {
  return (
    <div className='flex items-start gap-4 rounded-lg border bg-card p-4'>
      <Skeleton className='h-11 w-11 shrink-0 rounded-lg' />
      <div className='flex-1 space-y-2'>
        <Skeleton className='h-5 w-1/3' />
        <Skeleton className='h-4 w-1/4' />
        <Skeleton className='h-2 w-full' />
        <Skeleton className='h-3 w-1/2' />
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className='flex flex-col items-center justify-center py-20 text-muted-foreground'>
      <p className='text-lg'>暂无转码任务</p>
      <p className='mt-1 text-sm'>上传视频后将自动创建转码任务</p>
    </div>
  )
}

export default function TranscodingMonitor() {
  const [status, setStatus] = useState<TaskStatus>('all')
  const { data, isLoading, refetch, isRefetching } = useTranscodingTasks({
    status: status === 'all' ? undefined : status,
  })
  const retryMutation = useRetryTask()
  const cancelMutation = useCancelTask()

  const tasks = data?.list ?? []
  const stats = data?.stats

  const handleRefresh = () => {
    refetch()
  }

  const handleRetry = (id: string) => {
    retryMutation.mutate(id)
  }

  const handleCancel = (id: string) => {
    cancelMutation.mutate(id)
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>转码任务</h1>
        <Button variant='outline' size='sm' onClick={handleRefresh} disabled={isRefetching}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </div>

      {stats && (
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <StatCard label='处理中' value={stats.processing} color='text-blue-500' />
          <StatCard label='排队中' value={stats.pending} color='text-muted-foreground' />
          <StatCard label='已完成' value={stats.completed} color='text-green-500' />
          <StatCard label='失败' value={stats.failed} color='text-destructive' />
        </div>
      )}

      <Tabs value={status} onValueChange={v => setStatus(v as TaskStatus)}>
        <TabsList>
          {statusTabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className='space-y-4'>
          {Array.from({ length: 4 }, (_, i) => `skeleton-${i}`).map(key => (
            <TaskCardSkeleton key={key} />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <div className='space-y-4'>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onRetry={handleRetry}
              onCancel={handleCancel}
              isRetrying={retryMutation.isPending}
              isCanceling={cancelMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  )
}
