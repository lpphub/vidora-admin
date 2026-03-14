import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import DashboardLayout from '@/shared/components/layout'
import { NotFound, ServerError, Unauthorized } from '@/shared/components/widgets/ErrorPage'
import { SkeletonPage } from '@/shared/components/widgets/SkeletonPage'
import { AuthGuard } from './guard'

const Auth = lazy(() => import('@/pages/AuthPage'))
const Categories = lazy(() => import('@/pages/CategoriesPage'))
const Dashboard = lazy(() => import('@/pages/DashboardPage'))
const Profile = lazy(() => import('@/pages/ProfilePage'))
const Permissions = lazy(() => import('@/pages/SystemPermissionsPage'))
const Roles = lazy(() => import('@/pages/SystemRolesPage'))
const Users = lazy(() => import('@/pages/SystemUsersPage'))
const Tags = lazy(() => import('@/pages/TagsPage'))

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
