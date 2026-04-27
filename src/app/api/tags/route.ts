import type { NextRequest } from 'next/server'

const BACKEND_URL = process.env.API_BACKEND_URL || 'http://localhost:8080'

const MOCK_TAGS = [
  { id: '1', name: '动作', color: '#ef4444', usageCount: 120, createdAt: '2024-01-15' },
  { id: '2', name: '喜剧', color: '#22c55e', usageCount: 85, createdAt: '2024-01-16' },
  { id: '3', name: '科幻', color: '#3b82f6', usageCount: 64, createdAt: '2024-02-10' },
]

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    return Response.json({ code: 0, message: 'success', data: MOCK_TAGS })
  }

  const accessToken = request.cookies.get('accessToken')?.value
  const res = await fetch(`${BACKEND_URL}/tags`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return Response.json(await res.json(), { status: res.status })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  if (process.env.NODE_ENV === 'development') {
    const newTag = { id: String(Date.now()), ...body, usageCount: 0, createdAt: new Date().toISOString().split('T')[0] }
    return Response.json({ code: 0, message: 'success', data: newTag })
  }

  const accessToken = request.cookies.get('accessToken')?.value
  const res = await fetch(`${BACKEND_URL}/tags`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
  })
  return Response.json(await res.json(), { status: res.status })
}
