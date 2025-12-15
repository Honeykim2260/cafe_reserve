import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { AlertCircle, ShieldX } from 'lucide-react'

interface AdminRouteProps {
  children: ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()

  // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  // 관리자 권한이 없는 경우 액세스 거부 페이지 표시
  if (user?.role !== 'ADMIN') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md border">
            <div className="p-6">
              <div className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <ShieldX className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  접근 권한이 없습니다
                </h2>
                <p className="text-gray-600 mb-6">
                  이 페이지는 관리자만 접근할 수 있습니다.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-yellow-800">
                        현재 사용자: {user?.name || '알 수 없음'}
                      </p>
                      <p className="text-sm text-yellow-600">
                        권한: {user?.role || '없음'}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  이전 페이지로 돌아가기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 관리자인 경우 자식 컴포넌트 렌더링
  return <>{children}</>
}