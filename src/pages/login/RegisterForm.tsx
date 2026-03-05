import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ReturnButton } from './components/ReturnButton'
import { LoginStateEnum, useLoginStateContext } from './providers/LoginProvider'

const registerSchema = z
  .object({
    email: z.string().email('请输入有效的邮箱地址'),
    password: z.string().min(6, '密码至少6个字符'),
    confirmPassword: z.string().min(1, '请确认密码'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '两次密码不一致',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

function RegisterForm() {
  const { loginState, backToLogin } = useLoginStateContext()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onFinish = async (values: RegisterFormValues) => {
    // TODO: 调用实际的注册 API
    console.log('Register values:', values)
    toast.success('注册成功，请登录')
    backToLogin()
  }

  if (loginState !== LoginStateEnum.REGISTER) return null

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFinish)} className='space-y-4'>
        <div className='flex flex-col items-center gap-2 text-center'>
          <h1 className='text-2xl font-bold'>创建账户</h1>
        </div>

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type='email' placeholder='邮箱地址' {...field} />
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
                <Input type='password' placeholder='密码' {...field} />
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
                <Input type='password' placeholder='确认密码' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full'>
          注册
        </Button>

        <div className='mb-2 text-xs text-muted-foreground text-center'>
          <span>注册即表示您同意</span>
          <button type='button' className='text-primary underline ml-1'>
            服务条款
          </button>
          {' & '}
          <button type='button' className='text-primary underline'>
            隐私政策
          </button>
        </div>

        <ReturnButton onClick={backToLogin} />
      </form>
    </Form>
  )
}

export default RegisterForm
