import { useState, useEffect } from 'react'
import { ReservationService, CancellationPreview, CancellationRequest } from '@/services/reservationService'
import { formatPrice } from '../../../../shared/src/utils'

interface CancellationModalProps {
  reservationId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: (result: any) => void
}

const CANCELLATION_REASONS = [
  { value: 'USER_REQUEST', label: '개인 사정으로 인한 취소' },
  { value: 'EMERGENCY', label: '긴급 상황' },
  { value: 'CAFE_CLOSURE', label: '카페 휴업/문제' },
] as const

export function CancellationModal({ 
  reservationId, 
  isOpen, 
  onClose, 
  onSuccess 
}: CancellationModalProps) {
  const [preview, setPreview] = useState<CancellationPreview | null>(null)
  const [loading, setLoading] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    reason: 'USER_REQUEST' as CancellationRequest['reason'],
    note: ''
  })

  // 취소 미리보기 조회
  useEffect(() => {
    if (isOpen && reservationId) {
      loadCancellationPreview()
    }
  }, [isOpen, reservationId])

  const loadCancellationPreview = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const previewData = await ReservationService.getCancellationPreview(reservationId)
      setPreview(previewData)
    } catch (error: any) {
      setError(error.response?.data?.error?.message || '취소 정보를 불러올 수 없습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!preview?.canCancel) return

    setCancelling(true)
    setError(null)

    try {
      const result = await ReservationService.cancelReservation(reservationId, {
        reason: formData.reason,
        note: formData.note || undefined
      })

      onSuccess(result)
      onClose()
    } catch (error: any) {
      setError(error.response?.data?.error?.message || '취소 처리 중 오류가 발생했습니다')
    } finally {
      setCancelling(false)
    }
  }

  const formatHoursText = (hours: number) => {
    if (hours < 0) return '시작됨'
    if (hours === 0) return '곧 시작'
    if (hours < 24) return `${hours}시간 후`
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    return `${days}일 ${remainingHours}시간 후`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            예약 취소
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">취소 정보 확인 중...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {preview && !loading && (
            <>
              {/* 취소 불가능한 경우 */}
              {!preview.canCancel && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                  <p className="text-yellow-800 dark:text-yellow-400 font-medium mb-2">
                    취소할 수 없습니다
                  </p>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                    {preview.reason}
                  </p>
                </div>
              )}

              {/* 취소 가능한 경우 */}
              {preview.canCancel && (
                <>
                  {/* 취소 정보 요약 */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                      취소 수수료 안내
                    </h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">예약 시작까지</span>
                        <span className="font-medium">{formatHoursText(preview.calculation.hoursBeforeStart)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">원래 결제 금액</span>
                        <span>{formatPrice(preview.calculation.originalAmount)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">취소 수수료 ({preview.calculation.feeRate.toFixed(1)}%)</span>
                        <span className="text-red-600">{formatPrice(preview.calculation.feeAmount)}</span>
                      </div>
                      
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-900 dark:text-white">환불 예정 금액</span>
                          <span className="text-green-600">{formatPrice(preview.calculation.refundAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 취소 사유 선택 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      취소 사유 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value as any })}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {CANCELLATION_REASONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 추가 메모 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      추가 메모 (선택)
                    </label>
                    <textarea
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      placeholder="취소 사유에 대한 추가 설명이 있으면 입력해주세요..."
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={3}
                    />
                  </div>

                  {/* 환불 안내 */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                    <p className="text-blue-800 dark:text-blue-400 text-sm">
                      <strong>환불 안내:</strong> 취소 확인 후 결제 수단으로 자동 환불됩니다. 
                      환불 처리는 영업일 기준 1-3일 소요될 수 있습니다.
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={cancelling}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md disabled:opacity-50"
          >
            닫기
          </button>
          
          {preview?.canCancel && (
            <button
              onClick={handleCancel}
              disabled={cancelling || loading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 flex items-center"
            >
              {cancelling && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {cancelling ? '취소 처리 중...' : '예약 취소'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}