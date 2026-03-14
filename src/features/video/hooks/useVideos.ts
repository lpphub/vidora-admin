import { useQuery } from '@tanstack/react-query'
import { videoApi } from '../api'
import type { VideoListParams } from '../types'

export function useVideos(params?: VideoListParams) {
  return useQuery({
    queryKey: ['videos', params],
    queryFn: () => videoApi.list(params),
  })
}
