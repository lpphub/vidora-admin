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

const MOCK_USERS = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@vidora.com',
    role: '管理员',
    status: 'enabled',
    createdAt: '2024-01-15 10:30:00',
  },
  {
    id: 2,
    username: 'editor',
    email: 'editor@vidora.com',
    role: '编辑',
    status: 'enabled',
    createdAt: '2024-02-20 14:20:00',
  },
  {
    id: 3,
    username: 'viewer',
    email: 'viewer@vidora.com',
    role: '访客',
    status: 'disabled',
    createdAt: '2024-03-10 09:15:00',
  },
]

const ROLES = ['管理员', '编辑', '访客']

type User = (typeof MOCK_USERS)[0]

const getStatusBadgeVariant = (status: string) => (status === 'enabled' ? 'default' : 'destructive')

function createUserSchema(t: (key: string) => string) {
  return z.object({
    username: z.string().min(1, t('form.usernameRequired')),
    email: z.string().email(t('form.emailInvalid')).min(1, t('form.emailRequired')),
    password: z.string().optional(),
    role: z.string().min(1, t('form.roleRequired')),
    status: z.boolean(),
  })
}

type UserFormValues = z.infer<ReturnType<typeof createUserSchema>>

const DEFAULT_FORM_VALUES: UserFormValues = {
  username: '',
  email: '',
  password: '',
  role: '',
  status: true,
}

export default function Users() {
  const { t } = useTranslation('users')
  const [search, setSearch] = useState('')
  const [searchLower, setSearchLower] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const userSchema = createUserSchema(t)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  })

  const filteredUsers = MOCK_USERS.filter(
    user =>
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
  )

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setSearchLower(value.toLowerCase())
  }

  const handleAdd = () => {
    setEditingUser(null)
    form.reset(DEFAULT_FORM_VALUES)
    setSheetOpen(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    form.reset({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status === 'enabled',
    })
    setSheetOpen(true)
  }

  const onSubmit = (values: UserFormValues) => {
    console.log('Save:', { ...values, id: editingUser?.id })
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
                <TableHead>{t('table.username')}</TableHead>
                <TableHead>{t('table.email')}</TableHead>
                <TableHead>{t('table.role')}</TableHead>
                <TableHead>{t('table.status')}</TableHead>
                <TableHead>{t('table.createdAt')}</TableHead>
                <TableHead className='w-25'>{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
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
                      <Button variant='ghost' size='icon-sm' onClick={() => handleEdit(user)}>
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

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className='w-100 sm:w-135'>
          <SheetHeader>
            <SheetTitle>{editingUser ? t('form.editTitle') : t('form.addTitle')}</SheetTitle>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4 px-6 py-5'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.username')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.usernamePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.email')}</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder={t('form.emailPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!editingUser && (
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.password')}</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder={t('form.passwordPlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.role')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('form.rolePlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ROLES.map(role => (
                          <SelectItem key={role} value={role}>
                            {role}
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
                          {field.value ? t('form.statusEnabled') : t('form.statusDisabled')}
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
