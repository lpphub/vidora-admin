import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export default function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className='flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900'>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div
        className='flex flex-1 flex-col overflow-hidden transition-all duration-300'
        style={{
          marginLeft: sidebarCollapsed ? '60px' : '240px',
        }}
      >
        <Header />
        <main className='flex-1 overflow-auto p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
