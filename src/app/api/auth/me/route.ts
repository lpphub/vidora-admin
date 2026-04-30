import type { NextRequest } from 'next/server'
import { BACKEND_URL } from '@/lib/env'
import { authHeaders, errorResponse, getAccessToken, unauthorizedResponse } from '@/lib/route-utils'

export async function GET(request: NextRequest) {
  const accessToken = getAccessToken(request)

  if (!accessToken) {
    return unauthorizedResponse()
  }

  if (process.env.NODE_ENV === 'development') {
    return Response.json({
      code: 0,
      message: 'success',
      data: {
        id: 1,
        username: '管理员',
        email: 'admin@vidora.com',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      },
    })
  }

  try {
    const res = await fetch(`${BACKEND_URL}/auth/me`, {
      headers: authHeaders(accessToken),
    })
    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch {
    return errorResponse('Internal server error', 500)
  }
}
