import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { NotFound, ServerError, Unauthorized } from '@/pages/ErrorPages'
import MainLayout from '@/shared/components/layout'
import { AuthGuard } from './guard'

const Auth = lazy(() => import('@/pages/Auth'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Profile = lazy(() => import('@/pages/Profile'))
const Permissions = lazy(() => import('@/pages/Permissions'))
const Roles = lazy(() => import('@/pages/Roles'))
const Users = lazy(() => import('@/pages/Users'))
const Tags = lazy(() => import('@/pages/Tags'))

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
