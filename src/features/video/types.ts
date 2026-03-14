export type VideoType = 'movie' | 'series' | 'short'
export type VideoStatus = 'draft' | 'published' | 'archived'

export interface Video {
  id: string
  title: string
  description?: string
  cover?: string
  type: VideoType
  tags: string[]
  categoryId?: string
  status: VideoStatus
  duration?: number
  resolution?: string
  codec?: string
  bitrate?: number
  fileSize?: number
  createdAt: string
  updatedAt: string
  seasons?: Season[]
}

export interface Season {
  id: string
  videoId: string
  seasonNumber: number
  title?: string
  episodes: Episode[]
}

export interface Episode {
  id: string
  seasonId: string
  episodeNumber: number
  title?: string
  duration?: number
  videoFile?: string
  status: VideoStatus
}

export interface TranscodingTask {
  id: string
  videoId: string
  videoTitle: string
  type: 'transcode' | 'thumbnail' | 'subtitle'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  input: { file: string; resolution: string; codec: string }
  output: { resolution: string; codec: string; bitrate: number }
  startedAt?: string
  completedAt?: string
  error?: string
}

export interface UploadFile {
  id: string
  file: File | null
  fileName?: string
  md5?: string
  uploadId?: string
  uploadedChunks?: number[]
  progress: {
    loaded: number
    total: number
    percent: number
    speed?: number
    remaining?: number
  }
  status: 'idle' | 'hashing' | 'uploading' | 'paused' | 'success' | 'error'
  error?: string
  isInstantUpload?: boolean
  chunks?: {
    total: number
    uploaded: number
  }
}

export type VideoSortField = 'createdAt' | 'updatedAt' | 'title'
export type SortOrder = 'asc' | 'desc'

export interface VideoListParams {
  page?: number
  pageSize?: number
  type?: VideoType | 'all'
  status?: VideoStatus | 'all'
  categoryId?: string
  keyword?: string
  sortBy?: VideoSortField
  sortOrder?: SortOrder
}

export interface TranscodingConfig {
  resolution: '1080p' | '720p' | '480p' | '360p'
  codec: 'h264' | 'h265'
  bitrate: number
  segmentDuration: number
}

export interface BatchOperationResult {
  success: number
  failed: number
  errors?: Array<{ id: string; error: string }>
}
