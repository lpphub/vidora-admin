import { NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/env'
import { cookieOptions, errorResponse } from '@/lib/route-utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (process.env.NODE_ENV === 'development') {
      const { email, password } = body
      if (email === 'admin@vidora.com' && password === 'admin123') {
        const response = NextResponse.json({
          code: 0,
          message: 'success',
          data: {
            user: {
              id: 1,
              username: '管理员',
              email: 'admin@vidora.com',
              role: 'admin',
            },
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
          },
        })
        const opts = cookieOptions(true)
        response.cookies.set({
          name: 'accessToken',
          value: 'mock-access-token',
          ...opts,
          maxAge: 60 * 15,
        })
        response.cookies.set({
          name: 'refreshToken',
          value: 'mock-refresh-token',
          ...opts,
          maxAge: 60 * 60 * 24 * 7,
        })
        return response
      }
      return NextResponse.json({ code: 401, message: 'Invalid credentials' }, { status: 401 })
    }

    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()

    if (data.code !== 0) {
      return NextResponse.json(data, { status: res.status })
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
