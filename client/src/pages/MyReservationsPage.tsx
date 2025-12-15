import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReservationCard } from '@/components/reservations/ReservationCard'
import { ReservationService } from '@/services/reservationService'
import { useUiStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'

interface Reservation {
  id: string
  startTime: string
  endTime: string
  totalPrice: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  notes?: string
  cafe: {
    id: string
    name: string
    address: string
  }
  seat: {
    id: string
    seatNumber: string
    seatType: string
  }
  refund?: {
    id: string
    refundStatus: string
    refundAmount: number
  }
  createdAt: string
}

const STATUS_FILTERS = [
  { value: 'all', label: '전체' },
  { value: 'upcoming', label: '예정된 예약' },
  { value: 'completed', label: '완료됨' },
  { value: 'cancelled', label: '취소됨' },
] as const

export function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  const { addNotification } = useUiStore()
  const { user, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    if (!isAuthenticated) {
      navigate('/auth/login', { 
        state: { 
          from: '/my-reservations',
          message: '예약 목록을 확인하려면 로그인이 필요합니다.' 
        } 
      })
      return
    }
    
    loadReservations()
  }, [isAuthenticated, navigate])

  const loadReservations = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await ReservationService.getMyReservations()
      setReservations(data)
    } catch (error: any) {
      setError(error.response?.data?.error?.message || '예약 목록을 불러올 수 없습니다')
      addNotification({
        type: 'error',
        title: '오류',
        message: '예약 목록을 불러올 수 없습니다'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReservationUpdate = (updatedReservation: Reservation) => {
    setReservations(prev => 
      prev.map(reservation => 
        reservation.id === updatedReservation.id ? updatedReservation : reservation
      )
    )
    
    addNotification({
      type: 'success',
      title: '예약 취소 완료',
      message: '예약이 성공적으로 취소되었습니다'
    })
  }

  const filterReservations = (reservations: Reservation[]) => {
    const now = new Date()
    
    switch (statusFilter) {
      case 'upcoming':
        return reservations.filter(r => 
          r.status === 'CONFIRMED' && new Date(r.startTime) > now
        )
      case 'completed':
        return reservations.filter(r => r.status === 'COMPLETED')
      case 'cancelled':
        return reservations.filter(r => r.status === 'CANCELLED')
      default:
        return reservations
    }
  }

  const filteredReservations = filterReservations(reservations)

  const getStatusCounts = () => {
    const now = new Date()
    return {
      all: reservations.length,
      upcoming: reservations.filter(r => 
        r.status === 'CONFIRMED' && new Date(r.startTime) > now
      ).length,
      completed: reservations.filter(r => r.status === 'COMPLETED').length,
      cancelled: reservations.filter(r => r.status === 'CANCELLED').length,
    }
  }

  const statusCounts = getStatusCounts()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">내 예약</h1>
        
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mr-4"></div>
          <span className="text-gray-600 dark:text-gray-400">예약 목록을 불러오는 중...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">내 예약</h1>
        
        <button
          onClick={loadReservations}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          새로고침
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                오류가 발생했습니다
              </h3>
              <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
              <button
                onClick={loadReservations}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                statusFilter === filter.value
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {filter.label}
              <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 py-0.5 px-2 rounded-full text-xs">
                {statusCounts[filter.value as keyof typeof statusCounts]}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Empty State */}
      {filteredReservations.length === 0 && !loading && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0v4a4 4 0 018 0zm0 0V9a4 4 0 014 4v4m0 0a4 4 0 01-4 4H8a4 4 0 01-4-4v-4a4 4 0 014-4h4z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {statusFilter === 'all' ? '예약이 없습니다' : `${STATUS_FILTERS.find(f => f.value === statusFilter)?.label} 예약이 없습니다`}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {statusFilter === 'all' 
              ? '아직 예약한 내역이 없습니다. 카페를 둘러보고 예약해보세요!'
              : '해당 조건에 맞는 예약이 없습니다.'
            }
          </p>
          {statusFilter === 'all' && (
            <button
              onClick={() => window.location.href = '/cafes'}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              카페 둘러보기
            </button>
          )}
        </div>
      )}

      {/* Reservations List */}
      {filteredReservations.length > 0 && (
        <div className="space-y-6">
          {filteredReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onUpdate={handleReservationUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}