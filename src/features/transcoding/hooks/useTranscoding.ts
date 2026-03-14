import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { transcodingApi } from '../api'
import type { TranscodingListParams } from '../types'

export function useTranscodingTasks(params?: TranscodingListParams) {
  return useQuery({
    queryKey: ['transcoding', params],
    queryFn: () => transcodingApi.list(params),
    refetchInterval: 5000,
  })
}

export function useCancelTranscoding() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => transcodingApi.cancel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transcoding'] }),
  })
}

export function useRetryTranscoding() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => transcodingApi.retry(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transcoding'] }),
  })
}
