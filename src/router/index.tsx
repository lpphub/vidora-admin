import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { NotFound, ServerError, Unauthorized } from '@/components/common/ErrorPage'
import { PageSkeleton } from '@/components/common/PageSkeleton'
import DashboardLayout from '@/components/layout'
import { AuthGuard } from './guard'

const Auth = lazy(() => import('@/features/auth'))
const Categories = lazy(() => import('@/features/categories'))
const Dashboard = lazy(() => import('@/features/dashboard'))
const Profile = lazy(() => import('@/features/profile'))
const Permissions = lazy(() => import('@/features/system/permissions'))
const Roles = lazy(() => import('@/features/system/roles'))
const Users = lazy(() => import('@/features/system/users'))
const Tags = lazy(() => import('@/features/tags'))

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
