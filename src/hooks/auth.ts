import useSWR, { mutate } from 'swr'
import { clientFetch } from '@/lib/http/client'
import type { User } from '@/types/auth'

export const USER_KEY = 'auth/me'

export function useUser() {
  return useSWR(USER_KEY, (path) => clientFetch<User>(path), {
    shouldRetryOnError: false,
  })
}

export async function login(data: { email: string; password: string }) {
  await clientFetch('auth/login', { method: 'POST', body: JSON.stringify(data) })
}

export async function logout() {
  await clientFetch('auth/logout', { method: 'POST' })
  await mutate(() => true, false)
}
