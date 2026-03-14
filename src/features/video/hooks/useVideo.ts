import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { videoApi } from '../api'
import type { CreateEpisodeDto, CreateSeasonDto, CreateVideoDto, UpdateVideoDto } from '../types'

export function useVideo(id: string) {
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => videoApi.get(id),
    enabled: !!id,
  })
}

export function useCreateVideo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateVideoDto) => videoApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['videos'] }),
  })
}

export function useUpdateVideo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVideoDto }) => videoApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['video', id] })
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
  })
}

export function useDeleteVideo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => videoApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['videos'] }),
  })
}

export function useCreateSeason() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ videoId, data }: { videoId: string; data: CreateSeasonDto }) =>
      videoApi.createSeason(videoId, data),
    onSuccess: (_, { videoId }) => queryClient.invalidateQueries({ queryKey: ['video', videoId] }),
  })
}

export function useCreateEpisode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      videoId,
      seasonId,
      data,
    }: {
      videoId: string
      seasonId: string
      data: CreateEpisodeDto
    }) => videoApi.createEpisode(videoId, seasonId, data),
    onSuccess: (_, { videoId }) => queryClient.invalidateQueries({ queryKey: ['video', videoId] }),
  })
}
