import { AlertCircle, CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type StatusType =
  | 'draft'
  | 'pending'
  | 'published'
  | 'archived'
  | 'uploading'
  | 'processing'
  | 'error'
  | 'ready'

interface StatusBadgeProps {
  status: StatusType | string
  size?: 'default' | 'sm'
  showIcon?: boolean
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string
    variant: 'success' | 'warning' | 'info' | 'destructive' | 'secondary'
    icon?: React.ReactNode
  }
> = {
  draft: { label: '草稿', variant: 'secondary', icon: <Clock className='h-3 w-3' /> },
  pending: { label: '待审核', variant: 'warning', icon: <Clock className='h-3 w-3' /> },
  published: { label: '已发布', variant: 'success', icon: <CheckCircle2 className='h-3 w-3' /> },
  archived: { label: '已归档', variant: 'secondary', icon: <XCircle className='h-3 w-3' /> },
  uploading: {
    label: '上传中',
    variant: 'info',
    icon: <Loader2 className='h-3 w-3 animate-spin' />,
  },
  processing: {
    label: '处理中',
    variant: 'warning',
    icon: <Loader2 className='h-3 w-3 animate-spin' />,
  },
  error: { label: '错误', variant: 'destructive', icon: <AlertCircle className='h-3 w-3' /> },
  ready: { label: '就绪', variant: 'success', icon: <CheckCircle2 className='h-3 w-3' /> },
}

export function StatusBadge({ status, size = 'default', showIcon = true }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { label: status, variant: 'secondary' }

  if (size === 'sm') {
    return (
      <div className='flex items-center gap-1 text-xs text-muted-foreground'>
        {showIcon && config.icon}
        <span>{config.label}</span>
      </div>
    )
  }

  return (
    <Badge variant={config.variant} className='gap-1'>
      {showIcon && config.icon}
      {config.label}
    </Badge>
  )
}
