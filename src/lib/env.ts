export const env = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || '',
  APP_TITLE: process.env.NEXT_PUBLIC_APP_TITLE || '',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
  MODE: process.env.NODE_ENV ?? 'development',
} as const

export const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8080'
