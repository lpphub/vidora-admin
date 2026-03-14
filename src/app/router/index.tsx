import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import DashboardLayout from '@/shared/components/layout'
import { NotFound, ServerError, Unauthorized } from '@/shared/components/widgets/ErrorPage'
import { SkeletonPage } from '@/shared/components/widgets/SkeletonPage'
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
        <Suspense fallback={<SkeletonPage />}>
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
          <Suspense fallback={<SkeletonPage />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<SkeletonPage />}>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: 'system/users',
        element: (
          <Suspense fallback={<SkeletonPage />}>
            <Users />
          </Suspense>
        ),
      },
      {
        path: 'system/roles',
        element: (
          <Suspense fallback={<SkeletonPage />}>
            <Roles />
          </Suspense>
        ),
      },
      {
        path: 'system/permissions',
        element: (
          <Suspense fallback={<SkeletonPage />}>
            <Permissions />
          </Suspense>
        ),
      },
      {
        path: 'tags',
        element: (
          <Suspense fallback={<SkeletonPage />}>
            <Tags />
          </Suspense>
        ),
      },
      {
        path: 'categories',
        element: (
          <Suspense fallback={<SkeletonPage />}>
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
