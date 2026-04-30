import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/env'
import { clearCookieOptions, getAccessToken } from '@/lib/route-utils'

export async function POST(request: NextRequest) {
  const accessToken = getAccessToken(request)

  try {
    if (accessToken) {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      })
    }
  } catch {
    // Best-effort: even if backend logout fails, clear local cookies
  }

  const response = NextResponse.json({ code: 0, message: 'success' })
  const clearOpts = clearCookieOptions()
  response.cookies.set({ name: 'accessToken', value: '', ...clearOpts })
  response.cookies.set({ name: 'refreshToken', value: '', ...clearOpts })
  return response
}
