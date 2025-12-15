import { prisma } from '@/config/database'
import { CancellationReason, RefundStatus, PaymentMethod } from '@prisma/client'
import { AppError } from '@/middleware/errorHandler'
import { logger } from '@/utils/logger'
import { CancellationService } from './cancellationService'

export interface RefundRequest {
  reservationId: string
  reason: CancellationReason
  note?: string
  userId: string
  adminNote?: string
  processedBy?: string
}

export interface RefundResult {
  refundId: string
  originalAmount: number
  refundAmount: number
  feeAmount: number
  status: RefundStatus
  transactionId?: string
}

export class RefundService {
  /**
   * 예약 취소 및 환불 처리를 수행합니다
   * @param request 환불 요청 정보
   * @returns 환불 처리 결과
   */
  static async processReservationCancellation(request: RefundRequest): Promise<RefundResult> {
    const { reservationId, reason, note, userId, adminNote, processedBy } = request

    // 트랜잭션으로 처리
    return await prisma.$transaction(async (tx) => {
      // 1. 예약 정보 조회 및 검증
      const reservation = await tx.reservation.findUnique({
        where: { id: reservationId },
        include: {
          payment: true,
          cafe: {
            include: {
              cancellationPolicy: true
            }
          },
          user: true,
          refund: true
        }
      })

      if (!reservation) {
        throw new AppError('예약을 찾을 수 없습니다', 404, 'RESERVATION_NOT_FOUND')
      }

      // 사용자 권한 확인 (본인이거나 관리자)
      if (reservation.userId !== userId && !processedBy) {
        throw new AppError('예약을 취소할 권한이 없습니다', 403, 'UNAUTHORIZED_CANCELLATION')
      }

      if (reservation.status === 'CANCELLED') {
        throw new AppError('이미 취소된 예약입니다', 400, 'ALREADY_CANCELLED')
      }

      if (reservation.refund) {
        throw new AppError('이미 환불 처리가 진행 중입니다', 400, 'REFUND_ALREADY_EXISTS')
      }

      if (!reservation.payment || reservation.payment.paymentStatus !== 'completed') {
        throw new AppError('결제가 완료되지 않은 예약입니다', 400, 'PAYMENT_NOT_COMPLETED')
      }

      // 2. 취소 수수료 계산
      const calculation = await CancellationService.calculateCancellationFee(reservationId)
      
      if (!calculation.canCancel) {
        throw new AppError(
          calculation.reason || '예약을 취소할 수 없습니다', 
          400, 
          'CANCELLATION_NOT_ALLOWED'
        )
      }

      // 3. 예약 상태를 취소로 변경
      await tx.reservation.update({
        where: { id: reservationId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancellationReason: reason,
          cancellationNote: note
        }
      })

      // 4. 환불 레코드 생성
      const refund = await tx.refund.create({
        data: {
          reservationId,
          originalAmount: calculation.originalAmount,
          refundAmount: calculation.refundAmount,
          feeAmount: calculation.feeAmount,
          refundStatus: calculation.refundAmount > 0 ? 'PENDING' : 'COMPLETED',
          refundReason: `취소 사유: ${reason}${note ? ` - ${note}` : ''}`,
          hoursBeforeStart: calculation.hoursBeforeStart,
          appliedFeeRate: calculation.feeRate,
          refundMethod: reservation.payment.paymentMethod,
          adminNote,
          processedBy
        }
      })

      // 5. 환불 로그 기록
      await this.createRefundLog(tx, refund.id, null, 'PENDING', 
        `취소 요청 - 환불액: ${calculation.refundAmount}원`, userId)

      // 6. 실제 환불 처리 (환불액이 있는 경우)
      let transactionId: string | undefined
      
      if (calculation.refundAmount > 0) {
        try {
          // 실제 PG사 환불 API 호출
          const refundResult = await this.processActualRefund({
            paymentTransactionId: reservation.payment.transactionId!,
            refundAmount: calculation.refundAmount,
            reason: `예약 취소 환불 - 예약ID: ${reservationId}`
          })

          transactionId = refundResult.transactionId

          // 환불 완료 처리
          await tx.refund.update({
            where: { id: refund.id },
            data: {
              refundStatus: 'COMPLETED',
              refundTransactionId: transactionId,
              processedAt: new Date()
            }
          })

          // 환불 완료 로그
          await this.createRefundLog(tx, refund.id, 'PENDING', 'COMPLETED', 
            `환불 완료 - 거래ID: ${transactionId}`, processedBy || 'SYSTEM')

        } catch (error) {
          logger.error('환불 처리 실패:', error)

          // 환불 실패 처리
          await tx.refund.update({
            where: { id: refund.id },
            data: {
              refundStatus: 'FAILED',
              failureReason: error instanceof Error ? error.message : '환불 처리 중 오류 발생'
            }
          })

          // 환불 실패 로그
          await this.createRefundLog(tx, refund.id, 'PENDING', 'FAILED', 
            `환불 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`, 
            processedBy || 'SYSTEM')

          throw new AppError('환불 처리에 실패했습니다', 500, 'REFUND_PROCESSING_FAILED')
        }
      }

      return {
        refundId: refund.id,
        originalAmount: calculation.originalAmount,
        refundAmount: calculation.refundAmount,
        feeAmount: calculation.feeAmount,
        status: calculation.refundAmount > 0 ? 'COMPLETED' : 'COMPLETED',
        transactionId
      }
    })
  }

  /**
   * 실제 PG사 환불 API를 호출합니다 (시뮬레이션)
   * @param request 환불 요청
   * @returns 환불 결과
   */
  private static async processActualRefund(request: {
    paymentTransactionId: string
    refundAmount: number
    reason: string
  }): Promise<{
    transactionId: string
    success: boolean
    message?: string
  }> {
    // 실제 환경에서는 각 PG사의 환불 API를 호출
    // 여기서는 시뮬레이션으로 구현

    logger.info('PG사 환불 요청:', request)

    // 시뮬레이션: 95% 확률로 성공
    const isSuccess = Math.random() > 0.05

    if (!isSuccess) {
      throw new Error('PG사 환불 처리 실패')
    }

    // 환불 거래 ID 생성 (실제로는 PG사에서 반환)
    const transactionId = `REFUND_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // 실제 환경에서는 다음과 같은 PG사별 API 호출
    /*
    switch (paymentGateway) {
      case 'toss':
        return await this.processTossRefund(request)
      case 'kakaopay':
        return await this.processKakaoPayRefund(request)
      case 'naverpay':
        return await this.processNaverPayRefund(request)
      default:
        throw new Error('지원하지 않는 결제 방식입니다')
    }
    */

    return {
      transactionId,
      success: true,
      message: '환불이 성공적으로 처리되었습니다'
    }
  }

  /**
   * 환불 로그를 생성합니다
   */
  private static async createRefundLog(
    tx: any,
    refundId: string,
    previousStatus: RefundStatus | null,
    newStatus: RefundStatus,
    reason: string,
    processedBy: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    return await tx.refundLog.create({
      data: {
        refundId,
        previousStatus,
        newStatus,
        reason,
        processedBy,
        ipAddress,
        userAgent
      }
    })
  }

  /**
   * 환불 정보를 조회합니다
   * @param refundId 환불 ID
   */
  static async getRefundInfo(refundId: string) {
    const refund = await prisma.refund.findUnique({
      where: { id: refundId },
      include: {
        reservation: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            cafe: {
              select: {
                id: true,
                name: true
              }
            },
            seat: true
          }
        }
      }
    })

    if (!refund) {
      throw new AppError('환불 정보를 찾을 수 없습니다', 404, 'REFUND_NOT_FOUND')
    }

    return refund
  }

  /**
   * 환불 상태를 업데이트합니다 (관리자용)
   * @param refundId 환불 ID
   * @param status 새로운 상태
   * @param processedBy 처리자
   * @param note 처리 메모
   */
  static async updateRefundStatus(
    refundId: string,
    status: RefundStatus,
    processedBy: string,
    note?: string
  ) {
    return await prisma.$transaction(async (tx) => {
      const currentRefund = await tx.refund.findUnique({
        where: { id: refundId }
      })

      if (!currentRefund) {
        throw new AppError('환불 정보를 찾을 수 없습니다', 404, 'REFUND_NOT_FOUND')
      }

      const updatedRefund = await tx.refund.update({
        where: { id: refundId },
        data: {
          refundStatus: status,
          processedBy,
          adminNote: note,
          ...(status === 'COMPLETED' && { processedAt: new Date() })
        }
      })

      // 상태 변경 로그
      await this.createRefundLog(
        tx,
        refundId,
        currentRefund.refundStatus,
        status,
        note || `환불 상태 변경: ${currentRefund.refundStatus} → ${status}`,
        processedBy
      )

      return updatedRefund
    })
  }

  /**
   * 환불 재시도를 수행합니다
   * @param refundId 환불 ID
   * @param processedBy 처리자
   */
  static async retryRefund(refundId: string, processedBy: string) {
    return await prisma.$transaction(async (tx) => {
      const refund = await tx.refund.findUnique({
        where: { id: refundId },
        include: {
          reservation: {
            include: {
              payment: true
            }
          }
        }
      })

      if (!refund) {
        throw new AppError('환불 정보를 찾을 수 없습니다', 404, 'REFUND_NOT_FOUND')
      }

      if (refund.refundStatus !== 'FAILED') {
        throw new AppError('실패한 환불만 재시도할 수 있습니다', 400, 'INVALID_REFUND_STATUS')
      }

      // 재시도 횟수 증가
      const retryCount = refund.retryCount + 1
      
      if (retryCount > 3) {
        throw new AppError('최대 재시도 횟수를 초과했습니다', 400, 'MAX_RETRY_EXCEEDED')
      }

      // 상태를 PROCESSING으로 변경
      await tx.refund.update({
        where: { id: refundId },
        data: {
          refundStatus: 'PROCESSING',
          retryCount,
          failureReason: null
        }
      })

      await this.createRefundLog(
        tx,
        refundId,
        'FAILED',
        'PROCESSING',
        `환불 재시도 ${retryCount}회`,
        processedBy
      )

      // 실제 환불 처리 재시도
      try {
        const refundResult = await this.processActualRefund({
          paymentTransactionId: refund.reservation.payment!.transactionId!,
          refundAmount: refund.refundAmount,
          reason: `환불 재시도 - 환불ID: ${refundId}`
        })

        // 환불 성공
        await tx.refund.update({
          where: { id: refundId },
          data: {
            refundStatus: 'COMPLETED',
            refundTransactionId: refundResult.transactionId,
            processedAt: new Date()
          }
        })

        await this.createRefundLog(
          tx,
          refundId,
          'PROCESSING',
          'COMPLETED',
          `환불 재시도 성공 - 거래ID: ${refundResult.transactionId}`,
          processedBy
        )

        return refundResult

      } catch (error) {
        // 환불 실패
        await tx.refund.update({
          where: { id: refundId },
          data: {
            refundStatus: 'FAILED',
            failureReason: error instanceof Error ? error.message : '알 수 없는 오류'
          }
        })

        await this.createRefundLog(
          tx,
          refundId,
          'PROCESSING',
          'FAILED',
          `환불 재시도 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
          processedBy
        )

        throw error
      }
    })
  }

  /**
   * 환불 통계를 조회합니다
   * @param cafeId 카페 ID (선택적)
   * @param startDate 시작 날짜
   * @param endDate 종료 날짜
   */
  static async getRefundStatistics(cafeId?: string, startDate?: Date, endDate?: Date) {
    const where: any = {}
    
    if (cafeId) {
      where.reservation = { cafeId }
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const [totalRefunds, statusCounts, amountStats] = await Promise.all([
      // 총 환불 건수
      prisma.refund.count({ where }),

      // 상태별 환불 건수
      prisma.refund.groupBy({
        by: ['refundStatus'],
        where,
        _count: { id: true }
      }),

      // 환불 금액 통계
      prisma.refund.aggregate({
        where,
        _sum: {
          originalAmount: true,
          refundAmount: true,
          feeAmount: true
        },
        _avg: {
          refundAmount: true,
          feeAmount: true
        }
      })
    ])

    return {
      totalRefunds,
      statusCounts: statusCounts.reduce((acc, item) => {
        acc[item.refundStatus] = item._count.id
        return acc
      }, {} as Record<RefundStatus, number>),
      amounts: {
        totalOriginal: amountStats._sum.originalAmount || 0,
        totalRefund: amountStats._sum.refundAmount || 0,
        totalFee: amountStats._sum.feeAmount || 0,
        averageRefund: amountStats._avg.refundAmount || 0,
        averageFee: amountStats._avg.feeAmount || 0
      }
    }
  }
}

export default RefundService