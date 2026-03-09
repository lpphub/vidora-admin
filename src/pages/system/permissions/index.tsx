import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Mock data
const mockPermissions = [
  {
    id: 1,
    name: '用户查看',
    code: 'user:read',
    type: 'menu',
    status: 'enabled',
    createdAt: '2024-01-15 10:30:00',
  },
  {
    id: 2,
    name: '用户新增',
    code: 'user:create',
    type: 'button',
    status: 'enabled',
    createdAt: '2024-01-15 10:35:00',
  },
  {
    id: 3,
    name: '用户删除',
    code: 'user:delete',
    type: 'api',
    status: 'disabled',
    createdAt: '2024-02-20 14:20:00',
  },
  {
    id: 4,
    name: '角色管理',
    code: 'role:manage',
    type: 'menu',
    status: 'enabled',
    createdAt: '2024-03-10 09:15:00',
  },
]

const permissionTypes = ['menu', 'button', 'api'] as const

type Permission = (typeof mockPermissions)[0]

const getTypeBadgeVariant = (type: string) => {
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

export default function Permissions() {
  const { t } = useTranslation('permissions')
  const [search, setSearch] = useState('')
  const [searchLower, setSearchLower] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)

  const permissionSchema = z.object({
    name: z.string().min(1, t('form.nameRequired')),
    code: z.string().min(1, t('form.codeRequired')),
    type: z.enum(permissionTypes),
    status: z.boolean(),
  })

  type PermissionFormValues = z.infer<typeof permissionSchema>

  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: '',
      code: '',
      type: undefined,
      status: true,
    },
  })

  const filteredPermissions = mockPermissions.filter(
    permission =>
      permission.name.toLowerCase().includes(searchLower) ||
      permission.code.toLowerCase().includes(searchLower)
  )

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setSearchLower(value.toLowerCase())
  }

  const handleAdd = () => {
    setEditingPermission(null)
    form.reset({
      name: '',
      code: '',
      type: undefined,
      status: true,
    })
    setSheetOpen(true)
  }

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission)
    form.reset({
      name: permission.name,
      code: permission.code,
      type: permission.type as (typeof permissionTypes)[number],
      status: permission.status === 'enabled',
    })
    setSheetOpen(true)
  }

  const onSubmit = (values: PermissionFormValues) => {
    console.log('Save:', { ...values, id: editingPermission?.id })
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
                <TableHead>{t('table.code')}</TableHead>
                <TableHead>{t('table.type')}</TableHead>
                <TableHead>{t('table.status')}</TableHead>
                <TableHead>{t('table.createdAt')}</TableHead>
                <TableHead className='w-[100px]'>{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermissions.map(permission => (
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
                      <Button variant='ghost' size='icon-sm' onClick={() => handleEdit(permission)}>
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
            <SheetTitle>{editingPermission ? t('form.editTitle') : t('form.addTitle')}</SheetTitle>
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
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.code')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.codePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.type')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('form.typePlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {permissionTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {t(`type.${type}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='flex items-center justify-between rounded-lg'>
                    <FormLabel>{t('form.status')}</FormLabel>
                    <FormControl>
                      <div className='flex items-center gap-2'>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                        <span className='text-sm text-muted-foreground'>
                          {field.value ? t('status.enabled') : t('status.disabled')}
                        </span>
                      </div>
                    </FormControl>
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
