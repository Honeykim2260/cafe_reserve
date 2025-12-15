import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { useIsAuthenticated } from '@/stores/authStore'

export function HomePage() {
  const isAuthenticated = useIsAuthenticated()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          MyCafe에 오신 것을 환영합니다
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          원하는 카페를 찾고, 좌석을 예약하여 편안한 시간을 보내세요.
        </p>
        
        {!isAuthenticated && (
          <div className="flex justify-center space-x-4 mt-6">
            <Link 
              to={ROUTES.LOGIN}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              로그인하기
            </Link>
            <Link 
              to={ROUTES.REGISTER}
              className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              회원가입하기
            </Link>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">카페 검색</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              위치, 가격, 시설 등 다양한 조건으로 카페를 찾아보세요.
            </p>
            <Link 
              to={ROUTES.CAFES}
              className="btn-primary"
            >
              카페 찾기
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">실시간 예약</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              원하는 시간에 좌석을 실시간으로 예약할 수 있습니다.
            </p>
            <Link 
              to={ROUTES.CAFES}
              className="btn-secondary"
            >
              예약하기
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">예약 관리</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              내 예약을 확인하고 변경 또는 취소할 수 있습니다.
            </p>
            <Link 
              to={ROUTES.MY_RESERVATIONS}
              className="btn-outline"
            >
              예약 확인
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}