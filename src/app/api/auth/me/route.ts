import { getAuthUser } from '@/lib/api/auth'
import { proxyResponse } from '@/lib/bff-utils'

export async function GET() {
  return proxyResponse(getAuthUser)
}
