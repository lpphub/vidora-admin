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
      body: JSON.stringify(body),
    }).then(unwrap<T>),

  patch: <T, D = unknown>(url: string, body?: D) =>
    fetch(`/api/${url}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(unwrap<T>),

  delete: <T>(url: string) =>
    fetch(`/api/${url}`, { method: 'DELETE' }).then(unwrap<T>),
}
