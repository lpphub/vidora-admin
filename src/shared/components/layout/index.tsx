import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar'
import { Header } from './Header'
import Main from './Main'
import { AppSidebar } from './Sidebar'

export default function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <Main />
      </SidebarInset>
    </SidebarProvider>
  )
}
