import { useMutation } from '@tanstack/react-query'
import { bff } from '@/lib/bff'
import type { User } from '@/features/auth/types'

export interface UpdateProfileReq {
  username: string
  about?: string
}

export interface ChangePasswordReq {
  oldPassword: string
  newPassword: string
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (data: UpdateProfileReq) => bff.patch<User>('profile', data),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordReq) => bff.post<void>('profile/password', data),
  })
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => bff.delete<void>('profile'),
  })
}
