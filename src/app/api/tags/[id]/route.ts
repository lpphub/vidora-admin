import type { NextRequest } from 'next/server'
import { deleteTag, updateTag } from '@/lib/api/tag'
import { proxyResponse } from '@/lib/bff-utils'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  return proxyResponse(() => updateTag(id, body))
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return proxyResponse(() => deleteTag(id))
}
