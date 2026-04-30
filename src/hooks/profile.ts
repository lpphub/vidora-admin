import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authKeys } from '@/hooks/auth'
import { bff } from '@/lib/api'
import type { User } from '@/types/auth'

export interface UpdateProfileReq {
  username: string
  about?: string
}

export interface ChangePasswordReq {
  oldPassword: string
  newPassword: string
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateProfileReq) => bff.patch<User>('profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user() })
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordReq) => bff.post<void>('profile/password', data),
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => bff.delete<void>('profile'),
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
