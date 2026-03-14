import { Clock, Film, Play, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useUpdateVideo } from '@/features/video/hooks'
import type { Video } from '@/features/video/types'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { InlineEditField } from './components/InlineEditField'
import { StatCard } from './components/StatCard'

const typeLabels: Record<string, string> = {
  movie: '电影',
  series: '电视剧',
  short: '短视频',
}

const statusOptions = [
  { label: '草稿', value: 'draft' },
  { label: '已发布', value: 'published' },
  { label: '已归档', value: 'archived' },
]

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'secondary',
  published: 'default',
  archived: 'outline',
}

interface OverviewTabProps {
  video: Video
}

export function OverviewTab({ video }: OverviewTabProps) {
  const updateVideo = useUpdateVideo()
  const [coverUrl, setCoverUrl] = useState(video.cover || '')

  const handleUpdate = async (field: keyof Video, value: string) => {
    updateVideo.mutate(
      { id: video.id, data: { [field]: value } },
      {
        onSuccess: () => toast.success('更新成功'),
        onError: () => toast.error('更新失败'),
      }
    )
  }

  const handleCoverChange = () => {
    const url = prompt('请输入封面图片URL:', coverUrl)
    if (url !== null) {
      setCoverUrl(url)
      handleUpdate('cover', url)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-4 gap-4'>
        <StatCard icon={Film} label='上传状态' value='已完成' color='#10b981' />
        <StatCard icon={Clock} label='转码状态' value='已完成' color='#10b981' />
        <StatCard icon={Play} label='播放量' value='1,234' subValue='较昨日 +12%' color='#3b82f6' />
        <StatCard icon={TrendingUp} label='完播率' value='78%' color='#8b5cf6' />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基础信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex gap-6'>
            <div className='shrink-0'>
              <div className='aspect-video w-[200px] overflow-hidden rounded-lg bg-muted'>
                {coverUrl ? (
                  <img src={coverUrl} alt={video.title} className='h-full w-full object-cover' />
                ) : (
                  <div className='flex h-full w-full items-center justify-center text-muted-foreground text-xs'>
                    无封面
                  </div>
                )}
              </div>
              <Button
                variant='outline'
                size='sm'
                className='mt-2 w-full'
                onClick={handleCoverChange}
              >
                更换封面
              </Button>
            </div>

            <div className='flex-1 space-y-4'>
              <div className='group'>
                <InlineEditField
                  label='标题'
                  value={video.title}
                  onSave={value => handleUpdate('title', value)}
                  placeholder='请输入标题'
                />
              </div>

              <div className='flex items-start gap-2'>
                <span className='text-muted-foreground min-w-24 shrink-0 text-xs'>类型</span>
                <Badge variant='secondary'>{typeLabels[video.type] || video.type}</Badge>
              </div>

              <div className='group'>
                <InlineEditField
                  label='分类'
                  value={video.categoryId || ''}
                  onSave={value => handleUpdate('categoryId', value)}
                  placeholder='请输入分类'
                />
              </div>

              <div className='group'>
                <InlineEditField
                  label='状态'
                  value={video.status}
                  type='select'
                  options={statusOptions}
                  onSave={value => handleUpdate('status', value)}
                  badgeVariant={statusVariants[video.status]}
                />
              </div>

              <div className='group'>
                <InlineEditField
                  label='简介'
                  value={video.description || ''}
                  type='textarea'
                  onSave={value => handleUpdate('description', value)}
                  placeholder='请输入简介'
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
