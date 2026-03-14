import ky, { type Options } from 'ky'
import { useAuthStore } from '@/features/auth/store'
import { env } from '@/lib/env'

// ==================== Types ====================

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data?: T
}

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

// ==================== Constants ====================
const refreshTokenPath = '/auth/refresh'
const retryMap = new WeakMap<Request, boolean>()

// ==================== singleFlight ====================
let refreshPromise: Promise<string> | null = null

async function refreshToken(): Promise<string> {
  if (!refreshPromise) {
    const rt = useAuthStore.getState().refreshToken
    if (!rt) {
      useAuthStore.getState().logout()
      throw new ApiError(401, 'No refresh token')
    }

    refreshPromise = ky
      .post(`${env.API_BASE_URL}${refreshTokenPath}`, {
        json: { refreshToken: rt },
        retry: 0,
      })
      .json<ApiResponse<{ accessToken: string; refreshToken: string }>>()
      .then(res => {
        if (res.code !== 0) {
          throw new ApiError(res.code, res.message, res)
        }

        const { accessToken, refreshToken: newRT } = res.data!
        useAuthStore.getState().setTokens(accessToken, newRT)

        return accessToken
      })
      .catch(err => {
        useAuthStore.getState().logout()
        throw err instanceof ApiError ? err : new ApiError(401, 'Refresh token failed')
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

// ==================== log ====================
function logRequest(req: Request, options: Options): void {
  if (!env.IS_DEV) return

  console.groupCollapsed(`🚀 ${req.method} ${req.url}`)
  console.log('Headers:', Object.fromEntries(req.headers.entries()))

  if (options.json) {
    console.log('Body:', options.json)
  }

  if (options.searchParams) {
    console.log('Params:', options.searchParams)
  }

  console.groupEnd()
}

async function logResponse(req: Request, res: Response): Promise<void> {
  if (!env.IS_DEV) return

  console.groupCollapsed(`✅ ${req.method} ${req.url} [${res.status}]`)

  try {
    const data = await res.clone().json()
    console.log('Response:', data)
  } catch {
    console.log('Response not JSON')
  }

  console.groupEnd()
}

// ==================== unwrap ====================
async function unwrap<T>(res: Response): Promise<T> {
  const data: ApiResponse<T> = await res.json()

  if (data.code !== 0) {
    throw new ApiError(data.code, data.message, data)
  }

  return data.data as T
}

// ==================== Ky Instance ====================
const apiClient = ky.create({
  prefixUrl: env.API_BASE_URL,
  timeout: 30000,
  retry: 0,

  hooks: {
    beforeRequest: [
      (req, options) => {
        const token = useAuthStore.getState().accessToken
        if (token) {
          req.headers.set('Authorization', `Bearer ${token}`)
        }

        logRequest(req, options)
      },
    ],

    afterResponse: [
      async (req, options, res) => {
        // ==================== 401 处理 ====================
        if (res.status === 401 && !retryMap.get(req) && !req.url.includes(refreshTokenPath)) {
          const newToken = await refreshToken()

          const newReq = req.clone()
          newReq.headers.set('Authorization', `Bearer ${newToken}`)

          retryMap.set(newReq, true)

          return apiClient(newReq, options)
        }

        await logResponse(req, res)
        return res
      },
    ],
  },
})

// ==================== API ====================
const api = {
  get: <T>(url: string, params?: Record<string, string | number>) =>
    apiClient.get(url, { searchParams: params }).then(unwrap<T>),

  post: <T, D = unknown>(url: string, body?: D) =>
    apiClient.post(url, { json: body }).then(unwrap<T>),

  put: <T, D = unknown>(url: string, body?: D) =>
    apiClient.put(url, { json: body }).then(unwrap<T>),

  patch: <T, D = unknown>(url: string, body?: D) =>
    apiClient.patch(url, { json: body }).then(unwrap<T>),

  delete: <T>(url: string) => apiClient.delete(url).then(unwrap<T>),
}

export { apiClient }
export default api
