import api from '@/lib/api'
import type { Tag, TagType } from './types'

export const tagApi = {
  list: (params?: { type?: TagType }) =>
    api.get<Tag[]>('tags', params?.type !== undefined ? { type: params.type } : undefined),

  get: (id: string) => api.get<Tag>(`tags/${id}`),

  create: (data: Partial<Tag>) => api.post<Tag>('tags', data),

  update: (id: string, data: Partial<Tag>) => api.put<Tag>(`tags/${id}`, data),

  delete: (id: string) => api.delete(`tags/${id}`),
}
