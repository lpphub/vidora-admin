import { User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuthStore } from '@/stores'

type FormValues = {
  username: string
  email: string
  about: string
}

export default function General() {
  const { t } = useTranslation('profile')
  const { user } = useAuthStore()

  const form = useForm<FormValues>({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      about: '',
    },
  })

  const handleSubmit = () => {
    toast.success(t('toast.profileUpdated'))
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
            {t('general.deleteAccount')}
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('general.username')}</FormLabel>
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
                    <FormLabel>{t('general.email')}</FormLabel>
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
                  <FormLabel>{t('general.about')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder={t('general.aboutPlaceholder')} rows={4} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className='flex justify-end gap-2 pt-2'>
              <Button type='submit'>{t('general.saveChanges')}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
