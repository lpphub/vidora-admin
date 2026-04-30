import { cookies } from 'next/headers'
import { fetchApi } from '@/lib/api'
import type { DashboardData } from './types'
import { MOCK_DASHBOARD_DATA } from './types'

export async function getDashboardData(): Promise<DashboardData> {
  if (process.env.NODE_ENV === 'development') {
    return MOCK_DASHBOARD_DATA
  }

  const cookieStore = await cookies()
  return fetchApi.get<DashboardData>('dashboard/stats', cookieStore)
}
