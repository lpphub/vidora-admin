import type { ReactNode } from 'react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Header } from '@/components/layout/Header'
import { AppSidebar } from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-auto w-full flex flex-col px-4 sm:px-6 py-4 sm:py-6 md:px-8 mx-auto xl:max-w-7xl overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
