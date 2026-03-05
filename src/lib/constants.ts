export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CONTENTS: '/contents',
  CONTENT_CREATE: '/contents/create',
  CONTENT_EDIT: '/contents/:id',
  VIDEOS: '/videos',
  VIDEO_UPLOAD: '/videos/upload',
  VIDEO_DETAIL: '/videos/:id',
  TRANSCODE: '/transcode',
  CATEGORIES: '/categories',
  USERS: '/users',
  USER_CREATE: '/users/create',
  USER_EDIT: '/users/:id',
  SETTINGS: '/settings',
  LOGIN: '/login',
} as const

export const RESOLUTION_OPTIONS = [
  { value: '1080p', label: '1080p (Full HD)' },
  { value: '720p', label: '720p (HD)' },
  { value: '480p', label: '480p (SD)' },
  { value: '360p', label: '360p' },
] as const

export const STATUS_LABELS = {
  draft: '草稿',
  pending: '待审核',
  published: '已发布',
  archived: '已归档',
} as const

export const VIDEO_STATUS_LABELS = {
  uploading: '上传中',
  ready: '就绪',
  processing: '处理中',
  error: '错误',
} as const

export const TRANSCODE_STATUS_LABELS = {
  pending: '等待中',
  processing: '处理中',
  completed: '已完成',
  failed: '失败',
} as const
