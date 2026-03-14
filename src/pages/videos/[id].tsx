import { ArrowLeft, Film, Save, Send, Upload } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useUpdateVideo, useVideo } from '@/features/video/hooks'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { OverviewTab } from './[id]/OverviewTab'
import { TranscodingTab } from './[id]/TranscodingTab'
import { UploadTab } from './[id]/UploadTab'

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
  const updateVideo = useUpdateVideo()
  const [activeTab, setActiveTab] = useState('overview')

  if (isLoading) {
    return (
      <div className='flex flex-col gap-4'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-96 w-full' />
      </div>
    )
  }

  if (!video) {
    return <div className='text-muted-foreground'>影视不存在</div>
  }

  const handlePublish = () => {
    const newStatus = video.status === 'published' ? 'draft' : 'published'
    updateVideo.mutate(
      { id: id!, data: { status: newStatus } },
      {
        onSuccess: () => toast.success(newStatus === 'published' ? '发布成功' : '已下架'),
        onError: () => toast.error('操作失败'),
      }
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' onClick={() => navigate('/videos')}>
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <h1 className='text-2xl font-bold'>{video.title}</h1>
          <Badge variant='secondary'>{typeLabels[video.type]}</Badge>
          <Badge>{statusLabels[video.status]}</Badge>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline'>
            <Save className='mr-1 h-4 w-4' />
            保存
          </Button>
          <Button onClick={handlePublish}>
            <Send className='mr-1 h-4 w-4' />
            {video.status === 'published' ? '下架' : '发布'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant='line'>
          <TabsTrigger value='overview'>
            <Film className='mr-1.5 h-4 w-4' />
            概览
          </TabsTrigger>
          <TabsTrigger value='upload'>
            <Upload className='mr-1.5 h-4 w-4' />
            视频上传
          </TabsTrigger>
          <TabsTrigger value='transcoding'>
            <Film className='mr-1.5 h-4 w-4' />
            转码任务
          </TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='mt-6'>
          <OverviewTab video={video} />
        </TabsContent>

        <TabsContent value='upload' className='mt-6'>
          <UploadTab />
        </TabsContent>

        <TabsContent value='transcoding' className='mt-6'>
          <TranscodingTab videoId={id!} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
