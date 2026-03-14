import type { VideoStatus } from '@/features/video/types'
import { Badge } from '@/shared/components/ui/badge'

const statusConfig: Record<
  VideoStatus,
  { label: string; variant: 'secondary' | 'default' | 'outline' }
> = {
  draft: { label: '草稿', variant: 'secondary' },
  published: { label: '已发布', variant: 'default' },
  archived: { label: '已归档', variant: 'outline' },
}

interface VideoStatusBadgeProps {
  status: VideoStatus
}

export function VideoStatusBadge({ status }: VideoStatusBadgeProps) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
