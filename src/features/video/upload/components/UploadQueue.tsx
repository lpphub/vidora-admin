import { Pause, Play, Trash2 } from 'lucide-react'
import { useCallback } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useUploadStore } from '@/shared/stores/upload'
import { UploadItem } from './UploadItem'

interface UploadQueueProps {
  cancelTask: (id: string) => void
}

export function UploadQueue({ cancelTask }: UploadQueueProps) {
  const files = useUploadStore(s => s.files)
  const isUploading = useUploadStore(s => s.isUploading)
  const clearCompleted = useUploadStore(s => s.clearCompleted)
  const removeFile = useUploadStore(s => s.removeFile)
  const updateFile = useUploadStore(s => s.updateFile)

  const handlePause = useCallback(
    (id: string) => {
      cancelTask(id)
      updateFile(id, { status: 'paused' })
    },
    [cancelTask, updateFile]
  )

  const handleResume = useCallback(
    (id: string) => {
      updateFile(id, { status: 'idle' })
    },
    [updateFile]
  )

  const handleRetry = useCallback(
    (id: string) => {
      updateFile(id, { status: 'idle', error: undefined })
    },
    [updateFile]
  )

  if (files.length === 0) {
    return null
  }

  const completedCount = files.filter(f => f.status === 'success' || f.status === 'error').length
  const hasCompletedFiles = completedCount > 0

  const handlePauseAll = () => {
    files.forEach(file => {
      if (file.status === 'uploading' || file.status === 'hashing') {
        cancelTask(file.id)
        updateFile(file.id, { status: 'paused' })
      }
    })
  }

  const handleResumeAll = () => {
    files.forEach(file => {
      if (file.status === 'paused') {
        updateFile(file.id, { status: 'idle' })
      }
    })
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-base font-medium'>上传队列 ({files.length} 个文件)</CardTitle>
        <div className='flex items-center gap-2'>
          {hasCompletedFiles && (
            <Button variant='outline' size='sm' onClick={clearCompleted}>
              <Trash2 className='h-3.5 w-3.5 mr-1' />
              清空已完成
            </Button>
          )}
          {isUploading ? (
            <Button variant='outline' size='sm' onClick={handlePauseAll}>
              <Pause className='h-3.5 w-3.5 mr-1' />
              全部暂停
            </Button>
          ) : (
            <Button variant='outline' size='sm' onClick={handleResumeAll}>
              <Play className='h-3.5 w-3.5 mr-1' />
              全部开始
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className='space-y-3 pt-4'>
        {files.map(file => (
          <UploadItem
            key={file.id}
            file={file}
            onPause={handlePause}
            onResume={handleResume}
            onRetry={handleRetry}
            onRemove={removeFile}
          />
        ))}
      </CardContent>
    </Card>
  )
}
