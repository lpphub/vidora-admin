export interface Role {
  id: number
  name: string
  description: string
  permissionCount: number
  createdAt: string
}

export interface Permission {
  id: string
  name: string
}

export const mockRoles: Role[] = [
  {
    id: 1,
    name: '管理员',
    description: '拥有系统所有权限',
    permissionCount: 50,
    createdAt: '2024-01-15 10:30:00',
  },
  {
    id: 2,
    name: '编辑',
    description: '可管理内容和视频',
    permissionCount: 25,
    createdAt: '2024-02-20 14:20:00',
  },
  {
    id: 3,
    name: '访客',
    description: '仅可查看内容',
    permissionCount: 5,
    createdAt: '2024-03-10 09:15:00',
  },
]

export const allPermissions: Permission[] = [
  { id: 'user:read', name: '用户查看' },
  { id: 'user:create', name: '用户新增' },
  { id: 'user:update', name: '用户编辑' },
  { id: 'user:delete', name: '用户删除' },
  { id: 'role:read', name: '角色查看' },
  { id: 'role:create', name: '角色新增' },
  { id: 'content:read', name: '内容查看' },
  { id: 'content:create', name: '内容新增' },
]
