import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

const locales = ['zh', 'en'] as const
const defaultLocale = 'zh'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const locale = cookieStore.get('locale')?.value ?? defaultLocale

  const safeLocale = locales.includes(locale as (typeof locales)[number]) ? locale : defaultLocale

  const messages = {
    common: (await import(`@/i18n/messages/${safeLocale}/common.json`)).default,
    auth: (await import(`@/i18n/messages/${safeLocale}/auth.json`)).default,
    dashboard: (await import(`@/i18n/messages/${safeLocale}/dashboard.json`)).default,
    sidebar: (await import(`@/i18n/messages/${safeLocale}/sidebar.json`)).default,
    tags: (await import(`@/i18n/messages/${safeLocale}/tags.json`)).default,
    users: (await import(`@/i18n/messages/${safeLocale}/users.json`)).default,
    roles: (await import(`@/i18n/messages/${safeLocale}/roles.json`)).default,
    permissions: (await import(`@/i18n/messages/${safeLocale}/permissions.json`)).default,
    profile: (await import(`@/i18n/messages/${safeLocale}/profile.json`)).default,
  }

  return { locale: safeLocale, messages }
})
