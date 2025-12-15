import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to={ROUTES.HOME}>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              MyCafe
            </h1>
          </Link>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            카페 좌석 예약 서비스
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link 
            to={ROUTES.HOME}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}