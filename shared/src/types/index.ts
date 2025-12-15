import { z } from 'zod'

// Enums
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER'
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum SeatType {
  INDIVIDUAL = 'INDIVIDUAL',
  COUPLE = 'COUPLE',
  GROUP = 'GROUP',
  MEETING_ROOM = 'MEETING_ROOM'
}

// Base Types
export interface User {
  id: string
  email: string
  name: string
  phone: string | null
  role: Role
  isActive: boolean
  profileImage: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Cafe {
  id: string
  name: string
  description: string | null
  address: string
  phone: string
  email: string | null
  website: string | null
  images: string[]
  openTime: string
  closeTime: string
  isOpen: boolean
  latitude: number | null
  longitude: number | null
  basePrice: number
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

export interface Seat {
  id: string
  seatNumber: string
  seatType: SeatType
  capacity: number
  isAvailable: boolean
  priceMultiplier: number
  hasOutlet: boolean
  hasWindow: boolean
  isQuietZone: boolean
  cafeId: string
  createdAt: Date
  updatedAt: Date
}

export interface Reservation {
  id: string
  startTime: Date
  endTime: Date
  duration: number
  totalPrice: number
  status: ReservationStatus
  notes: string | null
  userId: string
  cafeId: string
  seatId: string
  paymentId: string | null
  paymentStatus: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  rating: number
  comment: string | null
  images: string[]
  userId: string
  cafeId: string
  createdAt: Date
  updatedAt: Date
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Auth Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  phone?: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Cafe Types
export interface CafeWithDetails extends Cafe {
  owner: User
  seats: Seat[]
  reviews: Review[]
  _count: {
    reservations: number
    reviews: number
  }
  averageRating?: number
}

export interface CafeSearchQuery {
  name?: string
  address?: string
  latitude?: number
  longitude?: number
  radius?: number // km
  page?: number
  limit?: number
}

// Reservation Types
export interface CreateReservationRequest {
  cafeId: string
  seatId: string
  startTime: string
  duration: number // minutes
  notes?: string
}

export interface ReservationWithDetails extends Reservation {
  user: User
  cafe: Cafe
  seat: Seat
}

// Validation Schemas (Zod)
export const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다')
})

export const registerSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다'),
  phone: z.string().optional()
})

export const createReservationSchema = z.object({
  cafeId: z.string().uuid(),
  seatId: z.string().uuid(),
  startTime: z.string().datetime(),
  duration: z.number().min(30).max(480), // 30분 ~ 8시간
  notes: z.string().optional()
})

export const cafeSearchSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radius: z.number().min(0.1).max(50).optional(), // 100m ~ 50km
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10)
})

// Utility Types
export type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateUser = Partial<Omit<User, 'id' | 'email' | 'createdAt' | 'updatedAt'>>
export type CreateCafe = Omit<Cafe, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateCafe = Partial<Omit<Cafe, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>>

// Constants
export const SEAT_TYPE_LABELS = {
  [SeatType.INDIVIDUAL]: '개인석',
  [SeatType.COUPLE]: '커플석',
  [SeatType.GROUP]: '그룹석',
  [SeatType.MEETING_ROOM]: '미팅룸'
} as const

export const RESERVATION_STATUS_LABELS = {
  [ReservationStatus.PENDING]: '대기중',
  [ReservationStatus.CONFIRMED]: '확정됨',
  [ReservationStatus.CANCELLED]: '취소됨',
  [ReservationStatus.COMPLETED]: '완료됨'
} as const

export const ROLE_LABELS = {
  [Role.USER]: '일반사용자',
  [Role.OWNER]: '카페사장',
  [Role.ADMIN]: '관리자'
} as const