import { prisma } from '@/config/database'
import { CancellationReason } from '@prisma/client'
import { AppError } from '@/middleware/errorHandler'
import { logger } from '@/utils/logger'

export interface CancellationCalculation {
  originalAmount: number
  refundAmount: number
  feeAmount: number
  feeRate: number
  hoursBeforeStart: number
  canCancel: boolean
  reason?: string
}

export interface CancellationRequest {
  reservationId: string
  reason: CancellationReason
  note?: string
  userId: string
}

export class CancellationService {
  /**
   * 취소 수수료를 계산합니다
   * @param reservationId 예약 ID
   * @returns 취소 수수료 계산 결과
   */
  static async calculateCancellationFee(reservationId: string): Promise<CancellationCalculation> {
    // 예약 정보 조회
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        cafe: {
          include: {
            cancellationPolicy: true
          }
        },
        payment: true
      }
    })

    if (!reservation) {
      throw new AppError('예약을 찾을 수 없습니다', 404, 'RESERVATION_NOT_FOUND')
    }

    if (reservation.status === 'CANCELLED') {
      throw new AppError('이미 취소된 예약입니다', 400, 'ALREADY_CANCELLED')
    }

    if (reservation.status === 'COMPLETED') {
      throw new AppError('이미 완료된 예약입니다', 400, 'ALREADY_COMPLETED')
    }

    // 결제 정보 확인
    if (!reservation.payment || reservation.payment.paymentStatus !== 'completed') {
      throw new AppError('결제가 완료되지 않은 예약입니다', 400, 'PAYMENT_NOT_COMPLETED')
    }

    const originalAmount = reservation.payment.amount
    const now = new Date()
    const startTime = reservation.startTime

    // 예약 시작 시간까지 남은 시간 계산 (시간 단위)
    const hoursBeforeStart = Math.floor((startTime.getTime() - now.getTime()) / (1000 * 60 * 60))

    // 이미 시작된 예약인지 확인
    if (hoursBeforeStart < 0) {
      return {
        originalAmount,
        refundAmount: 0,
        feeAmount: originalAmount,
        feeRate: 100,
        hoursBeforeStart,
        canCancel: false,
        reason: '이미 시작된 예약은 취소할 수 없습니다'
      }
    }

    // 카페의 취소 정책 조회 (없으면 기본 정책 사용)
    const cancellationPolicy = reservation.cafe.cancellationPolicy || {
      freecancellationHours: 24,
      earlyRefundRate: 100.0,
      standardRefundRate: 50.0,
      lateRefundRate: 0.0,
      noRefundBeforeHours: 2
    }

    let feeRate: number
    let canCancel = true
    let reason: string | undefined

    // 취소 수수료율 결정
    if (hoursBeforeStart >= cancellationPolicy.freecancellationHours) {
      // 무료 취소 기간
      feeRate = (100 - cancellationPolicy.earlyRefundRate) / 100
    } else if (hoursBeforeStart >= cancellationPolicy.noRefundBeforeHours) {
      // 일반 취소 기간
      feeRate = (100 - cancellationPolicy.standardRefundRate) / 100
    } else {
      // 늦은 취소 기간
      feeRate = (100 - cancellationPolicy.lateRefundRate) / 100
      
      if (cancellationPolicy.lateRefundRate === 0) {
        canCancel = false
        reason = `예약 시작 ${cancellationPolicy.noRefundBeforeHours}시간 전부터는 취소할 수 없습니다`
      }
    }

    const feeAmount = Math.round(originalAmount * feeRate)
    const refundAmount = originalAmount - feeAmount

    return {
      originalAmount,
      refundAmount,
      feeAmount,
      feeRate: feeRate * 100, // 백분율로 변환
      hoursBeforeStart,
      canCancel,
      reason
    }
  }

  /**
   * 예약 취소 가능 여부를 확인합니다 (임시 Mock 데이터 사용)
   * @param reservationId 예약 ID
   * @returns 취소 가능 여부와 정보
   */
  static async canCancelReservation(reservationId: string): Promise<{
    canCancel: boolean
    reason?: string
    calculation: CancellationCalculation
  }> {
    try {
      // 임시로 Mock 데이터 사용
      const { mockReservations, mockCancellationPolicies } = await import('@/data/mockReservations')
      
      const reservation = mockReservations.find(r => r.id === reservationId)
      if (!reservation) {
        throw new AppError('예약을 찾을 수 없습니다', 404, 'RESERVATION_NOT_FOUND')
      }

      // 이미 취소되었거나 완료된 예약 체크
      if (reservation.status === 'CANCELLED') {
        return {
          canCancel: false,
          reason: '이미 취소된 예약입니다',
          calculation: {
            originalAmount: reservation.totalPrice,
            refundAmount: 0,
            feeAmount: reservation.totalPrice,
            feeRate: 100,
            hoursBeforeStart: -1,
            canCancel: false
          }
        }
      }

      if (reservation.status === 'COMPLETED') {
        return {
          canCancel: false,
          reason: '이미 완료된 예약입니다',
          calculation: {
            originalAmount: reservation.totalPrice,
            refundAmount: 0,
            feeAmount: reservation.totalPrice,
            feeRate: 100,
            hoursBeforeStart: -1,
            canCancel: false
          }
        }
      }

      // 시간 계산
      const now = new Date()
      const startTime = new Date(reservation.startTime)
      const hoursBeforeStart = Math.floor((startTime.getTime() - now.getTime()) / (1000 * 60 * 60))

      // 취소 정책 조회
      const policy = mockCancellationPolicies[reservation.cafeId as keyof typeof mockCancellationPolicies] || {
        freeCancellationHours: 24,
        earlyRefundRate: 100,
        standardRefundRate: 80,
        lateRefundRate: 50,
        noRefundBeforeHours: 2
      }

      let canCancel = true
      let feeRate = 0
      let reason: string | undefined

      // 취소 불가 시간대
      if (hoursBeforeStart < policy.noRefundBeforeHours) {
        canCancel = false
        reason = `예약 시작 ${policy.noRefundBeforeHours}시간 전부터는 취소할 수 없습니다`
        feeRate = 100
      }
      // 무료 취소 기간
      else if (hoursBeforeStart >= policy.freeCancellationHours) {
        feeRate = 100 - policy.earlyRefundRate
      }
      // 일반 취소 기간
      else if (hoursBeforeStart >= 24) {
        feeRate = 100 - policy.standardRefundRate
      }
      // 늦은 취소 기간
      else {
        feeRate = 100 - policy.lateRefundRate
      }

      const originalAmount = reservation.totalPrice
      const refundAmount = canCancel ? Math.floor(originalAmount * ((100 - feeRate) / 100)) : 0
      const feeAmount = originalAmount - refundAmount

      return {
        canCancel,
        reason,
        calculation: {
          originalAmount,
          refundAmount,
          feeAmount,
          feeRate,
          hoursBeforeStart: Math.max(0, hoursBeforeStart),
          canCancel,
          reason
        }
      }
    } catch (error) {
      if (error instanceof AppError) {
        return {
          canCancel: false,
          reason: error.message,
          calculation: {
            originalAmount: 0,
            refundAmount: 0,
            feeAmount: 0,
            feeRate: 100,
            hoursBeforeStart: 0,
            canCancel: false,
            reason: error.message
          }
        }
      }
      throw error
    }
  }

  /**
   * 카페의 취소 정책을 조회합니다 (임시 Mock 데이터 사용)
   * @param cafeId 카페 ID
   * @returns 취소 정책
   */
  static async getCancellationPolicy(cafeId: string) {
    // 임시로 Mock 데이터 사용
    const { mockCancellationPolicies } = await import('@/data/mockReservations')
    
    const policy = mockCancellationPolicies[cafeId as keyof typeof mockCancellationPolicies]

    // 정책이 없으면 기본 정책 반환
    if (!policy) {
      return {
        freecancellationHours: 24,
        earlyRefundRate: 100.0,
        standardRefundRate: 50.0,
        lateRefundRate: 0.0,
        noRefundBeforeHours: 2,
        description: '기본 취소 정책: 24시간 전까지 무료 취소, 2시간 전까지 50% 환불, 2시간 이내 환불 불가'
      }
    }

    return {
      freecancellationHours: policy.freeCancellationHours,
      earlyRefundRate: policy.earlyRefundRate,
      standardRefundRate: policy.standardRefundRate,
      lateRefundRate: policy.lateRefundRate,
      noRefundBeforeHours: policy.noRefundBeforeHours,
      description: `${policy.freeCancellationHours}시간 전까지 무료 취소, ${policy.noRefundBeforeHours}시간 전까지 ${policy.standardRefundRate}% 환불, ${policy.noRefundBeforeHours}시간 이내 환불 불가`
    }
  }

  /**
   * 카페의 취소 정책을 생성하거나 업데이트합니다
   * @param cafeId 카페 ID
   * @param policyData 정책 데이터
   */
  static async upsertCancellationPolicy(cafeId: string, policyData: {
    freecancellationHours?: number
    earlyRefundRate?: number
    standardRefundRate?: number
    lateRefundRate?: number
    noRefundBeforeHours?: number
    description?: string
  }) {
    return await prisma.cancellationPolicy.upsert({
      where: { cafeId },
      create: {
        cafeId,
        ...policyData
      },
      update: {
        ...policyData,
        updatedAt: new Date()
      }
    })
  }

  /**
   * 취소 수수료 정책을 사용자 친화적인 텍스트로 변환합니다
   * @param policy 취소 정책
   * @returns 정책 설명 텍스트
   */
  static formatCancellationPolicy(policy: any): string {
    const {
      freecancellationHours,
      earlyRefundRate,
      standardRefundRate,
      lateRefundRate,
      noRefundBeforeHours
    } = policy

    let description = '취소 정책:\n'
    
    // 무료 취소 기간
    if (earlyRefundRate === 100) {
      description += `• ${freecancellationHours}시간 전까지: 무료 취소 (100% 환불)\n`
    } else {
      description += `• ${freecancellationHours}시간 전까지: ${earlyRefundRate}% 환불\n`
    }

    // 일반 취소 기간
    if (standardRefundRate > 0) {
      description += `• ${freecancellationHours}시간 이내 ~ ${noRefundBeforeHours}시간 전까지: ${standardRefundRate}% 환불\n`
    }

    // 늦은 취소 기간
    if (lateRefundRate === 0) {
      description += `• ${noRefundBeforeHours}시간 이내: 취소 불가 (환불 없음)`
    } else {
      description += `• ${noRefundBeforeHours}시간 이내: ${lateRefundRate}% 환불`
    }

    return description
  }

  /**
   * 예약 취소에 대한 상세 정보를 조회합니다
   * @param reservationId 예약 ID
   */
  static async getCancellationDetails(reservationId: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        cafe: {
          include: {
            cancellationPolicy: true
          }
        },
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        seat: true
      }
    })

    if (!reservation) {
      throw new AppError('예약을 찾을 수 없습니다', 404, 'RESERVATION_NOT_FOUND')
    }

    const calculation = await this.calculateCancellationFee(reservationId)
    const policy = await this.getCancellationPolicy(reservation.cafeId)
    
    return {
      reservation,
      calculation,
      policy: {
        ...policy,
        description: this.formatCancellationPolicy(policy)
      }
    }
  }
}

export default CancellationService