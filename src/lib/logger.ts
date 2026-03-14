export function log(...args: unknown[]) {
  if (import.meta.env.DEV) {
    console.log('[LOG]', ...args)
  }
}

export function warn(...args: unknown[]) {
  if (import.meta.env.DEV) {
    console.warn('[WARN]', ...args)
  }
}

export function error(...args: unknown[]) {
  console.error('[ERROR]', ...args)
}
