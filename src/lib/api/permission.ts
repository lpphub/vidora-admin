import { serverFetch } from '@/lib/http/server'

export interface PermissionItem {
  id: string
  name: string
  code: string
  description: string
  module: string
}

export function getPermissions() {
  return serverFetch<PermissionItem[]>('permissions')
}

export function createPermission(data: Partial<PermissionItem>) {
  return serverFetch<PermissionItem>('permissions', { method: 'POST', body: JSON.stringify(data) })
}

export function updatePermission(id: string, data: Partial<PermissionItem>) {
  return serverFetch<PermissionItem>(`permissions/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function deletePermission(id: string) {
  return serverFetch<void>(`permissions/${id}`, { method: 'DELETE' })
}
