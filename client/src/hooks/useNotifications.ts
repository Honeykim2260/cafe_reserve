import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '@/stores/notificationStore'
import { notificationService, mockNotificationService } from '@/services/notificationService'
import { Notification, NotificationFilter } from '@/types/notification'

// Mock 모드 (백엔드가 없을 때 true로 설정)
const USE_MOCK = true

const service = USE_MOCK ? mockNotificationService : notificationService

/**
 * 알림 목록 조회 훅
 */
export function useNotificationsQuery(page: number = 1, limit: number = 20, filter?: NotificationFilter) {
  const { setNotifications } = useNotificationStore()

  return useQuery({
    queryKey: ['notifications', page, limit, filter],
    queryFn: async () => {
      const response = await service.getNotifications(page, limit)
      setNotifications(response.notifications)
      return response
    },
    staleTime: 1 * 60 * 1000, // 1분
  })
}

/**
 * 읽지 않은 알림 개수 조회 훅
 */
export function useUnreadCountQuery() {
  const { updateUnreadCount } = useNotificationStore()

  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const count = await service.getUnreadCount()
      updateUnreadCount()
      return count
    },
    staleTime: 30 * 1000, // 30초
    refetchInterval: 60 * 1000, // 1분마다 자동 갱신
  })
}

/**
 * 알림 읽음 처리 훅
 */
export function useMarkAsReadMutation() {
  const queryClient = useQueryClient()
  const { markAsRead } = useNotificationStore()

  return useMutation({
    mutationFn: (notificationId: string) => service.markAsRead(notificationId),
    onSuccess: (_, notificationId) => {
      markAsRead(notificationId)
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

/**
 * 모든 알림 읽음 처리 훅
 */
export function useMarkAllAsReadMutation() {
  const queryClient = useQueryClient()
  const { markAllAsRead } = useNotificationStore()

  return useMutation({
    mutationFn: () => service.markAllAsRead(),
    onSuccess: () => {
      markAllAsRead()
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

/**
 * 알림 삭제 훅
 */
export function useDeleteNotificationMutation() {
  const queryClient = useQueryClient()
  const { removeNotification } = useNotificationStore()

  return useMutation({
    mutationFn: (notificationId: string) => service.deleteNotification(notificationId),
    onSuccess: (_, notificationId) => {
      removeNotification(notificationId)
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

/**
 * 알림 추가 (로컬 전용, 테스트용)
 */
export function useAddNotification() {
  const { addNotification } = useNotificationStore()

  return (notification: Notification) => {
    addNotification(notification)

    // Mock 서비스에도 추가
    if (USE_MOCK) {
      mockNotificationService.addMockNotification(notification)
    }
  }
}

/**
 * 알림 센터 관련 훅
 */
export function useNotificationCenter() {
  const {
    isNotificationCenterOpen,
    toggleNotificationCenter,
    setNotificationCenterOpen,
  } = useNotificationStore()

  return {
    isOpen: isNotificationCenterOpen,
    toggle: toggleNotificationCenter,
    open: () => setNotificationCenterOpen(true),
    close: () => setNotificationCenterOpen(false),
  }
}
