import type { NextRequest } from 'next/server'
import { createTag, getTags } from '@/lib/api/tag'
import { proxyResponse } from '@/lib/bff-utils'

export async function GET() {
  return proxyResponse(getTags)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  return proxyResponse(() => createTag(body))
}
