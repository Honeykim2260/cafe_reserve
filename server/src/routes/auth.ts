import { Router } from 'express'
import { asyncHandler } from '@/middleware/errorHandler'
import { authenticate } from '@/middleware/auth'
import * as authController from '@/controllers/authController'

const router = Router()

// Public routes
router.post('/register', asyncHandler(authController.register))
router.post('/login', asyncHandler(authController.login))
router.post('/refresh', asyncHandler(authController.refresh))

// Protected routes
router.post('/logout', authenticate, asyncHandler(authController.logout))
router.get('/me', authenticate, asyncHandler(authController.getProfile))
router.put('/me', authenticate, asyncHandler(authController.updateProfile))
router.put('/me/password', authenticate, asyncHandler(authController.changePassword))

export default router