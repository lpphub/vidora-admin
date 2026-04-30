export type UserStatus = 'enabled' | 'disabled'

export interface SystemUser {
  id: number
  username: string
  email: string
  role: string
  status: UserStatus
  createdAt: string
}

export const ROLES = [
  { value: 'admin', labelKey: 'roles.admin' },
  { value: 'editor', labelKey: 'roles.editor' },
  { value: 'viewer', labelKey: 'roles.viewer' },
] as const

export const MOCK_USERS: SystemUser[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@vidora.com',
    role: 'admin',
    status: 'enabled',
    createdAt: '2024-01-15 10:30:00',
  },
  {
    id: 2,
    username: 'editor',
    email: 'editor@vidora.com',
    role: 'editor',
    status: 'enabled',
    createdAt: '2024-02-20 14:20:00',
  },
  {
    id: 3,
    username: 'viewer',
    email: 'viewer@vidora.com',
    role: 'viewer',
    status: 'disabled',
    createdAt: '2024-03-10 09:15:00',
  },
]
