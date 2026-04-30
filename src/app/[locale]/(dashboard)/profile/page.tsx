import { getTranslations } from 'next-intl/server'
import { fetchApi } from '@/lib/api'
import type { User } from '@/types/auth'
import { ProfileClient } from './_components/ProfileClient'

export default async function ProfilePage() {
  const t = await getTranslations('profile')
  let initialUser: User | null = null

  try {
    const { cookies } = await import('next/headers')
    initialUser = await fetchApi.get<User>('auth/me', await cookies())
  } catch {
    // fallback to client-side fetch via useUser()
  }

  const translations = {
    tabs: { general: t('tabs.general'), security: t('tabs.security') },
    general: {
      username: t('general.username'),
      email: t('general.email'),
      about: t('general.about'),
      aboutPlaceholder: t('general.aboutPlaceholder'),
      saveChanges: t('general.saveChanges'),
      saving: t('general.saving'),
      deleteAccount: t('general.deleteAccount'),
    },
    security: {
      currentPassword: t('security.currentPassword'),
      newPassword: t('security.newPassword'),
      confirmPassword: t('security.confirmPassword'),
      updatePassword: t('security.updatePassword'),
      updating: t('security.updating'),
      passwordRequired: t('security.passwordRequired'),
      passwordMinLength: t('security.passwordMinLength'),
      passwordMismatch: t('security.passwordMismatch'),
    },
    toast: {
      profileUpdated: t('toast.profileUpdated'),
      profileUpdateFailed: t('toast.profileUpdateFailed'),
      passwordUpdated: t('toast.passwordUpdated'),
      passwordUpdateFailed: t('toast.passwordUpdateFailed'),
    },
  }

  return <ProfileClient initialUser={initialUser} translations={translations} />
}
