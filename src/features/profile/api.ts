import type { User } from '@/features/auth/types'
import api from '@/lib/api'

export interface UpdateProfileReq {
  username: string
  about?: string
}

export interface ChangePasswordReq {
  oldPassword: string
  newPassword: string
}

export const profileApi = {
  updateProfile: (data: UpdateProfileReq) => api.patch<User>('profile', data),
  changePassword: (data: ChangePasswordReq) => api.post<void>('profile/password', data),
  deleteAccount: () => api.delete<void>('profile'),
}
