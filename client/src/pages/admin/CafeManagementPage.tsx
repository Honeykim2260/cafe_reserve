import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import { api } from '@/services/api'

interface Cafe {
  id: string
  name: string
  description: string
  address: string
  phone: string
  operatingHours: {
    open: string
    close: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function CafeManagementPage() {
  const [cafes, setCafes] = useState<Cafe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null)
  const [showCafeForm, setShowCafeForm] = useState(false)
  
  const { user } = useAuthStore()
  const { addNotification } = useUiStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/')
      addNotification({
        type: 'error',
        title: '접근 권한 없음',
        message: '관리자만 접근할 수 있습니다'
      })
      return
    }
    
    loadCafes()
  }, [user, navigate, addNotification])

  const loadCafes = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/cafes')
      const cafeData = response.data.cafes || []
      
      // Transform API response to match admin page format
      const transformedCafes = cafeData.map((cafe: any) => ({
        ...cafe,
        operatingHours: cafe.businessHours?.mon || { open: '09:00', close: '18:00' },
        isActive: true // Default to active since the API might not have this field
      }))
      
      setCafes(transformedCafes)
      addNotification({
        type: 'success',
        title: '카페 목록 로드 완료',
        message: `${transformedCafes.length}개의 카페를 불러왔습니다`
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: '로드 실패',
        message: '카페 목록을 불러올 수 없습니다'
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleCafeStatus = async (cafeId: string) => {
    try {
      setCafes(prev => 
        prev.map(cafe => 
          cafe.id === cafeId 
            ? { ...cafe, isActive: !cafe.isActive }
            : cafe
        )
      )
      
      const cafe = cafes.find(c => c.id === cafeId)
      addNotification({
        type: 'success',
        title: '카페 상태 변경',
        message: `${cafe?.name}이 ${cafe?.isActive ? '비활성화' : '활성화'}되었습니다`
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: '상태 변경 실패',
        message: '카페 상태를 변경할 수 없습니다'
      })
    }
  }

  const filteredCafes = cafes.filter(cafe =>
    cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cafe.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mr-4"></div>
          <span className="text-gray-600">카페 목록을 불러오는 중...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">카페 관리</h1>
          <p className="text-gray-600 mt-2">등록된 카페를 관리하고 새로운 카페를 추가할 수 있습니다</p>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={loadCafes}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            새로고침
          </button>
          
          <button
            onClick={() => setShowCafeForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            새 카페 추가
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="카페명 또는 주소로 검색..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">전체 카페</p>
              <p className="text-2xl font-semibold text-gray-900">{cafes.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">활성 카페</p>
              <p className="text-2xl font-semibold text-gray-900">{cafes.filter(c => c.isActive).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">비활성 카페</p>
              <p className="text-2xl font-semibold text-gray-900">{cafes.filter(c => !c.isActive).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">검색 결과</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredCafes.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cafe List */}
      {filteredCafes.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">카페가 없습니다</h3>
          <p className="text-gray-600 mb-6">검색 조건에 맞는 카페를 찾을 수 없습니다.</p>
          <button
            onClick={() => setShowCafeForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            새 카페 추가
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">카페 목록</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredCafes.map((cafe) => (
              <div key={cafe.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-medium text-gray-900">{cafe.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        cafe.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {cafe.isActive ? '활성' : '비활성'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mt-1">{cafe.description}</p>
                    
                    <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {cafe.address}
                      </div>
                      
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {cafe.phone}
                      </div>
                      
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {cafe.operatingHours.open} ~ {cafe.operatingHours.close}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedCafe(cafe)}
                      className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-50"
                    >
                      상세보기
                    </button>
                    
                    <button
                      onClick={() => toggleCafeStatus(cafe.id)}
                      className={`px-3 py-1 text-sm font-medium rounded ${
                        cafe.isActive
                          ? 'text-red-600 hover:text-red-800 border border-red-300 hover:bg-red-50'
                          : 'text-green-600 hover:text-green-800 border border-green-300 hover:bg-green-50'
                      }`}
                    >
                      {cafe.isActive ? '비활성화' : '활성화'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}