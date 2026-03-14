import { Plus } from 'lucide-react'
import { TranscodingTable } from '@/features/transcoding/components'
import {
  useCancelTranscoding,
  useRetryTranscoding,
  useTranscodingTasks,
} from '@/features/transcoding/hooks'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

interface TranscodingTabProps {
  videoId: string
}

export function TranscodingTab({ videoId }: TranscodingTabProps) {
  const { data: tasks } = useTranscodingTasks({ videoId })
  const cancelTranscoding = useCancelTranscoding()
  const retryTranscoding = useRetryTranscoding()

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>转码任务</CardTitle>
        <Button variant='outline' size='sm'>
          <Plus className='mr-1 h-3 w-3' />
          创建任务
        </Button>
      </CardHeader>
      <CardContent>
        {tasks && tasks.length > 0 ? (
          <TranscodingTable
            tasks={tasks}
            onCancel={(id: string) => cancelTranscoding.mutate(id)}
            onRetry={(id: string) => retryTranscoding.mutate(id)}
          />
        ) : (
          <div className='text-center py-8 text-muted-foreground'>暂无转码任务</div>
        )}
      </CardContent>
    </Card>
  )
}
