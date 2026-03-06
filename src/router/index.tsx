import { createBrowserRouter, Navigate } from 'react-router-dom'
import DashboardLayout from '@/components/layout'
import Dashboard from '@/pages/dashboard'
import Login from '@/pages/login'
import { AuthGuard } from './guard'

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
        <DashboardLayout />
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
