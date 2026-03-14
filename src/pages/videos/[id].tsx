import { ArrowLeft, Save, Send } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useVideo } from '@/features/video/hooks'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'

const statusLabels = {
  draft: '草稿',
  published: '已发布',
  archived: '已归档',
}

const typeLabels = {
  movie: '电影',
  series: '电视剧',
  short: '短视频',
}

export default function VideoDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: video, isLoading } = useVideo(id!)

  if (isLoading) {
    return (
      <div className='flex flex-col gap-4'>
        <Skeleton className='h-8 w-48' />
        <div className='grid grid-cols-12 gap-6'>
          <Skeleton className='col-span-3 aspect-video' />
          <Skeleton className='col-span-9 h-96' />
        </div>
      </div>
    )
  }

  if (!video) {
    return <div className='text-muted-foreground'>影视不存在</div>
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' onClick={() => navigate('/videos')}>
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <h1 className='text-2xl font-bold'>{video.title}</h1>
          <Badge>{typeLabels[video.type]}</Badge>
        </div>
        <div className='flex gap-2'>
          <Button>
            <Save className='mr-1 h-4 w-4' />
            保存
          </Button>
          <Button variant='secondary'>
            <Send className='mr-1 h-4 w-4' />
            发布
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-12 gap-6'>
        <div className='col-span-3'>
          <Card>
            <CardContent className='pt-6'>
              <div className='aspect-video bg-muted rounded-lg overflow-hidden mb-4'>
                {video.cover ? (
                  <img src={video.cover} alt={video.title} className='w-full h-full object-cover' />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-muted-foreground'>
                    无封面
                  </div>
                )}
              </div>
              <Button variant='outline' className='w-full'>
                更换封面
              </Button>

              <div className='mt-4 space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>状态</span>
                  <span>{statusLabels[video.status]}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>创建时间</span>
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>更新时间</span>
                  <span>{new Date(video.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='col-span-9 space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>基础信息</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>基础信息编辑区域（待实现）</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>源视频上传</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>源视频上传区域（待实现）</p>
            </CardContent>
          </Card>

          {video.type === 'series' && (
            <Card>
              <CardHeader>
                <CardTitle>季集管理</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>季集管理区域（待实现）</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>转码任务</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>转码任务管理区域（待实现）</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
