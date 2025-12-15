import { Request, Response } from 'express'
import { AuthRequest } from '@/middleware/auth'
import { ApiResponse } from '../../../shared/src/types'
import { CancellationService } from '@/services/cancellationService'
import { RefundService } from '@/services/refundService'
import { CancellationReason } from '@prisma/client'
import { AppError } from '@/middleware/errorHandler'
import { z } from 'zod'
import { mockReservations } from '@/data/mockReservations'

export async function getMyReservations(req: AuthRequest, res: Response<ApiResponse>) {
  try {
    const userId = req.user?.id
    
    if (!userId) {
      throw new AppError('인증이 필요합니다', 401, 'AUTHENTICATION_REQUIRED')
    }

    // Mock 데이터에서 사용자의 예약 조회
    const userReservations = mockReservations.filter(reservation => 
      reservation.userId === userId
    )

    res.json({
      success: true,
      data: userReservations,
      message: '예약 목록을 조회했습니다'
    })
  } catch (error) {
    throw error
  }
}

const createReservationSchema = z.object({
  cafeId: z.string().min(1, '카페 ID는 필수입니다'),
  seatId: z.string().min(1, '좌석 ID는 필수입니다'),
  startTime: z.string().min(1, '시작 시간은 필수입니다'),
  endTime: z.string().min(1, '종료 시간은 필수입니다'),
  totalPrice: z.number().min(0, '금액은 0 이상이어야 합니다'),
  notes: z.string().optional()
})

export async function createReservation(req: AuthRequest, res: Response<ApiResponse>) {
  try {
    const userId = req.user?.id

    if (!userId) {
      throw new AppError('인증이 필요합니다', 401, 'AUTHENTICATION_REQUIRED')
    }

    // 요청 데이터 검증
    const validatedData = createReservationSchema.parse(req.body)
    const { cafeId, seatId, startTime, endTime, totalPrice, notes } = validatedData

    // Mock 데이터에서 카페와 좌석 확인
    const { mockCafes } = await import('@/data/mockCafes')
    const { mockSeats } = await import('@/data/mockSeats')
    
    const cafe = mockCafes.find(c => c.id === cafeId)
    if (!cafe) {
      throw new AppError('카페를 찾을 수 없습니다', 404, 'CAFE_NOT_FOUND')
    }

    const cafeSeats = mockSeats[cafeId] || []
    const seat = cafeSeats.find(s => s.id === seatId)
    if (!seat) {
      throw new AppError('좌석을 찾을 수 없습니다', 404, 'SEAT_NOT_FOUND')
    }

    if (!seat.isAvailable) {
      throw new AppError('선택한 좌석은 예약할 수 없습니다', 400, 'SEAT_NOT_AVAILABLE')
    }

    // 시간 유효성 검사
    const startDateTime = new Date(startTime)
    const endDateTime = new Date(endTime)
    const now = new Date()

    if (startDateTime <= now) {
      throw new AppError('예약 시간은 현재 시간 이후여야 합니다', 400, 'INVALID_START_TIME')
    }

    if (endDateTime <= startDateTime) {
      throw new AppError('종료 시간은 시작 시간 이후여야 합니다', 400, 'INVALID_END_TIME')
    }

    // 시간당 요금 계산 검증
    const durationHours = Math.ceil((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60))
    const calculatedPrice = seat.hourlyRate * durationHours

    if (Math.abs(totalPrice - calculatedPrice) > 100) { // 100원 정도 오차 허용
      throw new AppError('가격 계산이 올바르지 않습니다', 400, 'INVALID_PRICE')
    }

    // 새 예약 생성 (실제 환경에서는 데이터베이스에 저장)
    const newReservation = {
      id: `reservation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      cafeId,
      seatId,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      totalHours: durationHours,
      totalPrice,
      status: 'PENDING',
      notes: notes || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cafe: {
        id: cafe.id,
        name: cafe.name,
        address: cafe.address,
        phone: cafe.phone,
        images: cafe.images
      },
      seat: {
        id: seat.id,
        seatNumber: seat.seatNumber,
        seatType: seat.seatType,
        capacity: seat.capacity,
        hourlyRate: seat.hourlyRate,
        amenities: seat.amenities
      }
    }

    // Mock 데이터에 추가 (실제로는 데이터베이스 저장)
    const { mockReservations } = await import('@/data/mockReservations')
    mockReservations.push(newReservation)

    logger.info('새 예약 생성:', {
      reservationId: newReservation.id,
      userId,
      cafeId,
      seatId,
      startTime,
      endTime,
      totalPrice
    })

    res.status(201).json({
      success: true,
      data: newReservation,
      message: '예약이 성공적으로 생성되었습니다'
    })
  } catch (error) {
    throw error
  }
}

export async function getReservationById(req: AuthRequest, res: Response<ApiResponse>) {
  try {
    const { id: reservationId } = req.params
    const userId = req.user?.id
    
    if (!userId) {
      throw new AppError('인증이 필요합니다', 401, 'AUTHENTICATION_REQUIRED')
    }

    // Mock 데이터에서 예약 조회
    const reservation = mockReservations.find(r => 
      r.id === reservationId && r.userId === userId
    )

    if (!reservation) {
      throw new AppError('예약을 찾을 수 없습니다', 404, 'RESERVATION_NOT_FOUND')
    }

    res.json({
      success: true,
      data: reservation,
      message: '예약 정보를 조회했습니다'
    })
  } catch (error) {
    throw error
  }
}

export async function updateReservation(req: AuthRequest, res: Response<ApiResponse>) {
  // TODO: Implement update reservation
  res.json({
    success: true,
    data: {},
    message: 'updateReservation 구현 예정'
  })
}

// 취소 요청 검증 스키마
const cancelReservationSchema = z.object({
  reason: z.nativeEnum(CancellationReason),
  note: z.string().optional()
})

export async function cancelReservation(req: AuthRequest, res: Response<ApiResponse>) {
  try {
    const { id: reservationId } = req.params
    const userId = req.user?.id

    if (!userId) {
      throw new AppError('인증이 필요합니다', 401, 'AUTHENTICATION_REQUIRED')
    }

    // 요청 데이터 검증
    const { reason, note } = cancelReservationSchema.parse(req.body)

    // 임시로 Mock 데이터 사용한 취소 처리
    const { mockReservations } = await import('@/data/mockReservations')
    const reservation = mockReservations.find(r => r.id === reservationId && r.userId === userId)

    if (!reservation) {
      throw new AppError('예약을 찾을 수 없습니다', 404, 'RESERVATION_NOT_FOUND')
    }

    // 취소 가능 여부 확인
    const cancellationInfo = await CancellationService.canCancelReservation(reservationId)
    
    if (!cancellationInfo.canCancel) {
      throw new AppError(
        cancellationInfo.reason || '예약을 취소할 수 없습니다',
        400,
        'CANCELLATION_NOT_ALLOWED'
      )
    }

    // 임시 결과 반환 (실제로는 데이터베이스에 저장해야 함)
    const refundId = `refund_${reservationId}_${Date.now()}`

    res.json({
      success: true,
      data: {
        refundId,
        originalAmount: cancellationInfo.calculation.originalAmount,
        refundAmount: cancellationInfo.calculation.refundAmount,
        feeAmount: cancellationInfo.calculation.feeAmount,
        status: 'PENDING',
        transactionId: `tx_${Date.now()}`
      },
      message: '예약이 성공적으로 취소되었습니다'
    })
  } catch (error) {
    throw error
  }
}

export async function processPayment(req: AuthRequest, res: Response<ApiResponse>) {
  // TODO: Implement payment processing
  res.json({
    success: true,
    data: {},
    message: 'processPayment 구현 예정'
  })
}

export async function getPaymentStatus(req: AuthRequest, res: Response<ApiResponse>) {
  // TODO: Implement get payment status
  res.json({
    success: true,
    data: {},
    message: 'getPaymentStatus 구현 예정'
  })
}

export async function createReview(req: AuthRequest, res: Response<ApiResponse>) {
  // TODO: Implement create review for completed reservation
  res.status(201).json({
    success: true,
    data: {},
    message: 'createReview 구현 예정'
  })
}

// ===== 취소 및 환불 관련 추가 엔드포인트 =====

/**
 * 예약 취소 가능 여부 및 수수료 미리보기
 */
export async function getCancellationPreview(req: AuthRequest, res: Response<ApiResponse>) {
  try {
    const { id: reservationId } = req.params

    const preview = await CancellationService.canCancelReservation(reservationId)

    res.json({
      success: true,
      data: {
        canCancel: preview.canCancel,
        reason: preview.reason,
        calculation: {
          originalAmount: preview.calculation.originalAmount,
          refundAmount: preview.calculation.refundAmount,
          feeAmount: preview.calculation.feeAmount,
          feeRate: preview.calculation.feeRate,
          hoursBeforeStart: preview.calculation.hoursBeforeStart
        }
      },
      message: '취소 가능 여부를 조회했습니다'
    })
  } catch (error) {
    throw error
  }
}

/**
 * 예약 취소 정책 조회
 */
export async function getCancellationPolicy(req: Request, res: Response<ApiResponse>) {
  try {
    const { cafeId } = req.params

    const policy = await CancellationService.getCancellationPolicy(cafeId)

    res.json({
      success: true,
      data: {
        policy,
        description: CancellationService.formatCancellationPolicy(policy)
      },
      message: '취소 정책을 조회했습니다'
    })
  } catch (error) {
    throw error
  }
}

/**
 * 환불 정보 조회
 */
export async function getRefundInfo(req: AuthRequest, res: Response<ApiResponse>) {
  try {
    const { refundId } = req.params
    
    const refundInfo = await RefundService.getRefundInfo(refundId)

    // 본인의 환불 정보인지 확인 (관리자는 제외)
    if (req.user?.role === 'USER' && refundInfo.reservation.userId !== req.user.id) {
      throw new AppError('환불 정보에 접근할 권한이 없습니다', 403, 'UNAUTHORIZED')
    }

    res.json({
      success: true,
      data: refundInfo,
      message: '환불 정보를 조회했습니다'
    })
  } catch (error) {
    throw error
  }
}

/**
 * 환불 상태 업데이트 (관리자 전용)
 */
export async function updateRefundStatus(req: AuthRequest, res: Response<ApiResponse>) {
  try {
    const { refundId } = req.params
    const { status, note } = req.body
    const userId = req.user?.id

    if (!userId) {
      throw new AppError('인증이 필요합니다', 401, 'AUTHENTICATION_REQUIRED')
    }

    if (req.user?.role !== 'ADMIN') {
      throw new AppError('관리자 권한이 필요합니다', 403, 'ADMIN_REQUIRED')
    }

    const updatedRefund = await RefundService.updateRefundStatus(
      refundId,
      status,
      userId,
      note
    )

    res.json({
      success: true,
      data: updatedRefund,
      message: '환불 상태가 업데이트되었습니다'
    })
  } catch (error) {
    throw error
  }
}

/**
 * 환불 재시도 (관리자 전용)
 */
export async function retryRefund(req: AuthRequest, res: Response<ApiResponse>) {
  try {
    const { refundId } = req.params
    const userId = req.user?.id

    if (!userId) {
      throw new AppError('인증이 필요합니다', 401, 'AUTHENTICATION_REQUIRED')
    }

    if (req.user?.role !== 'ADMIN') {
      throw new AppError('관리자 권한이 필요합니다', 403, 'ADMIN_REQUIRED')
    }

    const result = await RefundService.retryRefund(refundId, userId)

    res.json({
      success: true,
      data: result,
      message: '환불 재시도가 완료되었습니다'
    })
  } catch (error) {
    throw error
  }
}

/**
 * 환불 통계 조회 (관리자 전용)
 */
export async function getRefundStatistics(req: AuthRequest, res: Response<ApiResponse>) {
  try {
    const { cafeId, startDate, endDate } = req.query
    
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'OWNER') {
      throw new AppError('권한이 없습니다', 403, 'INSUFFICIENT_PERMISSIONS')
    }

    const statistics = await RefundService.getRefundStatistics(
      cafeId as string,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    )

    res.json({
      success: true,
      data: statistics,
      message: '환불 통계를 조회했습니다'
    })
  } catch (error) {
    throw error
  }
}