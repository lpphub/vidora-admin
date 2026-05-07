import useSWR, { mutate } from 'swr'
import { clientFetch } from '@/lib/http/client'
import type { Tag } from '@/types/tag'

export const TAGS_KEY = 'tags'

export function useTags() {
  return useSWR(TAGS_KEY, (path) => clientFetch<Tag[]>(path))
}

export async function createTag(data: Partial<Tag>) {
  await clientFetch(TAGS_KEY, { method: 'POST', body: JSON.stringify(data) })
  await mutate(TAGS_KEY)
}

export async function updateTag(id: string, data: Partial<Tag>) {
  await clientFetch(`${TAGS_KEY}/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  await mutate(TAGS_KEY)
}

export async function deleteTag(id: string) {
  await clientFetch(`${TAGS_KEY}/${id}`, { method: 'DELETE' })
  await mutate(TAGS_KEY)
}
