import api from '@/lib/api'
import type {
  CreateEpisodeDto,
  CreateSeasonDto,
  CreateVideoDto,
  Episode,
  Season,
  TranscodingTask,
  UpdateVideoDto,
  Video,
  VideoListParams,
  VideoListResponse,
} from './types'

export const videoApi = {
  list: (params?: VideoListParams) =>
    api.get<VideoListResponse>('videos', params as Record<string, string | number>),

  get: (id: string) => api.get<Video>(`videos/${id}`),

  create: (data: CreateVideoDto) => api.post<Video>('videos', data),

  update: (id: string, data: UpdateVideoDto) => api.put<Video>(`videos/${id}`, data),

  delete: (id: string) => api.delete(`videos/${id}`),

  createSeason: (videoId: string, data: CreateSeasonDto) =>
    api.post<Season>(`videos/${videoId}/seasons`, data),

  updateSeason: (videoId: string, seasonId: string, data: Partial<CreateSeasonDto>) =>
    api.put<Season>(`videos/${videoId}/seasons/${seasonId}`, data),

  deleteSeason: (videoId: string, seasonId: string) =>
    api.delete(`videos/${videoId}/seasons/${seasonId}`),

  createEpisode: (videoId: string, seasonId: string, data: CreateEpisodeDto) =>
    api.post<Episode>(`videos/${videoId}/seasons/${seasonId}/episodes`, data),

  updateEpisode: (
    videoId: string,
    seasonId: string,
    episodeId: string,
    data: Partial<CreateEpisodeDto>
  ) => api.put<Episode>(`videos/${videoId}/seasons/${seasonId}/episodes/${episodeId}`, data),

  deleteEpisode: (videoId: string, seasonId: string, episodeId: string) =>
    api.delete(`videos/${videoId}/seasons/${seasonId}/episodes/${episodeId}`),

  createTranscoding: (videoId: string, config: { type: string; output: Record<string, unknown> }) =>
    api.post<TranscodingTask>(`videos/${videoId}/transcoding`, config),
}
