import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useCreateTranscoding, useRetryTask } from '@/features/video/hooks/useTranscodingTasks'
import {
  useBatchDeleteVideo,
  useBatchUpdateCategory,
  useBatchUpdateStatus,
  useDeleteVideo,
  useUpdateVideo,
  useVideos,
} from '@/features/video/hooks/useVideo'
import { useVideoSelection } from '@/features/video/hooks/useVideoSelection'
import { BatchActionsBar } from '@/features/video/library/components/BatchActionsBar'
import { VideoCard } from '@/features/video/library/components/VideoCard'
import { VideoDetailSheet } from '@/features/video/library/components/VideoDetailSheet'
import { VideoToolbar } from '@/features/video/library/components/VideoToolbar'
import type { TranscodingConfig, Video, VideoListParams, VideoStatus } from '@/features/video/types'
import { Skeleton } from '@/shared/components/ui/skeleton'

function VideoCardSkeleton() {
  return (
    <div className='overflow-hidden rounded-lg bg-card ring-1 ring-foreground/10'>
      <Skeleton className='aspect-3/4' />
      <div className='space-y-2 p-3'>
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-3 w-1/2' />
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className='flex flex-col items-center justify-center py-20 text-muted-foreground'>
      <p className='text-lg'>暂无视频</p>
      <p className='mt-1 text-sm'>点击上传按钮添加视频</p>
    </div>
  )
}

export default function VideoLibrary() {
  const [searchParams] = useSearchParams()
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const params: VideoListParams = {
    page: Number(searchParams.get('page')) || 1,
    pageSize: 24,
    keyword: searchParams.get('keyword') ?? undefined,
    type: (searchParams.get('type') as VideoListParams['type']) ?? undefined,
    status: (searchParams.get('status') as VideoListParams['status']) ?? undefined,
    sortBy: (searchParams.get('sort')?.split('-')[0] as VideoListParams['sortBy']) ?? 'createdAt',
    sortOrder: (searchParams.get('sort')?.split('-')[1] as VideoListParams['sortOrder']) ?? 'desc',
  }

  const { data, isLoading } = useVideos(params)
  const updateMutation = useUpdateVideo()
  const deleteMutation = useDeleteVideo()
  const batchDeleteMutation = useBatchDeleteVideo()
  const batchStatusMutation = useBatchUpdateStatus()
  const batchCategoryMutation = useBatchUpdateCategory()
  const createTranscodingMutation = useCreateTranscoding()
  const retryMutation = useRetryTask()

  const selection = useVideoSelection()
  const videos = data?.list ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / params.pageSize!)

  const handleFilterChange = () => {
    selection.clearAll()
  }

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video)
    setSheetOpen(true)
  }

  const handleUpdate = (id: string, data: Partial<Video>) => {
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          toast.success('更新成功')
          setSheetOpen(false)
        },
        onError: () => toast.error('更新失败'),
      }
    )
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('删除成功')
      },
      onError: () => toast.error('删除失败'),
    })
  }

  const handleBatchDelete = () => {
    batchDeleteMutation.mutate(selection.selectedIdsArray, {
      onSuccess: () => {
        toast.success(`成功删除 ${selection.selectedCount} 个视频`)
        selection.clearAll()
      },
      onError: () => toast.error('批量删除失败'),
    })
  }

  const handleBatchStatus = (status: VideoStatus) => {
    batchStatusMutation.mutate(
      { ids: selection.selectedIdsArray, status },
      {
        onSuccess: () => {
          toast.success('状态更新成功')
          selection.clearAll()
        },
        onError: () => toast.error('状态更新失败'),
      }
    )
  }

  const handleBatchCategory = (categoryId: string) => {
    batchCategoryMutation.mutate(
      { ids: selection.selectedIdsArray, categoryId },
      {
        onSuccess: () => {
          toast.success('分类更新成功')
          selection.clearAll()
        },
        onError: () => toast.error('分类更新失败'),
      }
    )
  }

  const handleCreateTranscoding = (videoId: string, config: TranscodingConfig) => {
    createTranscodingMutation.mutate(
      { videoId, config },
      {
        onSuccess: () => toast.success('转码任务已创建'),
        onError: () => toast.error('创建转码任务失败'),
      }
    )
  }

  const handleRetryTranscoding = (taskId: string) => {
    retryMutation.mutate(taskId, {
      onSuccess: () => toast.success('重试任务已提交'),
      onError: () => toast.error('重试失败'),
    })
  }

  return (
    <div className='space-y-6'>
      <VideoToolbar onFilterChange={handleFilterChange} />

      <BatchActionsBar
        selectedCount={selection.selectedCount}
        onDelete={handleBatchDelete}
        onUpdateStatus={handleBatchStatus}
        onUpdateCategory={handleBatchCategory}
        onClear={selection.clearAll}
        isDeleting={batchDeleteMutation.isPending}
      />

      {isLoading ? (
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
          {Array.from({ length: 12 }, (_, i) => `skeleton-${i}`).map(key => (
            <VideoCardSkeleton key={key} />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <EmptyState />
      ) : (
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
          {videos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              isSelected={selection.isSelected(video.id)}
              onSelect={selection.toggle}
              onClick={() => handleVideoClick(video)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className='flex justify-center'>
          <p className='text-sm text-muted-foreground'>
            共 {total} 条记录，第 {params.page} / {totalPages} 页
          </p>
        </div>
      )}

      <VideoDetailSheet
        video={selectedVideo}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onCreateTranscoding={handleCreateTranscoding}
        onRetryTranscoding={handleRetryTranscoding}
        isUpdating={updateMutation.isPending}
        isDeleting={deleteMutation.isPending}
        isCreatingTranscoding={createTranscodingMutation.isPending}
      />
    </div>
  )
}
