import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = requested ?? 'zh'

  const messages = {
    common: (await import(`@/messages/${locale}/common.json`)).default,
    auth: (await import(`@/messages/${locale}/auth.json`)).default,
    dashboard: (await import(`@/messages/${locale}/dashboard.json`)).default,
    sidebar: (await import(`@/messages/${locale}/sidebar.json`)).default,
    tags: (await import(`@/messages/${locale}/tags.json`)).default,
    users: (await import(`@/messages/${locale}/users.json`)).default,
    roles: (await import(`@/messages/${locale}/roles.json`)).default,
    permissions: (await import(`@/messages/${locale}/permissions.json`)).default,
    profile: (await import(`@/messages/${locale}/profile.json`)).default,
  }

  return { locale, messages }
})
