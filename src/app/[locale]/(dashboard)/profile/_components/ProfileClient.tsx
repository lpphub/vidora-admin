'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { User } from '@/types/auth'
import { General } from './General'
import { Security } from './Security'

interface ProfileTranslations {
  tabs: { general: string; security: string }
  general: {
    username: string
    email: string
    about: string
    aboutPlaceholder: string
    saveChanges: string
    saving: string
    deleteAccount: string
  }
  security: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
    updatePassword: string
    updating: string
    passwordRequired: string
    passwordMinLength: string
    passwordMismatch: string
  }
  toast: {
    profileUpdated: string
    profileUpdateFailed: string
    passwordUpdated: string
    passwordUpdateFailed: string
  }
}

export function ProfileClient({
  initialUser,
  translations: t,
}: {
  initialUser: User | null
  translations: ProfileTranslations
}) {
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general')

  return (
    <div className='space-y-6'>
      <div className='flex gap-2 border-b'>
        {(['general', 'security'] as const).map(tab => (
          <button
            type='button'
            key={tab}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setActiveTab(tab)}
          >
            {t.tabs[tab]}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <General user={initialUser} translations={t.general} toastTranslations={t.toast} />
      )}
      {activeTab === 'security' && (
        <Security translations={t.security} toastTranslations={t.toast} />
      )}
    </div>
  )
}
