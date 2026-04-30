import type { NextRequest } from 'next/server'
import { MOCK_DASHBOARD_DATA } from '@/app/[locale]/(dashboard)/dashboard/types'
import { BACKEND_URL } from '@/lib/env'
import { authHeaders, errorResponse, getAccessToken, unauthorizedResponse } from '@/lib/route-utils'

export async function GET(request: NextRequest) {
  const accessToken = getAccessToken(request)

  if (!accessToken) {
    return unauthorizedResponse()
  }

  if (process.env.NODE_ENV === 'development') {
    return Response.json({ code: 0, message: 'success', data: MOCK_DASHBOARD_DATA })
  }

  try {
    const res = await fetch(`${BACKEND_URL}/dashboard/stats`, {
      headers: authHeaders(accessToken),
    })
    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch {
    return errorResponse('Internal server error', 500)
  }
}
