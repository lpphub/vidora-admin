import { Pencil, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
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
import type { Role } from '../types'

const roleNameKeys: Record<string, string> = {
  admin: 'roleNames.admin',
  editor: 'roleNames.editor',
  viewer: 'roleNames.viewer',
}

interface RoleTableProps {
  roles: Role[]
  onEdit: (role: Role) => void
  onDelete?: (role: Role) => void
}

export function RoleTable({ roles, onEdit, onDelete }: RoleTableProps) {
  const t = useTranslations('roles')

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('table.name')}</TableHead>
          <TableHead>{t('table.description')}</TableHead>
          <TableHead>{t('table.permissionCount')}</TableHead>
          <TableHead>{t('table.createdAt')}</TableHead>
          <TableHead className='w-25'>{t('table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map(role => (
          <TableRow key={role.id}>
            <TableCell className='font-medium'>
              {roleNameKeys[role.name] ? t(roleNameKeys[role.name]) : role.name}
            </TableCell>
            <TableCell className='max-w-75 truncate'>{t(role.description)}</TableCell>
            <TableCell>
              <Badge variant='secondary'>{role.permissionCount}</Badge>
            </TableCell>
            <TableCell>{role.createdAt}</TableCell>
            <TableCell>
              <div className='flex items-center gap-1'>
                <Button variant='ghost' size='icon-sm' onClick={() => onEdit(role)}>
                  <Pencil size={14} />
                </Button>
                {onDelete && (
                  <Button
                    variant='ghost'
                    size='icon-sm'
                    className='text-destructive'
                    onClick={() => onDelete(role)}
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
