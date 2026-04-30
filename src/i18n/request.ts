import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = requested ?? 'zh'

  const messages = {
    common: (await import(`@/i18n/messages/${locale}/common.json`)).default,
    auth: (await import(`@/i18n/messages/${locale}/auth.json`)).default,
    dashboard: (await import(`@/i18n/messages/${locale}/dashboard.json`)).default,
    sidebar: (await import(`@/i18n/messages/${locale}/sidebar.json`)).default,
    tags: (await import(`@/i18n/messages/${locale}/tags.json`)).default,
    users: (await import(`@/i18n/messages/${locale}/users.json`)).default,
    roles: (await import(`@/i18n/messages/${locale}/roles.json`)).default,
    permissions: (await import(`@/i18n/messages/${locale}/permissions.json`)).default,
    profile: (await import(`@/i18n/messages/${locale}/profile.json`)).default,
  }

  return { locale, messages }
})
