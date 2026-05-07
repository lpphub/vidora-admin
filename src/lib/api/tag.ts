import { serverFetch } from '@/lib/http/server'
import type { Tag } from '@/types/tag'

const MOCK_TAGS: Tag[] = [
  { id: '1', name: '动作', color: '#ef4444', usageCount: 120, createdAt: '2024-01-15' },
  { id: '2', name: '喜剧', color: '#22c55e', usageCount: 85, createdAt: '2024-01-16' },
  { id: '3', name: '科幻', color: '#3b82f6', usageCount: 64, createdAt: '2024-02-10' },
]

export function getTags() {
  if (process.env.ENABLE_MOCKS === 'true') return Promise.resolve(MOCK_TAGS)
  return serverFetch<Tag[]>('tags')
}

export function createTag(data: Partial<Tag>) {
  if (process.env.ENABLE_MOCKS === 'true') {
    return Promise.resolve({ id: String(Date.now()), ...data, usageCount: 0, createdAt: new Date().toISOString().split('T')[0] } as Tag)
  }
  return serverFetch<Tag>('tags', { method: 'POST', body: JSON.stringify(data) })
}

export function updateTag(id: string, data: Partial<Tag>) {
  if (process.env.ENABLE_MOCKS === 'true') return Promise.resolve({ id, ...data } as Tag)
  return serverFetch<Tag>(`tags/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function deleteTag(id: string) {
  if (process.env.ENABLE_MOCKS === 'true') return Promise.resolve(undefined as void)
  return serverFetch<void>(`tags/${id}`, { method: 'DELETE' })
}
