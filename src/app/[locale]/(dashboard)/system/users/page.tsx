'use client'

import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserFormSheet, type UserFormValues } from './_components/UserFormSheet'
import { UserSearchBar } from './_components/UserSearchBar'
import { UserTable } from './_components/UserTable'
import { MOCK_USERS, type SystemUser } from './types'

export default function Users() {
  const t = useTranslations('users')
  const [searchLower, setSearchLower] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null)

  const filteredUsers = MOCK_USERS.filter(
    user =>
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
  )

  const handleAdd = () => {
    setEditingUser(null)
    setSheetOpen(true)
  }

  const handleEdit = (user: SystemUser) => {
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
