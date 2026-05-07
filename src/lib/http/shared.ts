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

export async function parseResponse<T>(res: Response): Promise<T> {
  const data = await res.json()

  if (data.code !== 0) {
    throw new ApiError(data.code, data.message, data)
  }

  return data.data as T
}
