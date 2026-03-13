import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api'
import { useAuthStore } from '../store'
import type { LoginRequest, User } from '../types'

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
}

// 核心 hook
export function useAuth() {
  const user = useAuthStore(s => s.user)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const storeLogin = useAuthStore(s => s.login)
  const storeLogout = useAuthStore(s => s.logout)

  return {
    user,
    isAuthenticated,
    login: (data: { user: User; accessToken: string; refreshToken: string }) => {
      storeLogin(data.user, data.accessToken, data.refreshToken)
    },
    logout: storeLogout,
  }
}

// 登录 hook
export function useLogin() {
  const { login } = useAuth()
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: data => login(data),
  })
}

// 登出 hook
export function useLogout() {
  const { logout } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout()
      queryClient.clear()
    },
  })
}

// 获取当前用户 hook
export function useUser() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => authApi.me(),
    enabled: isAuthenticated,
  })
}
