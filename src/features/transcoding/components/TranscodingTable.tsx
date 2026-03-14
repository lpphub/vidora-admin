import { CheckCircle, Clock, Loader2, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Progress } from '@/shared/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import type { TranscodingTask } from '../types'

interface TranscodingTableProps {
  tasks: TranscodingTask[]
  onCancel: (id: string) => void
  onRetry: (id: string) => void
}

const statusConfig = {
  pending: { icon: Clock, color: 'secondary' as const, label: '等待中' },
  processing: { icon: Loader2, color: 'default' as const, label: '进行中' },
  completed: { icon: CheckCircle, color: 'secondary' as const, label: '已完成' },
  failed: { icon: XCircle, color: 'destructive' as const, label: '失败' },
} as const

const typeLabels = {
  transcode: '转码',
  thumbnail: '缩略图',
  subtitle: '字幕',
}

export function TranscodingTable({ tasks, onCancel, onRetry }: TranscodingTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>影视名称</TableHead>
          <TableHead>任务类型</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>进度</TableHead>
          <TableHead>创建时间</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map(task => {
          const config = statusConfig[task.status]
          const StatusIcon = config.icon

          return (
            <TableRow key={task.id}>
              <TableCell>
                <Link to={`/videos/${task.videoId}`} className='hover:underline'>
                  {task.videoTitle}
                </Link>
              </TableCell>
              <TableCell>{typeLabels[task.type]}</TableCell>
              <TableCell>
                <Badge variant={config.color}>
                  <StatusIcon
                    className={`mr-1 h-3 w-3 ${task.status === 'processing' ? 'animate-spin' : ''}`}
                  />
                  {config.label}
                </Badge>
              </TableCell>
              <TableCell>
                {task.status === 'processing' ? (
                  <div className='flex items-center gap-2'>
                    <Progress value={task.progress} className='w-24' />
                    <span className='text-sm text-muted-foreground'>{task.progress}%</span>
                  </div>
                ) : task.status === 'completed' ? (
                  <span className='text-green-600'>100%</span>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {task.startedAt ? new Date(task.startedAt).toLocaleString() : '-'}
              </TableCell>
              <TableCell>
                {task.status === 'processing' && (
                  <Button size='sm' variant='ghost' onClick={() => onCancel(task.id)}>
                    取消
                  </Button>
                )}
                {(task.status === 'failed' || task.status === 'completed') && (
                  <Button size='sm' variant='ghost' onClick={() => onRetry(task.id)}>
                    重试
                  </Button>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
