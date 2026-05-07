'use client'

import { User } from 'lucide-react'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useUser } from '@/hooks/auth'
import { updateProfile } from '@/hooks/profile'
import type { User as UserType } from '@/types/auth'

interface GeneralTranslations {
  username: string
  email: string
  about: string
  aboutPlaceholder: string
  saveChanges: string
  saving: string
  deleteAccount: string
}

interface ToastTranslations {
  profileUpdated: string
  profileUpdateFailed: string
  passwordUpdated: string
  passwordUpdateFailed: string
}

type FormValues = {
  username: string
  email: string
  about: string
}

export function General({
  initialUser,
  translations: t,
  toastTranslations: tt,
}: {
  initialUser: UserType | null
  translations: GeneralTranslations
  toastTranslations: ToastTranslations
}) {
  const { data: user = initialUser } = useUser()
  const [isPending, startTransition] = useTransition()

  const form = useForm<FormValues>({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      about: user?.about || '',
    },
  })

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      try {
        await updateProfile({ username: data.username, about: data.about })
        toast.success(tt.profileUpdated)
      } catch {
        toast.error(tt.profileUpdateFailed)
      }
    })
  }

  const userInitial = user?.username?.charAt(0).toUpperCase() || null

  return (
    <Card>
      <CardContent className='pt-6'>
        <div className='flex items-start gap-6 mb-6'>
          <Avatar className='h-20 w-20 shrink-0'>
            <AvatarImage src={user?.avatar} alt={user?.username} />
            <AvatarFallback className='bg-emerald-500 text-white text-xl font-medium'>
              {userInitial || <User size={28} />}
            </AvatarFallback>
          </Avatar>
          <Button variant='destructive' size='sm'>
            {t.deleteAccount}
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.username}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.email}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='about'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.about}</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder={t.aboutPlaceholder} rows={4} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className='flex justify-end gap-2 pt-2'>
              <Button type='submit' disabled={isPending}>
                {isPending ? t.saving : t.saveChanges}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
