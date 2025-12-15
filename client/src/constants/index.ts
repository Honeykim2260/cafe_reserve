export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  CAFES: '/cafes',
  MY_RESERVATIONS: '/my-reservations',
  PROFILE: '/profile'
}

export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com' 
  : '' // 개발 환경에서는 Vite 프록시 사용

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'mycafe_token',
  ACCESS_TOKEN: 'mycafe_token', // Alias for compatibility
  USER: 'mycafe_user',
  THEME: 'mycafe_theme'
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me',
    LOGOUT: '/api/auth/logout'
  },
  CAFES: {
    LIST: '/api/cafes',
    DETAIL: (id: string) => `/api/cafes/${id}`,
    SEARCH: '/api/cafes/search'
  },
  RESERVATIONS: {
    LIST: '/api/reservations',
    CREATE: '/api/reservations',
    DETAIL: (id: string) => `/api/reservations/${id}`,
    UPDATE: (id: string) => `/api/reservations/${id}`,
    CANCEL: (id: string) => `/api/reservations/${id}`
  }
}

export const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
} as const

export const RESERVATION_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
} as const