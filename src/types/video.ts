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
  file: File
  md5?: string
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
