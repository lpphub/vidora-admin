import { serverFetch } from '@/lib/http/server'
import type { User } from '@/types/auth'

export interface UpdateProfileReq {
  username: string
  about?: string
}

export interface ChangePasswordReq {
  oldPassword: string
  newPassword: string
}

export function getProfile() {
  return serverFetch<User>('profile')
}

export function updateProfile(data: UpdateProfileReq) {
  return serverFetch<User>('profile', { method: 'PATCH', body: JSON.stringify(data) })
}

export function changePassword(data: ChangePasswordReq) {
  return serverFetch<void>('profile/password', { method: 'POST', body: JSON.stringify(data) })
}

export function deleteAccount() {
  return serverFetch<void>('profile', { method: 'DELETE' })
}
