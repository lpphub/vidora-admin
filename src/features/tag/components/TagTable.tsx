import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Tag } from '../types'

interface TagTableProps {
  tags: Tag[]
  isLoading?: boolean
  onEdit: (tag: Tag) => void
  onDelete?: (tag: Tag) => void
}

function TagRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className='flex items-center gap-2'>
          <Skeleton className='w-3 h-3 rounded-full' />
          <Skeleton className='h-4 w-20' />
        </div>
      </TableCell>
      <TableCell>
        <div className='flex items-center gap-2'>
          <Skeleton className='w-6 h-6 rounded' />
          <Skeleton className='h-4 w-16' />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className='h-5 w-10' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-4 w-28' />
      </TableCell>
      <TableCell>
        <div className='flex items-center gap-1'>
          <Skeleton className='h-7 w-7' />
          <Skeleton className='h-7 w-7' />
        </div>
      </TableCell>
    </TableRow>
  )
}

export function TagTable({ tags, isLoading, onEdit, onDelete }: TagTableProps) {
  const { t } = useTranslation('tags')

  if (isLoading) {
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
          {[0, 1, 2, 3, 4].map(i => (
            <TagRowSkeleton key={`skeleton-${i}`} />
          ))}
        </TableBody>
      </Table>
    )
  }

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
