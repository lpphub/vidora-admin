import { getDashboardStats } from '@/lib/api/dashboard'
import type { DashboardData } from './types'

export async function getDashboardData(): Promise<DashboardData | null> {
  try {
    return await getDashboardStats()
  } catch {
    return null
  }
}
