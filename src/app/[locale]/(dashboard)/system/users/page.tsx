'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  UserFormSheet,
  type UserFormValues,
  UserSearchBar,
  UserTable,
} from '@/features/system/users'
import { MOCK_USERS, type User } from '@/features/system/users/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Users() {
  const t = useTranslations('users')
  const [searchLower, setSearchLower] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const filteredUsers = MOCK_USERS.filter(
    user =>
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
  )

  const handleAdd = () => {
    setEditingUser(null)
    setSheetOpen(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setSheetOpen(true)
  }

  const handleSubmit = (values: UserFormValues) => {
    console.log('Save:', { ...values, id: editingUser?.id })
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
            <UserSearchBar value={searchLower} onChange={setSearchLower} />
          </div>
          <UserTable users={filteredUsers} onEdit={handleEdit} />
        </CardContent>
      </Card>

      <UserFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        user={editingUser}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
