import { useState, useEffect } from 'react'
import { ReservationService, RefundInfo } from '@/services/reservationService'
import { formatPrice, formatDateTime } from '../../../../shared/src/utils'

interface RefundStatusCardProps {
  refundId: string
  onClose?: () => void
}

const REFUND_STATUS_LABELS = {
  PENDING: '환불 대기',
  PROCESSING: '환불 처리 중',
  COMPLETED: '환불 완료',
  FAILED: '환불 실패',
  CANCELLED: '환불 취소됨'
} as const

const REFUND_STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  PROCESSING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  FAILED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  CANCELLED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
} as const

export function RefundStatusCard({ refundId, onClose }: RefundStatusCardProps) {
  const [refundInfo, setRefundInfo] = useState<RefundInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRefundInfo()
  }, [refundId])

  const loadRefundInfo = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const info = await ReservationService.getRefundInfo(refundId)
      setRefundInfo(info)
    } catch (error: any) {
      setError(error.response?.data?.error?.message || '환불 정보를 불러올 수 없습니다')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    return REFUND_STATUS_COLORS[status as keyof typeof REFUND_STATUS_COLORS] || 
           REFUND_STATUS_COLORS.PENDING
  }

  const getStatusLabel = (status: string) => {
    return REFUND_STATUS_LABELS[status as keyof typeof REFUND_STATUS_LABELS] || status
  }

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'PENDING': return 25
      case 'PROCESSING': return 75
      case 'COMPLETED': return 100
      case 'FAILED': return 100
      case 'CANCELLED': return 100
      default: return 0
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">환불 정보 로딩 중...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-red-700 dark:text-red-400">{error}</p>
          <button
            onClick={loadRefundInfo}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  if (!refundInfo) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            환불 처리 현황
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            환불 ID: {refundInfo.id}
          </p>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        )}
      </div>

      {/* Status Badge and Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(refundInfo.refundStatus)}`}>
            {getStatusLabel(refundInfo.refundStatus)}
          </span>
          <span className="text-sm text-gray-500">
            {getProgressPercentage(refundInfo.refundStatus)}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              refundInfo.refundStatus === 'COMPLETED' 
                ? 'bg-green-500' 
                : refundInfo.refundStatus === 'FAILED'
                ? 'bg-red-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${getProgressPercentage(refundInfo.refundStatus)}%` }}
          ></div>
        </div>
      </div>

      {/* 예약 정보 */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">예약 정보</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <div><strong>카페:</strong> {refundInfo.reservation.cafe.name}</div>
          <div><strong>좌석:</strong> {refundInfo.reservation.seat.seatNumber} ({refundInfo.reservation.seat.seatType})</div>
          <div><strong>예약 시간:</strong> {formatDateTime(new Date(refundInfo.reservation.startTime))} - {formatDateTime(new Date(refundInfo.reservation.endTime))}</div>
        </div>
      </div>

      {/* 환불 금액 정보 */}
      <div className="space-y-3 mb-4">
        <h3 className="font-medium text-gray-900 dark:text-white">환불 금액</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">원래 결제 금액</span>
            <span>{formatPrice(refundInfo.originalAmount)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">취소 수수료 ({refundInfo.appliedFeeRate.toFixed(1)}%)</span>
            <span className="text-red-600">{formatPrice(refundInfo.feeAmount)}</span>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-600 pt-2 flex justify-between font-semibold">
            <span className="text-gray-900 dark:text-white">환불 금액</span>
            <span className="text-green-600">{formatPrice(refundInfo.refundAmount)}</span>
          </div>
        </div>
      </div>

      {/* 환불 사유 */}
      <div className="mb-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">환불 사유</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {refundInfo.refundReason}
        </p>
      </div>

      {/* 처리 정보 */}
      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        {refundInfo.processedAt && (
          <div>
            <strong>처리 완료:</strong> {formatDateTime(new Date(refundInfo.processedAt))}
          </div>
        )}
        
        <div>
          <strong>예약 취소 시점:</strong> 예약 시작 {refundInfo.hoursBeforeStart}시간 전
        </div>

        {refundInfo.failureReason && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 mt-3">
            <strong className="text-red-700 dark:text-red-400">실패 사유:</strong>
            <p className="text-red-600 dark:text-red-300 mt-1">{refundInfo.failureReason}</p>
          </div>
        )}
      </div>

      {/* 상태별 추가 안내 */}
      {refundInfo.refundStatus === 'PENDING' && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mt-4">
          <p className="text-yellow-800 dark:text-yellow-400 text-sm">
            <strong>환불 대기 중입니다.</strong> 환불 처리가 곧 시작됩니다.
          </p>
        </div>
      )}

      {refundInfo.refundStatus === 'PROCESSING' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 mt-4">
          <p className="text-blue-800 dark:text-blue-400 text-sm">
            <strong>환불 처리 중입니다.</strong> 결제 수단으로 환불이 진행 중이며, 
            영업일 기준 1-3일 소요될 수 있습니다.
          </p>
        </div>
      )}

      {refundInfo.refundStatus === 'COMPLETED' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3 mt-4">
          <p className="text-green-800 dark:text-green-400 text-sm">
            <strong>환불이 완료되었습니다.</strong> 결제하신 카드나 계좌로 환불되었습니다. 
            영업일 기준 1-3일 내에 확인 가능합니다.
          </p>
        </div>
      )}
    </div>
  )
}