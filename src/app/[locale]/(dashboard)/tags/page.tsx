'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import type { Tag } from '@/features/tag'
import { TagFormSheet, TagSearchBar, TagTable } from '@/features/tag'
import { useCreateTag, useDeleteTag, useTags, useUpdateTag } from '@/features/tag/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Tags() {
  const t = useTranslations('tags')
  const [search, setSearch] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)

  const { data: tags = [], isLoading } = useTags()
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
      onSuccess: () => toast.success(t('messages.deleteSuccess')),
      onError: () => toast.error(t('messages.deleteFailed')),
    })
  }

  const handleSubmit = (values: { name: string; color: string }) => {
    if (editingTag) {
      updateMutation.mutate(
        { id: editingTag.id, data: values },
        {
          onSuccess: () => {
            toast.success(t('messages.updateSuccess'))
            setSheetOpen(false)
          },
          onError: () => toast.error(t('messages.updateFailed')),
        }
      )
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success(t('messages.createSuccess'))
          setSheetOpen(false)
        },
        onError: () => toast.error(t('messages.createFailed')),
      })
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>{t('title')}</CardTitle>
          <Button onClick={handleAdd}>
            <Plus size={16} className='mr-1' />
            {t('form.addTitle')}
          </Button>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex items-center gap-2'>
            <TagSearchBar value={search} onChange={setSearch} />
          </div>
          <TagTable
            tags={filteredTags}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <TagFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        tag={editingTag}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
