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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Mock data
const mockTags = [
  {
    id: 1,
    name: 'JavaScript',
    color: '#f7df1e',
    usageCount: 156,
    createdAt: '2024-01-15 10:30:00',
  },
  {
    id: 2,
    name: 'TypeScript',
    color: '#3178c6',
    usageCount: 89,
    createdAt: '2024-02-20 14:20:00',
  },
  {
    id: 3,
    name: 'React',
    color: '#61dafb',
    usageCount: 234,
    createdAt: '2024-03-10 09:15:00',
  },
  {
    id: 4,
    name: 'Vue',
    color: '#42b883',
    usageCount: 78,
    createdAt: '2024-03-15 16:45:00',
  },
]

const presetColors = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
]

type Tag = (typeof mockTags)[0]

export default function Tags() {
  const { t } = useTranslation('tags')
  const [search, setSearch] = useState('')
  const [searchLower, setSearchLower] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)

  const tagSchema = z.object({
    name: z.string().min(1, t('form.nameRequired')),
    color: z.string().min(1, t('form.colorRequired')),
  })

  type TagFormValues = z.infer<typeof tagSchema>

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: '',
      color: '#3b82f6',
    },
  })

  const filteredTags = mockTags.filter(tag => tag.name.toLowerCase().includes(searchLower))

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setSearchLower(value.toLowerCase())
  }

  const handleAdd = () => {
    setEditingTag(null)
    form.reset({
      name: '',
      color: '#3b82f6',
    })
    setSheetOpen(true)
  }

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    form.reset({
      name: tag.name,
      color: tag.color,
    })
    setSheetOpen(true)
  }

  const onSubmit = (values: TagFormValues) => {
    console.log('Save:', { ...values, id: editingTag?.id })
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
                <TableHead>{t('table.color')}</TableHead>
                <TableHead>{t('table.usageCount')}</TableHead>
                <TableHead>{t('table.createdAt')}</TableHead>
                <TableHead className='w-[100px]'>{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTags.map(tag => (
                <TableRow key={tag.id}>
                  <TableCell className='font-medium'>
                    <div className='flex items-center gap-2'>
                      <div
                        className='w-3 h-3 rounded-full'
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <div
                        className='w-6 h-6 rounded border'
                        style={{ backgroundColor: tag.color }}
                      />
                      <code className='text-sm text-muted-foreground'>{tag.color}</code>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant='secondary'>{tag.usageCount}</Badge>
                  </TableCell>
                  <TableCell>{tag.createdAt}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      <Button variant='ghost' size='icon-sm' onClick={() => handleEdit(tag)}>
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
            <SheetTitle>{editingTag ? t('form.editTitle') : t('form.addTitle')}</SheetTitle>
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
                name='color'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.color')}</FormLabel>
                    <FormControl>
                      <div className='flex items-center gap-3'>
                        <div
                          className='w-10 h-10 rounded-lg border shadow-sm'
                          style={{ backgroundColor: field.value }}
                        />
                        <Input type='text' {...field} className='w-32' />
                        <input
                          type='color'
                          value={field.value}
                          onChange={field.onChange}
                          className='w-10 h-10 rounded cursor-pointer'
                        />
                      </div>
                    </FormControl>
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {presetColors.map(color => (
                        <button
                          key={color}
                          type='button'
                          className={`w-6 h-6 rounded-md border-2 transition-all ${
                            field.value === color
                              ? 'border-primary scale-110'
                              : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => field.onChange(color)}
                        />
                      ))}
                    </div>
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
