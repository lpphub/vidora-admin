import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
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
import { useLogin } from '../hooks'
import { LoginStateEnum, useLoginStateContext } from './LoginProvider'

export function LoginForm() {
  const { t } = useTranslation('auth')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { loginState, setLoginState } = useLoginStateContext()
  const loginMutation = useLogin()

  const loginSchema = z.object({
    email: z.email(t('login.emailInvalid')).min(1, t('login.emailRequired')),
    password: z.string().min(1, t('login.passwordRequired')).min(6, t('login.passwordMinLength')),
  })

  type LoginFormValues = z.infer<typeof loginSchema>

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  if (loginState !== LoginStateEnum.LOGIN) return null

  const handleFinish = async (values: LoginFormValues) => {
    try {
      await loginMutation.mutateAsync(values)
      navigate('/dashboard', { replace: true })
      toast.success(t('login.success'))
    } catch (error) {
      console.error(t('login.failed'), error)
      toast.error(t('login.failed'))
    }
  }

  const isLoading = loginMutation.isPending

  return (
    <div className='flex flex-col gap-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFinish)} className='space-y-4'>
          <div className='flex flex-col items-center gap-2 text-center'>
            <h1 className='text-2xl font-bold'>{t('login.title')}</h1>
            <p className='text-balance text-sm text-muted-foreground'>{t('login.subtitle')}</p>
          </div>

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('login.email')}</FormLabel>
                <FormControl>
                  <Input type='email' placeholder={t('login.emailPlaceholder')} {...field} />
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
                <FormLabel>{t('login.password')}</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('login.passwordPlaceholder')}
                      {...field}
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4 text-muted-foreground' />
                      ) : (
                        <Eye className='h-4 w-4 text-muted-foreground' />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading && <Loader2 className='animate-spin mr-2' />}
            {t('login.submit')}
          </Button>

          <div className='text-center text-sm'>
            {t('login.noAccount')}
            <Button
              variant='link'
              className='px-1'
              onClick={() => setLoginState(LoginStateEnum.REGISTER)}
            >
              {t('login.register')}
            </Button>
          </div>

          <div className='text-center'>
            <Button
              variant='link'
              size='sm'
              onClick={() => setLoginState(LoginStateEnum.RESET_PASSWORD)}
            >
              {t('login.forgotPassword')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default LoginForm
