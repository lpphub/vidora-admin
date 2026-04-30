export interface Role {
  id: number
  name: string
  description: string
  permissionCount: number
  createdAt: string
}

export interface RolePermission {
  id: string
  name: string
}

export const mockRoles: Role[] = [
  {
    id: 1,
    name: 'admin',
    description: 'roles.mock.adminDesc',
    permissionCount: 50,
    createdAt: '2024-01-15 10:30:00',
  },
  {
    id: 2,
    name: 'editor',
    description: 'roles.mock.editorDesc',
    permissionCount: 25,
    createdAt: '2024-02-20 14:20:00',
  },
  {
    id: 3,
    name: 'viewer',
    description: 'roles.mock.viewerDesc',
    permissionCount: 5,
    createdAt: '2024-03-10 09:15:00',
  },
]

export const allPermissions: RolePermission[] = [
  { id: 'user:read', name: 'roles.perm.userRead' },
  { id: 'user:create', name: 'roles.perm.userCreate' },
  { id: 'user:update', name: 'roles.perm.userUpdate' },
  { id: 'user:delete', name: 'roles.perm.userDelete' },
  { id: 'role:read', name: 'roles.perm.roleRead' },
  { id: 'role:create', name: 'roles.perm.roleCreate' },
  { id: 'content:read', name: 'roles.perm.contentRead' },
  { id: 'content:create', name: 'roles.perm.contentCreate' },
]
