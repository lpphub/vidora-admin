import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bff } from '@/lib/api'
import type { User } from '@/types/auth'

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
}

export function useUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => bff.get<User>('auth/me'),
    retry: false,
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => bff.post('auth/logout'),
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
