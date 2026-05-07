import { serverFetch } from '@/lib/http/server'

export interface RoleItem {
  id: string
  name: string
  description: string
  permissions: string[]
  createdAt: string
}

export function getRoles() {
  return serverFetch<RoleItem[]>('roles')
}

export function createRole(data: Partial<RoleItem>) {
  return serverFetch<RoleItem>('roles', { method: 'POST', body: JSON.stringify(data) })
}

export function updateRole(id: string, data: Partial<RoleItem>) {
  return serverFetch<RoleItem>(`roles/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function deleteRole(id: string) {
  return serverFetch<void>(`roles/${id}`, { method: 'DELETE' })
}
