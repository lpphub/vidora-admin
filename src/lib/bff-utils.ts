import type { NextRequest } from 'next/server'
import { ApiError } from '@/lib/http/shared'

export function getAccessToken(request: NextRequest): string | undefined {
  return request.cookies.get('accessToken')?.value || undefined
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

export async function proxyResponse(fn: () => Promise<unknown>) {
  try {
    const data = await fn()
    return Response.json({ code: 0, message: 'success', data })
  } catch (err) {
    if (err instanceof ApiError) {
      return Response.json({ code: err.code, message: err.message }, { status: err.code >= 100 && err.code < 600 ? err.code : 500 })
    }
    return errorResponse('Internal server error', 500)
  }
}
