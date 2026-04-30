import { BACKEND_URL } from '@/lib/env'

export class ApiError extends Error {
  public code: number
  public response?: unknown

  constructor(code: number, message: string, response?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.response = response
  }
}

async function unwrap<T>(res: Response): Promise<T> {
  const data = await res.json()

  if (data.code !== 0) {
    throw new ApiError(data.code, data.message, data)
  }

  return data.data as T
}

type CookieSource = { get: (name: string) => { value: string } | undefined } | undefined

function getTokenFromCookies(cookies: CookieSource): string | undefined {
  return cookies?.get('accessToken')?.value || undefined
}

function makeAuthHeaders(token?: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const bff = {
  get: <T>(url: string) => fetch(`/api/${url}`).then(unwrap<T>),

  post: <T, D = unknown>(url: string, body?: D) =>
    fetch(`/api/${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    }).then(unwrap<T>),

  put: <T, D = unknown>(url: string, body?: D) =>
    fetch(`/api/${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    }).then(unwrap<T>),

  patch: <T, D = unknown>(url: string, body?: D) =>
    fetch(`/api/${url}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    }).then(unwrap<T>),

  delete: <T>(url: string) => fetch(`/api/${url}`, { method: 'DELETE' }).then(unwrap<T>),
}

export const fetchApi = {
  get: <T>(url: string, cookies?: CookieSource) => {
    const token = getTokenFromCookies(cookies)
    return fetch(`${BACKEND_URL}/${url}`, { headers: makeAuthHeaders(token) }).then(unwrap<T>)
  },

  post: <T, D = unknown>(url: string, body?: D, cookies?: CookieSource) => {
    const token = getTokenFromCookies(cookies)
    return fetch(`${BACKEND_URL}/${url}`, {
      method: 'POST',
      headers: makeAuthHeaders(token),
      body: body ? JSON.stringify(body) : undefined,
    }).then(unwrap<T>)
  },

  put: <T, D = unknown>(url: string, body: D, cookies?: CookieSource) => {
    const token = getTokenFromCookies(cookies)
    return fetch(`${BACKEND_URL}/${url}`, {
      method: 'PUT',
      headers: makeAuthHeaders(token),
      body: JSON.stringify(body),
    }).then(unwrap<T>)
  },

  patch: <T, D = unknown>(url: string, body?: D, cookies?: CookieSource) => {
    const token = getTokenFromCookies(cookies)
    return fetch(`${BACKEND_URL}/${url}`, {
      method: 'PATCH',
      headers: makeAuthHeaders(token),
      body: body ? JSON.stringify(body) : undefined,
    }).then(unwrap<T>)
  },

  delete: <T>(url: string, cookies?: CookieSource) => {
    const token = getTokenFromCookies(cookies)
    return fetch(`${BACKEND_URL}/${url}`, {
      method: 'DELETE',
      headers: makeAuthHeaders(token),
    }).then(unwrap<T>)
  },
}
