const BACKEND_URL = process.env.API_BACKEND_URL || 'http://localhost:8080'

export async function GET(request: Request) {
  const accessToken = request.cookies.get('accessToken')?.value

  if (!accessToken) {
    return Response.json({ code: 401, message: '未授权' }, { status: 401 })
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

  const res = await fetch(`${BACKEND_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const data = await res.json()
  return Response.json(data, { status: res.status })
}
