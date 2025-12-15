import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  Coffee, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Clock,
  MapPin,
  AlertCircle
} from 'lucide-react'


export function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 간단한 로딩 시뮬레이션
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">데이터를 불러오는 중...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
        <div className="flex gap-2">
          <button className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700">
            <TrendingUp className="w-4 h-4 mr-2" />
            보고서
          </button>
          <button className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700">
            <AlertCircle className="w-4 h-4 mr-2" />
            알림 설정
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <h3 className="text-sm font-medium text-gray-900">총 사용자</h3>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold text-gray-900">156</div>
            <p className="text-xs text-green-600">+12% 전월 대비</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <h3 className="text-sm font-medium text-gray-900">활성 사용자</h3>
            <Users className="h-4 w-4 text-green-600" />
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold text-gray-900">89</div>
            <p className="text-xs text-gray-500">현재 온라인</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <h3 className="text-sm font-medium text-gray-900">등록 카페</h3>
            <Coffee className="h-4 w-4 text-orange-600" />
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold text-gray-900">6</div>
            <p className="text-xs text-green-600">+1 이번주</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <h3 className="text-sm font-medium text-gray-900">총 예약</h3>
            <Calendar className="h-4 w-4 text-purple-600" />
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold text-gray-900">342</div>
            <p className="text-xs text-gray-500">누적</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <h3 className="text-sm font-medium text-gray-900">오늘 예약</h3>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold text-gray-900">23</div>
            <p className="text-xs text-green-600">+5 어제 대비</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <h3 className="text-sm font-medium text-gray-900">매출</h3>
            <DollarSign className="h-4 w-4 text-green-600" />
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold text-gray-900">₩2,450,000</div>
            <p className="text-xs text-gray-500">이번 달</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 최근 예약 */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b">
            <h3 className="font-semibold flex items-center gap-2 text-gray-900">
              <Calendar className="w-5 h-5" />
              최근 예약
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">김철수</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    스타벅스 강남점
                  </p>
                  <p className="text-xs text-gray-500">2024-08-31 14:00</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">확인됨</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">이영희</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    블루보틀 한남점
                  </p>
                  <p className="text-xs text-gray-500">2024-08-31 15:30</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">대기중</span>
              </div>
            </div>
            <Link to="/admin/reservations">
              <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700 font-medium">
                모든 예약 보기
              </button>
            </Link>
          </div>
        </div>

        {/* 빠른 액션 */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">빠른 액션</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 gap-3">
              <Link to="/admin/cafes">
                <button className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700">
                  <Coffee className="w-4 h-4 mr-2" />
                  카페 관리
                </button>
              </Link>
              <Link to="/admin/users">
                <button className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700">
                  <Users className="w-4 h-4 mr-2" />
                  사용자 관리
                </button>
              </Link>
              <Link to="/admin/reservations">
                <button className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  예약 관리
                </button>
              </Link>
              <button className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700">
                <TrendingUp className="w-4 h-4 mr-2" />
                매출 분석
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 시스템 상태 */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">시스템 상태</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-800">서버 상태</p>
                <p className="text-sm text-green-600">정상</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-800">데이터베이스</p>
                <p className="text-sm text-green-600">연결됨</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-yellow-800">백업</p>
                <p className="text-sm text-yellow-600">2시간 전</p>
              </div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}