import { Request, Response } from 'express'
import { prisma } from '@/config/database'
import { AppError } from '@/middleware/errorHandler'
import { AuthRequest } from '@/middleware/auth'
import { hashPassword, comparePassword } from '@/utils/hash'
import { generateToken } from '@/utils/jwt'
import { loginSchema, registerSchema } from '../../../shared/src/types'
import { ApiResponse, AuthResponse } from '../../../shared/src/types'

export async function register(req: Request, res: Response<ApiResponse<AuthResponse>>) {
  const validatedData = registerSchema.parse(req.body)
  const { email, password, name, phone } = validatedData

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new AppError('이미 등록된 이메일입니다', 409, 'EMAIL_ALREADY_EXISTS')
  }

  // Hash password
  const hashedPassword = await hashPassword(password)

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phone
    }
  })

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user

  // Generate JWT token
  const token = generateToken(userWithoutPassword as any)

  res.status(201).json({
    success: true,
    data: {
      user: userWithoutPassword as any,
      token
    },
    message: '회원가입이 완료되었습니다'
  })
}

export async function login(req: Request, res: Response<ApiResponse<AuthResponse>>) {
  const validatedData = loginSchema.parse(req.body)
  const { email, password } = validatedData

  // 임시로 Mock 데이터 사용
  const { mockUsers } = await import('@/data/mockUsers')
  
  // Find user
  const user = mockUsers.find(u => u.email === email)

  if (!user) {
    throw new AppError('이메일 또는 비밀번호가 올바르지 않습니다', 401, 'INVALID_CREDENTIALS')
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError('비활성화된 계정입니다', 401, 'ACCOUNT_DISABLED')
  }

  // 간단한 비밀번호 확인 (실제로는 해시 비교를 해야 함)
  if (password !== 'password') {
    throw new AppError('이메일 또는 비밀번호가 올바르지 않습니다', 401, 'INVALID_CREDENTIALS')
  }

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user

  // Generate JWT token
  const token = generateToken(userWithoutPassword as any)

  res.json({
    success: true,
    data: {
      user: userWithoutPassword as any,
      token
    },
    message: '로그인이 완료되었습니다'
  })
}

export async function logout(req: AuthRequest, res: Response<ApiResponse>) {
  // In a real application, you might want to blacklist the token
  // or store it in a revoked tokens list
  
  res.json({
    success: true,
    message: '로그아웃이 완료되었습니다'
  })
}

export async function getProfile(req: AuthRequest, res: Response<ApiResponse>) {
  if (!req.user) {
    throw new AppError('인증이 필요합니다', 401, 'AUTHENTICATION_REQUIRED')
  }

  // 임시로 Mock 데이터 사용
  const { mockUsers } = await import('@/data/mockUsers')
  
  const user = mockUsers.find(u => u.id === req.user.id)

  if (!user) {
    throw new AppError('사용자를 찾을 수 없습니다', 404, 'USER_NOT_FOUND')
  }

  const { password: _, ...userWithoutPassword } = user

  res.json({
    success: true,
    data: userWithoutPassword
  })
}

export async function updateProfile(req: AuthRequest, res: Response<ApiResponse>) {
  if (!req.user) {
    throw new AppError('인증이 필요합니다', 401, 'AUTHENTICATION_REQUIRED')
  }

  const { name, phone, profileImage } = req.body

  // 임시로 Mock 데이터 사용 - 실제 업데이트는 하지 않고 업데이트된 정보로 응답
  const { mockUsers } = await import('@/data/mockUsers')
  const user = mockUsers.find(u => u.id === req.user.id)

  if (!user) {
    throw new AppError('사용자를 찾을 수 없습니다', 404, 'USER_NOT_FOUND')
  }

  // Mock response with updated data
  const updatedUser = {
    ...user,
    ...(name && { name }),
    ...(phone !== undefined && { phone }),
    ...(profileImage !== undefined && { profileImage }),
    updatedAt: new Date().toISOString()
  }

  const { password: _, ...userWithoutPassword } = updatedUser

  res.json({
    success: true,
    data: userWithoutPassword,
    message: '프로필이 업데이트되었습니다'
  })
}

export async function changePassword(req: AuthRequest, res: Response<ApiResponse>) {
  if (!req.user) {
    throw new AppError('인증이 필요합니다', 401, 'AUTHENTICATION_REQUIRED')
  }

  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    throw new AppError('현재 비밀번호와 새 비밀번호가 필요합니다', 400, 'MISSING_PASSWORDS')
  }

  if (newPassword.length < 6) {
    throw new AppError('새 비밀번호는 최소 6자 이상이어야 합니다', 400, 'PASSWORD_TOO_SHORT')
  }

  // 임시로 Mock 데이터 사용
  const { mockUsers } = await import('@/data/mockUsers')
  const user = mockUsers.find(u => u.id === req.user.id)

  if (!user) {
    throw new AppError('사용자를 찾을 수 없습니다', 404, 'USER_NOT_FOUND')
  }

  // Mock 환경에서는 현재 비밀번호가 'password'인지 확인
  if (currentPassword !== 'password') {
    throw new AppError('현재 비밀번호가 올바르지 않습니다', 401, 'INVALID_CURRENT_PASSWORD')
  }

  // Mock 환경에서는 실제 비밀번호 변경은 하지 않음
  res.json({
    success: true,
    message: '비밀번호가 변경되었습니다'
  })
}

export async function refresh(req: Request, res: Response<ApiResponse<AuthResponse>>) {
  // This would implement refresh token logic
  // For now, we'll return an error
  throw new AppError('아직 구현되지 않은 기능입니다', 501, 'NOT_IMPLEMENTED')
}