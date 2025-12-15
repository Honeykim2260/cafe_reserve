import { apiClient } from './api'
import {
  Notification,
  NotificationsResponse,
  NotificationFilter,
  NotificationSettings,
  CreateNotificationRequest,
} from '@/types/notification'

/**
 * 알림 API 서비스
 */
export const notificationService = {
  /**
   * 알림 목록 조회
   */
  async getNotifications(
    page: number = 1,
    limit: number = 20,
    filter?: NotificationFilter
  ): Promise<NotificationsResponse> {
    const response = await apiClient.get<NotificationsResponse>('/api/notifications', {
      params: { page, limit, ...filter },
    })

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || '알림 목록을 가져올 수 없습니다')
    }

    return response.data
  },

  /**
   * 읽지 않은 알림 개수 조회
   */
  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>('/api/notifications/unread')

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || '읽지 않은 알림 개수를 가져올 수 없습니다')
    }

    return response.data.count
  },

  /**
   * 알림 읽음 처리
   */
  async markAsRead(notificationId: string): Promise<void> {
    const response = await apiClient.post(`/api/notifications/${notificationId}/read`)

    if (!response.success) {
      throw new Error(response.error?.message || '알림을 읽음 처리할 수 없습니다')
    }
  },

  /**
   * 모든 알림 읽음 처리
   */
  async markAllAsRead(): Promise<void> {
    const response = await apiClient.post('/api/notifications/read-all')

    if (!response.success) {
      throw new Error(response.error?.message || '모든 알림을 읽음 처리할 수 없습니다')
    }
  },

  /**
   * 알림 삭제
   */
  async deleteNotification(notificationId: string): Promise<void> {
    const response = await apiClient.delete(`/api/notifications/${notificationId}`)

    if (!response.success) {
      throw new Error(response.error?.message || '알림을 삭제할 수 없습니다')
    }
  },

  /**
   * 모든 알림 삭제
   */
  async clearAll(): Promise<void> {
    const response = await apiClient.delete('/api/notifications')

    if (!response.success) {
      throw new Error(response.error?.message || '모든 알림을 삭제할 수 없습니다')
    }
  },

  /**
   * 알림 설정 조회
   */
  async getSettings(): Promise<NotificationSettings> {
    const response = await apiClient.get<NotificationSettings>('/api/notifications/settings')

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || '알림 설정을 가져올 수 없습니다')
    }

    return response.data
  },

  /**
   * 알림 설정 업데이트
   */
  async updateSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const response = await apiClient.put<NotificationSettings>(
      '/api/notifications/settings',
      settings
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || '알림 설정을 업데이트할 수 없습니다')
    }

    return response.data
  },

  /**
   * 알림 생성 (테스트용)
   */
  async createNotification(notification: CreateNotificationRequest): Promise<Notification> {
    const response = await apiClient.post<Notification>('/api/notifications', notification)

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || '알림을 생성할 수 없습니다')
    }

    return response.data
  },
}

/**
 * Mock 알림 서비스 (백엔드가 없을 때 사용)
 */
export const mockNotificationService = {
  /**
   * Mock 알림 데이터
   */
  mockNotifications: [
    {
      id: '1',
      type: 'reservation_confirmed' as const,
      title: '예약이 확인되었습니다',
      message: '스타벅스 강남점 예약이 확인되었습니다. 2024-11-27 14:00',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1시간 전
      actionUrl: '/my-reservations',
      metadata: {
        reservationId: 'res-001',
        cafeId: 'cafe-001',
        cafeName: '스타벅스 강남점',
        seatNumber: 'A-12',
      },
    },
    {
      id: '2',
      type: 'reservation_reminder' as const,
      title: '예약 1시간 전입니다',
      message: '투썸플레이스 예약 시간이 1시간 남았습니다.',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2시간 전
      actionUrl: '/my-reservations',
      metadata: {
        reservationId: 'res-002',
        cafeId: 'cafe-002',
        cafeName: '투썸플레이스',
      },
    },
    {
      id: '3',
      type: 'payment_success' as const,
      title: '결제가 완료되었습니다',
      message: '카페베네 예약 결제가 완료되었습니다. 10,000원',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 300), // 5시간 전
      actionUrl: '/my-reservations',
      metadata: {
        reservationId: 'res-003',
        cafeId: 'cafe-003',
        cafeName: '카페베네',
        amount: 10000,
      },
    },
  ] as Notification[],

  /**
   * Mock 알림 목록 조회
   */
  async getNotifications(
    page: number = 1,
    limit: number = 20
  ): Promise<NotificationsResponse> {
    // 실제로는 페이지네이션 처리
    const start = (page - 1) * limit
    const end = start + limit
    const notifications = this.mockNotifications.slice(start, end)
    const unreadCount = this.mockNotifications.filter((n) => !n.isRead).length

    return {
      notifications,
      total: this.mockNotifications.length,
      unreadCount,
      hasMore: end < this.mockNotifications.length,
    }
  },

  /**
   * Mock 읽지 않은 알림 개수
   */
  async getUnreadCount(): Promise<number> {
    return this.mockNotifications.filter((n) => !n.isRead).length
  },

  /**
   * Mock 알림 읽음 처리
   */
  async markAsRead(notificationId: string): Promise<void> {
    const notification = this.mockNotifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.isRead = true
    }
  },

  /**
   * Mock 모든 알림 읽음 처리
   */
  async markAllAsRead(): Promise<void> {
    this.mockNotifications.forEach((n) => {
      n.isRead = true
    })
  },

  /**
   * Mock 알림 삭제
   */
  async deleteNotification(notificationId: string): Promise<void> {
    const index = this.mockNotifications.findIndex((n) => n.id === notificationId)
    if (index !== -1) {
      this.mockNotifications.splice(index, 1)
    }
  },

  /**
   * Mock 알림 추가 (테스트용)
   */
  addMockNotification(notification: Notification) {
    this.mockNotifications.unshift(notification)
  },
}
