import type { AuthData, LoginRequest, User } from '@/types/auth'
import api from './index'

export const authApi = {
  login: (data: LoginRequest) => api.post<AuthData>('auth/login', data),
  logout: () => api.post<void>('auth/logout'),
  me: () => api.get<User>('auth/me'),
}
