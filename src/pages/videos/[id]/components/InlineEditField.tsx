import { Check, Pencil, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'

export interface InlineEditFieldOption {
  label: string
  value: string
}

export interface InlineEditFieldProps {
  label: string
  value: string
  type?: 'text' | 'textarea' | 'select'
  options?: InlineEditFieldOption[]
  onSave: (value: string) => void | Promise<void>
  placeholder?: string
  className?: string
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

export function InlineEditField({
  label,
  value,
  type = 'text',
  options = [],
  onSave,
  placeholder,
  className,
  badgeVariant,
}: InlineEditFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = () => {
    setEditValue(value)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onSave(editValue)
      setIsEditing(false)
    } finally {
      setIsLoading(false)
    }
  }

  const displayValue = value || placeholder || '-'
  const isSelectWithBadge = type === 'select' && badgeVariant

  if (!isEditing) {
    return (
      <div className={cn('flex items-start gap-2', className)}>
        <span className='text-muted-foreground min-w-24 shrink-0 text-xs'>{label}</span>
        <div className='flex flex-1 items-center gap-2'>
          {isSelectWithBadge ? (
            <Badge variant={badgeVariant}>{displayValue}</Badge>
          ) : (
            <span className='text-xs'>{displayValue}</span>
          )}
          <Button
            variant='ghost'
            size='icon-xs'
            onClick={handleEdit}
            className='opacity-0 transition-opacity group-hover:opacity-100'
          >
            <Pencil />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex items-start gap-2', className)}>
      <span className='text-muted-foreground min-w-24 shrink-0 text-xs'>{label}</span>
      <div className='flex flex-1 items-start gap-2'>
        {type === 'textarea' ? (
          <Textarea
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            placeholder={placeholder}
            className='min-h-20 text-xs'
            disabled={isLoading}
          />
        ) : type === 'select' ? (
          <Select value={editValue} onValueChange={setEditValue} disabled={isLoading}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            placeholder={placeholder}
            className='text-xs'
            disabled={isLoading}
          />
        )}
        <div className='flex shrink-0 gap-1'>
          <Button variant='ghost' size='icon-xs' onClick={handleSave} disabled={isLoading}>
            <Check className='text-success' />
          </Button>
          <Button variant='ghost' size='icon-xs' onClick={handleCancel} disabled={isLoading}>
            <X className='text-destructive' />
          </Button>
        </div>
      </div>
    </div>
  )
}
