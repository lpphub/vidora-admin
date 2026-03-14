import type { User } from '@/features/auth/types'
import api from '@/lib/api'

export interface UpdateProfileRequest {
  username: string
  about?: string
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

export const profileApi = {
  updateProfile: (data: UpdateProfileRequest) => api.patch<User>('profile', data),
  changePassword: (data: ChangePasswordRequest) => api.post<void>('profile/password', data),
  deleteAccount: () => api.delete<void>('profile'),
}
