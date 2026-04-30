import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/env'
import { clearCookieOptions, cookieOptions, errorResponse } from '@/lib/route-utils'

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (!refreshToken) {
    return NextResponse.json({ code: 401, message: 'No refresh token' }, { status: 401 })
  }

  try {
    if (process.env.NODE_ENV === 'development') {
      const response = NextResponse.json({
        code: 0,
        message: 'success',
        data: {
          accessToken: 'mock-access-token-refreshed',
          refreshToken: 'mock-refresh-token-refreshed',
        },
      })
      const opts = cookieOptions(true)
      response.cookies.set({
        name: 'accessToken',
        value: 'mock-access-token-refreshed',
        ...opts,
        maxAge: 60 * 15,
      })
      response.cookies.set({
        name: 'refreshToken',
        value: 'mock-refresh-token-refreshed',
        ...opts,
        maxAge: 60 * 60 * 24 * 7,
      })
      return response
    }

    const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    const data = await res.json()

    if (data.code !== 0) {
      const errorResponse = NextResponse.json(data, { status: res.status })
      const clearOpts = clearCookieOptions()
      errorResponse.cookies.set({ name: 'accessToken', value: '', ...clearOpts })
      errorResponse.cookies.set({ name: 'refreshToken', value: '', ...clearOpts })
      return errorResponse
    }

    const response = NextResponse.json(data)
    const opts = cookieOptions(false)
    response.cookies.set({
      name: 'accessToken',
      value: data.data.accessToken,
      ...opts,
      maxAge: 60 * 15,
    })
    response.cookies.set({
      name: 'refreshToken',
      value: data.data.refreshToken,
      ...opts,
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch {
    return errorResponse('Internal server error', 500)
  }
}
