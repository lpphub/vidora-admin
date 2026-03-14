export type TranscodingType = 'transcode' | 'thumbnail' | 'subtitle'
export type TranscodingStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface TranscodingTask {
  id: string
  videoId: string
  videoTitle: string
  type: TranscodingType
  status: TranscodingStatus
  progress: number
  input: {
    file: string
    resolution: string
    codec: string
  }
  output: {
    resolution: string
    codec: string
    bitrate: number
  }
  startedAt?: string
  completedAt?: string
  error?: string
}

export interface TranscodingListParams {
  status?: TranscodingStatus
  type?: TranscodingType
}
