import { Router } from 'express'
import { asyncHandler } from '@/middleware/errorHandler'
import { authenticate, checkOwnership } from '@/middleware/auth'
import * as seatController from '@/controllers/seatController'

const router = Router()

// Public routes
router.get('/cafe/:cafeId', asyncHandler(seatController.getSeatsByCafe))
router.get('/:id', asyncHandler(seatController.getSeatById))
router.get('/:id/availability', asyncHandler(seatController.getSeatAvailability))

// Owner routes (seat management)
router.post('/cafe/:cafeId', authenticate, asyncHandler(seatController.createSeat))
router.put('/:id', authenticate, asyncHandler(seatController.updateSeat))
router.delete('/:id', authenticate, asyncHandler(seatController.deleteSeat))

export default router