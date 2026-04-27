import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoginStateEnum, useLoginStateContext } from './LoginProvider'
import { ReturnButton } from './ReturnButton'

function ResetForm() {
  const { t } = useTranslation('auth')
  const { loginState, backToLogin } = useLoginStateContext()

  const resetSchema = z.object({
    email: z.string().email(t('resetPassword.emailInvalid')),
  })

  type ResetFormValues = z.infer<typeof resetSchema>

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  })

  const onFinish = async (values: ResetFormValues) => {
    console.log('Reset password for:', values.email)
    toast.success(t('resetPassword.success'))
    backToLogin()
  }

  if (loginState !== LoginStateEnum.RESET_PASSWORD) return null

  return (
    <>
      <div className='mb-8 text-center'>
        <h1 className='text-2xl font-bold'>{t('resetPassword.title')}</h1>
        <p className='text-balance text-sm text-muted-foreground mt-2'>
          {t('resetPassword.subtitle')}
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFinish)} className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder={t('resetPassword.emailPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='w-full'>
            {t('resetPassword.submit')}
          </Button>
          <ReturnButton onClick={backToLogin} />
        </form>
      </Form>
    </>
  )
}

export default ResetForm
