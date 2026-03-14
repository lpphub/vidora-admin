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
import type { Permission, PermissionType } from '../types'

interface PermissionTableProps {
  permissions: Permission[]
  onEdit: (permission: Permission) => void
  onDelete?: (permission: Permission) => void
}

function getTypeBadgeVariant(type: PermissionType) {
  switch (type) {
    case 'menu':
      return 'default'
    case 'button':
      return 'secondary'
    case 'api':
      return 'outline'
    default:
      return 'secondary'
  }
}

export function PermissionTable({ permissions, onEdit, onDelete }: PermissionTableProps) {
  const { t } = useTranslation('permissions')

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('table.name')}</TableHead>
          <TableHead>{t('table.code')}</TableHead>
          <TableHead>{t('table.type')}</TableHead>
          <TableHead>{t('table.status')}</TableHead>
          <TableHead>{t('table.createdAt')}</TableHead>
          <TableHead className='w-25'>{t('table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {permissions.map(permission => (
          <TableRow key={permission.id}>
            <TableCell className='font-medium'>{permission.name}</TableCell>
            <TableCell>
              <code className='px-2 py-1 bg-muted rounded text-sm'>{permission.code}</code>
            </TableCell>
            <TableCell>
              <Badge variant={getTypeBadgeVariant(permission.type)}>
                {t(`type.${permission.type}`)}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={permission.status === 'enabled' ? 'default' : 'destructive'}>
                {permission.status === 'enabled' ? t('status.enabled') : t('status.disabled')}
              </Badge>
            </TableCell>
            <TableCell>{permission.createdAt}</TableCell>
            <TableCell>
              <div className='flex items-center gap-1'>
                <Button variant='ghost' size='icon-sm' onClick={() => onEdit(permission)}>
                  <Pencil size={14} />
                </Button>
                {onDelete && (
                  <Button
                    variant='ghost'
                    size='icon-sm'
                    className='text-destructive'
                    onClick={() => onDelete(permission)}
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
