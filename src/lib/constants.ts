export const StorageKey = {
  Auth: 'vidora-auth',
  Theme: 'vidora-theme',
  Locale: 'vidora-locale-language',
  UploadState: 'video-upload-state',
} as const

export const ThemeMode = {
  Light: 'light',
  Dark: 'dark',
} as const

export const UploadConfig = {
  DEFAULT_CHUNK_SIZE: 5 * 1024 * 1024,
  DEFAULT_CHUNK_CONCURRENCY: 3,
  MAX_FILE_CONCURRENCY: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024 * 1024,
  NETWORK_RETRY_DELAY: 1000,
} as const
