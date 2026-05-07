import { cookies } from 'next/headers'
import { BACKEND_URL } from '@/lib/env'
import { parseResponse } from './shared'

export async function serverFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const cookieStore = await cookies()
  const token = cookieStore.get('accessToken')?.value

  const res = await fetch(`${BACKEND_URL}/${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    cache: 'no-store',
  })

  return parseResponse<T>(res)
}
