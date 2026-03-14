export type PermissionType = 'menu' | 'button' | 'api'
export type PermissionStatus = 'enabled' | 'disabled'

export interface Permission {
  id: number
  name: string
  code: string
  type: PermissionType
  status: PermissionStatus
  createdAt: string
}

export const permissionTypes: PermissionType[] = ['menu', 'button', 'api']

export const mockPermissions: Permission[] = [
  {
    id: 1,
    name: '用户查看',
    code: 'user:read',
    type: 'menu',
    status: 'enabled',
    createdAt: '2024-01-15 10:30:00',
  },
  {
    id: 2,
    name: '用户新增',
    code: 'user:create',
    type: 'button',
    status: 'enabled',
    createdAt: '2024-01-15 10:35:00',
  },
  {
    id: 3,
    name: '用户删除',
    code: 'user:delete',
    type: 'api',
    status: 'disabled',
    createdAt: '2024-02-20 14:20:00',
  },
  {
    id: 4,
    name: '角色管理',
    code: 'role:manage',
    type: 'menu',
    status: 'enabled',
    createdAt: '2024-03-10 09:15:00',
  },
]
