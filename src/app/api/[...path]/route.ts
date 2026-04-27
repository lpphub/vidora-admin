const BACKEND_URL = process.env.API_BACKEND_URL || 'http://localhost:8080'

async function handleProxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const pathname = path.join('/')

  if (process.env.NODE_ENV === 'development') {
    return Response.json({ code: 0, message: 'success', data: null })
  }

  const accessToken = request.cookies.get('accessToken')?.value

  const res = await fetch(`${BACKEND_URL}/${pathname}`, {
    method: request.method,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: request.method !== 'GET' && request.method !== 'DELETE' ? await request.text() : undefined,
  })

  const data = await res.json()
  return Response.json(data, { status: res.status })
}

export const GET = handleProxy
export const POST = handleProxy
export const PUT = handleProxy
export const PATCH = handleProxy
export const DELETE = handleProxy
