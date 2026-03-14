import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@/shared/stores/auth'
import { type ChangePasswordRequest, profileApi, type UpdateProfileRequest } from '../api'

export function useUpdateProfile() {
  const setUser = useAuthStore(s => s.setUser)
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileApi.updateProfile(data),
    onSuccess: user => setUser(user),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => profileApi.changePassword(data),
  })
}

export function useDeleteAccount() {
  const logout = useAuthStore(s => s.logout)
  return useMutation({
    mutationFn: () => profileApi.deleteAccount(),
    onSuccess: () => logout(),
  })
}
