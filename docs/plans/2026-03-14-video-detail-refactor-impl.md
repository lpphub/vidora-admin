# 影视详情页重构实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将影视详情页从「左侧边栏 + 右侧堆叠卡片」布局重构为「头部 + Tab 导航」布局。

**Architecture:** 组件级 Tab 切换，创建 OverviewTab、UploadTab、TranscodingTab 三个子组件，新增 InlineEditField、StatCard 通用组件。

**Tech Stack:** React 19, shadcn/ui Tabs, TanStack Query, react-hook-form

---

## Task 1: 创建 StatCard 统计卡片组件

**Files:**
- Create: `src/pages/videos/[id]/components/StatCard.tsx`

**Step 1: 创建 StatCard 组件**

```typescript
// src/pages/videos/[id]/components/StatCard.tsx
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  subValue?: string
  color?: string
}

export function StatCard({ icon: Icon, label, value, subValue, color = '#10b981' }: StatCardProps) {
  return (
    <Card className='flex flex-col justify-between'>
      <CardContent className='flex flex-col gap-2 p-4'>
        <div className='flex items-center gap-2'>
          <div
            className='rounded-lg p-2'
            style={{ background: `${color}20` }}
          >
            <Icon size={20} style={{ color }} />
          </div>
          <span className='text-sm font-medium text-muted-foreground'>{label}</span>
        </div>
        <div className='flex items-baseline gap-2'>
          <span className='text-2xl font-bold'>{value}</span>
          {subValue && <span className='text-xs text-muted-foreground'>{subValue}</span>}
        </div>
      </CardContent>
    </Card>
  )
}
```

**Step 2: 运行类型检查**

```bash
pnpm build
```

**Step 3: 提交**

```bash
git add src/pages/videos/[id]/components/StatCard.tsx
git commit -m "feat(video): add StatCard component"
```

---

## Task 2: 创建 InlineEditField 内联编辑组件

**Files:**
- Create: `src/pages/videos/[id]/components/InlineEditField.tsx`

**Step 1: 创建 InlineEditField 组件**

```typescript
// src/pages/videos/[id]/components/InlineEditField.tsx
import { Check, Pencil, X } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

type FieldType = 'text' | 'textarea' | 'select'

interface BaseProps {
  label: string
  value: string
  type?: FieldType
  onSave: (value: string) => void
}

interface TextProps extends BaseProps {
  type?: 'text' | 'textarea'
}

interface SelectProps extends BaseProps {
  type: 'select'
  options: { value: string; label: string }[]
}

type InlineEditFieldProps = TextProps | SelectProps

export function InlineEditField(props: InlineEditFieldProps) {
  const { label, value: initialValue, type = 'text', onSave } = props
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialValue)
  const options = type === 'select' ? (props as SelectProps).options : []

  const handleSave = () => {
    onSave(value)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setValue(initialValue)
    setIsEditing(false)
  }

  const renderDisplayValue = () => {
    if (type === 'select') {
      const option = options.find(o => o.value === value)
      return <Badge variant='secondary'>{option?.label ?? value}</Badge>
    }
    if (type === 'textarea') {
      return <span className='text-sm whitespace-pre-wrap'>{value || '-'}</span>
    }
    return <span className='text-sm'>{value || '-'}</span>
  }

  const renderEditField = () => {
    if (type === 'select') {
      return (
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className='w-48'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }
    if (type === 'textarea') {
      return (
        <Textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          rows={4}
          className='min-w-64'
        />
      )
    }
    return (
      <Input
        value={value}
        onChange={e => setValue(e.target.value)}
        className='min-w-48'
      />
    )
  }

  return (
    <div className='flex items-start justify-between py-2 border-b last:border-b-0'>
      <span className='text-sm text-muted-foreground w-20 shrink-0'>{label}</span>
      <div className='flex items-center gap-2 flex-1 justify-end'>
        {isEditing ? (
          <>
            {renderEditField()}
            <div className='flex gap-1'>
              <Button size='icon' variant='ghost' onClick={handleSave}>
                <Check className='h-4 w-4 text-green-600' />
              </Button>
              <Button size='icon' variant='ghost' onClick={handleCancel}>
                <X className='h-4 w-4 text-muted-foreground' />
              </Button>
            </div>
          </>
        ) : (
          <>
            {renderDisplayValue()}
            <Button size='icon' variant='ghost' onClick={() => setIsEditing(true)}>
              <Pencil className='h-3.5 w-3.5 text-muted-foreground' />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
```

**Step 2: 运行类型检查**

```bash
pnpm build
```

**Step 3: 提交**

```bash
git add src/pages/videos/[id]/components/InlineEditField.tsx
git commit -m "feat(video): add InlineEditField component"
```

---

## Task 3: 创建 OverviewTab 概览组件

**Files:**
- Create: `src/pages/videos/[id]/OverviewTab.tsx`

**Step 1: 创建 OverviewTab 组件**

```typescript
// src/pages/videos/[id]/OverviewTab.tsx
import { FileVideo, Film, Play, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import type { Video } from '@/features/video/types'
import { useUpdateVideo } from '@/features/video/hooks'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { InlineEditField } from './components/InlineEditField'
import { StatCard } from './components/StatCard'

const statusOptions = [
  { value: 'draft', label: '草稿' },
  { value: 'published', label: '已发布' },
  { value: 'archived', label: '已归档' },
]

const typeLabels = {
  movie: '电影',
  series: '电视剧',
  short: '短视频',
}

interface OverviewTabProps {
  video: Video
}

export function OverviewTab({ video }: OverviewTabProps) {
  const updateVideo = useUpdateVideo()

  const handleFieldSave = (field: keyof Video, value: string) => {
    updateVideo.mutate(
      { id: video.id, data: { [field]: value } },
      {
        onSuccess: () => toast.success('保存成功'),
        onError: () => toast.error('保存失败'),
      }
    )
  }

  const episodeCount = video.seasons?.reduce((acc, s) => acc + s.episodes.length, 0) ?? 0
  const seasonCount = video.seasons?.length ?? 0

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-4 gap-4'>
        <StatCard
          icon={FileVideo}
          label='上传状态'
          value={video.type === 'series' ? `${episodeCount}集` : formatFileSize(video.fileSize)}
          subValue={video.type === 'series' && seasonCount > 0 ? `${seasonCount}季` : undefined}
          color='#3b82f6'
        />
        <StatCard
          icon={Film}
          label='转码状态'
          value='已完成'
          color='#10b981'
        />
        <StatCard
          icon={Play}
          label='播放量'
          value='1,234'
          color='#8b5cf6'
        />
        <StatCard
          icon={TrendingUp}
          label='完播率'
          value='45%'
          color='#f59e0b'
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基础信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex gap-6'>
            <div className='shrink-0'>
              <div className='aspect-video w-48 bg-muted rounded-lg overflow-hidden'>
                {video.cover ? (
                  <img src={video.cover} alt={video.title} className='w-full h-full object-cover' />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-muted-foreground'>
                    无封面
                  </div>
                )}
              </div>
              <Button variant='outline' size='sm' className='w-full mt-2'>
                更换封面
              </Button>
            </div>

            <div className='flex-1 space-y-1'>
              <InlineEditField
                label='标题'
                value={video.title}
                onSave={v => handleFieldSave('title', v)}
              />
              <div className='flex items-center justify-between py-2 border-b'>
                <span className='text-sm text-muted-foreground w-20'>类型</span>
                <Badge variant='secondary'>{typeLabels[video.type]}</Badge>
              </div>
              <InlineEditField
                label='分类'
                value={video.categoryId ?? ''}
                onSave={v => handleFieldSave('categoryId', v)}
              />
              <InlineEditField
                label='状态'
                value={video.status}
                type='select'
                options={statusOptions}
                onSave={v => handleFieldSave('status', v)}
              />
              <InlineEditField
                label='简介'
                value={video.description ?? ''}
                type='textarea'
                onSave={v => handleFieldSave('description', v)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function formatFileSize(bytes?: number) {
  if (!bytes) return '未上传'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}
```

**Step 2: 运行类型检查**

```bash
pnpm build
```

**Step 3: 提交**

```bash
git add src/pages/videos/[id]/OverviewTab.tsx
git commit -m "feat(video): add OverviewTab component"
```

---

## Task 4: 创建 UploadTab 上传组件

**Files:**
- Create: `src/pages/videos/[id]/UploadTab.tsx`

**Step 1: 创建 UploadTab 组件**

```typescript
// src/pages/videos/[id]/UploadTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { UploadDropzone, UploadQueue } from '@/features/video/upload/components'
import { useUploadScheduler } from '@/features/video/hooks'

export function UploadTab() {
  const { cancelTask } = useUploadScheduler()

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>上传视频</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <UploadDropzone />
          <UploadQueue cancelTask={cancelTask} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>已上传文件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8 text-muted-foreground'>
            暂无已上传文件
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Step 2: 运行类型检查**

```bash
pnpm build
```

**Step 3: 提交**

```bash
git add src/pages/videos/[id]/UploadTab.tsx
git commit -m "feat(video): add UploadTab component"
```

---

## Task 5: 创建 TranscodingTab 转码组件

**Files:**
- Create: `src/pages/videos/[id]/TranscodingTab.tsx`

**Step 1: 创建 TranscodingTab 组件**

```typescript
// src/pages/videos/[id]/TranscodingTab.tsx
import { Plus } from 'lucide-react'
import { TranscodingTable } from '@/features/transcoding/components'
import { useCancelTranscoding, useRetryTranscoding, useTranscodingTasks } from '@/features/transcoding/hooks'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

interface TranscodingTabProps {
  videoId: string
}

export function TranscodingTab({ videoId }: TranscodingTabProps) {
  const { data: transcodingData } = useTranscodingTasks({ videoId })
  const cancelTranscoding = useCancelTranscoding()
  const retryTranscoding = useRetryTranscoding()

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>转码任务</CardTitle>
          <Button variant='outline' size='sm'>
            <Plus className='mr-1 h-3 w-3' />
            创建任务
          </Button>
        </CardHeader>
        <CardContent>
          {transcodingData && transcodingData.length > 0 ? (
            <TranscodingTable
              tasks={transcodingData}
              onCancel={(id: string) => cancelTranscoding.mutate(id)}
              onRetry={(id: string) => retryTranscoding.mutate(id)}
            />
          ) : (
            <div className='text-center py-8 text-muted-foreground'>暂无转码任务</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

**Step 2: 运行类型检查**

```bash
pnpm build
```

**Step 3: 提交**

```bash
git add src/pages/videos/[id]/TranscodingTab.tsx
git commit -m "feat(video): add TranscodingTab component"
```

---

## Task 6: 重构主页面为 Tab 布局

**Files:**
- Modify: `src/pages/videos/[id].tsx`

**Step 1: 重写主页面**

```typescript
// src/pages/videos/[id].tsx
import { ArrowLeft, Film, Save, Send, Upload } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useUpdateVideo, useVideo } from '@/features/video/hooks'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { OverviewTab } from './OverviewTab'
import { TranscodingTab } from './TranscodingTab'
import { UploadTab } from './UploadTab'

const statusLabels = {
  draft: '草稿',
  published: '已发布',
  archived: '已归档',
}

const typeLabels = {
  movie: '电影',
  series: '电视剧',
  short: '短视频',
}

export default function VideoDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: video, isLoading } = useVideo(id!)
  const updateVideo = useUpdateVideo()
  const [activeTab, setActiveTab] = useState('overview')

  if (isLoading) {
    return (
      <div className='flex flex-col gap-4'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-96 w-full' />
      </div>
    )
  }

  if (!video) {
    return <div className='text-muted-foreground'>影视不存在</div>
  }

  const handlePublish = () => {
    if (video.status === 'published') {
      updateVideo.mutate(
        { id: id!, data: { status: 'draft' } },
        { onSuccess: () => toast.success('已下架') }
      )
    } else {
      updateVideo.mutate(
        { id: id!, data: { status: 'published' } },
        { onSuccess: () => toast.success('发布成功') }
      )
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' onClick={() => navigate('/videos')}>
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <h1 className='text-2xl font-bold'>{video.title}</h1>
          <Badge variant='secondary'>{typeLabels[video.type]}</Badge>
          <Badge>{statusLabels[video.status]}</Badge>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline'>
            <Save className='mr-1 h-4 w-4' />
            保存
          </Button>
          <Button onClick={handlePublish}>
            <Send className='mr-1 h-4 w-4' />
            {video.status === 'published' ? '下架' : '发布'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant='line'>
          <TabsTrigger value='overview'>
            <Film className='mr-1.5 h-4 w-4' />
            概览
          </TabsTrigger>
          <TabsTrigger value='upload'>
            <Upload className='mr-1.5 h-4 w-4' />
            视频上传
          </TabsTrigger>
          <TabsTrigger value='transcoding'>
            <Film className='mr-1.5 h-4 w-4' />
            转码任务
          </TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='mt-6'>
          <OverviewTab video={video} />
        </TabsContent>

        <TabsContent value='upload' className='mt-6'>
          <UploadTab />
        </TabsContent>

        <TabsContent value='transcoding' className='mt-6'>
          <TranscodingTab videoId={id!} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

**Step 2: 运行类型检查**

```bash
pnpm build
```

**Step 3: 提交**

```bash
git add src/pages/videos/[id].tsx
git commit -m "refactor(video): convert detail page to tab layout"
```

---

## Task 7: 创建组件导出文件

**Files:**
- Create: `src/pages/videos/[id]/components/index.ts`

**Step 1: 创建导出文件**

```typescript
// src/pages/videos/[id]/components/index.ts
export { InlineEditField } from './InlineEditField'
export { StatCard } from './StatCard'
```

**Step 2: 运行类型检查**

```bash
pnpm build
```

**Step 3: 提交**

```bash
git add src/pages/videos/[id]/components/index.ts
git commit -m "feat(video): add component exports"
```

---

## Task 8: 最终验证

**Step 1: 运行完整构建**

```bash
pnpm build
```

**Step 2: 启动开发服务器验证**

```bash
pnpm dev
```

访问 `http://localhost:5173/videos/:id` 验证页面显示正常。

**Step 3: 最终提交**

```bash
git add .
git commit -m "feat(video): complete detail page refactor with tab layout"
```