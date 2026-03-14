import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { transcodingApi } from '../api'
import type { TranscodingConfig, TranscodingTask } from '../types'

type TaskStatus = TranscodingTask['status']

interface TranscodingTaskListParams {
  status?: TaskStatus | 'all'
}

export const transcodingKeys = {
  all: ['transcoding'] as const,
  tasks: () => [...transcodingKeys.all, 'tasks'] as const,
  taskList: (params?: TranscodingTaskListParams) => [...transcodingKeys.tasks(), params] as const,
}

export function useTranscodingTasks(params?: TranscodingTaskListParams) {
  return useQuery({
    queryKey: transcodingKeys.taskList(params),
    queryFn: () => transcodingApi.list(params),
    refetchInterval: 5000,
    placeholderData: keepPreviousData,
  })
}

export function useCreateTranscoding() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ videoId, config }: { videoId: string; config: TranscodingConfig }) =>
      transcodingApi.create(videoId, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transcodingKeys.tasks() })
    },
  })
}

export function useRetryTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => transcodingApi.retry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transcodingKeys.tasks() })
    },
  })
}

export function useCancelTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => transcodingApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transcodingKeys.tasks() })
    },
  })
}
