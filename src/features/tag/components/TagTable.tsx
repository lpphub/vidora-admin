import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import type { Tag } from '../types'

interface TagTableProps {
  tags: Tag[]
  onEdit: (tag: Tag) => void
  onDelete?: (tag: Tag) => void
}

export function TagTable({ tags, onEdit, onDelete }: TagTableProps) {
  const { t } = useTranslation('tags')

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('table.name')}</TableHead>
          <TableHead>{t('table.color')}</TableHead>
          <TableHead>{t('table.usageCount')}</TableHead>
          <TableHead>{t('table.createdAt')}</TableHead>
          <TableHead className='w-25'>{t('table.actions')}</TableHead>
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
