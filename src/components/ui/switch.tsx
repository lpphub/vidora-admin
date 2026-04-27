import { Switch as SwitchPrimitive } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/lib/utils'

function Switch({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: 'sm' | 'default'
}) {
  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      className={cn(
        'peer inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
        size === 'default' && 'h-5 w-9',
        size === 'sm' && 'h-4 w-7',
        'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot='switch-thumb'
        className={cn(
          'pointer-events-none block rounded-full bg-background ring-0 transition-transform',
          size === 'default' &&
            'size-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5',
          size === 'sm' &&
            'size-3 data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0.5'
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
