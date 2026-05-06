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
import type { SystemUser, UserStatus } from '../types'
import { ROLES } from '../types'

const roleLabelMap = Object.fromEntries(ROLES.map(r => [r.value, r.labelKey]))

const getStatusBadgeVariant = (status: UserStatus) =>
  status === 'enabled' ? 'default' : 'destructive'

interface UserTableProps {
  users: SystemUser[]
  onEdit: (user: SystemUser) => void
  onDelete?: (user: SystemUser) => void
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const t = useTranslations('users')

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('table.username')}</TableHead>
          <TableHead>{t('table.email')}</TableHead>
          <TableHead>{t('table.role')}</TableHead>
          <TableHead>{t('table.status')}</TableHead>
          <TableHead>{t('table.createdAt')}</TableHead>
          <TableHead className='w-25'>{t('table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <TableRow key={user.id}>
            <TableCell className='font-medium'>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant='secondary'>{t(roleLabelMap[user.role] ?? user.role)}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(user.status)}>
                {user.status === 'enabled' ? t('status.enabled') : t('status.disabled')}
              </Badge>
            </TableCell>
            <TableCell>{user.createdAt}</TableCell>
            <TableCell>
              <div className='flex items-center gap-1'>
                <Button variant='ghost' size='icon-sm' onClick={() => onEdit(user)}>
                  <Pencil size={14} />
                </Button>
                {onDelete && (
                  <Button
                    variant='ghost'
                    size='icon-sm'
                    className='text-destructive'
                    onClick={() => onDelete(user)}
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
