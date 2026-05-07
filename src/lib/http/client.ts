import { parseResponse } from './shared'

export async function clientFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const hasRawBody = init?.body instanceof FormData || init?.body instanceof Blob

  const res = await fetch(`/api/${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(!hasRawBody ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })

  return parseResponse<T>(res)
}
