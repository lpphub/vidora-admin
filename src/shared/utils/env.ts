export const env = {
  APP_NAME: import.meta.env.VITE_APP_NAME || '',
  APP_TITLE: import.meta.env.VITE_APP_TITLE || '',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  ENABLE_PROXY: import.meta.env.VITE_ENABLE_PROXY === 'true',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE,
} as const
