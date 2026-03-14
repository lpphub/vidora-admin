import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
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
import { Textarea } from '@/shared/components/ui/textarea'
import type { Role } from '../types'
import { allPermissions } from '../types'

interface RoleFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: Role | null
  onSubmit: (values: { name: string; description?: string; permissions: string[] }) => void
}

export function RoleFormSheet({ open, onOpenChange, role, onSubmit }: RoleFormSheetProps) {
  const { t } = useTranslation('roles')

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
    values: role
      ? { name: role.name, description: role.description, permissions: [] }
      : { name: '', description: '', permissions: [] },
  })

  const handleSubmit = (values: RoleFormValues) => {
    onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-100 sm:w-135'>
        <SheetHeader>
          <SheetTitle>{role ? t('form.editTitle') : t('form.addTitle')}</SheetTitle>
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
                    <div className='grid grid-cols-2 gap-2 p-3 border rounded-lg max-h-50 overflow-y-auto'>
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
