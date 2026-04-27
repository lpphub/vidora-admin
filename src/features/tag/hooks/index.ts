import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bff } from '@/lib/bff'
import type { Tag } from '@/features/tag/types'

export const tagKeys = {
  all: ['tags'] as const,
  list: () => [...tagKeys.all, 'list'] as const,
}

export function useTags() {
  return useQuery({
    queryKey: tagKeys.list(),
    queryFn: () => bff.get<Tag[]>('tags'),
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Tag>) => bff.post<Tag>('tags', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tagKeys.all }),
  })
}

export function useUpdateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Tag> }) =>
      bff.put<Tag>(`tags/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tagKeys.all }),
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => bff.delete(`tags/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tagKeys.all }),
  })
}
