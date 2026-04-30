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
import type { SystemUser } from '../types'
import { ROLES } from '../types'

interface UserFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: SystemUser | null
  onSubmit: (values: UserFormValues) => void
}

export interface UserFormValues {
  username: string
  email: string
  password?: string
  role: string
  status: boolean
}

function createUserSchema(t: (key: string) => string) {
  return z.object({
    username: z.string().min(1, t('form.usernameRequired')),
    email: z.string().email(t('form.emailInvalid')).min(1, t('form.emailRequired')),
    password: z.string().optional(),
    role: z.string().min(1, t('form.roleRequired')),
    status: z.boolean(),
  })
}

const DEFAULT_VALUES: UserFormValues = {
  username: '',
  email: '',
  password: '',
  role: '',
  status: true,
}

export function UserFormSheet({ open, onOpenChange, user, onSubmit }: UserFormSheetProps) {
  const t = useTranslations('users')
  const tc = useTranslations('common')
  const userSchema = createUserSchema(t)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: DEFAULT_VALUES,
    values: user
      ? {
          username: user.username,
          email: user.email,
          password: '',
          role: user.role,
          status: user.status === 'enabled',
        }
      : DEFAULT_VALUES,
  })

  const handleSubmit = (values: UserFormValues) => {
    onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-80 sm:w-100'>
        <SheetHeader>
          <SheetTitle>{user ? t('form.editTitle') : t('form.addTitle')}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='grid gap-4 px-6 py-5'>
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
            {!user && (
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
                        <SelectItem key={role.value} value={role.value}>
                          {t(role.labelKey)}
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
