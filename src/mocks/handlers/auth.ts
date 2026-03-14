import { delay, HttpResponse, http } from 'msw'
import type { AuthResp, LoginReq, User } from '@/features/auth/types'
import type { ApiResponse } from '@/lib/api'
import { generateToken, getEmailByToken, removeToken, storeToken, users } from '../db'

const API_BASE = '/api'

// 成功响应
function success<T>(data: T): ApiResponse<T> {
  return { code: 0, message: 'success', data }
}

// 错误响应
function error(message: string, code = 400): ApiResponse<null> {
  return { code, message, data: null as unknown as null }
}

export const authHandlers = [
  // 登录
  http.post<never, LoginReq, ApiResponse<AuthResp | null>>(
    `${API_BASE}/auth/login`,
    async ({ request }) => {
      await delay(500)

      const body = await request.json()
      const { email, password } = body

      const record = users.get(email)

      if (!record || record.password !== password) {
        return HttpResponse.json(error('邮箱或密码错误', 401))
      }

      const token = generateToken()
      storeToken(token, email)

      return HttpResponse.json(
        success({
          user: record.user,
          accessToken: token,
          refreshToken: generateToken(),
        })
      )
    }
  ),

  // 获取当前用户信息
  http.get<never, never, ApiResponse<User | null>>(`${API_BASE}/auth/me`, async ({ request }) => {
    await delay(200)

    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json(error('未授权', 401))
    }

    const token = authHeader.slice(7)
    const email = getEmailByToken(token)

    if (!email) {
      return HttpResponse.json(error('Token 无效或已过期', 401))
    }

    const record = users.get(email)
    if (!record) {
      return HttpResponse.json(error('用户不存在', 404))
    }

    return HttpResponse.json(success(record.user))
  }),

  // 登出
  http.post<never, never, ApiResponse<void>>(`${API_BASE}/auth/logout`, async ({ request }) => {
    await delay(200)

    const authHeader = request.headers.get('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7)
      removeToken(token)
    }

    return HttpResponse.json(success(undefined))
  }),
]
