import { serverFetch } from '@/lib/http/server'
import type { User } from '@/types/auth'

const MOCK_USER: User = {
  id: 1,
  username: '管理员',
  email: 'admin@vidora.com',
  role: 'admin',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
}

export function getAuthUser() {
  if (process.env.ENABLE_MOCKS === 'true') return Promise.resolve(MOCK_USER)
  return serverFetch<User>('auth/me')
}
