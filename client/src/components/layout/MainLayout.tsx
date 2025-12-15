import { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { DarkModeToggle } from '@/components/ui/DarkModeToggle'
import { ROUTES } from '@/constants'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, logout, isAuthenticated, isLoading } = useAuthStore()
  const navigate = useNavigate()

  // 로딩 중이거나 토큰이 없으면 인증되지 않은 것으로 처리
  const isActuallyAuthenticated = isAuthenticated && !isLoading && user && user.email && localStorage.getItem('mycafe_token')

  const handleLogout = () => {
    logout()
    navigate(ROUTES.HOME)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to={ROUTES.HOME} className="text-xl font-bold text-primary hover:text-primary/80">
              MyCafe
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to={ROUTES.CAFES}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                카페 찾기
              </Link>
              {isActuallyAuthenticated && (
                <>
                  <Link
                    to={ROUTES.MY_RESERVATIONS}
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    내 예약
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link
                      to="/admin/dashboard"
                      className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                    >
                      관리자
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* 다크모드 토글 */}
            <DarkModeToggle />

            {isActuallyAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  안녕하세요, {user?.name || user?.email}님
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to={ROUTES.LOGIN}
                  className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  로그인
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="px-4 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 MyCafe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}