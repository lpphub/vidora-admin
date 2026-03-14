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
    mutationFn: ({ id }: { id: string; type: TagType }) => tagApi.delete(id),
    onMutate: async ({ id, type }) => {
      await queryClient.cancelQueries({ queryKey: tagKeys.list(type) })

      const previousTags = queryClient.getQueryData<Tag[]>(tagKeys.list(type))

      queryClient.setQueryData<Tag[]>(
        tagKeys.list(type),
        old => old?.filter(t => t.id !== id) || []
      )

      return { previousTags, type }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTags) {
        queryClient.setQueryData(tagKeys.list(context.type), context.previousTags)
      }
    },
    onSettled: (_data, _err, _vars, context) => {
      queryClient.invalidateQueries({ queryKey: tagKeys.list(context?.type) })
    },
  })
}
