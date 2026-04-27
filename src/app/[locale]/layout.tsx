import type { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Providers } from '@/lib/query-client'
import { Toaster } from 'sonner'
import '@/index.css'

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            {children}
            <Toaster richColors position="top-right" />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
