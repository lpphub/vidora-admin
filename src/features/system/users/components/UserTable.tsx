import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
import type { User, UserStatus } from '../types'

const getStatusBadgeVariant = (status: UserStatus) =>
  status === 'enabled' ? 'default' : 'destructive'

interface UserTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete?: (user: User) => void
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const { t } = useTranslation('users')

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
              <Badge variant='secondary'>{user.role}</Badge>
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
