import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Role } from '../../../../shared/src/types'
import { ROUTES } from '@/constants'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: Role[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuthStore()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  // Check role permissions if specified
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              접근 권한이 없습니다
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              이 페이지에 접근할 권한이 없습니다.
            </p>
            <Navigate to={ROUTES.HOME} replace />
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}