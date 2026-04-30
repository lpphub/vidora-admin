import type { NextRequest } from 'next/server'
import { BACKEND_URL } from '@/lib/env'
import { authHeaders, errorResponse, getAccessToken, unauthorizedResponse } from '@/lib/route-utils'

const MOCK_TAGS = [
  { id: '1', name: '动作', color: '#ef4444', usageCount: 120, createdAt: '2024-01-15' },
  { id: '2', name: '喜剧', color: '#22c55e', usageCount: 85, createdAt: '2024-01-16' },
  { id: '3', name: '科幻', color: '#3b82f6', usageCount: 64, createdAt: '2024-02-10' },
]

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    return Response.json({ code: 0, message: 'success', data: MOCK_TAGS })
  }

  const accessToken = getAccessToken(request)
  if (!accessToken) return unauthorizedResponse()

  try {
    const res = await fetch(`${BACKEND_URL}/tags`, {
      headers: authHeaders(accessToken),
    })
    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch {
    return errorResponse('Internal server error', 500)
  }
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    try {
      const body = await request.json()
      const newTag = {
        id: String(Date.now()),
        ...body,
        usageCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      }
      return Response.json({ code: 0, message: 'success', data: newTag })
    } catch {
      return errorResponse('Invalid request body', 400)
    }
  }

  const accessToken = getAccessToken(request)
  if (!accessToken) return unauthorizedResponse()

  try {
    const body = await request.json()
    const res = await fetch(`${BACKEND_URL}/tags`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: authHeaders(accessToken),
    })
    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch {
    return errorResponse('Internal server error', 500)
  }
}
