'use client'

import type { ReactNode } from 'react'
import { SWRConfig } from 'swr'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        errorRetryCount: 1,
      }}
    >
      {children}
    </SWRConfig>
  )
}
