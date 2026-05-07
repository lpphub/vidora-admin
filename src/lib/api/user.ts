import { serverFetch } from '@/lib/http/server'

export interface UserItem {
  id: string
  username: string
  email: string
  role: string
  status: string
  createdAt: string
}

export function getUsers() {
  return serverFetch<UserItem[]>('users')
}

export function getUser(id: string) {
  return serverFetch<UserItem>(`users/${id}`)
}

export function createUser(data: Partial<UserItem>) {
  return serverFetch<UserItem>('users', { method: 'POST', body: JSON.stringify(data) })
}

export function updateUser(id: string, data: Partial<UserItem>) {
  return serverFetch<UserItem>(`users/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function deleteUser(id: string) {
  return serverFetch<void>(`users/${id}`, { method: 'DELETE' })
}
