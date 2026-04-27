import type { NextRequest } from 'next/server'

const BACKEND_URL = process.env.API_BACKEND_URL || 'http://localhost:8080'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  if (process.env.NODE_ENV === 'development') {
    return Response.json({ code: 0, message: 'success', data: { id, ...body } })
  }

  const accessToken = request.cookies.get('accessToken')?.value
  const res = await fetch(`${BACKEND_URL}/tags/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
  })
  return Response.json(await res.json(), { status: res.status })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (process.env.NODE_ENV === 'development') {
    return Response.json({ code: 0, message: 'success', data: null })
  }

  const accessToken = request.cookies.get('accessToken')?.value
  const res = await fetch(`${BACKEND_URL}/tags/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return Response.json(await res.json(), { status: res.status })
}
