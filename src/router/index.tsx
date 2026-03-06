import { createBrowserRouter, Navigate } from 'react-router-dom'
import { NotFound, ServerError, Unauthorized } from '@/components/common/ErrorPage'
import DashboardLayout from '@/components/layout'
import Dashboard from '@/pages/dashboard'
import Login from '@/pages/login'
import Profile from '@/pages/profile'
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
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '/401',
    element: <Unauthorized />,
  },
  {
    path: '/500',
    element: <ServerError />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

export default router
