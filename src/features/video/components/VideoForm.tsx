import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import type { Video } from '../types'

const videoFormSchema = z.object({
  title: z.string().min(1, '请输入标题'),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
})

type VideoFormValues = z.infer<typeof videoFormSchema>

interface VideoFormProps {
  defaultValues: Pick<Video, 'title' | 'description' | 'type' | 'tags' | 'categoryId'>
  onSubmit: (values: VideoFormValues) => void
}

const typeLabels = {
  movie: '电影',
  series: '电视剧',
  short: '短视频',
}

export function VideoForm({ defaultValues, onSubmit }: VideoFormProps) {
  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      title: defaultValues.title ?? '',
      description: defaultValues.description ?? '',
      tags: defaultValues.tags ?? [],
      categoryId: defaultValues.categoryId ?? undefined,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>标题</FormLabel>
              <FormControl>
                <Input placeholder='请输入影视标题' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-2 gap-4'>
          <FormItem>
            <FormLabel>类型</FormLabel>
            <FormControl>
              <div className='flex h-8 items-center'>
                <Badge variant='secondary'>{typeLabels[defaultValues.type]}</Badge>
              </div>
            </FormControl>
          </FormItem>

          <FormField
            control={form.control}
            name='categoryId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>分类</FormLabel>
                <FormControl>
                  <Input placeholder='请选择分类' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='tags'
          render={({ field }) => (
            <FormItem>
              <FormLabel>标签</FormLabel>
              <FormControl>
                <Input
                  placeholder='多个标签用逗号分隔'
                  value={field.value?.join(',') ?? ''}
                  onChange={e => {
                    const value = e.target.value
                    field.onChange(value ? value.split(',').map(t => t.trim()) : [])
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>简介</FormLabel>
              <FormControl>
                <Textarea placeholder='请输入影视简介' rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end'>
          <Button type='submit'>保存</Button>
        </div>
      </form>
    </Form>
  )
}
