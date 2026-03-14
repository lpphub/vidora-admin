export type UserStatus = 'enabled' | 'disabled'

export interface User {
  id: number
  username: string
  email: string
  role: string
  status: UserStatus
  createdAt: string
}

export const ROLES = ['管理员', '编辑', '访客'] as const

export const MOCK_USERS: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@vidora.com',
    role: '管理员',
    status: 'enabled',
    createdAt: '2024-01-15 10:30:00',
  },
  {
    id: 2,
    username: 'editor',
    email: 'editor@vidora.com',
    role: '编辑',
    status: 'enabled',
    createdAt: '2024-02-20 14:20:00',
  },
  {
    id: 3,
    username: 'viewer',
    email: 'viewer@vidora.com',
    role: '访客',
    status: 'disabled',
    createdAt: '2024-03-10 09:15:00',
  },
]
