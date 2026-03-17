import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet'
import type { Tag } from '../types'
import { PRESET_COLORS } from '../types'

interface TagFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tag?: Tag | null
  onSubmit: (values: { name: string; color: string }) => void
}

export function TagFormSheet({ open, onOpenChange, tag, onSubmit }: TagFormSheetProps) {
  const { t } = useTranslation('tags')

  const tagSchema = z.object({
    name: z.string().min(1, t('form.nameRequired')),
    color: z.string().min(1, t('form.colorRequired')),
  })

  type TagFormValues = z.infer<typeof tagSchema>

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: tag?.name ?? '',
      color: tag?.color ?? '#3b82f6',
    },
    values: tag
      ? { name: tag.name, color: tag.color ?? '#3b82f6' }
      : { name: '', color: '#3b82f6' },
  })

  const handleSubmit = (values: TagFormValues) => {
    onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-80 sm:w-100'>
        <SheetHeader>
          <SheetTitle>{tag ? t('form.editTitle') : t('form.addTitle')}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='grid gap-4 px-6 py-5'>
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
                    {PRESET_COLORS.map(color => (
                      <button
                        key={color}
                        type='button'
                        className={`w-6 h-6 rounded-md border-2 transition-all ${
                          field.value === color ? 'border-primary scale-110' : 'border-transparent'
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
          <Button variant='outline' className='flex-1' onClick={() => onOpenChange(false)}>
            {t('actions.cancel', { ns: 'common' })}
          </Button>
          <Button className='flex-1' onClick={form.handleSubmit(handleSubmit)}>
            {t('actions.save', { ns: 'common' })}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
