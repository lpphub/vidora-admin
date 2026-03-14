import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { videoApi } from '../api'
import type { Video, VideoListParams, VideoStatus } from '../types'

export const videoKeys = {
  all: ['videos'] as const,
  lists: () => [...videoKeys.all, 'list'] as const,
  list: (params?: VideoListParams) => [...videoKeys.lists(), params] as const,
  details: () => [...videoKeys.all, 'detail'] as const,
  detail: (id: string) => [...videoKeys.details(), id] as const,
}

export function useVideos(params?: VideoListParams) {
  return useQuery({
    queryKey: videoKeys.list(params),
    queryFn: () => videoApi.list(params),
    placeholderData: keepPreviousData,
  })
}

export function useVideo(id: string) {
  return useQuery({
    queryKey: videoKeys.detail(id),
    queryFn: () => videoApi.get(id),
    enabled: !!id,
  })
}

export function useCreateVideo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Video>) => videoApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() })
    },
  })
}

export function useUpdateVideo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Video> }) => videoApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() })
    },
  })
}

export function useDeleteVideo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => videoApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() })
    },
  })
}

export function useBatchDeleteVideo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => videoApi.batchDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() })
    },
  })
}

export function useBatchUpdateStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: VideoStatus }) =>
      videoApi.batchUpdateStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() })
    },
  })
}

export function useBatchUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, categoryId }: { ids: string[]; categoryId: string }) =>
      videoApi.batchUpdateCategory(ids, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() })
    },
  })
}
