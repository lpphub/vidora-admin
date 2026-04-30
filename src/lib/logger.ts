export function log(...args: unknown[]) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[LOG]', ...args)
  }
}

export function warn(...args: unknown[]) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[WARN]', ...args)
  }
}

export function error(...args: unknown[]) {
  console.error('[ERROR]', ...args)
}
