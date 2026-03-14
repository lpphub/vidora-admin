import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useTags } from '@/features/tag/hooks'
import type { Tag } from '@/features/tag/types'
import type { TranscodingConfig, Video } from '@/features/video/types'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Textarea } from '@/shared/components/ui/textarea'
import { formatBitrate, formatDate, formatDuration, formatFileSize } from '@/shared/lib/format'
import { TranscodingPanel } from './TranscodingPanel'

const videoSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题最多100字符'),
  description: z.string().max(500, '描述最多500字符').optional(),
  type: z.enum(['movie', 'series', 'short']),
  status: z.enum(['draft', 'published', 'archived']),
  categoryId: z.string().optional(),
  tags: z.array(z.string()),
  cover: z.string().optional(),
})

type VideoFormValues = z.infer<typeof videoSchema>

interface VideoDetailSheetProps {
  video: Video | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (id: string, data: Partial<Video>) => void
  onDelete: (id: string) => void
  onCreateTranscoding: (videoId: string, config: TranscodingConfig) => void
  onRetryTranscoding: (taskId: string) => void
  isUpdating?: boolean
  isDeleting?: boolean
  isCreatingTranscoding?: boolean
}

export function VideoDetailSheet({
  video,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
  onCreateTranscoding,
  onRetryTranscoding,
  isUpdating,
  isDeleting,
  isCreatingTranscoding,
}: VideoDetailSheetProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('detail')
  const { data: tags } = useTags()

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    values: {
      title: video?.title ?? '',
      description: video?.description ?? '',
      type: video?.type ?? 'movie',
      status: video?.status ?? 'draft',
      categoryId: video?.categoryId ?? '',
      tags: video?.tags ?? [],
      cover: video?.cover ?? '',
    },
  })

  const handleUpdate = (values: VideoFormValues) => {
    if (video) {
      onUpdate(video.id, values)
    }
  }

  const handleDelete = () => {
    if (video) {
      onDelete(video.id)
      setDeleteDialogOpen(false)
      onOpenChange(false)
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        form.setValue('cover', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (!video) return null

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className='!w-1/2 !min-w-[400px] !max-w-[600px] flex flex-col p-0'>
          <SheetHeader className='px-6 pt-6 pb-2'>
            <SheetTitle>视频详情</SheetTitle>
          </SheetHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='mt-2 flex-1 flex flex-col overflow-hidden'
          >
            <TabsList className='grid w-full grid-cols-2 mx-6'>
              <TabsTrigger value='detail'>详情</TabsTrigger>
              <TabsTrigger value='transcode'>转码</TabsTrigger>
            </TabsList>

            <TabsContent value='detail' className='flex-1 flex flex-col overflow-hidden'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleUpdate)} className='flex-1 flex flex-col'>
                  <div className='flex-1 overflow-y-auto px-6 space-y-6 py-4'>
                    <div className='space-y-1'>
                      <h3 className='text-sm font-medium'>基本信息</h3>
                      <div className='rounded-lg border p-4 space-y-4'>
                        <div className='flex gap-4'>
                          <div className='relative group'>
                            <div className='h-32 w-24 shrink-0 overflow-hidden rounded-lg bg-muted'>
                              {form.watch('cover') ? (
                                <img
                                  src={form.watch('cover')}
                                  alt='封面'
                                  className='h-full w-full object-cover'
                                />
                              ) : (
                                <div className='flex h-full items-center justify-center text-muted-foreground'>
                                  <Camera className='h-8 w-8' />
                                </div>
                              )}
                            </div>
                            <label className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg'>
                              <span className='text-white text-xs'>更换封面</span>
                              <input
                                type='file'
                                accept='image/*'
                                className='hidden'
                                onChange={handleCoverChange}
                              />
                            </label>
                          </div>
                          <div className='flex-1 space-y-3'>
                            <FormField
                              control={form.control}
                              name='title'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>标题</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className='grid grid-cols-2 gap-3'>
                              <FormField
                                control={form.control}
                                name='type'
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>类型</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value='movie'>电影</SelectItem>
                                        <SelectItem value='series'>电视剧</SelectItem>
                                        <SelectItem value='short'>短视频</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name='status'
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>状态</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value='draft'>草稿</SelectItem>
                                        <SelectItem value='published'>已发布</SelectItem>
                                        <SelectItem value='archived'>已归档</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <FormField
                            control={form.control}
                            name='tags'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>标签</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <div className='flex min-h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm'>
                                      <div className='flex flex-wrap gap-1'>
                                        {field.value.length > 0 ? (
                                          field.value.map(tag => (
                                            <Badge
                                              key={tag}
                                              variant='secondary'
                                              className='gap-1 px-1'
                                            >
                                              {tag}
                                              <button
                                                type='button'
                                                onClick={e => {
                                                  e.stopPropagation()
                                                  field.onChange(field.value.filter(t => t !== tag))
                                                }}
                                                className='hover:text-destructive'
                                              >
                                                <X className='h-3 w-3' />
                                              </button>
                                            </Badge>
                                          ))
                                        ) : (
                                          <span className='text-muted-foreground'>选择标签</span>
                                        )}
                                      </div>
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent className='w-[200px] p-0' align='start'>
                                    <div
                                      className='max-h-[200px] overflow-y-auto p-2'
                                      onWheel={e => e.stopPropagation()}
                                    >
                                      {tags?.map((tag: Tag) => (
                                        <button
                                          key={tag.id}
                                          type='button'
                                          className='flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-muted cursor-pointer'
                                          onClick={() => {
                                            if (field.value.includes(tag.name)) {
                                              field.onChange(
                                                field.value.filter(t => t !== tag.name)
                                              )
                                            } else {
                                              field.onChange([...field.value, tag.name])
                                            }
                                          }}
                                        >
                                          <Checkbox
                                            checked={field.value.includes(tag.name)}
                                            className='pointer-events-none'
                                          />
                                          <span>{tag.name}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className='space-y-1'>
                      <h3 className='text-sm font-medium'>简介</h3>
                      <div className='rounded-lg border p-4'>
                        <FormField
                          control={form.control}
                          name='description'
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea {...field} rows={3} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className='space-y-1'>
                      <h3 className='text-sm font-medium text-muted-foreground'>属性信息</h3>
                      <div className='rounded-lg border p-4'>
                        <div className='grid grid-cols-3 gap-4 text-sm'>
                          <div>
                            <span className='text-muted-foreground'>时长</span>
                            <p className='font-medium'>{formatDuration(video.duration)}</p>
                          </div>
                          <div>
                            <span className='text-muted-foreground'>分辨率</span>
                            <p className='font-medium'>{video.resolution || '--'}</p>
                          </div>
                          <div>
                            <span className='text-muted-foreground'>编码</span>
                            <p className='font-medium'>{video.codec || '--'}</p>
                          </div>
                          <div>
                            <span className='text-muted-foreground'>码率</span>
                            <p className='font-medium'>{formatBitrate(video.bitrate)}</p>
                          </div>
                          <div>
                            <span className='text-muted-foreground'>文件大小</span>
                            <p className='font-medium'>{formatFileSize(video.fileSize)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='text-sm text-muted-foreground space-y-1'>
                      <p>创建时间: {formatDate(video.createdAt)}</p>
                      <p>更新时间: {formatDate(video.updatedAt)}</p>
                    </div>
                  </div>

                  <div className='border-t p-6 mt-auto flex gap-3'>
                    <Button type='submit' className='flex-1' disabled={isUpdating}>
                      {isUpdating ? '保存中...' : '保存'}
                    </Button>
                    <Button
                      type='button'
                      variant='destructive'
                      className='flex-1'
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash2 className='mr-2 h-4 w-4' />
                      删除
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value='transcode' className='mt-6 overflow-y-auto px-6 pb-6'>
              <TranscodingPanel
                videoId={video.id}
                onCreateTask={config => onCreateTranscoding(video.id, config)}
                onRetry={onRetryTranscoding}
                isCreating={isCreatingTranscoding}
              />
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除视频「{video.title}」吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant='destructive' onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? '删除中...' : '确认删除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
