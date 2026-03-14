import api from '@/lib/api'
import type { TranscodingListParams, TranscodingTask } from './types'

export const transcodingApi = {
  list: (params?: TranscodingListParams) =>
    api.get<TranscodingTask[]>('transcoding', params as Record<string, string>),

  cancel: (id: string) => api.post(`transcoding/${id}/cancel`),

  retry: (id: string) => api.post<TranscodingTask>(`transcoding/${id}/retry`),
}
