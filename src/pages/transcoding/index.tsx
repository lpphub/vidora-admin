import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useCancelTranscoding,
  useRetryTranscoding,
  useTranscodingTasks,
} from '@/features/transcoding'
import { TranscodingTable } from '@/features/transcoding/components/TranscodingTable'
import type { TranscodingStatus, TranscodingType } from '@/features/transcoding/types'
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

export default function Transcoding() {
  const { t } = useTranslation('transcoding')
  const [status, setStatus] = useState<TranscodingStatus | undefined>()
  const [type, setType] = useState<TranscodingType | undefined>()

  const { data: tasks = [], isLoading } = useTranscodingTasks({ status, type })
  const cancelMutation = useCancelTranscoding()
  const retryMutation = useRetryTranscoding()

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>{t('title')}</h1>

      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Select
              value={status || 'all'}
              onValueChange={v => setStatus(v === 'all' ? undefined : (v as TranscodingStatus))}
            >
              <SelectTrigger className='w-32'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{t('status.all')}</SelectItem>
                <SelectItem value='pending'>{t('status.pending')}</SelectItem>
                <SelectItem value='processing'>{t('status.processing')}</SelectItem>
                <SelectItem value='completed'>{t('status.completed')}</SelectItem>
                <SelectItem value='failed'>{t('status.failed')}</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={type || 'all'}
              onValueChange={v => setType(v === 'all' ? undefined : (v as TranscodingType))}
            >
              <SelectTrigger className='w-32'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{t('type.all')}</SelectItem>
                <SelectItem value='transcode'>{t('type.transcode')}</SelectItem>
                <SelectItem value='thumbnail'>{t('type.thumbnail')}</SelectItem>
                <SelectItem value='subtitle'>{t('type.subtitle')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='text-center py-8 text-muted-foreground'>加载中...</div>
          ) : tasks.length > 0 ? (
            <TranscodingTable
              tasks={tasks}
              onCancel={id => cancelMutation.mutate(id)}
              onRetry={id => retryMutation.mutate(id)}
            />
          ) : (
            <div className='text-center py-8 text-muted-foreground'>{t('empty')}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
