import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const locales = ['zh', 'en'] as const
const defaultLocale = 'zh'

const protectedPaths = ['/dashboard', '/profile', '/tags', '/system']
const authPaths = ['/login']

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get('locale')?.value
  if (cookieLocale && locales.includes(cookieLocale as (typeof locales)[number])) {
    return cookieLocale
  }
  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const locale = getLocale(request)
  const accessToken = request.cookies.get('accessToken')?.value

  // Strip locale prefix if present (e.g. /zh/dashboard → /dashboard)
  let cleanPath = pathname
  for (const l of locales) {
    if (pathname.startsWith(`/${l}/`)) {
      cleanPath = pathname.slice(`/${l}`.length)
      break
    }
    if (pathname === `/${l}`) {
      cleanPath = '/'
      break
    }
  }

  // Root path: redirect directly based on auth, skip extra hops
  if (cleanPath === '/') {
    return NextResponse.redirect(new URL(accessToken ? '/dashboard' : '/login', request.url))
  }

  // Auth checks on clean path
  const isProtected = protectedPaths.some(p => cleanPath.startsWith(p))
  const isAuthPage = authPaths.some(p => cleanPath.startsWith(p))

  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If path already has locale prefix, pass through
  if (cleanPath !== pathname) {
    return NextResponse.next()
  }

  // Rewrite clean path to add locale: /dashboard → /zh/dashboard
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.rewrite(request.nextUrl)
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
}
