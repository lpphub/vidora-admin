import type { NextRequest } from 'next/server'

export function getAccessToken(request: NextRequest): string | undefined {
  return request.cookies.get('accessToken')?.value || undefined
}

export function authHeaders(token?: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export function unauthorizedResponse() {
  return Response.json({ code: 401, message: 'Unauthorized' }, { status: 401 })
}

export function errorResponse(message: string, status = 500) {
  return Response.json({ code: -1, message }, { status })
}

export function cookieOptions(isDev: boolean) {
  return {
    httpOnly: true,
    secure: !isDev,
    sameSite: 'lax' as const,
    path: '/',
  }
}

export function clearCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  }
}
