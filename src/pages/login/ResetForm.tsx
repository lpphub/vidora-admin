import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ReturnButton } from './components/ReturnButton'
import { LoginStateEnum, useLoginStateContext } from './providers/LoginProvider'

const resetSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
})

type ResetFormValues = z.infer<typeof resetSchema>

function ResetForm() {
  const { loginState, backToLogin } = useLoginStateContext()

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  })

  const onFinish = async (values: ResetFormValues) => {
    // TODO: 调用实际的密码重置 API
    console.log('Reset password for:', values.email)
    toast.success('密码重置邮件已发送，请查收邮箱')
    backToLogin()
  }

  if (loginState !== LoginStateEnum.RESET_PASSWORD) return null

  return (
    <>
      <div className='mb-8 text-center'>
        <h1 className='text-2xl font-bold'>忘记密码</h1>
        <p className='text-balance text-sm text-muted-foreground mt-2'>
          输入您的邮箱地址，我们将发送密码重置链接
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
                  <Input placeholder='邮箱地址' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='w-full'>
            发送重置邮件
          </Button>
          <ReturnButton onClick={backToLogin} />
        </form>
      </Form>
    </>
  )
}

export default ResetForm
