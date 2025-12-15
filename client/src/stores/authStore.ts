import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import { LOCAL_STORAGE_KEYS } from '@/constants'
import { authService, LoginRequest, RegisterRequest } from '@/services/authService'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthActions {
  setUser: (user: User) => void
  setToken: (token: string) => void
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  setLoading: (isLoading: boolean) => void
  clearAuth: () => void
  refreshUser: () => Promise<void>
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      // Actions
      setUser: (user: User) => {
        set({ user })
      },

      setToken: (token: string) => {
        set({ token })
        localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, token)
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const { user, token } = await authService.login({ email, password })
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
          localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, token)
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
          localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
          throw error
        }
      },

      register: async (userData: RegisterRequest) => {
        set({ isLoading: true })
        try {
          const { user, token } = await authService.register(userData)
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
          localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, token)
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
          localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await authService.logout()
        } catch (error) {
          console.warn('Logout API failed:', error)
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
          localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
        }
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
      },

      refreshUser: async () => {
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
        if (!token) {
          set({ isAuthenticated: false, isLoading: false })
          return
        }

        set({ isLoading: true })
        try {
          const user = await authService.getCurrentUser()
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          // 토큰이 유효하지 않으면 로그아웃
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
          localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) {
          console.warn('Failed to rehydrate auth state:', error)
          // 에러 시 초기 상태로 리셋
          if (state) {
            state.user = null
            state.token = null
            state.isAuthenticated = false
            state.isLoading = false
          }
          return
        }
        
        // 앱 시작 시 토큰 유효성 검증
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
        if (token && state.user && state.isAuthenticated) {
          // 저장된 상태와 토큰이 모두 있는 경우에만 사용자 정보 갱신
          state.refreshUser()
        } else {
          // 토큰이 없거나 상태가 불완전한 경우 초기화
          state.user = null
          state.token = null
          state.isAuthenticated = false
          state.isLoading = false
          localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
        }
      },
    }
  )
)

// Selectors
export const useUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)