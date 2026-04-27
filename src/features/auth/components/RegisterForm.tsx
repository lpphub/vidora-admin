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

function RegisterForm() {
  const { t } = useTranslation('auth')
  const { loginState, backToLogin } = useLoginStateContext()

  const registerSchema = z
    .object({
      email: z.string().email(t('register.emailInvalid')),
      password: z.string().min(6, t('register.passwordMinLength')),
      confirmPassword: z.string().min(1, t('register.confirmPasswordRequired')),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: t('register.confirmPasswordMismatch'),
      path: ['confirmPassword'],
    })

  type RegisterFormValues = z.infer<typeof registerSchema>

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onFinish = async (values: RegisterFormValues) => {
    console.log('Register values:', values)
    toast.success(t('register.success'))
    backToLogin()
  }

  if (loginState !== LoginStateEnum.REGISTER) return null

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFinish)} className='space-y-4'>
        <div className='flex flex-col items-center gap-2 text-center'>
          <h1 className='text-2xl font-bold'>{t('register.title')}</h1>
        </div>

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type='email' placeholder={t('register.emailPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type='password' placeholder={t('register.passwordPlaceholder')} {...field} />
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
              <FormControl>
                <Input
                  type='password'
                  placeholder={t('register.confirmPasswordPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full'>
          {t('register.submit')}
        </Button>

        <div className='mb-2 text-xs text-muted-foreground text-center'>
          <span>{t('register.hasAccount')}</span>
          <button type='button' className='text-primary underline ml-1' onClick={backToLogin}>
            {t('register.login')}
          </button>
        </div>

        <ReturnButton onClick={backToLogin} />
      </form>
    </Form>
  )
}

export default RegisterForm
