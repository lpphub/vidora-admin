import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ code: 0, message: 'success' })

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
