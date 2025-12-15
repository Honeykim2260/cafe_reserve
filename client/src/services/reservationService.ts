import { apiClient } from './api'
import { ApiResponse } from '../../../shared/src/types'

export interface CancellationPreview {
  canCancel: boolean
  reason?: string
  calculation: {
    originalAmount: number
    refundAmount: number
    feeAmount: number
    feeRate: number
    hoursBeforeStart: number
  }
}

export interface CancellationRequest {
  reason: 'USER_REQUEST' | 'CAFE_CLOSURE' | 'EMERGENCY' | 'SYSTEM_ERROR' | 'PAYMENT_FAILED'
  note?: string
}

export interface CancellationResult {
  refundId: string
  originalAmount: number
  refundAmount: number
  feeAmount: number
  status: string
  transactionId?: string
}

export interface CancellationPolicy {
  freecancellationHours: number
  earlyRefundRate: number
  standardRefundRate: number
  lateRefundRate: number
  noRefundBeforeHours: number
  description?: string
}

export interface RefundInfo {
  id: string
  originalAmount: number
  refundAmount: number
  feeAmount: number
  refundStatus: string
  refundReason: string
  hoursBeforeStart: number
  appliedFeeRate: number
  processedAt?: string
  failureReason?: string
  reservation: {
    id: string
    startTime: string
    endTime: string
    cafe: {
      id: string
      name: string
    }
    seat: {
      seatNumber: string
      seatType: string
    }
  }
}

export class ReservationService {
  /**
   * 예약 취소 미리보기 (수수료 계산)
   */
  static async getCancellationPreview(reservationId: string): Promise<CancellationPreview> {
    const response = await apiClient.get<CancellationPreview>(
      `/api/reservations/${reservationId}/cancellation/preview`
    )
    return response.data!
  }

  /**
   * 예약 취소 실행
   */
  static async cancelReservation(
    reservationId: string, 
    request: CancellationRequest
  ): Promise<CancellationResult> {
    const response = await apiClient.post<CancellationResult>(
      `/api/reservations/${reservationId}/cancel`,
      request
    )
    return response.data!
  }

  /**
   * 카페의 취소 정책 조회
   */
  static async getCancellationPolicy(cafeId: string): Promise<{
    policy: CancellationPolicy
    description: string
  }> {
    const response = await apiClient.get<{
      policy: CancellationPolicy
      description: string
    }>(`/api/reservations/policies/cancellation/${cafeId}`)
    return response.data!
  }

  /**
   * 환불 정보 조회
   */
  static async getRefundInfo(refundId: string): Promise<RefundInfo> {
    const response = await apiClient.get<RefundInfo>(
      `/api/reservations/refunds/${refundId}`
    )
    return response.data!
  }

  /**
   * 내 예약 목록 조회
   */
  static async getMyReservations(): Promise<any[]> {
    const response = await apiClient.get<any[]>('/api/reservations/my', {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    return response.data || []
  }

  /**
   * 예약 상세 조회
   */
  static async getReservationById(reservationId: string): Promise<any> {
    const response = await apiClient.get<any>(`/api/reservations/${reservationId}`)
    return response.data!
  }

  /**
   * 예약 생성
   */
  static async createReservation(data: {
    cafeId: string
    seatId: string
    startTime: string
    endTime: string
    totalPrice: number
    notes?: string
  }): Promise<any> {
    const response = await apiClient.post<any>('/api/reservations', data)
    return response.data!
  }
}

export default ReservationService