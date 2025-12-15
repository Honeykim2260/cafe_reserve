import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from './errorHandler'

export interface AuthRequest extends Request {
  user?: any
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('인증 토큰이 필요합니다', 401, 'AUTHENTICATION_REQUIRED')
    }

    const token = authHeader.substring(7)
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
    
    // JWT 토큰을 generateToken과 동일한 옵션으로 검증
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'my-cafe-api',
      audience: 'my-cafe-client'
    }) as any
    
    // Mock 사용자 정보 - userId를 id로 매핑
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    }
    
    next()
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('유효하지 않은 토큰입니다', 401, 'INVALID_TOKEN')
    } else if (error.name === 'TokenExpiredError') {
      throw new AppError('만료된 토큰입니다', 401, 'TOKEN_EXPIRED')
    } else {
      throw error
    }
  }
}

export const checkOwnership = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Mock에서는 간단히 통과
  next()
}

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('인증이 필요합니다', 401, 'AUTHENTICATION_REQUIRED')
    }
    
    if (!roles.includes(req.user.role)) {
      throw new AppError('권한이 없습니다', 403, 'INSUFFICIENT_PERMISSIONS')
    }
    
    next()
  }
}