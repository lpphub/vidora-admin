import { AlertCircle, CheckCircle, Clock, Film, Image, Loader2, RotateCcw, X } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Progress } from '@/shared/components/ui/progress'
import type { TranscodingTask } from '../../types'

const statusConfig = {
  pending: { label: '排队中', icon: Clock, color: 'text-muted-foreground', bgColor: 'bg-muted' },
  processing: { label: '处理中', icon: Loader2, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  completed: {
    label: '已完成',
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  failed: {
    label: '失败',
    icon: AlertCircle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
}

const typeConfig = {
  transcode: { label: '转码', icon: Film },
  thumbnail: { label: '缩略图', icon: Image },
  subtitle: { label: '字幕', icon: Film },
}

function formatTime(dateStr?: string): string {
  if (!dateStr) return '--'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface TaskCardProps {
  task: TranscodingTask
  onRetry?: (id: string) => void
  onCancel?: (id: string) => void
  isRetrying?: boolean
  isCanceling?: boolean
}

export function TaskCard({ task, onRetry, onCancel, isRetrying, isCanceling }: TaskCardProps) {
  const status = statusConfig[task.status]
  const type = typeConfig[task.type]
  const StatusIcon = status.icon
  const TypeIcon = type.icon

  return (
    <div className='flex items-start gap-4 rounded-lg border bg-card p-4'>
      <div className={`shrink-0 rounded-lg p-3 ${status.bgColor}`}>
        <TypeIcon className={`h-5 w-5 ${status.color}`} />
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex items-center justify-between gap-2 mb-1'>
          <h3 className='font-medium truncate'>{task.videoTitle}</h3>
          <Badge
            variant={task.status === 'completed' ? 'default' : 'secondary'}
            className='shrink-0'
          >
            <StatusIcon
              className={`mr-1 h-3 w-3 ${task.status === 'processing' ? 'animate-spin' : ''}`}
            />
            {status.label}
          </Badge>
        </div>

        <div className='text-sm text-muted-foreground mb-3'>{type.label}</div>

        <div className='mb-2'>
          <div className='flex items-center justify-between text-xs text-muted-foreground mb-1'>
            <span>
              {task.input.resolution} {task.input.codec} → {task.output.resolution}{' '}
              {task.output.codec}
            </span>
            <span>{task.progress}%</span>
          </div>
          <Progress value={task.progress} className='h-2' />
        </div>

        <div className='flex items-center justify-between text-xs text-muted-foreground'>
          <span>
            {task.status === 'processing' &&
              task.startedAt &&
              `开始于 ${formatTime(task.startedAt)}`}
            {task.status === 'completed' &&
              task.completedAt &&
              `完成于 ${formatTime(task.completedAt)}`}
            {task.status === 'pending' && '等待处理...'}
            {task.status === 'failed' && '处理失败'}
          </span>
          {task.output.bitrate > 0 && <span>{task.output.bitrate} kbps</span>}
        </div>

        {task.status === 'failed' && task.error && (
          <p className='mt-2 text-sm text-destructive'>{task.error}</p>
        )}
      </div>

      <div className='flex items-center gap-1 shrink-0'>
        {task.status === 'failed' && onRetry && (
          <Button
            variant='ghost'
            size='icon-xs'
            onClick={() => onRetry(task.id)}
            disabled={isRetrying}
            title='重试'
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
          </Button>
        )}
        {(task.status === 'pending' || task.status === 'processing') && onCancel && (
          <Button
            variant='ghost'
            size='icon-xs'
            onClick={() => onCancel(task.id)}
            disabled={isCanceling}
            title='取消'
          >
            <X className='h-3.5 w-3.5' />
          </Button>
        )}
      </div>
    </div>
  )
}
