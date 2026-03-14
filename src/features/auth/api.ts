import type { AuthData, LoginRequest, User } from '@/features/auth/types'
import api from '@/lib/api'

export const authApi = {
  login: (data: LoginRequest) => api.post<AuthData>('auth/login', data),
  logout: () => api.post<void>('auth/logout'),
  me: () => api.get<User>('auth/me'),
}
