# 影视库与转码任务功能实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 实现影视库管理和转码任务管理功能，包括影视列表、详情页编辑、源视频上传（秒传/分片/续传）、季集管理、转码任务列表。

**Architecture:** 遵循 FSD 分层架构，API → Hooks → Components。复用 feature/video 分支已有的上传实现，新建 transcoding feature 模块。

**Tech Stack:** React 19, TanStack Query, Zustand, ky, shadcn/ui, react-hook-form, zod

---

## Task 1: 合并 feature/video 分支的上传代码

**Files:**
- Copy from `feature/video` branch:
  - `src/features/video/upload/`
  - `src/shared/stores/upload.ts`
  - `src/lib/constants.ts` (UploadConfig)
  - `src/features/video/types.ts` (补充 UploadFile 类型)

**Step 1: 检查 feature/video 分支存在**

```bash
git branch -a | grep feature/video
```

**Step 2: 从 feature/video 分支复制上传相关文件**

```bash
git checkout feature/video -- src/features/video/upload
git checkout feature/video -- src/shared/stores/upload.ts
```

**Step 3: 更新 types.ts 补充 UploadFile 类型**

检查 `src/features/video/types.ts` 是否包含完整的 UploadFile 类型定义。

**Step 4: 安装依赖 spark-md5**

```bash
pnpm add spark-md5
pnpm add -D @types/spark-md5
```

**Step 5: 运行类型检查**

```bash
pnpm build
```

**Step 6: 提交**

```bash
git add .
git commit -m "feat(video): merge upload feature from feature/video branch"
```

---

## Task 2: 创建视频 API 层

**Files:**
- Modify: `src/features/video/types.ts`
- Create: `src/features/video/api.ts`

**Step 1: 补充类型定义**

```typescript
// src/features/video/types.ts 追加

export interface VideoListParams {
  page?: number
  pageSize?: number
  type?: VideoType
  status?: VideoStatus
  keyword?: string
}

export interface VideoListResponse {
  items: Video[]
  total: number
  page: number
  pageSize: number
}

export interface CreateVideoDto {
  title: string
  description?: string
  cover?: string
  type: VideoType
  tags?: string[]
  categoryId?: string
}

export interface UpdateVideoDto extends Partial<CreateVideoDto> {
  status?: VideoStatus
}

export interface CreateSeasonDto {
  seasonNumber: number
  title?: string
}

export interface CreateEpisodeDto {
  episodeNumber: number
  title?: string
  duration?: number
}
```

**Step 2: 创建 API 文件**

```typescript
// src/features/video/api.ts
import api from '@/lib/api'
import type {
  Video,
  VideoListParams,
  VideoListResponse,
  CreateVideoDto,
  UpdateVideoDto,
  Season,
  CreateSeasonDto,
  Episode,
  CreateEpisodeDto,
  TranscodingTask,
} from './types'

export const videoApi = {
  list: (params?: VideoListParams) =>
    api.get<VideoListResponse>('videos', params as Record<string, string | number>),

  get: (id: string) => api.get<Video>(`videos/${id}`),

  create: (data: CreateVideoDto) => api.post<Video>('videos', data),

  update: (id: string, data: UpdateVideoDto) => api.put<Video>(`videos/${id}`, data),

  delete: (id: string) => api.delete(`videos/${id}`),

  createSeason: (videoId: string, data: CreateSeasonDto) =>
    api.post<Season>(`videos/${videoId}/seasons`, data),

  updateSeason: (videoId: string, seasonId: string, data: Partial<CreateSeasonDto>) =>
    api.put<Season>(`videos/${videoId}/seasons/${seasonId}`, data),

  deleteSeason: (videoId: string, seasonId: string) =>
    api.delete(`videos/${videoId}/seasons/${seasonId}`),

  createEpisode: (videoId: string, seasonId: string, data: CreateEpisodeDto) =>
    api.post<Episode>(`videos/${videoId}/seasons/${seasonId}/episodes`, data),

  updateEpisode: (videoId: string, seasonId: string, episodeId: string, data: Partial<CreateEpisodeDto>) =>
    api.put<Episode>(`videos/${videoId}/seasons/${seasonId}/episodes/${episodeId}`, data),

  deleteEpisode: (videoId: string, seasonId: string, episodeId: string) =>
    api.delete(`videos/${videoId}/seasons/${seasonId}/episodes/${episodeId}`),

  createTranscoding: (videoId: string, config: { type: string; output: Record<string, unknown> }) =>
    api.post<TranscodingTask>(`videos/${videoId}/transcoding`, config),
}
```

**Step 3: 运行类型检查**

```bash
pnpm build
```

**Step 4: 提交**

```bash
git add src/features/video/types.ts src/features/video/api.ts
git commit -m "feat(video): add video API layer"
```

---

## Task 3: 创建视频 Hooks 层

**Files:**
- Create: `src/features/video/hooks/useVideos.ts`
- Create: `src/features/video/hooks/useVideo.ts`
- Modify: `src/features/video/hooks/index.ts`

**Step 1: 创建 useVideos hook**

```typescript
// src/features/video/hooks/useVideos.ts
import { useQuery } from '@tanstack/react-query'
import { videoApi } from '../api'
import type { VideoListParams } from '../types'

export function useVideos(params?: VideoListParams) {
  return useQuery({
    queryKey: ['videos', params],
    queryFn: () => videoApi.list(params),
  })
}
```

**Step 2: 创建 useVideo hook**

```typescript
// src/features/video/hooks/useVideo.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { videoApi } from '../api'
import type { CreateVideoDto, UpdateVideoDto, CreateSeasonDto, CreateEpisodeDto } from '../types'

export function useVideo(id: string) {
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => videoApi.get(id),
    enabled: !!id,
  })
}

export function useCreateVideo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateVideoDto) => videoApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['videos'] }),
  })
}

export function useUpdateVideo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVideoDto }) =>
      videoApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['video', id] })
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
  })
}

export function useDeleteVideo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => videoApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['videos'] }),
  })
}

export function useCreateSeason() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ videoId, data }: { videoId: string; data: CreateSeasonDto }) =>
      videoApi.createSeason(videoId, data),
    onSuccess: (_, { videoId }) => queryClient.invalidateQueries({ queryKey: ['video', videoId] }),
  })
}

export function useCreateEpisode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ videoId, seasonId, data }: { videoId: string; seasonId: string; data: CreateEpisodeDto }) =>
      videoApi.createEpisode(videoId, seasonId, data),
    onSuccess: (_, { videoId }) => queryClient.invalidateQueries({ queryKey: ['video', videoId] }),
  })
}
```

**Step 3: 更新 hooks/index.ts 导出**

```typescript
// src/features/video/hooks/index.ts
export * from './useVideos'
export * from './useVideo'
export { useChunkUpload } from './useChunkUpload'
export { useUploadScheduler } from './useUploadScheduler'
```

**Step 4: 运行类型检查**

```bash
pnpm build
```

**Step 5: 提交**

```bash
git add src/features/video/hooks/
git commit -m "feat(video): add video hooks layer"
```

---

## Task 4: 创建转码 feature 模块

**Files:**
- Create: `src/features/transcoding/index.ts`
- Create: `src/features/transcoding/types.ts`
- Create: `src/features/transcoding/api.ts`
- Create: `src/features/transcoding/hooks/index.ts`
- Create: `src/features/transcoding/hooks/useTranscoding.ts`

**Step 1: 创建 types.ts**

```typescript
// src/features/transcoding/types.ts
export type TranscodingType = 'transcode' | 'thumbnail' | 'subtitle'
export type TranscodingStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface TranscodingTask {
  id: string
  videoId: string
  videoTitle: string
  type: TranscodingType
  status: TranscodingStatus
  progress: number
  input: {
    file: string
    resolution: string
    codec: string
  }
  output: {
    resolution: string
    codec: string
    bitrate: number
  }
  startedAt?: string
  completedAt?: string
  error?: string
}

export interface TranscodingListParams {
  status?: TranscodingStatus
  type?: TranscodingType
}
```

**Step 2: 创建 api.ts**

```typescript
// src/features/transcoding/api.ts
import api from '@/lib/api'
import type { TranscodingTask, TranscodingListParams } from './types'

export const transcodingApi = {
  list: (params?: TranscodingListParams) =>
    api.get<TranscodingTask[]>('transcoding', params as Record<string, string>),

  cancel: (id: string) => api.post(`transcoding/${id}/cancel`),

  retry: (id: string) => api.post<TranscodingTask>(`transcoding/${id}/retry`),
}
```

**Step 3: 创建 hooks**

```typescript
// src/features/transcoding/hooks/useTranscoding.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { transcodingApi } from '../api'
import type { TranscodingListParams } from '../types'

export function useTranscodingTasks(params?: TranscodingListParams) {
  return useQuery({
    queryKey: ['transcoding', params],
    queryFn: () => transcodingApi.list(params),
    refetchInterval: 5000, // 每5秒刷新
  })
}

export function useCancelTranscoding() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => transcodingApi.cancel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transcoding'] }),
  })
}

export function useRetryTranscoding() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => transcodingApi.retry(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transcoding'] }),
  })
}
```

**Step 4: 创建 index.ts 导出**

```typescript
// src/features/transcoding/index.ts
export * from './types'
export * from './api'
export * from './hooks'
```

```typescript
// src/features/transcoding/hooks/index.ts
export * from './useTranscoding'
```

**Step 5: 提交**

```bash
git add src/features/transcoding/
git commit -m "feat(transcoding): add transcoding feature module"
```

---

## Task 5: 创建影视卡片组件

**Files:**
- Create: `src/features/video/components/VideoCard.tsx`

**Step 1: 创建 VideoCard 组件**

```typescript
// src/features/video/components/VideoCard.tsx
import { Film, Tv, Sparkles, Upload, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Video } from '../types'
import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent } from '@/shared/components/ui/card'

interface VideoCardProps {
  video: Video
}

const typeIcons = {
  movie: Film,
  series: Tv,
  anime: Sparkles,
}

const typeLabels = {
  movie: '电影',
  series: '电视剧',
  anime: '动漫',
}

const statusColors = {
  draft: 'secondary',
  published: 'default',
  archived: 'outline',
} as const

const statusLabels = {
  draft: '草稿',
  published: '已发布',
  archived: '已归档',
}

export function VideoCard({ video }: VideoCardProps) {
  const TypeIcon = typeIcons[video.type] || Film
  
  const hasSource = !!video.fileSize
  const transcodingStatus = video.transcodingStatus
  
  return (
    <Link to={`/videos/${video.id}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-video bg-muted">
          {video.cover ? (
            <img
              src={video.cover}
              alt={video.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <TypeIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          <div className="absolute right-2 top-2 flex gap-1">
            <Badge variant="secondary" className="gap-1">
              <TypeIcon className="h-3 w-3" />
              {typeLabels[video.type]}
            </Badge>
          </div>
          
          <div className="absolute bottom-2 left-2 flex gap-1">
            <Badge variant={statusColors[video.status]}>
              {statusLabels[video.status]}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-3">
          <h3 className="truncate font-medium">{video.title}</h3>
          
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            {video.type !== 'movie' && video.seasons && (
              <span>
                {video.seasons.length}季
                {video.seasons.reduce((acc, s) => acc + s.episodes.length, 0)}集
              </span>
            )}
          </div>
          
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className={`flex items-center gap-1 ${hasSource ? 'text-green-600' : 'text-muted-foreground'}`}>
              {hasSource ? <CheckCircle className="h-3 w-3" /> : <Upload className="h-3 w-3" />}
              {hasSource ? '已上传' : '未上传'}
            </span>
            
            {transcodingStatus === 'processing' && (
              <span className="flex items-center gap-1 text-blue-600">
                <Loader2 className="h-3 w-3 animate-spin" />
                转码中
              </span>
            )}
            {transcodingStatus === 'completed' && (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-3 w-3" />
                已转码
              </span>
            )}
            {transcodingStatus === 'failed' && (
              <span className="flex items-center gap-1 text-red-600">
                <XCircle className="h-3 w-3" />
                转码失败
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
```

**Step 2: 提交**

```bash
git add src/features/video/components/VideoCard.tsx
git commit -m "feat(video): add VideoCard component"
```

---

## Task 6: 创建影视列表页

**Files:**
- Create: `src/pages/videos/index.tsx`
- Modify: `src/app/router/index.tsx`
- Modify: `src/shared/components/layout/Sidebar.tsx`
- Create: `src/shared/locales/zh/videos.json`
- Modify: `src/shared/locales/zh/index.ts`

**Step 1: 创建 i18n 文件**

```json
// src/shared/locales/zh/videos.json
{
  "title": "影视库",
  "search": "搜索影视...",
  "type": {
    "all": "全部类型",
    "movie": "电影",
    "series": "电视剧",
    "anime": "动漫"
  },
  "status": {
    "all": "全部状态",
    "draft": "草稿",
    "published": "已发布",
    "archived": "已归档"
  },
  "actions": {
    "create": "新建影视"
  },
  "empty": "暂无影视数据"
}
```

**Step 2: 创建页面组件**

```typescript
// src/pages/videos/index.tsx
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useVideos } from '@/features/video/hooks'
import { VideoCard } from '@/features/video/components/VideoCard'
import type { VideoType, VideoStatus } from '@/features/video/types'
import { Button } from '@/shared/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Input } from '@/shared/components/ui/input'

export default function Videos() {
  const { t } = useTranslation('videos')
  const [keyword, setKeyword] = useState('')
  const [type, setType] = useState<VideoType | undefined>()
  const [status, setStatus] = useState<VideoStatus | undefined>()
  
  const { data, isLoading } = useVideos({ keyword, type, status })
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button>
          <Plus className="mr-1 h-4 w-4" />
          {t('actions.create')}
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Input
          placeholder={t('search')}
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          className="w-64"
        />
        
        <Select value={type || 'all'} onValueChange={v => setType(v === 'all' ? undefined : v as VideoType)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('type.all')}</SelectItem>
            <SelectItem value="movie">{t('type.movie')}</SelectItem>
            <SelectItem value="series">{t('type.series')}</SelectItem>
            <SelectItem value="anime">{t('type.anime')}</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={status || 'all'} onValueChange={v => setStatus(v === 'all' ? undefined : v as VideoStatus)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('status.all')}</SelectItem>
            <SelectItem value="draft">{t('status.draft')}</SelectItem>
            <SelectItem value="published">{t('status.published')}</SelectItem>
            <SelectItem value="archived">{t('status.archived')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-video animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : data?.items?.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {data.items.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          {t('empty')}
        </div>
      )}
    </div>
  )
}
```

**Step 3: 更新路由**

```typescript
// src/app/router/index.tsx 添加
const Videos = lazy(() => import('@/pages/videos'))

// children 数组中添加
{
  path: 'videos',
  element: <Videos />,
},
```

**Step 4: 更新侧边栏**

```typescript
// src/shared/components/layout/Sidebar.tsx
import { Film, Loader2 } from 'lucide-react'

// NAVIGATION_CONFIG 中 features 分组修改为
{
  name: 'groups.features',
  items: [
    { title: 'items.videoLibrary', path: '/videos', icon: <Film size={18} /> },
    { title: 'items.transcoding', path: '/transcoding', icon: <Loader2 size={18} /> },
    { title: 'items.tagManagement', path: '/tags', icon: <Tag size={18} /> },
  ],
},
```

**Step 5: 更新 sidebar i18n**

```json
// src/shared/locales/zh/sidebar.json 添加
"items": {
  "videoLibrary": "影视库",
  "transcoding": "转码任务",
  ...
}
```

**Step 6: 更新 locales index**

```typescript
// src/shared/locales/zh/index.ts 添加
import videos from './videos.json'

export default {
  ...
  videos,
}
```

**Step 7: 提交**

```bash
git add .
git commit -m "feat(video): add video list page"
```

---

## Task 7: 创建转码任务表格组件

**Files:**
- Create: `src/features/transcoding/components/TranscodingTable.tsx`

**Step 1: 创建表格组件**

```typescript
// src/features/transcoding/components/TranscodingTable.tsx
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { TranscodingTask } from '../types'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Progress } from '@/shared/components/ui/progress'

interface TranscodingTableProps {
  tasks: TranscodingTask[]
  onCancel: (id: string) => void
  onRetry: (id: string) => void
}

const statusConfig = {
  pending: { icon: Clock, color: 'secondary', label: '等待中' },
  processing: { icon: Loader2, color: 'default', label: '进行中' },
  completed: { icon: CheckCircle, color: 'success', label: '已完成' },
  failed: { icon: XCircle, color: 'destructive', label: '失败' },
} as const

const typeLabels = {
  transcode: '转码',
  thumbnail: '缩略图',
  subtitle: '字幕',
}

export function TranscodingTable({ tasks, onCancel, onRetry }: TranscodingTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>影视名称</TableHead>
          <TableHead>任务类型</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>进度</TableHead>
          <TableHead>创建时间</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map(task => {
          const config = statusConfig[task.status]
          const StatusIcon = config.icon
          
          return (
            <TableRow key={task.id}>
              <TableCell>
                <Link
                  to={`/videos/${task.videoId}`}
                  className="hover:underline"
                >
                  {task.videoTitle}
                </Link>
              </TableCell>
              <TableCell>{typeLabels[task.type]}</TableCell>
              <TableCell>
                <Badge variant={config.color as 'secondary' | 'default' | 'destructive'}>
                  <StatusIcon className={`mr-1 h-3 w-3 ${task.status === 'processing' ? 'animate-spin' : ''}`} />
                  {config.label}
                </Badge>
              </TableCell>
              <TableCell>
                {task.status === 'processing' ? (
                  <div className="flex items-center gap-2">
                    <Progress value={task.progress} className="w-24" />
                    <span className="text-sm text-muted-foreground">{task.progress}%</span>
                  </div>
                ) : task.status === 'completed' ? (
                  <span className="text-green-600">100%</span>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>{new Date(task.startedAt || task.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                {task.status === 'processing' && (
                  <Button size="sm" variant="ghost" onClick={() => onCancel(task.id)}>
                    取消
                  </Button>
                )}
                {(task.status === 'failed' || task.status === 'completed') && (
                  <Button size="sm" variant="ghost" onClick={() => onRetry(task.id)}>
                    重试
                  </Button>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
```

**Step 2: 提交**

```bash
git add src/features/transcoding/components/
git commit -m "feat(transcoding): add TranscodingTable component"
```

---

## Task 8: 创建转码任务列表页

**Files:**
- Create: `src/pages/transcoding/index.tsx`
- Modify: `src/app/router/index.tsx`
- Create: `src/shared/locales/zh/transcoding.json`

**Step 1: 创建 i18n**

```json
// src/shared/locales/zh/transcoding.json
{
  "title": "转码任务",
  "status": {
    "all": "全部状态",
    "pending": "等待中",
    "processing": "进行中",
    "completed": "已完成",
    "failed": "失败"
  },
  "type": {
    "all": "全部类型",
    "transcode": "转码",
    "thumbnail": "缩略图",
    "subtitle": "字幕"
  },
  "empty": "暂无转码任务"
}
```

**Step 2: 创建页面**

```typescript
// src/pages/transcoding/index.tsx
import { useTranslation } from 'react-i18next'
import { useTranscodingTasks, useCancelTranscoding, useRetryTranscoding } from '@/features/transcoding'
import { TranscodingTable } from '@/features/transcoding/components/TranscodingTable'
import type { TranscodingStatus, TranscodingType } from '@/features/transcoding/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

export default function Transcoding() {
  const { t } = useTranslation('transcoding')
  const [status, setStatus] = useState<TranscodingStatus | undefined>()
  const [type, setType] = useState<TranscodingType | undefined>()
  
  const { data: tasks = [], isLoading } = useTranscodingTasks({ status, type })
  const cancelMutation = useCancelTranscoding()
  const retryMutation = useRetryTranscoding()
  
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Select value={status || 'all'} onValueChange={v => setStatus(v === 'all' ? undefined : v as TranscodingStatus)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('status.all')}</SelectItem>
                <SelectItem value="pending">{t('status.pending')}</SelectItem>
                <SelectItem value="processing">{t('status.processing')}</SelectItem>
                <SelectItem value="completed">{t('status.completed')}</SelectItem>
                <SelectItem value="failed">{t('status.failed')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={type || 'all'} onValueChange={v => setType(v === 'all' ? undefined : v as TranscodingType)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('type.all')}</SelectItem>
                <SelectItem value="transcode">{t('type.transcode')}</SelectItem>
                <SelectItem value="thumbnail">{t('type.thumbnail')}</SelectItem>
                <SelectItem value="subtitle">{t('type.subtitle')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">加载中...</div>
          ) : tasks.length > 0 ? (
            <TranscodingTable
              tasks={tasks}
              onCancel={id => cancelMutation.mutate(id)}
              onRetry={id => retryMutation.mutate(id)}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">{t('empty')}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

**Step 3: 更新路由**

```typescript
// src/app/router/index.tsx 添加
const Transcoding = lazy(() => import('@/pages/transcoding'))

// children 数组中添加
{
  path: 'transcoding',
  element: <Transcoding />,
},
```

**Step 4: 提交**

```bash
git add .
git commit -m "feat(transcoding): add transcoding list page"
```

---

## Task 9: 创建影视详情页 - 基础结构

**Files:**
- Create: `src/pages/videos/[id].tsx`

**Step 1: 创建页面基础结构**

```typescript
// src/pages/videos/[id].tsx
import { ArrowLeft, Save, Send } from 'lucide-react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useVideo } from '@/features/video/hooks'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'

export default function VideoDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: video, isLoading } = useVideo(id!)
  
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-12 gap-6">
          <Skeleton className="col-span-3 aspect-video" />
          <Skeleton className="col-span-9 h-96" />
        </div>
      </div>
    )
  }
  
  if (!video) {
    return <div>影视不存在</div>
  }
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/videos')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{video.title}</h1>
        </div>
        <div className="flex gap-2">
          <Button>
            <Save className="mr-1 h-4 w-4" />
            保存
          </Button>
          <Button variant="secondary">
            <Send className="mr-1 h-4 w-4" />
            发布
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <Card>
            <CardContent className="pt-6">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                {video.cover ? (
                  <img src={video.cover} alt={video.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    无封面
                  </div>
                )}
              </div>
              <Button variant="outline" className="w-full">更换封面</Button>
              
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">状态</span>
                  <span>{video.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">创建时间</span>
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">更新时间</span>
                  <span>{new Date(video.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-9 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>基础信息</CardTitle>
            </CardHeader>
            <CardContent>
              {}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>源视频上传</CardTitle>
            </CardHeader>
            <CardContent>
              {}
            </CardContent>
          </Card>
          
          {video.type !== 'movie' && (
            <Card>
              <CardHeader>
                <CardTitle>季集管理</CardTitle>
              </CardHeader>
              <CardContent>
                {}
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>转码任务</CardTitle>
            </CardHeader>
            <CardContent>
              {}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: 更新路由**

```typescript
// src/app/router/index.tsx
const VideoDetail = lazy(() => import('@/pages/videos/[id]'))

// children 中添加
{
  path: 'videos/:id',
  element: <VideoDetail />,
},
```

**Step 3: 提交**

```bash
git add .
git commit -m "feat(video): add video detail page structure"
```

---

## Task 10: 完善影视详情页各功能模块

后续任务需要完善：
1. 基础信息编辑表单（VideoForm 组件）
2. 源视频上传区域（复用 upload 组件）
3. 季集管理组件（SeasonManager）
4. 转码任务创建和管理

每个模块单独任务实现。

---

## 执行选项

**计划已保存到 `docs/plans/2026-03-14-video-library-impl.md`**

**两种执行方式：**

1. **Subagent-Driven（当前会话）** - 每个任务派发子代理，任务间代码审查，快速迭代

2. **Parallel Session（独立会话）** - 在新会话中使用 executing-plans，批量执行带检查点

**选择哪种方式？**