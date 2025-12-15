import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Notification,
  NotificationSettings,
  defaultNotificationSettings,
} from '@/types/notification'

interface NotificationState {
  // 알림 목록
  notifications: Notification[]

  // 읽지 않은 알림 개수
  unreadCount: number

  // 알림 설정
  settings: NotificationSettings

  // 로딩 상태
  isLoading: boolean

  // 알림 센터 열림/닫힘
  isNotificationCenterOpen: boolean
}

interface NotificationActions {
  // 알림 추가
  addNotification: (notification: Notification) => void

  // 알림 목록 설정
  setNotifications: (notifications: Notification[]) => void

  // 알림 읽음 처리
  markAsRead: (notificationId: string) => void

  // 모든 알림 읽음 처리
  markAllAsRead: () => void

  // 알림 삭제
  removeNotification: (notificationId: string) => void

  // 모든 알림 삭제
  clearAllNotifications: () => void

  // 읽지 않은 알림 개수 업데이트
  updateUnreadCount: () => void

  // 알림 설정 업데이트
  updateSettings: (settings: Partial<NotificationSettings>) => void

  // 로딩 상태 설정
  setLoading: (isLoading: boolean) => void

  // 알림 센터 토글
  toggleNotificationCenter: () => void

  // 알림 센터 열기/닫기
  setNotificationCenterOpen: (isOpen: boolean) => void
}

export const useNotificationStore = create<NotificationState & NotificationActions>()(
  persist(
    (set, get) => ({
      // Initial state
      notifications: [],
      unreadCount: 0,
      settings: defaultNotificationSettings,
      isLoading: false,
      isNotificationCenterOpen: false,

      // Actions
      addNotification: (notification) => {
        set((state) => {
          const newNotifications = [notification, ...state.notifications]
          const unreadCount = newNotifications.filter((n) => !n.isRead).length

          return {
            notifications: newNotifications,
            unreadCount,
          }
        })
      },

      setNotifications: (notifications) => {
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.isRead).length,
        })
      },

      markAsRead: (notificationId) => {
        set((state) => {
          const notifications = state.notifications.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
          const unreadCount = notifications.filter((n) => !n.isRead).length

          return { notifications, unreadCount }
        })
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        }))
      },

      removeNotification: (notificationId) => {
        set((state) => {
          const notifications = state.notifications.filter((n) => n.id !== notificationId)
          const unreadCount = notifications.filter((n) => !n.isRead).length

          return { notifications, unreadCount }
        })
      },

      clearAllNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0,
        })
      },

      updateUnreadCount: () => {
        set((state) => ({
          unreadCount: state.notifications.filter((n) => !n.isRead).length,
        }))
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }))
      },

      setLoading: (isLoading) => {
        set({ isLoading })
      },

      toggleNotificationCenter: () => {
        set((state) => ({
          isNotificationCenterOpen: !state.isNotificationCenterOpen,
        }))
      },

      setNotificationCenterOpen: (isOpen) => {
        set({ isNotificationCenterOpen: isOpen })
      },
    }),
    {
      name: 'notification-store',
      partialize: (state) => ({
        notifications: state.notifications,
        settings: state.settings,
      }),
    }
  )
)

// Selectors
export const useNotifications = () => useNotificationStore((state) => state.notifications)
export const useUnreadCount = () => useNotificationStore((state) => state.unreadCount)
export const useNotificationSettings = () => useNotificationStore((state) => state.settings)
export const useNotificationCenterOpen = () =>
  useNotificationStore((state) => state.isNotificationCenterOpen)
