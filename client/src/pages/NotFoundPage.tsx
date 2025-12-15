import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            to={ROUTES.HOME}
            className="btn-primary w-full"
          >
            홈으로 돌아가기
          </Link>
          <Link 
            to={ROUTES.CAFES}
            className="btn-outline w-full"
          >
            카페 찾기
          </Link>
        </div>
      </div>
    </div>
  )
}