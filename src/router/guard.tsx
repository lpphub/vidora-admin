import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean // true = 需要登录, false/undefined = 公开路由
}

// 统一的路由守卫组件
export function AuthGuard({ children, requireAuth = false }: AuthGuardProps) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  // 需要登录但未登录 -> 跳转登录页
  if (requireAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  // 不需要登录但已登录 -> 跳转首页
  if (!requireAuth && isAuthenticated) {
    return <Navigate to='/dashboard' replace />
  }

  return <>{children}</>
}
