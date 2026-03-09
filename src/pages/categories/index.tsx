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
const mockCategories = [
  {
    id: 1,
    name: '前端开发',
    sort: 1,
    contentCount: 156,
    status: 'enabled',
    createdAt: '2024-01-15 10:30:00',
  },
  {
    id: 2,
    name: '后端开发',
    sort: 2,
    contentCount: 89,
    status: 'enabled',
    createdAt: '2024-02-20 14:20:00',
  },
  {
    id: 3,
    name: 'UI设计',
    sort: 3,
    contentCount: 45,
    status: 'enabled',
    createdAt: '2024-03-10 09:15:00',
  },
  {
    id: 4,
    name: '产品运营',
    sort: 4,
    contentCount: 23,
    status: 'disabled',
    createdAt: '2024-03-15 16:45:00',
  },
]

type Category = (typeof mockCategories)[0]

const getStatusBadgeVariant = (status: string) => (status === 'enabled' ? 'default' : 'destructive')

export default function Categories() {
  const { t } = useTranslation('categories')
  const [search, setSearch] = useState('')
  const [searchLower, setSearchLower] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const categorySchema = z.object({
    name: z.string().min(1, t('form.nameRequired')),
    sort: z.number().int().min(0, t('form.sortMin')),
    status: z.boolean(),
  })

  type CategoryFormValues = z.infer<typeof categorySchema>

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      sort: 0,
      status: true,
    },
  })

  const filteredCategories = mockCategories.filter(category =>
    category.name.toLowerCase().includes(searchLower)
  )

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setSearchLower(value.toLowerCase())
  }

  const handleAdd = () => {
    setEditingCategory(null)
    form.reset({
      name: '',
      sort: 0,
      status: true,
    })
    setSheetOpen(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    form.reset({
      name: category.name,
      sort: category.sort,
      status: category.status === 'enabled',
    })
    setSheetOpen(true)
  }

  const onSubmit = (values: CategoryFormValues) => {
    console.log('Save:', { ...values, id: editingCategory?.id })
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
                <TableHead className='w-[80px]'>{t('table.sort')}</TableHead>
                <TableHead>{t('table.contentCount')}</TableHead>
                <TableHead>{t('table.status')}</TableHead>
                <TableHead>{t('table.createdAt')}</TableHead>
                <TableHead className='w-[100px]'>{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map(category => (
                <TableRow key={category.id}>
                  <TableCell className='font-medium'>{category.name}</TableCell>
                  <TableCell>
                    <Badge variant='outline'>{category.sort}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant='secondary'>{category.contentCount}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(category.status)}>
                      {category.status === 'enabled' ? t('status.enabled') : t('status.disabled')}
                    </Badge>
                  </TableCell>
                  <TableCell>{category.createdAt}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      <Button variant='ghost' size='icon-sm' onClick={() => handleEdit(category)}>
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
            <SheetTitle>{editingCategory ? t('form.editTitle') : t('form.addTitle')}</SheetTitle>
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
                name='sort'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.sort')}</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder={t('form.sortPlaceholder')}
                        value={field.value}
                        onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)}
                      />
                    </FormControl>
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
