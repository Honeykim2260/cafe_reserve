import { Router } from 'express'
import { asyncHandler } from '@/middleware/errorHandler'
import { authenticate, checkOwnership, authorize } from '@/middleware/auth'
import { Role } from '../../../shared/src/types'
import * as reservationController from '@/controllers/reservationController'

const router = Router()

// User reservation routes
router.get('/my', authenticate, asyncHandler(reservationController.getMyReservations))
router.post('/', authenticate, asyncHandler(reservationController.createReservation))
router.get('/:id', authenticate, checkOwnership, asyncHandler(reservationController.getReservationById))
router.put('/:id', authenticate, checkOwnership, asyncHandler(reservationController.updateReservation))
router.delete('/:id', authenticate, checkOwnership, asyncHandler(reservationController.cancelReservation))

// Payment routes
router.post('/:id/payment', authenticate, checkOwnership, asyncHandler(reservationController.processPayment))
router.get('/:id/payment/status', authenticate, checkOwnership, asyncHandler(reservationController.getPaymentStatus))

// Review routes
router.post('/:id/review', authenticate, checkOwnership, asyncHandler(reservationController.createReview))

// ===== 취소 및 환불 관련 라우트 =====

// Cancellation routes
router.get('/:id/cancellation/preview', authenticate, checkOwnership, asyncHandler(reservationController.getCancellationPreview))
router.post('/:id/cancel', authenticate, checkOwnership, asyncHandler(reservationController.cancelReservation))

// Cancellation policy routes (public)
router.get('/policies/cancellation/:cafeId', asyncHandler(reservationController.getCancellationPolicy))

// Refund routes
router.get('/refunds/:refundId', authenticate, asyncHandler(reservationController.getRefundInfo))
router.put('/refunds/:refundId/status', authenticate, authorize(Role.ADMIN), asyncHandler(reservationController.updateRefundStatus))
router.post('/refunds/:refundId/retry', authenticate, authorize(Role.ADMIN), asyncHandler(reservationController.retryRefund))

// Statistics routes (admin/owner only)
router.get('/refunds/statistics', authenticate, authorize(Role.ADMIN, Role.OWNER), asyncHandler(reservationController.getRefundStatistics))

export default router