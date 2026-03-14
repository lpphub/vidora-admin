import { Film, Layers, Play } from 'lucide-react'
import type { Video, VideoType } from '@/features/video/types'
import { Badge } from '@/shared/components/ui/badge'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { VideoStatusBadge } from './VideoStatusBadge'

function formatDuration(seconds?: number): string {
  if (!seconds) return ''
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

const typeConfig: Record<VideoType, { label: string; icon: typeof Film }> = {
  movie: { label: '电影', icon: Film },
  series: { label: '电视剧', icon: Layers },
  short: { label: '短视频', icon: Play },
}

interface VideoCardProps {
  video: Video
  isSelected?: boolean
  onSelect?: (id: string) => void
  onClick?: () => void
}

export function VideoCard({ video, isSelected, onSelect, onClick }: VideoCardProps) {
  const typeInfo = typeConfig[video.type]
  const TypeIcon = typeInfo.icon

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-checkbox]')) return
    onClick?.()
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Card component with complex layout
    // biome-ignore lint/a11y/useKeyWithClickEvents: Visual card - keyboard handled by parent or link
    <div
      className={`group cursor-pointer overflow-hidden rounded-lg bg-card ring-1 transition-shadow hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : 'ring-foreground/10'
      }`}
      onClick={handleCardClick}
    >
      <div className='relative aspect-[3/4] overflow-hidden bg-muted'>
        {video.cover ? (
          <img alt={video.title} className='h-full w-full object-cover' src={video.cover} />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-muted'>
            <Film className='h-12 w-12 text-muted-foreground/50' />
          </div>
        )}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: Checkbox wrapper - prevents event bubbling */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: Click only for stopPropagation */}
        <div data-checkbox className='absolute left-2 top-2' onClick={e => e.stopPropagation()}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect?.(video.id)}
            className='bg-white/80 data-[state=checked]:bg-primary'
          />
        </div>
        {video.duration && (
          <Badge
            className='absolute right-2 bottom-2 bg-black/70 text-white hover:bg-black/70'
            variant='secondary'
          >
            {formatDuration(video.duration)}
          </Badge>
        )}
      </div>
      <div className='p-3'>
        <h3 className='line-clamp-2 text-sm font-medium leading-tight'>{video.title}</h3>
        <div className='mt-2 flex items-center gap-2 text-xs text-muted-foreground'>
          <span className='flex items-center gap-1'>
            <TypeIcon className='h-3 w-3' />
            {typeInfo.label}
          </span>
          <VideoStatusBadge status={video.status} />
        </div>
      </div>
    </div>
  )
}
