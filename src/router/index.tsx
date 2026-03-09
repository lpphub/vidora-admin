import { createBrowserRouter, Navigate } from 'react-router-dom'
import { NotFound, ServerError, Unauthorized } from '@/components/common/ErrorPage'
import DashboardLayout from '@/components/layout'
import Auth from '@/pages/auth'
import Categories from '@/pages/categories'
import Dashboard from '@/pages/dashboard'
import Profile from '@/pages/profile'
import Permissions from '@/pages/system/permissions'
import Roles from '@/pages/system/roles'
import Users from '@/pages/system/users'
import Tags from '@/pages/tags'
import { AuthGuard } from './guard'

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthGuard>
        <Auth />
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
      {
        path: 'system/users',
        element: <Users />,
      },
      {
        path: 'system/roles',
        element: <Roles />,
      },
      {
        path: 'system/permissions',
        element: <Permissions />,
      },
      {
        path: 'tags',
        element: <Tags />,
      },
      {
        path: 'categories',
        element: <Categories />,
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
