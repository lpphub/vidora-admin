import { BACKEND_URL } from './_constants'

export async function POST(request: Request) {
  const body = await request.json()

  if (process.env.NODE_ENV === 'development') {
    // Dev mock: simulate successful login
    const { email, password } = body
    if (email === 'admin@vidora.com' && password === 'admin123') {
      const response = Response.json({
        code: 0,
        message: 'success',
        data: {
          user: {
            id: 1,
            username: '管理员',
            email: 'admin@vidora.com',
            role: 'admin',
          },
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
      })
      response.cookies.set({
        name: 'accessToken',
        value: 'mock-access-token',
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 15,
      })
      response.cookies.set({
        name: 'refreshToken',
        value: 'mock-refresh-token',
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
      return response
    }
    return Response.json({ code: 401, message: '邮箱或密码错误' }, { status: 401 })
  }

  // Production: proxy to real backend
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
  const data = await res.json()

  if (data.code !== 0) {
    return Response.json(data, { status: res.status })
  }

  const response = Response.json(data)
  response.cookies.set({
    name: 'accessToken',
    value: data.data.accessToken,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15,
  })
  response.cookies.set({
    name: 'refreshToken',
    value: data.data.refreshToken,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
