import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Tag } from '@/types/tag'

interface TagTableTranslations {
  name: string
  color: string
  usageCount: string
  createdAt: string
  actions: string
}

interface TagTableProps {
  tags: Tag[]
  onEdit: (tag: Tag) => void
  onDelete?: (tag: Tag) => void
  translations: TagTableTranslations
}

export function TagTable({ tags, onEdit, onDelete, translations: t }: TagTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t.name}</TableHead>
          <TableHead>{t.color}</TableHead>
          <TableHead>{t.usageCount}</TableHead>
          <TableHead>{t.createdAt}</TableHead>
          <TableHead className='w-25'>{t.actions}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tags.map(tag => (
          <TableRow key={tag.id}>
            <TableCell className='font-medium'>
              <div className='flex items-center gap-2'>
                {tag.color && (
                  <div className='w-3 h-3 rounded-full' style={{ backgroundColor: tag.color }} />
                )}
                {tag.name}
              </div>
            </TableCell>
            <TableCell>
              {tag.color && (
                <div className='flex items-center gap-2'>
                  <div className='w-6 h-6 rounded border' style={{ backgroundColor: tag.color }} />
                  <code className='text-sm text-muted-foreground'>{tag.color}</code>
                </div>
              )}
            </TableCell>
            <TableCell>
              {tag.usageCount !== undefined && <Badge variant='secondary'>{tag.usageCount}</Badge>}
            </TableCell>
            <TableCell>{tag.createdAt}</TableCell>
            <TableCell>
              <div className='flex items-center gap-1'>
                <Button variant='ghost' size='icon-sm' onClick={() => onEdit(tag)}>
                  <Pencil size={14} />
                </Button>
                {onDelete && (
                  <Button
                    variant='ghost'
                    size='icon-sm'
                    className='text-destructive'
                    onClick={() => onDelete(tag)}
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
