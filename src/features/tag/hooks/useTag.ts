import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tagApi } from '@/features/tag/api'
import type { Tag, TagType } from '@/features/tag/types'

export const tagKeys = {
  all: ['tags'] as const,
  list: (type?: TagType) => [...tagKeys.all, 'list', type] as const,
}

export function useTags(type?: TagType) {
  return useQuery({
    queryKey: tagKeys.list(type),
    queryFn: () => tagApi.list({ type }),
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Tag>) => tagApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all })
    },
  })
}

export function useUpdateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Tag> }) => tagApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all })
    },
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => tagApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all })
    },
  })
}
