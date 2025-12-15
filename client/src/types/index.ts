// Local copy of shared types for now
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

export interface User {
  id: string
  email: string
  name: string
  phone: string | null
  role: Role
  isActive: boolean
  profileImage?: string | null
  createdAt: Date | string
  updatedAt: Date | string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    message: string
    details?: any
  }
}

export interface AuthResponse {
  user: User
  token: string
}

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

// Cafe related types
export interface Cafe {
  id: string
  name: string
  description: string | null
  address: string
  phone: string
  email: string | null
  website: string | null
  images: string[]
  businessHours: {
    [key: string]: {
      open: string
      close: string
      isOpen: boolean
    }
  }
  amenities: string[]
  priceRange: 'LOW' | 'MEDIUM' | 'HIGH'
  rating: number
  reviewCount: number
  latitude: number | null
  longitude: number | null
  ownerId: string
  isActive: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Seat {
  id: string
  cafeId: string
  seatNumber: string
  seatType: 'SINGLE' | 'DOUBLE' | 'GROUP'
  capacity: number
  isAvailable: boolean
  amenities: string[]
  hourlyRate: number
  position: {
    x: number
    y: number
  } | null
  cafe?: Cafe
}

export interface Reservation {
  id: string
  userId: string
  cafeId: string
  seatId: string
  startTime: Date | string
  endTime: Date | string
  totalHours: number
  totalPrice: number
  status: ReservationStatus
  notes: string | null
  user?: User
  cafe?: Cafe
  seat?: Seat
  createdAt: Date | string
  updatedAt: Date | string
}