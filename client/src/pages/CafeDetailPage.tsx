import { useState, useMemo, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Seat, Cafe } from '@/types'
import { formatPrice, getCurrentBusinessHours, getValidTimeOptions, filterPastTimeOptions, getBusinessHoursForDate } from '@/utils/format'
import { ReservationService } from '@/services/reservationService'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import { ROUTES } from '@/constants'
import { api } from '@/services/api'

const SEAT_TYPE_LABELS = {
  SINGLE: '1인석',
  DOUBLE: '2인석',
  GROUP: '그룹석',
  STUDY: '스터디석'
}

export function CafeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const { addNotification } = useUiStore()
  
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)
  const [reservationDate, setReservationDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [duration, setDuration] = useState(2)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [reservationData, setReservationData] = useState<any>(null)
  const [cafe, setCafe] = useState<Cafe | null>(null)
  const [seats, setSeats] = useState<Seat[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch cafe and seats data
  useEffect(() => {
    const fetchCafeData = async () => {
      if (!id) return

      try {
        setLoading(true)
        const [cafeResponse, seatsResponse] = await Promise.all([
          api.get(`/api/cafes/${id}`),
          api.get(`/api/cafes/${id}/seats`)
        ])
        
        setCafe(cafeResponse.data.cafe)
        setSeats(seatsResponse.data || [])
      } catch (error) {
        console.error('Failed to fetch cafe data:', error)
        addNotification({
          type: 'error',
          title: '오류',
          message: '카페 정보를 불러올 수 없습니다'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCafeData()
  }, [id, addNotification])

  const availableSeats = useMemo(() => {
    return seats.filter(seat => seat.isAvailable)
  }, [seats])

  const totalPrice = useMemo(() => {
    if (!selectedSeat) return 0
    return selectedSeat.hourlyRate * duration
  }, [selectedSeat, duration])

  // 유효한 시간 옵션 계산
  const validTimeOptions = useMemo(() => {
    if (!cafe?.businessHours || !reservationDate) {
      return []
    }
    
    const timeOptions = getValidTimeOptions(cafe.businessHours, reservationDate, duration)
    return filterPastTimeOptions(timeOptions, reservationDate)
  }, [cafe?.businessHours, reservationDate, duration])

  // 선택한 날짜의 영업시간 정보
  const selectedDateInfo = useMemo(() => {
    if (!cafe?.businessHours || !reservationDate) {
      return null
    }
    return getBusinessHoursForDate(cafe.businessHours, reservationDate)
  }, [cafe?.businessHours, reservationDate])

  const handlePayment = async (paymentMethod: string) => {
    try {
      // 임시 결제 처리 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      addNotification({
        type: 'success',
        title: '결제 완료',
        message: '예약이 완료되었습니다!'
      })

      setShowPaymentModal(false)
      navigate(ROUTES.MY_RESERVATIONS)
      
    } catch (error) {
      addNotification({
        type: 'error',
        title: '결제 실패',
        message: '결제 처리 중 오류가 발생했습니다.'
      })
    }
  }

  const handleReservation = async () => {
    if (!isAuthenticated) {
      addNotification({
        type: 'warning',
        title: '로그인 필요',
        message: '예약하려면 로그인이 필요합니다.'
      })
      navigate(ROUTES.LOGIN)
      return
    }

    if (!selectedSeat || !reservationDate || !startTime) {
      addNotification({
        type: 'error',
        title: '입력 오류',
        message: '좌석, 날짜, 시간을 모두 선택해주세요.'
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 시작 시간과 종료 시간 계산
      const [hours, minutes] = startTime.split(':').map(Number)
      const startDateTime = new Date(reservationDate)
      startDateTime.setHours(hours, minutes, 0, 0)
      
      const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 60 * 1000)

      // 예약 생성 요청
      const reservation = await ReservationService.createReservation({
        cafeId: id!,
        seatId: selectedSeat.id,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        totalPrice,
        notes: notes || undefined
      })

      // 예약 데이터를 저장하고 결제 모달 표시
      setReservationData(reservation)
      setShowPaymentModal(true)
      
    } catch (error: any) {
      console.error('예약 생성 실패:', error)
      addNotification({
        type: 'error',
        title: '예약 실패',
        message: error.response?.data?.error?.message || '예약 중 오류가 발생했습니다.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!cafe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">카페를 찾을 수 없습니다</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">요청하신 카페 정보가 존재하지 않습니다.</p>
          <Link
            to="/cafes"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            카페 목록으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  const currentHours = getCurrentBusinessHours(cafe.businessHours)
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/cafes"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          카페 목록으로 돌아가기
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{cafe.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">{cafe.description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{cafe.address}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(cafe.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{cafe.rating}</span>
                <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">({cafe.reviewCount}개)</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                currentHours.isOpen ? 'bg-green-500' : 'bg-red-500'
              }`} />
              {currentHours.isOpen ? '영업중' : '영업종료'} • {currentHours.hours}
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      {cafe.images && cafe.images.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4 h-64">
            <img
              src={cafe.images[0]}
              alt={cafe.name}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="grid grid-cols-2 gap-2">
              {cafe.images.slice(1, 3).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${cafe.name} ${index + 2}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Cafe Info */}
        <div className="lg:col-span-2">
          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">카페 정보</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">{cafe.address}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">{cafe.phone}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">
                  가격대: {cafe.priceRange === 'LOW' ? '저렴' : cafe.priceRange === 'MEDIUM' ? '보통' : '비쌈'}
                </span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">편의시설</h2>
            <div className="flex flex-wrap gap-2">
              {cafe.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Seat Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">좌석 선택</h2>
            
            {availableSeats.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">예약 가능한 좌석이 없습니다</h3>
                <p className="text-gray-600 dark:text-gray-400">현재 예약 가능한 좌석이 없습니다. 나중에 다시 시도해주세요.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableSeats.map((seat) => (
                  <div
                    key={seat.id}
                    onClick={() => setSelectedSeat(seat)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedSeat?.id === seat.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {seat.seatNumber} - {SEAT_TYPE_LABELS[seat.seatType]}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{seat.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600 dark:text-blue-400">
                          {formatPrice(seat.hourlyRate)}/시간
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          최대 {seat.capacity}명
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {seat.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Reservation Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">예약하기</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  예약 날짜
                </label>
                <input
                  type="date"
                  value={reservationDate}
                  onChange={(e) => {
                    setReservationDate(e.target.value)
                    setStartTime('') // 날짜 변경 시 시간 초기화
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  시작 시간
                </label>
                {selectedDateInfo && !selectedDateInfo.isOpen ? (
                  <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400">
                    {selectedDateInfo.dayName} 휴무
                  </div>
                ) : (
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    disabled={!reservationDate || validTimeOptions.length === 0}
                  >
                    <option value="">시간 선택</option>
                    {validTimeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                )}
                {selectedDateInfo && selectedDateInfo.isOpen && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    영업시간: {selectedDateInfo.openTime} - {selectedDateInfo.closeTime}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  이용 시간
                </label>
                <select
                  value={duration}
                  onChange={(e) => {
                    setDuration(Number(e.target.value))
                    setStartTime('') // 이용시간 변경 시 시간 초기화
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value={1}>1시간</option>
                  <option value={2}>2시간</option>
                  <option value={3}>3시간</option>
                  <option value={4}>4시간</option>
                  <option value={6}>6시간</option>
                  <option value={8}>8시간</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  요청사항 (선택)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="특별한 요청사항이 있으시면 입력해주세요."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              {selectedSeat && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">선택된 좌석</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedSeat.seatNumber} - {SEAT_TYPE_LABELS[selectedSeat.seatType]}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {selectedSeat.description}
                  </p>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                    <span className="font-medium text-gray-900 dark:text-white">총 금액</span>
                    <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatPrice(selectedSeat.hourlyRate)} × {duration}시간
                  </p>
                </div>
              )}
              
              <button
                onClick={handleReservation}
                disabled={!selectedSeat || !reservationDate || !startTime || isSubmitting}
                className={`w-full py-3 px-4 rounded-md font-medium ${
                  selectedSeat && reservationDate && startTime && !isSubmitting
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? '예약 중...' : '예약하기'}
              </button>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                예약 후 결제를 진행합니다
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && reservationData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              결제하기
            </h2>
            
            <div className="mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  예약 정보
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>카페:</span>
                    <span>{cafe?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>좌석:</span>
                    <span>{selectedSeat?.seatNumber} ({SEAT_TYPE_LABELS[selectedSeat?.seatType as keyof typeof SEAT_TYPE_LABELS]})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>날짜:</span>
                    <span>{reservationDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>시간:</span>
                    <span>{startTime} ({duration}시간)</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-900 dark:text-white pt-2 border-t">
                    <span>총 결제금액:</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  결제 방법 선택
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handlePayment('card')}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    신용/체크카드
                  </button>
                  <button
                    onClick={() => handlePayment('kakao')}
                    className="w-full p-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center font-medium"
                  >
                    카카오페이
                  </button>
                  <button
                    onClick={() => handlePayment('toss')}
                    className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center font-medium"
                  >
                    토스페이
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}