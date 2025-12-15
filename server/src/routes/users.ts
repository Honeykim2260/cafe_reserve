import { Router } from 'express'
import { asyncHandler } from '@/middleware/errorHandler'
import { authenticate, authorize, checkOwnership } from '@/middleware/auth'
import { Role } from '../../../shared/src/types'
import * as userController from '@/controllers/userController'

const router = Router()

// User profile routes
router.get('/me', authenticate, asyncHandler(userController.getMyProfile))
router.put('/me', authenticate, asyncHandler(userController.updateMyProfile))
router.delete('/me', authenticate, asyncHandler(userController.deleteMyAccount))

// User data routes
router.get('/me/reservations', authenticate, asyncHandler(userController.getMyReservations))
router.get('/me/reviews', authenticate, asyncHandler(userController.getMyReviews))
router.get('/me/cafes', authenticate, authorize(Role.OWNER), asyncHandler(userController.getMyCafes))

// Admin routes
router.get('/', authenticate, authorize(Role.ADMIN), asyncHandler(userController.getAllUsers))
router.get('/:id', authenticate, authorize(Role.ADMIN), asyncHandler(userController.getUserById))
router.put('/:id', authenticate, authorize(Role.ADMIN), asyncHandler(userController.updateUser))
router.delete('/:id', authenticate, authorize(Role.ADMIN), asyncHandler(userController.deleteUser))
router.put('/:id/role', authenticate, authorize(Role.ADMIN), asyncHandler(userController.updateUserRole))
router.put('/:id/status', authenticate, authorize(Role.ADMIN), asyncHandler(userController.updateUserStatus))

export default router