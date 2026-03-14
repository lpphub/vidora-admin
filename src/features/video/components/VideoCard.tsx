import { CheckCircle, Film, Sparkles, Tv, Upload } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent } from '@/shared/components/ui/card'
import type { Video } from '../types'

interface VideoCardProps {
  video: Video
}

const typeIcons = {
  movie: Film,
  series: Tv,
  short: Sparkles,
}

const typeLabels = {
  movie: '电影',
  series: '电视剧',
  short: '短视频',
}

const statusColors = {
  draft: 'secondary',
  published: 'default',
  archived: 'outline',
} as const

const statusLabels = {
  draft: '草稿',
  published: '已发布',
  archived: '已归档',
}

export function VideoCard({ video }: VideoCardProps) {
  const TypeIcon = typeIcons[video.type] || Film

  const hasSource = !!video.fileSize

  return (
    <Link to={`/videos/${video.id}`}>
      <Card className='group overflow-hidden transition-shadow hover:shadow-lg'>
        <div className='relative aspect-video bg-muted'>
          {video.cover ? (
            <img src={video.cover} alt={video.title} className='h-full w-full object-cover' />
          ) : (
            <div className='flex h-full items-center justify-center'>
              <TypeIcon className='h-12 w-12 text-muted-foreground' />
            </div>
          )}

          <div className='absolute right-2 top-2 flex gap-1'>
            <Badge variant='secondary' className='gap-1'>
              <TypeIcon className='h-3 w-3' />
              {typeLabels[video.type]}
            </Badge>
          </div>

          <div className='absolute bottom-2 left-2 flex gap-1'>
            <Badge variant={statusColors[video.status]}>{statusLabels[video.status]}</Badge>
          </div>
        </div>

        <CardContent className='p-3'>
          <h3 className='truncate font-medium'>{video.title}</h3>

          <div className='mt-2 flex items-center gap-2 text-xs text-muted-foreground'>
            {video.type !== 'movie' && video.seasons && (
              <span>
                {video.seasons.length}季
                {video.seasons.reduce((acc, s) => acc + s.episodes.length, 0)}集
              </span>
            )}
          </div>

          <div className='mt-2 flex items-center gap-2 text-xs'>
            <span
              className={`flex items-center gap-1 ${hasSource ? 'text-green-600' : 'text-muted-foreground'}`}
            >
              {hasSource ? <CheckCircle className='h-3 w-3' /> : <Upload className='h-3 w-3' />}
              {hasSource ? '已上传' : '未上传'}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
