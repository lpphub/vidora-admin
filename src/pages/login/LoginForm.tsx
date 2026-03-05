import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
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
import { useLogin } from '@/hooks/useAuth'
import { LoginStateEnum, useLoginStateContext } from './providers/LoginProvider'

const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { loginState, setLoginState } = useLoginStateContext()
  const loginMutation = useLogin()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  if (loginState !== LoginStateEnum.LOGIN) return null

  const handleFinish = async (values: LoginFormValues) => {
    setLoading(true)
    try {
      await loginMutation.mutateAsync(values)
      navigate('/dashboard', { replace: true })
      toast.success('登录成功', { closeButton: true })
    } catch (error) {
      console.error('登录失败:', error)
      toast.error('登录失败，请检查邮箱和密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFinish)} className='space-y-4'>
          <div className='flex flex-col items-center gap-2 text-center'>
            <h1 className='text-2xl font-bold'>欢迎回来</h1>
            <p className='text-balance text-sm text-muted-foreground'>请输入您的邮箱和密码登录</p>
          </div>

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱</FormLabel>
                <FormControl>
                  <Input type='email' placeholder='请输入邮箱地址' {...field} />
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
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='请输入密码'
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

          <Button type='submit' className='w-full' disabled={loading}>
            {loading && <Loader2 className='animate-spin mr-2' />}
            登录
          </Button>

          <div className='text-center text-sm'>
            还没有账户？
            <Button
              variant='link'
              className='px-1'
              onClick={() => setLoginState(LoginStateEnum.REGISTER)}
            >
              立即注册
            </Button>
          </div>

          <div className='text-center'>
            <Button
              variant='link'
              size='sm'
              onClick={() => setLoginState(LoginStateEnum.RESET_PASSWORD)}
            >
              忘记密码？
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default LoginForm
