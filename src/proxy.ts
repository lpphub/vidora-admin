import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

const protectedPaths = ['/dashboard', '/profile', '/tags', '/system']
const authPaths = ['/login']

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip i18n middleware for /api routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Handle next-intl locale detection + redirect
  const response = intlMiddleware(request)
  if (response.redirected) return response

  // Check authentication from httpOnly cookie
  const accessToken = request.cookies.get('accessToken')?.value
  const isProtected = protectedPaths.some(p => pathname.includes(p))
  const isAuthPage = authPaths.some(p => pathname.includes(p))

  if (isProtected && !accessToken) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthPage && accessToken) {
    const dashUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!_next|_vercel|.*\\..*).*)',
}
