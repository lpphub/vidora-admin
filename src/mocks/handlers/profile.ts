import { delay, HttpResponse, http } from 'msw'
import type { User } from '@/features/auth/types'
import type { ApiResponse } from '@/lib/api'
import { deleteUser, getEmailByToken, updateUser, users } from '../db'

const API_BASE = '/api'

// 成功响应
function success<T>(data: T): ApiResponse<T> {
  return { code: 0, message: 'success', data }
}

// 错误响应
function error<T>(message: string, code = 400): ApiResponse<T> {
  return { code, message, data: null as unknown as T }
}

// 获取当前用户邮箱
function getEmailFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.slice(7)
  return getEmailByToken(token) || null
}

export const profileHandlers = [
  // 更新用户资料
  http.patch<never, { username?: string; about?: string }, ApiResponse<User | null>>(
    `${API_BASE}/profile`,
    async ({ request }) => {
      await delay(300)

      const email = getEmailFromRequest(request)
      if (!email) {
        return HttpResponse.json(error('未授权', 401))
      }

      const body = await request.json()
      const updatedUser = updateUser(email, body)

      if (!updatedUser) {
        return HttpResponse.json(error('用户不存在', 404))
      }

      return HttpResponse.json(success(updatedUser))
    }
  ),

  // 修改密码
  http.post<never, { oldPassword: string; newPassword: string }, ApiResponse<void>>(
    `${API_BASE}/profile/password`,
    async ({ request }) => {
      await delay(300)

      const email = getEmailFromRequest(request)
      if (!email) {
        return HttpResponse.json(error('未授权', 401))
      }

      const body = await request.json()
      const { oldPassword, newPassword } = body

      const record = users.get(email)
      if (!record || record.password !== oldPassword) {
        return HttpResponse.json(error('原密码错误', 400))
      }

      // 更新密码
      users.set(email, { ...record, password: newPassword })

      return HttpResponse.json(success(undefined))
    }
  ),

  // 删除账户
  http.delete<never, never, ApiResponse<void>>(`${API_BASE}/profile`, async ({ request }) => {
    await delay(300)

    const email = getEmailFromRequest(request)
    if (!email) {
      return HttpResponse.json(error('未授权', 401))
    }

    const deleted = deleteUser(email)
    if (!deleted) {
      return HttpResponse.json(error('用户不存在', 404))
    }

    return HttpResponse.json(success(undefined))
  }),
]
