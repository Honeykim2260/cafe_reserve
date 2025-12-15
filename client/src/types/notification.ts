/**
 * 알림 타입 정의
 */

export type NotificationType =
  | 'reservation_confirmed'    // 예약 확인
  | 'reservation_cancelled'    // 예약 취소
  | 'reservation_reminder'     // 예약 리마인더
  | 'payment_success'          // 결제 성공
  | 'payment_failed'           // 결제 실패
  | 'review_request'           // 리뷰 요청
  | 'reservation_updated'      // 예약 변경
  | 'system'                   // 시스템 알림

/**
 * 알림 인터페이스
 */
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  actionUrl?: string
  metadata?: NotificationMetadata
}

/**
 * 알림 메타데이터
 */
export interface NotificationMetadata {
  reservationId?: string
  cafeId?: string
  cafeName?: string
  seatNumber?: string
  reservationTime?: Date
  amount?: number
  [key: string]: any
}

/**
 * 알림 설정 인터페이스
 */
export interface NotificationSettings {
  // 알림 활성화
  enabled: boolean

  // 알림 유형별 설정
  types: {
    reservation_confirmed: boolean
    reservation_cancelled: boolean
    reservation_reminder: boolean
    payment_success: boolean
    payment_failed: boolean
    review_request: boolean
    reservation_updated: boolean
    system: boolean
  }

  // 브라우저 알림
  browserNotifications: boolean

  // 이메일 알림
  emailNotifications: boolean

  // 알림 시간 설정
  quietHoursEnabled: boolean
  quietHoursStart?: string // "22:00"
  quietHoursEnd?: string   // "08:00"
}

/**
 * 알림 생성 요청
 */
export interface CreateNotificationRequest {
  type: NotificationType
  title: string
  message: string
  actionUrl?: string
  metadata?: NotificationMetadata
}

/**
 * 알림 필터
 */
export interface NotificationFilter {
  type?: NotificationType
  isRead?: boolean
  startDate?: Date
  endDate?: Date
}

/**
 * 알림 통계
 */
export interface NotificationStats {
  total: number
  unread: number
  byType: Record<NotificationType, number>
}

/**
 * 알림 API 응답
 */
export interface NotificationsResponse {
  notifications: Notification[]
  total: number
  unreadCount: number
  hasMore: boolean
}

/**
 * 알림 타입별 아이콘 매핑
 */
export const notificationIcons: Record<NotificationType, string> = {
  reservation_confirmed: '✅',
  reservation_cancelled: '❌',
  reservation_reminder: '⏰',
  payment_success: '💳',
  payment_failed: '⚠️',
  review_request: '⭐',
  reservation_updated: '🔄',
  system: '📢',
}

/**
 * 알림 타입별 색상 매핑
 */
export const notificationColors: Record<NotificationType, string> = {
  reservation_confirmed: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  reservation_cancelled: 'text-red-600 bg-red-50 dark:bg-red-900/20',
  reservation_reminder: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  payment_success: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  payment_failed: 'text-red-600 bg-red-50 dark:bg-red-900/20',
  review_request: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
  reservation_updated: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  system: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20',
}

/**
 * 기본 알림 설정
 */
export const defaultNotificationSettings: NotificationSettings = {
  enabled: true,
  types: {
    reservation_confirmed: true,
    reservation_cancelled: true,
    reservation_reminder: true,
    payment_success: true,
    payment_failed: true,
    review_request: true,
    reservation_updated: true,
    system: true,
  },
  browserNotifications: false,
  emailNotifications: false,
  quietHoursEnabled: false,
}
