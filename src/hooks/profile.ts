import { mutate } from 'swr'
import { USER_KEY } from '@/hooks/auth'
import { clientFetch } from '@/lib/http/client'

export interface UpdateProfileReq {
  username: string
  about?: string
}

export interface ChangePasswordReq {
  oldPassword: string
  newPassword: string
}

export async function updateProfile(data: UpdateProfileReq) {
  await clientFetch('profile', { method: 'PATCH', body: JSON.stringify(data) })
  await mutate(USER_KEY)
}

export async function changePassword(data: ChangePasswordReq) {
  await clientFetch('profile/password', { method: 'POST', body: JSON.stringify(data) })
}

export async function deleteAccount() {
  await clientFetch('profile', { method: 'DELETE' })
  await mutate(() => true, false)
}
