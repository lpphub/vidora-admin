import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

// Mock data
const mockRoles = [
  {
    id: 1,
    name: '管理员',
    description: '拥有系统所有权限',
    permissionCount: 50,
    createdAt: '2024-01-15 10:30:00',
  },
  {
    id: 2,
    name: '编辑',
    description: '可管理内容和视频',
    permissionCount: 25,
    createdAt: '2024-02-20 14:20:00',
  },
  {
    id: 3,
    name: '访客',
    description: '仅可查看内容',
    permissionCount: 5,
    createdAt: '2024-03-10 09:15:00',
  },
]

const allPermissions = [
  { id: 'user:read', name: '用户查看' },
  { id: 'user:create', name: '用户新增' },
  { id: 'user:update', name: '用户编辑' },
  { id: 'user:delete', name: '用户删除' },
  { id: 'role:read', name: '角色查看' },
  { id: 'role:create', name: '角色新增' },
  { id: 'content:read', name: '内容查看' },
  { id: 'content:create', name: '内容新增' },
]

type Role = (typeof mockRoles)[0]

export default function Roles() {
  const { t } = useTranslation('roles')
  const [search, setSearch] = useState('')
  const [searchLower, setSearchLower] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const roleSchema = z.object({
    name: z.string().min(1, t('form.nameRequired')),
    description: z.string().optional(),
    permissions: z.array(z.string()),
  })

  type RoleFormValues = z.infer<typeof roleSchema>

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      description: '',
      permissions: [],
    },
  })

  const filteredRoles = mockRoles.filter(role => role.name.toLowerCase().includes(searchLower))

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setSearchLower(value.toLowerCase())
  }

  const handleAdd = () => {
    setEditingRole(null)
    form.reset({
      name: '',
      description: '',
      permissions: [],
    })
    setSheetOpen(true)
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    form.reset({
      name: role.name,
      description: role.description,
      permissions: [],
    })
    setSheetOpen(true)
  }

  const onSubmit = (values: RoleFormValues) => {
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('table.name')}</TableHead>
                <TableHead>{t('table.description')}</TableHead>
                <TableHead>{t('table.permissionCount')}</TableHead>
                <TableHead>{t('table.createdAt')}</TableHead>
                <TableHead className='w-[100px]'>{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map(role => (
                <TableRow key={role.id}>
                  <TableCell className='font-medium'>{role.name}</TableCell>
                  <TableCell className='max-w-[300px] truncate'>{role.description}</TableCell>
                  <TableCell>
                    <Badge variant='secondary'>{role.permissionCount}</Badge>
                  </TableCell>
                  <TableCell>{role.createdAt}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      <Button variant='ghost' size='icon-sm' onClick={() => handleEdit(role)}>
                        <Pencil size={14} />
                      </Button>
                      <Button variant='ghost' size='icon-sm' className='text-destructive'>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className='w-[400px] sm:w-[540px]'>
          <SheetHeader>
            <SheetTitle>{editingRole ? t('form.editTitle') : t('form.addTitle')}</SheetTitle>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4 px-6 py-5'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.namePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.description')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t('form.descriptionPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='permissions'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.permissions')}</FormLabel>
                    <FormControl>
                      <div className='grid grid-cols-2 gap-2 p-3 border rounded-lg max-h-[200px] overflow-y-auto'>
                        {allPermissions.map(permission => (
                          <div key={permission.id} className='flex items-center space-x-2'>
                            <Checkbox
                              id={permission.id}
                              checked={field.value?.includes(permission.id)}
                              onCheckedChange={checked => {
                                const newValue = checked
                                  ? [...(field.value || []), permission.id]
                                  : (field.value || []).filter(p => p !== permission.id)
                                field.onChange(newValue)
                              }}
                            />
                            <label htmlFor={permission.id} className='text-sm cursor-pointer'>
                              {permission.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <SheetFooter>
            <Button variant='outline' className='flex-1' onClick={() => setSheetOpen(false)}>
              {t('actions.cancel', { ns: 'common' })}
            </Button>
            <Button className='flex-1' onClick={form.handleSubmit(onSubmit)}>
              {t('actions.save', { ns: 'common' })}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
