import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { logger } from '@/utils/logger'
import { ApiResponse } from '../../../shared/src/types'

export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean
  public code: string

  constructor(message: string, statusCode: number, code: string = 'INTERNAL_ERROR') {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

export function errorHandler(
  error: Error,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) {
  let statusCode = 500
  let code = 'INTERNAL_ERROR'
  let message = '서버에서 오류가 발생했습니다'

  // Log the error
  logger.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })

  // Handle different error types
  if (error instanceof AppError) {
    statusCode = error.statusCode
    code = error.code
    message = error.message
  } else if (error instanceof ZodError) {
    statusCode = 400
    code = 'VALIDATION_ERROR'
    message = '입력 데이터가 올바르지 않습니다'
    
    const validationDetails = error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message
    }))

    return res.status(statusCode).json({
      success: false,
      error: {
        code,
        message,
        details: validationDetails
      }
    })
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        statusCode = 409
        code = 'DUPLICATE_ERROR'
        message = '이미 존재하는 데이터입니다'
        break
      case 'P2025':
        statusCode = 404
        code = 'NOT_FOUND'
        message = '요청한 데이터를 찾을 수 없습니다'
        break
      case 'P2003':
        statusCode = 400
        code = 'FOREIGN_KEY_ERROR'
        message = '참조 데이터가 올바르지 않습니다'
        break
      case 'P2014':
        statusCode = 400
        code = 'RELATION_ERROR'
        message = '관련 데이터가 존재하여 삭제할 수 없습니다'
        break
      default:
        statusCode = 500
        code = 'DATABASE_ERROR'
        message = '데이터베이스 오류가 발생했습니다'
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400
    code = 'VALIDATION_ERROR'
    message = '데이터 유효성 검사에 실패했습니다'
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401
    code = 'INVALID_TOKEN'
    message = '유효하지 않은 토큰입니다'
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401
    code = 'TOKEN_EXPIRED'
    message = '토큰이 만료되었습니다'
  } else if (error.name === 'MulterError') {
    statusCode = 400
    code = 'FILE_UPLOAD_ERROR'
    
    switch ((error as any).code) {
      case 'LIMIT_FILE_SIZE':
        message = '파일 크기가 너무 큽니다'
        break
      case 'LIMIT_FILE_COUNT':
        message = '파일 개수가 제한을 초과했습니다'
        break
      case 'LIMIT_UNEXPECTED_FILE':
        message = '허용되지 않은 파일 필드입니다'
        break
      default:
        message = '파일 업로드 중 오류가 발생했습니다'
    }
  }

  // Don't send stack trace in production
  const errorResponse: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  }

  res.status(statusCode).json(errorResponse)
}

export function notFoundHandler(
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) {
  const error = new AppError(
    `경로 ${req.originalUrl}을 찾을 수 없습니다`,
    404,
    'NOT_FOUND'
  )
  
  next(error)
}

// Async error wrapper
export function asyncHandler<T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}