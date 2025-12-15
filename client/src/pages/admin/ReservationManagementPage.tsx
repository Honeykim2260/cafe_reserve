import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import { api } from '@/services/api'

interface Reservation {
  id: string
  userId: string
  cafeId: string
  seatId: string
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
  user: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  refund?: {
    id: string
    refundStatus: string
    refundAmount: number
  }
}

const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'PENDING', label: '대기중' },
  { value: 'CONFIRMED', label: '확정' },
  { value: 'CANCELLED', label: '취소됨' },
  { value: 'COMPLETED', label: '완료됨' },
] as const

export function ReservationManagementPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  
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
    
    loadReservations()
  }, [user, navigate, addNotification])

  const loadReservations = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/reservations')
      const reservationData = response.data.data || []
      
      // Transform API response to match admin page format
      const transformedReservations = reservationData.map((reservation: any) => ({
        ...reservation,
        cafe: reservation.cafe || { id: reservation.cafeId, name: 'Unknown Cafe', address: '' },
        seat: reservation.seat || { id: reservation.seatId, seatNumber: 'Unknown Seat', seatType: '1인석' },
        user: reservation.user || { id: reservation.userId, name: 'Unknown User', email: '' }
      }))
      
      setReservations(transformedReservations)
      addNotification({
        type: 'success',
        title: '예약 목록 로드 완료',
        message: `${transformedReservations.length}개의 예약을 불러왔습니다`
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: '로드 실패',
        message: '예약 목록을 불러올 수 없습니다'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateReservationStatus = async (reservationId: string, newStatus: string) => {
    try {
      setReservations(prev =>
        prev.map(reservation =>
          reservation.id === reservationId
            ? { ...reservation, status: newStatus as any }
            : reservation
        )
      )
      
      const reservation = reservations.find(r => r.id === reservationId)
      addNotification({
        type: 'success',
        title: '예약 상태 변경',
        message: `${reservation?.user.name}님의 예약이 ${getStatusLabel(newStatus)}(으)로 변경되었습니다`
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: '상태 변경 실패',
        message: '예약 상태를 변경할 수 없습니다'
      })
    }
  }

  const getStatusLabel = (status: string) => {
    const option = STATUS_OPTIONS.find(opt => opt.value === status)
    return option?.label || status
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-green-100 text-green-800'
    }
    
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`
  }

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatistics = () => {
    return {
      total: reservations.length,
      pending: reservations.filter(r => r.status === 'PENDING').length,
      confirmed: reservations.filter(r => r.status === 'CONFIRMED').length,
      cancelled: reservations.filter(r => r.status === 'CANCELLED').length,
      completed: reservations.filter(r => r.status === 'COMPLETED').length,
      totalRevenue: reservations
        .filter(r => r.status === 'COMPLETED')
        .reduce((sum, r) => sum + r.totalPrice, 0)
    }
  }

  const stats = getStatistics()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mr-4"></div>
          <span className="text-gray-600">예약 목록을 불러오는 중...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">예약 관리</h1>
          <p className="text-gray-600 mt-2">모든 예약을 조회하고 관리할 수 있습니다</p>
        </div>
        
        <button
          onClick={loadReservations}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          새로고침
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500">전체 예약</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-2xl font-semibold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-500">대기중</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-2xl font-semibold text-blue-600">{stats.confirmed}</p>
            <p className="text-sm text-gray-500">확정됨</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-2xl font-semibold text-green-600">{stats.completed}</p>
            <p className="text-sm text-gray-500">완료됨</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-2xl font-semibold text-red-600">{stats.cancelled}</p>
            <p className="text-sm text-gray-500">취소됨</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-2xl font-semibold text-green-700">₩{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500">총 수익</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="예약 ID, 사용자명, 이메일, 카페명으로 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0v4a4 4 0 018 0zm0 0V9a4 4 0 014 4v4m0 0a4 4 0 01-4 4H8a4 4 0 01-4-4v-4a4 4 0 014-4h4z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">예약이 없습니다</h3>
          <p className="text-gray-600">검색 조건에 맞는 예약을 찾을 수 없습니다.</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">예약 목록 ({filteredReservations.length}건)</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredReservations.map((reservation) => (
              <div key={reservation.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        {reservation.cafe.name}
                      </h4>
                      <span className={getStatusBadge(reservation.status)}>
                        {getStatusLabel(reservation.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><strong>예약 ID:</strong> {reservation.id}</p>
                        <p><strong>고객:</strong> {reservation.user.name} ({reservation.user.email})</p>
                        <p><strong>좌석:</strong> {reservation.seat.seatNumber} ({reservation.seat.seatType})</p>
                      </div>
                      
                      <div>
                        <p><strong>예약 시간:</strong> {new Date(reservation.startTime).toLocaleString('ko-KR')} ~ {new Date(reservation.endTime).toLocaleString('ko-KR')}</p>
                        <p><strong>결제 금액:</strong> ₩{reservation.totalPrice.toLocaleString()}</p>
                        <p><strong>예약일:</strong> {new Date(reservation.createdAt).toLocaleString('ko-KR')}</p>
                      </div>
                    </div>
                    
                    {reservation.notes && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600"><strong>메모:</strong> {reservation.notes}</p>
                      </div>
                    )}
                    
                    {reservation.refund && (
                      <div className="mt-3 p-3 bg-red-50 rounded-md">
                        <p className="text-sm text-red-700">
                          <strong>환불 정보:</strong> {reservation.refund.refundStatus === 'COMPLETED' ? '환불 완료' : '환불 처리중'} 
                          - ₩{reservation.refund.refundAmount.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-6">
                    {reservation.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => updateReservationStatus(reservation.id, 'CONFIRMED')}
                          className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                        >
                          승인
                        </button>
                        <button
                          onClick={() => updateReservationStatus(reservation.id, 'CANCELLED')}
                          className="px-3 py-1 text-sm font-medium text-red-600 border border-red-300 rounded hover:bg-red-50"
                        >
                          거부
                        </button>
                      </>
                    )}
                    
                    {reservation.status === 'CONFIRMED' && (
                      <button
                        onClick={() => updateReservationStatus(reservation.id, 'COMPLETED')}
                        className="px-3 py-1 text-sm font-medium text-green-600 border border-green-300 rounded hover:bg-green-50"
                      >
                        완료처리
                      </button>
                    )}
                    
                    <button
                      onClick={() => setSelectedReservation(reservation)}
                      className="px-3 py-1 text-sm font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      상세보기
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