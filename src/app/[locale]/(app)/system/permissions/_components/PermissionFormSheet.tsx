import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
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
import type { Permission, PermissionType } from '../types'
import { permissionTypes } from '../types'

interface PermissionFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  permission?: Permission | null
  onSubmit: (values: { name: string; code: string; type: PermissionType; status: boolean }) => void
}

export function PermissionFormSheet({
  open,
  onOpenChange,
  permission,
  onSubmit,
}: PermissionFormSheetProps) {
  const t = useTranslations('permissions')
  const tc = useTranslations('common')

  const permissionSchema = z.object({
    name: z.string().min(1, t('form.nameRequired')),
    code: z.string().min(1, t('form.codeRequired')),
    type: z.enum(permissionTypes as [PermissionType, ...PermissionType[]]),
    status: z.boolean(),
  })

  type PermissionFormValues = z.infer<typeof permissionSchema>

  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: permission?.name ?? '',
      code: permission?.code ?? '',
      type: permission?.type,
      status: permission ? permission.status === 'enabled' : true,
    },
    values: permission
      ? {
          name: permission.name,
          code: permission.code,
          type: permission.type,
          status: permission.status === 'enabled',
        }
      : { name: '', code: '', type: undefined as unknown as PermissionType, status: true },
  })

  const handleSubmit = (values: PermissionFormValues) => {
    onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-80 sm:w-100'>
        <SheetHeader>
          <SheetTitle>{permission ? t('form.editTitle') : t('form.addTitle')}</SheetTitle>
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
          <Button variant='outline' className='flex-1' onClick={() => onOpenChange(false)}>
            {tc('actions.cancel')}
          </Button>
          <Button className='flex-1' onClick={form.handleSubmit(handleSubmit)}>
            {tc('actions.save')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
