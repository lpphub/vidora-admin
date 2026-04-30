'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateTag, useDeleteTag, useTags, useUpdateTag } from '@/hooks/tag'
import type { Tag } from '@/types/tag'
import { TagFormSheet } from './TagFormSheet'
import { TagSearchBar } from './TagSearchBar'
import { TagTable } from './TagTable'

interface TagsTranslations {
  title: string
  addTitle: string
  deleteSuccess: string
  deleteFailed: string
  updateSuccess: string
  updateFailed: string
  createSuccess: string
  createFailed: string
  searchPlaceholder: string
  table: {
    name: string
    color: string
    usageCount: string
    createdAt: string
    actions: string
  }
  form: {
    editTitle: string
    addTitle: string
    name: string
    namePlaceholder: string
    nameRequired: string
    color: string
    colorRequired: string
    cancel: string
    save: string
  }
}

export function TagsClient({
  initialTags,
  translations: t,
}: {
  initialTags: Tag[]
  translations: TagsTranslations
}) {
  const [search, setSearch] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)

  const { data: tags = initialTags } = useTags()
  const createMutation = useCreateTag()
  const updateMutation = useUpdateTag()
  const deleteMutation = useDeleteTag()

  const filteredTags = tags.filter(tag => tag.name.toLowerCase().includes(search.toLowerCase()))

  const handleAdd = () => {
    setEditingTag(null)
    setSheetOpen(true)
  }

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setSheetOpen(true)
  }

  const handleDelete = (tag: Tag) => {
    deleteMutation.mutate(tag.id, {
      onSuccess: () => toast.success(t.deleteSuccess),
      onError: () => toast.error(t.deleteFailed),
    })
  }

  const handleSubmit = (values: { name: string; color: string }) => {
    if (editingTag) {
      updateMutation.mutate(
        { id: editingTag.id, data: values },
        {
          onSuccess: () => {
            toast.success(t.updateSuccess)
            setSheetOpen(false)
          },
          onError: () => toast.error(t.updateFailed),
        }
      )
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success(t.createSuccess)
          setSheetOpen(false)
        },
        onError: () => toast.error(t.createFailed),
      })
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>{t.title}</CardTitle>
          <Button onClick={handleAdd}>
            <Plus size={16} className='mr-1' />
            {t.addTitle}
          </Button>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex items-center gap-2'>
            <TagSearchBar value={search} onChange={setSearch} placeholder={t.searchPlaceholder} />
          </div>
          <TagTable
            tags={filteredTags}
            onEdit={handleEdit}
            onDelete={handleDelete}
            translations={t.table}
          />
        </CardContent>
      </Card>

      <TagFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        tag={editingTag}
        onSubmit={handleSubmit}
        translations={t.form}
      />
    </div>
  )
}
