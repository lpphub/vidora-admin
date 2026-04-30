import type { NextRequest } from 'next/server'
import { BACKEND_URL } from '@/lib/env'
import { errorResponse } from '@/lib/route-utils'

async function handleProxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (process.env.NODE_ENV === 'development') {
    if (request.method === 'GET') {
      return Response.json({ code: 0, message: 'success', data: [] })
    }
    return Response.json({ code: 0, message: 'success', data: {} })
  }

  try {
    const { path } = await params
    const pathname = path.join('/')
    const accessToken = request.cookies.get('accessToken')?.value

    const headers: Record<string, string> = {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    }

    const hasBody = request.method !== 'GET' && request.method !== 'DELETE'
    if (hasBody) {
      headers['Content-Type'] = 'application/json'
    }

    const res = await fetch(`${BACKEND_URL}/${pathname}`, {
      method: request.method,
      headers,
      body: hasBody ? await request.text() : undefined,
    })
    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch {
    return errorResponse('Internal server error', 500)
  }
}

export const GET = handleProxy
export const POST = handleProxy
export const PUT = handleProxy
export const PATCH = handleProxy
export const DELETE = handleProxy
