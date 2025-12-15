import jwt from 'jsonwebtoken'
import { User } from '../../../shared/src/types'

export interface JwtPayload {
  userId: string
  email: string
  role: string
}

export function generateToken(user: User): string {
  const jwtSecret = process.env.JWT_SECRET
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d'

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
  }

  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiresIn,
    issuer: 'my-cafe-api',
    audience: 'my-cafe-client'
  })
}

export function verifyToken(token: string): JwtPayload {
  const jwtSecret = process.env.JWT_SECRET

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }

  return jwt.verify(token, jwtSecret, {
    issuer: 'my-cafe-api',
    audience: 'my-cafe-client'
  }) as JwtPayload
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload
  } catch {
    return null
  }
}