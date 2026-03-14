import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { VideoCard } from '@/features/video/components/VideoCard'
import { useVideos } from '@/features/video/hooks'
import type { VideoStatus, VideoType } from '@/features/video/types'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

export default function Videos() {
  const { t } = useTranslation('videos')
  const [keyword, setKeyword] = useState('')
  const [type, setType] = useState<VideoType | undefined>()
  const [status, setStatus] = useState<VideoStatus | undefined>()

  const { data, isLoading } = useVideos({ keyword, type, status })

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>{t('title')}</h1>
        <Button>
          <Plus className='mr-1 h-4 w-4' />
          {t('actions.create')}
        </Button>
      </div>

      <div className='flex items-center gap-2'>
        <Input
          placeholder={t('search')}
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          className='w-64'
        />

        <Select
          value={type || 'all'}
          onValueChange={v => setType(v === 'all' ? undefined : (v as VideoType))}
        >
          <SelectTrigger className='w-32'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>{t('type.all')}</SelectItem>
            <SelectItem value='movie'>{t('type.movie')}</SelectItem>
            <SelectItem value='series'>{t('type.series')}</SelectItem>
            <SelectItem value='short'>{t('type.short')}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={status || 'all'}
          onValueChange={v => setStatus(v === 'all' ? undefined : (v as VideoStatus))}
        >
          <SelectTrigger className='w-32'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>{t('status.all')}</SelectItem>
            <SelectItem value='draft'>{t('status.draft')}</SelectItem>
            <SelectItem value='published'>{t('status.published')}</SelectItem>
            <SelectItem value='archived'>{t('status.archived')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className='aspect-video animate-pulse rounded-lg bg-muted' />
          ))}
        </div>
      ) : data?.items?.length ? (
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
          {data.items.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className='flex h-64 items-center justify-center text-muted-foreground'>
          {t('empty')}
        </div>
      )}
    </div>
  )
}
