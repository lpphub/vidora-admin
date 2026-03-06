import { useState } from 'react'
import { Header } from './Header'
import Main from './Main'
import { Sidebar } from './Sidebar'

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className='flex min-h-screen bg-background'>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div
        className='flex flex-1 flex-col transition-all duration-300'
        style={{ marginLeft: sidebarCollapsed ? '4rem' : '16rem' }}
      >
        <Header />
        <Main />
      </div>
    </div>
  )
}
