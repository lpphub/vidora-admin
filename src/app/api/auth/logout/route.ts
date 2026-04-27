export async function POST() {
  const response = Response.json({ code: 0, message: 'success' })

  response.cookies.set({
    name: 'accessToken',
    value: '',
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  response.cookies.set({
    name: 'refreshToken',
    value: '',
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  return response
}
