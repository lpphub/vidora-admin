import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { NotFound, ServerError, Unauthorized } from '@/shared/components/common/ErrorPage'
import { PageSkeleton } from '@/shared/components/common/PageSkeleton'
import DashboardLayout from '@/shared/components/layout'
import { AuthGuard } from './guard'

const Auth = lazy(() => import('@/pages/Login'))
const Categories = lazy(() => import('@/pages/Categories'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Profile = lazy(() => import('@/pages/Profile'))
const Permissions = lazy(() => import('@/pages/system/Permissions'))
const Roles = lazy(() => import('@/pages/system/Roles'))
const Users = lazy(() => import('@/pages/system/Users'))
const Tags = lazy(() => import('@/pages/Tags'))

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthGuard>
        <Suspense fallback={<PageSkeleton />}>
          <Auth />
        </Suspense>
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
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: 'system/users',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Users />
          </Suspense>
        ),
      },
      {
        path: 'system/roles',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Roles />
          </Suspense>
        ),
      },
      {
        path: 'system/permissions',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Permissions />
          </Suspense>
        ),
      },
      {
        path: 'tags',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Tags />
          </Suspense>
        ),
      },
      {
        path: 'categories',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Categories />
          </Suspense>
        ),
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
