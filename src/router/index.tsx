import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import Dashboard from '@/pages/dashboard'
import Login from '@/pages/login'
import { useAuthStore } from '@/stores/auth'

// Auth Guard - redirects to login if not authenticated
function AuthGuard({
  children,
  requireAuth = false,
}: {
  children: React.ReactNode
  requireAuth?: boolean
}) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)

  if (requireAuth && !isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to='/dashboard' replace />
  }

  return <>{children}</>
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthGuard>
        <Login />
      </AuthGuard>
    ),
  },
  {
    path: '/',
    element: (
      <AuthGuard requireAuth>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to='/dashboard' replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
    ],
  },
])

export default router
