'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useChangePassword } from '@/hooks/profile'

interface SecurityTranslations {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  updatePassword: string
  updating: string
  passwordRequired: string
  passwordMinLength: string
  passwordMismatch: string
}

interface ToastTranslations {
  profileUpdated: string
  profileUpdateFailed: string
  passwordUpdated: string
  passwordUpdateFailed: string
}

export function Security({
  translations: t,
  toastTranslations: tt,
}: {
  translations: SecurityTranslations
  toastTranslations: ToastTranslations
}) {
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const changePassword = useChangePassword()

  const passwordSchema = z
    .object({
      oldPassword: z.string().min(1, t.passwordRequired),
      newPassword: z.string().min(6, t.passwordMinLength),
      confirmPassword: z.string().min(1, t.passwordRequired),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
      message: t.passwordMismatch,
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

  const onSubmit = (data: PasswordFormValues) => {
    changePassword.mutate(
      { oldPassword: data.oldPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          toast.success(tt.passwordUpdated)
          form.reset()
          setShowOldPassword(false)
          setShowNewPassword(false)
          setShowConfirmPassword(false)
        },
        onError: () => {
          toast.error(tt.passwordUpdateFailed)
        },
      }
    )
  }

  return (
    <Card>
      <CardContent className='pt-6'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='oldPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.currentPassword}</FormLabel>
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
                  <FormLabel>{t.newPassword}</FormLabel>
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
                  <FormLabel>{t.confirmPassword}</FormLabel>
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
              <Button type='submit' disabled={changePassword.isPending}>
                {changePassword.isPending ? t.updating : t.updatePassword}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
