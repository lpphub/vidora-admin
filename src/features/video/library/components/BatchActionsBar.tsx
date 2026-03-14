import { CheckCircle2, FolderTree, Trash2, X } from 'lucide-react'
import { useTags } from '@/features/tag/hooks'
import type { VideoStatus } from '@/features/video/types'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

interface BatchActionsBarProps {
  selectedCount: number
  onDelete: () => void
  onUpdateStatus: (status: VideoStatus) => void
  onUpdateCategory: (categoryId: string) => void
  onClear: () => void
  isDeleting?: boolean
}

const statusOptions: { value: VideoStatus; label: string }[] = [
  { value: 'draft', label: '草稿' },
  { value: 'published', label: '已发布' },
  { value: 'archived', label: '已归档' },
]

export function BatchActionsBar({
  selectedCount,
  onDelete,
  onUpdateStatus,
  onUpdateCategory,
  onClear,
  isDeleting,
}: BatchActionsBarProps) {
  const { data: categories } = useTags(1)

  if (selectedCount === 0) return null

  return (
    <div className='flex items-center gap-3 rounded-lg bg-muted p-3'>
      <span className='text-sm font-medium'>已选中 {selectedCount} 项</span>

      <div className='flex items-center gap-2'>
        <Button variant='destructive' size='sm' onClick={onDelete} disabled={isDeleting}>
          <Trash2 className='mr-1 h-4 w-4' />
          删除
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm'>
              <CheckCircle2 className='mr-1 h-4 w-4' />
              修改状态
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {statusOptions.map(opt => (
              <DropdownMenuItem key={opt.value} onClick={() => onUpdateStatus(opt.value)}>
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm'>
              <FolderTree className='mr-1 h-4 w-4' />
              修改分类
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {categories?.map((cat: { id: string; name: string }) => (
              <DropdownMenuItem key={cat.id} onClick={() => onUpdateCategory(cat.id)}>
                {cat.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant='ghost' size='sm' onClick={onClear}>
          <X className='mr-1 h-4 w-4' />
          取消选择
        </Button>
      </div>
    </div>
  )
}
