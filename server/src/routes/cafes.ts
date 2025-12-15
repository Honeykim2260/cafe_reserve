import { Router } from 'express'
import { asyncHandler } from '@/middleware/errorHandler'
import { authenticate, authorize, checkOwnership, optionalAuth } from '@/middleware/auth'
import { Role } from '../../../shared/src/types'
import * as cafeController from '@/controllers/cafeController'

const router = Router()

// Public routes
router.get('/', optionalAuth, asyncHandler(cafeController.getCafes))
router.get('/search', optionalAuth, asyncHandler(cafeController.searchCafes))
router.get('/:id', optionalAuth, asyncHandler(cafeController.getCafeById))
router.get('/:id/seats', asyncHandler(cafeController.getCafeSeats))
router.get('/:id/availability', asyncHandler(cafeController.getCafeAvailability))

// Owner/Admin routes
router.post('/', authenticate, authorize(Role.OWNER, Role.ADMIN), asyncHandler(cafeController.createCafe))
router.put('/:id', authenticate, checkOwnership, asyncHandler(cafeController.updateCafe))
router.delete('/:id', authenticate, checkOwnership, asyncHandler(cafeController.deleteCafe))

// Cafe management routes
router.get('/:id/reservations', authenticate, checkOwnership, asyncHandler(cafeController.getCafeReservations))
router.get('/:id/reviews', asyncHandler(cafeController.getCafeReviews))
router.get('/:id/analytics', authenticate, checkOwnership, asyncHandler(cafeController.getCafeAnalytics))

export default router