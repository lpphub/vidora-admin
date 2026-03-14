import api from '@/lib/api'
import type {
  TranscodingConfig,
  TranscodingTask,
  Video,
  VideoListParams,
  VideoStatus,
} from './types'

interface VideoListResponse {
  list: Video[]
  total: number
  page: number
  pageSize: number
}

interface TranscodingTaskListParams {
  status?: string
}

interface TranscodingTaskListResponse {
  list: TranscodingTask[]
  total: number
  page: number
  pageSize: number
  stats: {
    total: number
    pending: number
    processing: number
    completed: number
    failed: number
  }
}

export const videoApi = {
  list: (params?: VideoListParams) => {
    const searchParams: Record<string, string | number> = {}
    if (params?.page) searchParams.page = params.page
    if (params?.pageSize) searchParams.pageSize = params.pageSize
    if (params?.type && params.type !== 'all') searchParams.type = params.type
    if (params?.status && params.status !== 'all') searchParams.status = params.status
    if (params?.keyword) searchParams.keyword = params.keyword
    if (params?.sortBy) searchParams.sortBy = params.sortBy
    if (params?.sortOrder) searchParams.sortOrder = params.sortOrder
    return api.get<VideoListResponse>('videos', searchParams)
  },

  get: (id: string) => api.get<Video>(`videos/${id}`),

  create: (data: Partial<Video>) => api.post<Video>('videos', data),

  update: (id: string, data: Partial<Video>) => api.put<Video>(`videos/${id}`, data),

  delete: (id: string) => api.delete(`videos/${id}`),

  batchDelete: (ids: string[]) => api.post<{ success: boolean }>('videos/batch/delete', { ids }),

  batchUpdateStatus: (ids: string[], status: VideoStatus) =>
    api.patch<{ success: boolean }>('videos/batch/status', { ids, status }),

  batchUpdateCategory: (ids: string[], categoryId: string) =>
    api.patch<{ success: boolean }>('videos/batch/category', { ids, categoryId }),
}

export const transcodingApi = {
  list: (params?: TranscodingTaskListParams) => {
    const searchParams: Record<string, string> = {}
    if (params?.status && params.status !== 'all') {
      searchParams.status = params.status
    }
    return api.get<TranscodingTaskListResponse>('transcoding/tasks', searchParams)
  },

  create: (videoId: string, config: TranscodingConfig) =>
    api.post<TranscodingTask>('transcoding/tasks', { videoId, ...config }),

  getByVideo: (videoId: string) =>
    api.get<{ list: TranscodingTask[] }>('transcoding/tasks', { videoId }),

  retry: (id: string) => api.post<TranscodingTask>(`transcoding/tasks/${id}/retry`),

  cancel: (id: string) => api.post<TranscodingTask>(`transcoding/tasks/${id}/cancel`),
}

export type { VideoListResponse, TranscodingTaskListParams, TranscodingTaskListResponse }
