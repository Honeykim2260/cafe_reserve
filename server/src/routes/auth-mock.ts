import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Mock user data
const mockUsers: any[] = [
  {
    id: 'user-1',
    email: 'admin@mycafe.com',
    name: '관리자',
    phone: '010-1234-5678',
    password: 'admin123',
    role: 'ADMIN',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-4',
    email: 'customer1@gmail.com',
    name: '김고객',
    phone: '010-4567-8901',
    password: 'customer123',
    role: 'USER',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user1',
    email: 'user1@test.com',
    name: '테스트 사용자',
    phone: '010-1111-1111',
    password: 'password', // 간단한 평문 비밀번호 (Mock 환경용)
    role: 'USER',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body
    
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '필수 필드를 모두 입력해주세요'
        }
      })
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '비밀번호는 6자 이상이어야 합니다'
        }
      })
    }
    
    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: '이미 등록된 이메일입니다'
        }
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email: email,
      name: name,
      phone: phone || null,
      password: hashedPassword,
      role: 'USER',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockUsers.push(newUser)
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-development',
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        issuer: 'my-cafe-api',
        audience: 'my-cafe-client'
      }
    )
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser
    
    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: '회원가입이 완료되었습니다'
    })
    
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '회원가입 중 오류가 발생했습니다'
      }
    })
  }
})

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '이메일과 비밀번호를 입력해주세요'
        }
      })
    }
    
    // Find user by email
    const user = mockUsers.find(user => user.email === email)
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: '이메일 또는 비밀번호가 올바르지 않습니다'
        }
      })
    }
    
    // Check password (Mock 환경에서는 평문 비교)
    const isPasswordValid = password === user.password
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: '이메일 또는 비밀번호가 올바르지 않습니다'
        }
      })
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-development',
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        issuer: 'my-cafe-api',
        audience: 'my-cafe-client'
      }
    )
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user
    
    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: '로그인이 완료되었습니다'
    })
    
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '로그인 중 오류가 발생했습니다'
      }
    })
  }
})

// Get current user endpoint
router.get('/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '인증 토큰이 필요합니다'
        }
      })
    }
    
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-development', {
      issuer: 'my-cafe-api',
      audience: 'my-cafe-client'
    }) as any
    
    const user = mockUsers.find(user => user.id === decoded.userId)
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: '사용자를 찾을 수 없습니다'
        }
      })
    }
    
    const { password: _, ...userWithoutPassword } = user
    
    res.json({
      success: true,
      data: {
        user: userWithoutPassword
      }
    })
    
  } catch (error) {
    console.error('Get user error:', error)
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: '유효하지 않은 토큰입니다'
      }
    })
  }
})

// Logout endpoint
router.post('/logout', (req, res) => {
  try {
    // In a real application, you would invalidate the token
    // For mock purposes, we just return success
    res.json({
      success: true,
      message: '로그아웃이 완료되었습니다'
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '로그아웃 중 오류가 발생했습니다'
      }
    })
  }
})

export default router