import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LOCAL_STORAGE_KEYS } from '@/constants'

type Theme = 'light' | 'dark' | 'system'

interface UiState {
  theme: Theme
  isSidebarOpen: boolean
  isLoading: boolean
  notifications: Notification[]
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface UiActions {
  setTheme: (theme: Theme) => void
  toggleSidebar: () => void
  setSidebarOpen: (isOpen: boolean) => void
  setLoading: (isLoading: boolean) => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useUiStore = create<UiState & UiActions>()(
  persist(
    (set, get) => ({
      // State
      theme: 'system',
      isSidebarOpen: false,
      isLoading: false,
      notifications: [],

      // Actions
      setTheme: (theme: Theme) => {
        set({ theme })
        
        // Apply theme to document
        const root = document.documentElement
        if (theme === 'dark') {
          root.classList.add('dark')
        } else if (theme === 'light') {
          root.classList.remove('dark')
        } else {
          // System preference
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
          if (mediaQuery.matches) {
            root.classList.add('dark')
          } else {
            root.classList.remove('dark')
          }
        }
      },

      toggleSidebar: () => {
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen }))
      },

      setSidebarOpen: (isOpen: boolean) => {
        set({ isSidebarOpen: isOpen })
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },

      addNotification: (notification: Omit<Notification, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newNotification: Notification = {
          ...notification,
          id,
        }
        
        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }))

        // Auto-remove notification after duration
        const duration = notification.duration || 5000
        setTimeout(() => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }))
        }, duration)
      },

      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }))
      },

      clearNotifications: () => {
        set({ notifications: [] })
      },
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        theme: state.theme,
        isSidebarOpen: state.isSidebarOpen,
      }),
      onRehydrateStorage: () => (state) => {
        // Apply saved theme on app start
        if (state?.theme) {
          const root = document.documentElement
          if (state.theme === 'dark') {
            root.classList.add('dark')
          } else if (state.theme === 'light') {
            root.classList.remove('dark')
          } else {
            // System preference
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            if (mediaQuery.matches) {
              root.classList.add('dark')
            } else {
              root.classList.remove('dark')
            }
          }
        }
      },
    }
  )
)

// Selectors
export const useTheme = () => useUiStore((state) => state.theme)
export const useNotifications = () => useUiStore((state) => state.notifications)