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
          <div className='rounded-lg p-2' style={{ background: `${color}20` }}>
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
