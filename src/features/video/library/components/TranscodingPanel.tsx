import { AlertCircle, CheckCircle2, Loader2, Play } from 'lucide-react'
import { useState } from 'react'
import { useTranscodingTasks } from '@/features/video/hooks'
import type { TranscodingConfig, TranscodingTask } from '@/features/video/types'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Progress } from '@/shared/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

interface TranscodingPanelProps {
  videoId: string
  onCreateTask: (config: TranscodingConfig) => void
  onRetry: (taskId: string) => void
  isCreating?: boolean
}

const resolutionOptions = [
  { value: '1080p', label: '1080p', bitrate: 5000 },
  { value: '720p', label: '720p', bitrate: 2800 },
  { value: '480p', label: '480p', bitrate: 1400 },
  { value: '360p', label: '360p', bitrate: 800 },
]

const codecOptions = [
  { value: 'h264', label: 'H.264' },
  { value: 'h265', label: 'H.265' },
]

function TaskItem({ task, onRetry }: { task: TranscodingTask; onRetry: (id: string) => void }) {
  const statusConfig = {
    pending: {
      icon: <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />,
      label: '排队中',
    },
    processing: { icon: <Play className='h-4 w-4 text-blue-500' />, label: '处理中' },
    completed: { icon: <CheckCircle2 className='h-4 w-4 text-green-500' />, label: '已完成' },
    failed: { icon: <AlertCircle className='h-4 w-4 text-destructive' />, label: '失败' },
  }[task.status]

  return (
    <div className='flex items-center gap-3 rounded-lg border p-3'>
      {statusConfig.icon}
      <div className='flex-1'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-medium'>
            {task.output.resolution} {task.output.codec.toUpperCase()}
          </span>
          <span className='text-xs text-muted-foreground'>
            {task.status === 'processing' ? `${task.progress}%` : statusConfig.label}
          </span>
        </div>
        {task.status === 'processing' && <Progress value={task.progress} className='mt-2 h-1' />}
        {task.status === 'failed' && task.error && (
          <p className='mt-1 text-xs text-destructive'>{task.error}</p>
        )}
      </div>
      {task.status === 'failed' && (
        <Button variant='outline' size='sm' onClick={() => onRetry(task.id)}>
          重试
        </Button>
      )}
    </div>
  )
}

export function TranscodingPanel({
  videoId,
  onCreateTask,
  onRetry,
  isCreating,
}: TranscodingPanelProps) {
  const [config, setConfig] = useState<
    Omit<TranscodingConfig, 'codec' | 'resolution'> & { resolution: string; codec: string }
  >({
    resolution: '1080p',
    codec: 'h264',
    bitrate: 5000,
    segmentDuration: 15,
  })

  const { data } = useTranscodingTasks()
  const tasks = data?.list.filter(t => t.videoId === videoId) ?? []

  const handleResolutionChange = (value: string) => {
    const option = resolutionOptions.find(o => o.value === value)
    setConfig(prev => ({
      ...prev,
      resolution: value,
      bitrate: option?.bitrate ?? prev.bitrate,
    }))
  }

  const handleCreate = () => {
    onCreateTask({
      resolution: config.resolution as TranscodingConfig['resolution'],
      codec: config.codec as TranscodingConfig['codec'],
      bitrate: config.bitrate,
      segmentDuration: config.segmentDuration,
    })
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <h3 className='font-medium'>新建转码任务</h3>
        <div className='grid grid-cols-4 gap-3'>
          <div className='space-y-2'>
            <label className='text-sm text-muted-foreground'>分辨率</label>
            <Select value={config.resolution} onValueChange={handleResolutionChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {resolutionOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <label className='text-sm text-muted-foreground'>码率 (kbps)</label>
            <Input
              type='number'
              value={config.bitrate}
              onChange={e => setConfig(prev => ({ ...prev, bitrate: Number(e.target.value) }))}
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm text-muted-foreground'>编码</label>
            <Select
              value={config.codec}
              onValueChange={v => setConfig(prev => ({ ...prev, codec: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {codecOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <label className='text-sm text-muted-foreground'>切片时长 (秒)</label>
            <Input
              type='number'
              value={config.segmentDuration}
              onChange={e =>
                setConfig(prev => ({ ...prev, segmentDuration: Number(e.target.value) }))
              }
            />
          </div>
        </div>
        <Button onClick={handleCreate} disabled={isCreating} className='w-full'>
          {isCreating && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          开始转码
        </Button>
      </div>

      {tasks.length > 0 && (
        <div className='space-y-3'>
          <h3 className='font-medium'>转码任务</h3>
          <div className='space-y-2'>
            {tasks.map(task => (
              <TaskItem key={task.id} task={task} onRetry={onRetry} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
