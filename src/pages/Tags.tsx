import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Tag } from '@/features/tag'
import { TagFormSheet, TagSearchBar, TagTable } from '@/features/tag'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

const mockTags: Tag[] = [
  {
    id: '1',
    name: 'JavaScript',
    color: '#f7df1e',
    usageCount: 156,
    createdAt: '2024-01-15 10:30:00',
  },
  {
    id: '2',
    name: 'TypeScript',
    color: '#3178c6',
    usageCount: 89,
    createdAt: '2024-02-20 14:20:00',
  },
  {
    id: '3',
    name: 'React',
    color: '#61dafb',
    usageCount: 234,
    createdAt: '2024-03-10 09:15:00',
  },
  {
    id: '4',
    name: 'Vue',
    color: '#42b883',
    usageCount: 78,
    createdAt: '2024-03-15 16:45:00',
  },
]

export default function Tags() {
  const { t } = useTranslation('tags')
  const [search, setSearch] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)

  const filteredTags = mockTags.filter(tag => tag.name.toLowerCase().includes(search.toLowerCase()))

  const handleAdd = () => {
    setEditingTag(null)
    setSheetOpen(true)
  }

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setSheetOpen(true)
  }

  const handleSubmit = (values: { name: string; color: string }) => {
    console.log('Save:', { ...values, id: editingTag?.id })
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
          <TagTable tags={filteredTags} onEdit={handleEdit} />
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
