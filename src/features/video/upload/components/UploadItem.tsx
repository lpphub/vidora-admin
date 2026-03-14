import { AlertCircle, CheckCircle, Loader2, Pause, Play, RotateCcw, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Progress } from '@/shared/components/ui/progress'
import type { UploadFile } from '../../types'

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const size = bytes / k ** i
  return `${size.toFixed(i > 0 ? 2 : 0)} ${units[i]}`
}

function formatSpeed(bps: number): string {
  if (bps === 0) return '0 B/s'
  const units = ['B/s', 'KB/s', 'MB/s', 'GB/s']
  const k = 1024
  const i = Math.floor(Math.log(bps) / Math.log(k))
  const speed = bps / k ** i
  return `${speed.toFixed(2)} ${units[i]}`
}

function formatTime(seconds: number): string {
  if (seconds <= 0 || !Number.isFinite(seconds)) return '--'
  if (seconds < 60) return `${Math.round(seconds)}秒`
  if (seconds < 3600) {
    const min = Math.floor(seconds / 60)
    const sec = Math.round(seconds % 60)
    return sec > 0 ? `${min}分${sec}秒` : `${min}分`
  }
  const hours = Math.floor(seconds / 3600)
  const min = Math.floor((seconds % 3600) / 60)
  return min > 0 ? `${hours}小时${min}分` : `${hours}小时`
}

const statusConfig = {
  idle: { icon: Loader2, text: '等待中', color: 'text-muted-foreground', spin: false },
  hashing: { icon: Loader2, text: '计算MD5...', color: 'text-blue-500', spin: true },
  uploading: { icon: Loader2, text: '上传中', color: 'text-primary', spin: true },
  paused: { icon: Pause, text: '已暂停', color: 'text-yellow-500', spin: false },
  success: { icon: CheckCircle, text: '上传完成', color: 'text-green-500', spin: false },
  error: { icon: AlertCircle, text: '上传失败', color: 'text-destructive', spin: false },
}

interface UploadItemProps {
  file: UploadFile
  onPause: (id: string) => void
  onResume: (id: string) => void
  onRetry: (id: string) => void
  onRemove: (id: string) => void
}

export function UploadItem({ file, onPause, onResume, onRetry, onRemove }: UploadItemProps) {
  const config = statusConfig[file.status]
  const StatusIcon = config.icon
  const isUploading = file.status === 'uploading'
  const isHashing = file.status === 'hashing'
  const isPaused = file.status === 'paused'
  const isError = file.status === 'error'
  const isSuccess = file.status === 'success'

  return (
    <div className='flex items-start gap-4 rounded-lg border bg-card p-4'>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 mb-2'>
          <StatusIcon
            className={`h-4 w-4 shrink-0 ${config.color} ${config.spin ? 'animate-spin' : ''}`}
          />
          <span className='font-medium truncate flex-1 min-w-0'>
            {file.file?.name ?? file.fileName ?? '未知文件'}
          </span>
          <span className='text-sm text-muted-foreground shrink-0'>
            {formatSize(file.progress.loaded)} / {formatSize(file.progress.total)}
          </span>
        </div>

        <div className='mb-2'>
          <Progress value={file.progress.percent} className='h-2' />
        </div>

        <div className='flex items-center justify-between text-sm text-muted-foreground'>
          <span className={config.color}>{config.text}</span>
          <div className='flex items-center gap-4'>
            {isUploading && file.progress.speed !== undefined && (
              <span>{formatSpeed(file.progress.speed)}</span>
            )}
            {isUploading && file.progress.remaining !== undefined && (
              <span>剩余 {formatTime(file.progress.remaining)}</span>
            )}
            {isUploading && file.chunks && (
              <span>
                分片 {file.chunks.uploaded}/{file.chunks.total}
              </span>
            )}
            {!isUploading && !isHashing && <span>{file.progress.percent.toFixed(1)}%</span>}
          </div>
        </div>

        {isError && file.error && <p className='mt-2 text-sm text-destructive'>{file.error}</p>}

        {file.isInstantUpload && isSuccess && (
          <p className='mt-1 text-xs text-green-500'>秒传成功</p>
        )}
      </div>

      <div className='flex items-center gap-1 shrink-0'>
        {(isUploading || isHashing) && (
          <Button variant='ghost' size='icon-xs' onClick={() => onPause(file.id)} title='暂停'>
            <Pause className='h-3.5 w-3.5' />
          </Button>
        )}
        {isPaused && (
          <Button variant='ghost' size='icon-xs' onClick={() => onResume(file.id)} title='继续'>
            <Play className='h-3.5 w-3.5' />
          </Button>
        )}
        {isError && (
          <Button variant='ghost' size='icon-xs' onClick={() => onRetry(file.id)} title='重试'>
            <RotateCcw className='h-3.5 w-3.5' />
          </Button>
        )}
        {!isSuccess && !isUploading && !isHashing && (
          <Button variant='ghost' size='icon-xs' onClick={() => onRemove(file.id)} title='移除'>
            <Trash2 className='h-3.5 w-3.5' />
          </Button>
        )}
      </div>
    </div>
  )
}
