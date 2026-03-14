import api from '@/lib/api'
import type { AuthData, LoginRequest, User } from '@/shared/types/user'

export const authApi = {
  login: (data: LoginRequest) => api.post<AuthData>('auth/login', data),
  logout: () => api.post<void>('auth/logout'),
  me: () => api.get<User>('auth/me'),
}
