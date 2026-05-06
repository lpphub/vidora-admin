import { cookies } from 'next/headers'
import { fetchApi } from '@/lib/api'
import type { DashboardData } from './types'
import { MOCK_DASHBOARD_DATA } from './types'

export async function getDashboardData(): Promise<DashboardData | null> {
  if (process.env.ENABLE_MOCKS === 'true') {
    return MOCK_DASHBOARD_DATA
  }

  try {
    const cookieStore = await cookies()
    return await fetchApi.get<DashboardData>('dashboard/stats', cookieStore)
  } catch {
    return null
  }
}
