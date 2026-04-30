import type { NextRequest } from 'next/server'
import { BACKEND_URL } from '@/lib/env'
import { authHeaders, errorResponse, getAccessToken, unauthorizedResponse } from '@/lib/route-utils'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (process.env.NODE_ENV === 'development') {
    try {
      const body = await request.json()
      return Response.json({ code: 0, message: 'success', data: { id, ...body } })
    } catch {
      return errorResponse('Invalid request body', 400)
    }
  }

  const accessToken = getAccessToken(request)
  if (!accessToken) return unauthorizedResponse()

  try {
    const body = await request.json()
    const res = await fetch(`${BACKEND_URL}/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: authHeaders(accessToken),
    })
    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch {
    return errorResponse('Internal server error', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (process.env.NODE_ENV === 'development') {
    return Response.json({ code: 0, message: 'success', data: null })
  }

  const accessToken = getAccessToken(request)
  if (!accessToken) return unauthorizedResponse()

  try {
    const res = await fetch(`${BACKEND_URL}/tags/${id}`, {
      method: 'DELETE',
      headers: authHeaders(accessToken),
    })
    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch {
    return errorResponse('Internal server error', 500)
  }
}
