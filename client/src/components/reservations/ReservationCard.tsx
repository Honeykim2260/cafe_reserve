import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CancellationModal } from './CancellationModal'
import { RefundStatusCard } from './RefundStatusCard'
import { formatPrice, formatDateTime } from '../../../../shared/src/utils'

interface ReservationCardProps {
  reservation: {
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
  onUpdate?: (reservation: any) => void
}

const RESERVATION_STATUS_LABELS = {
  PENDING: '대기중',
  CONFIRMED: '확정됨',
  CANCELLED: '취소됨',
  COMPLETED: '완료됨'
} as const

const RESERVATION_STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  CONFIRMED: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  COMPLETED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
} as const

export function ReservationCard({ reservation, onUpdate }: ReservationCardProps) {
  const [showCancellationModal, setShowCancellationModal] = useState(false)
  const [showRefundStatus, setShowRefundStatus] = useState(false)
  const navigate = useNavigate()

  const isUpcoming = () => {
    const now = new Date()
    const startTime = new Date(reservation.startTime)
    return startTime > now && reservation.status === 'CONFIRMED'
  }

  const canCancel = () => {
    return isUpcoming() && reservation.status === 'CONFIRMED'
  }

  const handleCancellationSuccess = (result: any) => {
    // 예약 상태 업데이트
    const updatedReservation = {
      ...reservation,
      status: 'CANCELLED' as const,
      refund: {
        id: result.refundId,
        refundStatus: result.status,
        refundAmount: result.refundAmount
      }
    }
    
    onUpdate?.(updatedReservation)
    
    // 환불 상태 표시
    setShowRefundStatus(true)
  }

  const getStatusColor = (status: string) => {
    return RESERVATION_STATUS_COLORS[status as keyof typeof RESERVATION_STATUS_COLORS] || 
           RESERVATION_STATUS_COLORS.PENDING
  }

  const getStatusLabel = (status: string) => {
    return RESERVATION_STATUS_LABELS[status as keyof typeof RESERVATION_STATUS_LABELS] || status
  }

  const formatReservationTime = () => {
    const start = new Date(reservation.startTime)
    const end = new Date(reservation.endTime)
    
    const dateStr = start.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    })
    
    const timeStr = `${start.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    })} - ${end.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    })}`
    
    return { dateStr, timeStr }
  }

  const { dateStr, timeStr } = formatReservationTime()

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 
              className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
              onClick={() => navigate(`/cafes/${reservation.cafe.id}`)}
            >
              {reservation.cafe.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {reservation.cafe.address}
            </p>
          </div>
          
          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
            {getStatusLabel(reservation.status)}
          </span>
        </div>

        {/* Reservation Details */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">예약 정보</h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <div><strong>좌석:</strong> {reservation.seat.seatNumber}</div>
                <div><strong>타입:</strong> {reservation.seat.seatType}</div>
                <div><strong>금액:</strong> {formatPrice(reservation.totalPrice)}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">시간</h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <div><strong>날짜:</strong> {dateStr}</div>
                <div><strong>시간:</strong> {timeStr}</div>
              </div>
            </div>
          </div>

          {reservation.notes && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>메모:</strong> {reservation.notes}
              </p>
            </div>
          )}
        </div>

        {/* Refund Information */}
        {reservation.refund && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-yellow-800 dark:text-yellow-400 font-medium">
                  환불 처리 중
                </p>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  환불 금액: {formatPrice(reservation.refund.refundAmount)}
                </p>
              </div>
              
              <button
                onClick={() => setShowRefundStatus(true)}
                className="text-yellow-600 hover:text-yellow-800 text-sm underline"
              >
                환불 현황 보기
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500">
            예약일: {formatDateTime(new Date(reservation.createdAt))}
          </p>
          
          <div className="flex space-x-2">
            {canCancel() && (
              <button
                onClick={() => setShowCancellationModal(true)}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-md transition-colors"
              >
                취소하기
              </button>
            )}
            
            {reservation.status === 'CONFIRMED' && !isUpcoming() && (
              <button
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-md transition-colors"
              >
                리뷰 작성
              </button>
            )}
            
            <button
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              상세보기
            </button>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancellationModal && (
        <CancellationModal
          reservationId={reservation.id}
          isOpen={showCancellationModal}
          onClose={() => setShowCancellationModal(false)}
          onSuccess={handleCancellationSuccess}
        />
      )}

      {/* Refund Status Modal */}
      {showRefundStatus && reservation.refund && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <RefundStatusCard
              refundId={reservation.refund.id}
              onClose={() => setShowRefundStatus(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}