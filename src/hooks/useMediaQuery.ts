import { useEffect, useMemo, useState } from 'react'

type MediaQueryConfig = {
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  orientation?: 'portrait' | 'landscape'
  prefersColorScheme?: 'dark' | 'light'
  prefersReducedMotion?: boolean
  devicePixelRatio?: number
  pointerType?: 'coarse' | 'fine'
}

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

const buildMediaQuery = (config: MediaQueryConfig | string): string => {
  if (typeof config === 'string') return config

  const conditions: string[] = []

  if (config.minWidth) conditions.push(`(min-width: ${config.minWidth}px)`)
  if (config.maxWidth) conditions.push(`(max-width: ${config.maxWidth}px)`)
  if (config.minHeight) conditions.push(`(min-height: ${config.minHeight}px)`)
  if (config.maxHeight) conditions.push(`(max-height: ${config.maxHeight}px)`)
  if (config.orientation) conditions.push(`(orientation: ${config.orientation})`)
  if (config.prefersColorScheme)
    conditions.push(`(prefers-color-scheme: ${config.prefersColorScheme})`)
  if (config.prefersReducedMotion) conditions.push('(prefers-reduced-motion: reduce)')
  if (config.devicePixelRatio)
    conditions.push(`(-webkit-min-device-pixel-ratio: ${config.devicePixelRatio})`)
  if (config.pointerType) conditions.push(`(pointer: ${config.pointerType})`)

  return conditions.join(' and ')
}

export const useMediaQuery = (config: MediaQueryConfig | string) => {
  const [matches, setMatches] = useState(false)

  const mediaQueryString = useMemo(() => buildMediaQuery(config), [config])

  useEffect(() => {
    const mediaQuery = window.matchMedia(mediaQueryString)
    setMatches(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler)
    } else {
      mediaQuery.addListener(handler)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler)
      } else {
        mediaQuery.removeListener(handler)
      }
    }
  }, [mediaQueryString])

  return matches
}

type Breakpoints = typeof breakpoints
type BreakpointsKeys = keyof Breakpoints

export const up = (key: BreakpointsKeys) => ({
  minWidth: breakpoints[key],
})

export const down = (key: BreakpointsKeys) => ({
  maxWidth: breakpoints[key] - 0.05,
})

export const between = (start: BreakpointsKeys, end: BreakpointsKeys) => ({
  minWidth: breakpoints[start],
  maxWidth: breakpoints[end] - 0.05,
})
