import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import type { VideoListParams } from '@/features/video/types'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

interface VideoToolbarProps {
  onFilterChange: (params: Partial<VideoListParams>) => void
}

const typeOptions = [
  { value: 'all', label: '全部类型' },
  { value: 'movie', label: '电影' },
  { value: 'series', label: '电视剧' },
  { value: 'short', label: '短视频' },
]

const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'draft', label: '草稿' },
  { value: 'published', label: '已发布' },
  { value: 'archived', label: '已归档' },
]

const sortOptions = [
  { value: 'createdAt-desc', label: '创建时间 (最新)' },
  { value: 'createdAt-asc', label: '创建时间 (最早)' },
  { value: 'updatedAt-desc', label: '更新时间 (最新)' },
  { value: 'title-asc', label: '标题 (A-Z)' },
]

export function VideoToolbar({ onFilterChange }: VideoToolbarProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const keyword = searchParams.get('keyword') ?? ''
  const type = searchParams.get('type') ?? 'all'
  const status = searchParams.get('status') ?? 'all'
  const sort = searchParams.get('sort') ?? 'createdAt-desc'

  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    if (key !== 'page') params.set('page', '1')
    setSearchParams(params)
  }

  const handleKeywordChange = (value: string) => {
    updateParams('keyword', value || null)
    onFilterChange({ keyword: value || undefined, page: 1 })
  }

  const handleTypeChange = (value: string) => {
    updateParams('type', value)
    onFilterChange({
      type: value === 'all' ? undefined : (value as VideoListParams['type']),
      page: 1,
    })
  }

  const handleStatusChange = (value: string) => {
    updateParams('status', value)
    onFilterChange({
      status: value === 'all' ? undefined : (value as VideoListParams['status']),
      page: 1,
    })
  }

  const handleSortChange = (value: string) => {
    updateParams('sort', value)
    const [sortBy, sortOrder] = value.split('-') as [
      VideoListParams['sortBy'],
      VideoListParams['sortOrder'],
    ]
    onFilterChange({ sortBy, sortOrder })
  }

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <div className='relative w-64'>
        <Search className='absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          className='pl-8'
          placeholder='搜索视频...'
          value={keyword}
          onChange={e => handleKeywordChange(e.target.value)}
        />
      </div>

      <Select value={type} onValueChange={handleTypeChange}>
        <SelectTrigger className='w-32'>
          <SelectValue placeholder='类型' />
        </SelectTrigger>
        <SelectContent>
          {typeOptions.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger className='w-32'>
          <SelectValue placeholder='状态' />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={handleSortChange}>
        <SelectTrigger className='w-40'>
          <SelectValue placeholder='排序' />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
