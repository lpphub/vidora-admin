import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'

export default function Security() {
  const { t } = useTranslation('profile')
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordSchema = z
    .object({
      oldPassword: z.string().min(1, t('security.passwordRequired')),
      newPassword: z.string().min(6, t('security.passwordMinLength')),
      confirmPassword: z.string().min(1, t('security.passwordRequired')),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
      message: t('security.passwordMismatch'),
      path: ['confirmPassword'],
    })

  type PasswordFormValues = z.infer<typeof passwordSchema>

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const handleSubmit = () => {
    toast.success(t('toast.passwordUpdated'))
    form.reset()
    setShowOldPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
  }

  return (
    <Card>
      <CardContent className='pt-6'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='oldPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('security.currentPassword')}</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showOldPassword ? 'text' : 'password'}
                        {...field}
                        className='pr-10'
                      />
                      <button
                        type='button'
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('security.newPassword')}</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        {...field}
                        className='pr-10'
                      />
                      <button
                        type='button'
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('security.confirmPassword')}</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...field}
                        className='pr-10'
                      />
                      <button
                        type='button'
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end pt-2'>
              <Button type='submit'>{t('security.updatePassword')}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
