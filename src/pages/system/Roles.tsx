import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { mockRoles, type Role, RoleFormSheet, RoleTable } from '@/features/system/roles'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'

export default function Roles() {
  const { t } = useTranslation('roles')
  const [search, setSearch] = useState('')
  const [searchLower, setSearchLower] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const filteredRoles = mockRoles.filter(role => role.name.toLowerCase().includes(searchLower))

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setSearchLower(value.toLowerCase())
  }

  const handleAdd = () => {
    setEditingRole(null)
    setSheetOpen(true)
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setSheetOpen(true)
  }

  const handleSubmit = (values: { name: string; description?: string; permissions: string[] }) => {
    console.log('Save:', { ...values, id: editingRole?.id })
    setSheetOpen(false)
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
            <div className='relative flex-1 max-w-sm'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder={t('search.placeholder')}
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
                className='pl-9'
              />
            </div>
          </div>
          <RoleTable roles={filteredRoles} onEdit={handleEdit} />
        </CardContent>
      </Card>

      <RoleFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        role={editingRole}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
