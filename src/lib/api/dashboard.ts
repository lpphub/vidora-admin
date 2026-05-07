import type { DashboardData } from '@/app/[locale]/(app)/dashboard/types'
import { MOCK_DASHBOARD_DATA } from '@/app/[locale]/(app)/dashboard/types'
import { serverFetch } from '@/lib/http/server'

export function getDashboardStats() {
  if (process.env.ENABLE_MOCKS === 'true') return Promise.resolve(MOCK_DASHBOARD_DATA)
  return serverFetch<DashboardData>('dashboard/stats')
}
