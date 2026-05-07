import { getDashboardStats } from '@/lib/api/dashboard'
import { proxyResponse } from '@/lib/bff-utils'

export async function GET() {
  return proxyResponse(getDashboardStats)
}
