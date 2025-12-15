import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '@/config/database'
import { AppError } from './errorHandler'
import { User, Role } from '../../../shared/src/types'

export interface AuthRequest extends Request {
  user?: User
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null

    if (!token) {
      throw new AppError('인증 토큰이 필요합니다', 401, 'NO_TOKEN')
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw new AppError('JWT 비밀키가 설정되지 않았습니다', 500, 'JWT_SECRET_MISSING')
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: string; iat: number; exp: number }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
        isActive: true
      }
    })

    if (!user) {
      throw new AppError('유효하지 않은 사용자입니다', 401, 'INVALID_USER')
    }

    // Add user to request
    req.user = user as User
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('유효하지 않은 토큰입니다', 401, 'INVALID_TOKEN'))
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('토큰이 만료되었습니다', 401, 'TOKEN_EXPIRED'))
    } else {
      next(error)
    }
  }
}

export function authorize(...roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('인증이 필요합니다', 401, 'AUTHENTICATION_REQUIRED')
      }

      if (roles.length > 0 && !roles.includes(req.user.role)) {
        throw new AppError('권한이 없습니다', 403, 'INSUFFICIENT_PERMISSIONS')
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

// Check if user is owner of the resource
export async function checkOwnership(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params
    const userId = req.user?.id

    if (!userId) {
      throw new AppError('인증이 필요합니다', 401, 'AUTHENTICATION_REQUIRED')
    }

    // Admin can access everything
    if (req.user?.role === Role.ADMIN) {
      return next()
    }

    // Check resource ownership based on route
    const path = req.route?.path || req.path
    
    if (path.includes('/cafes')) {
      const cafe = await prisma.cafe.findUnique({
        where: { id },
        select: { ownerId: true }
      })

      if (!cafe) {
        throw new AppError('카페를 찾을 수 없습니다', 404, 'CAFE_NOT_FOUND')
      }

      if (cafe.ownerId !== userId) {
        throw new AppError('카페에 대한 권한이 없습니다', 403, 'NOT_CAFE_OWNER')
      }
    } else if (path.includes('/reservations')) {
      const reservation = await prisma.reservation.findUnique({
        where: { id },
        select: { userId: true, cafe: { select: { ownerId: true } } }
      })

      if (!reservation) {
        throw new AppError('예약을 찾을 수 없습니다', 404, 'RESERVATION_NOT_FOUND')
      }

      // User can access their own reservations or cafe owner can access reservations for their cafe
      if (reservation.userId !== userId && reservation.cafe.ownerId !== userId) {
        throw new AppError('예약에 대한 권한이 없습니다', 403, 'NOT_RESERVATION_OWNER')
      }
    } else if (path.includes('/users')) {
      // Users can only access their own profile
      if (id !== userId) {
        throw new AppError('사용자 정보에 대한 권한이 없습니다', 403, 'NOT_USER_OWNER')
      }
    }

    next()
  } catch (error) {
    next(error)
  }
}

// Optional authentication - doesn't throw error if no token
export async function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null

    if (token) {
      const jwtSecret = process.env.JWT_SECRET!
      const decoded = jwt.verify(token, jwtSecret) as { userId: string }
      
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
          isActive: true
        }
      })

      if (user) {
        req.user = user as User
      }
    }

    next()
  } catch (error) {
    // Ignore token errors for optional auth
    next()
  }
}