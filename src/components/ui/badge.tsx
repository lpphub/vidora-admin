import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary-hover',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive-hover',
        success:
          'border-transparent bg-success text-success-foreground shadow-sm hover:bg-success-hover',
        warning:
          'border-transparent bg-warning text-warning-foreground shadow-sm hover:bg-warning-hover',
        info: 'border-transparent bg-info text-info-foreground shadow-sm hover:bg-info-hover',
        outline: 'text-foreground border-border',
        'outline-primary': 'text-primary border-primary/50 bg-primary/5',
        'outline-secondary': 'text-secondary border-secondary/50 bg-secondary/5',
        'outline-destructive': 'text-destructive border-destructive/50 bg-destructive/5',
        'outline-success': 'text-success border-success/50 bg-success/5',
        'outline-warning': 'text-warning border-warning/50 bg-warning/5',
        'outline-info': 'text-info border-info/50 bg-info/5',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
