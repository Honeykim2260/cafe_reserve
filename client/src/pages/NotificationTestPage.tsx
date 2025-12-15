import { useState } from 'react'
import {
  useNotificationsQuery,
  useUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useAddNotification,
} from '@/hooks/useNotifications'
import { Notification, NotificationType } from '@/types/notification'
import { notificationIcons, notificationColors } from '@/types/notification'

/**
 * 알림 기능 테스트 페이지
 * Phase 1 인프라 테스트용
 */
export function NotificationTestPage() {
  const [selectedType, setSelectedType] = useState<NotificationType>('system')

  // Queries
  const { data: notificationsData, isLoading, refetch } = useNotificationsQuery()
  const { data: unreadCount } = useUnreadCountQuery()

  // Mutations
  const markAsRead = useMarkAsReadMutation()
  const markAllAsRead = useMarkAllAsReadMutation()
  const deleteNotification = useDeleteNotificationMutation()

  // Local action
  const addNotification = useAddNotification()

  // 테스트 알림 추가
  const handleAddTestNotification = () => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: selectedType,
      title: `테스트 알림 - ${selectedType}`,
      message: `이것은 ${selectedType} 타입의 테스트 알림입니다.`,
      isRead: false,
      createdAt: new Date(),
      actionUrl: '/test',
      metadata: {
        test: true,
      },
    }

    addNotification(newNotification)
    refetch()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            알림 시스템 테스트 (Phase 1)
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            기본 알림 인프라가 정상적으로 작동하는지 테스트합니다.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              전체 알림
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {notificationsData?.notifications.length || 0}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              읽지 않은 알림
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {unreadCount || 0}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              읽은 알림
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {(notificationsData?.notifications.length || 0) - (unreadCount || 0)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            테스트 액션
          </h2>

          <div className="space-y-4">
            {/* Add Notification */}
            <div className="flex items-center gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as NotificationType)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="reservation_confirmed">예약 확인</option>
                <option value="reservation_cancelled">예약 취소</option>
                <option value="reservation_reminder">예약 리마인더</option>
                <option value="payment_success">결제 성공</option>
                <option value="payment_failed">결제 실패</option>
                <option value="review_request">리뷰 요청</option>
                <option value="reservation_updated">예약 변경</option>
                <option value="system">시스템 알림</option>
              </select>
              <button
                onClick={handleAddTestNotification}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                테스트 알림 추가
              </button>
            </div>

            {/* Bulk Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => markAllAsRead.mutate()}
                disabled={markAllAsRead.isPending}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {markAllAsRead.isPending ? '처리 중...' : '모두 읽음으로 표시'}
              </button>

              <button
                onClick={() => refetch()}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                새로고침
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            알림 목록
          </h2>

          {isLoading ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              로딩 중...
            </div>
          ) : notificationsData?.notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              알림이 없습니다. 위에서 테스트 알림을 추가해보세요!
            </div>
          ) : (
            <div className="space-y-3">
              {notificationsData?.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.isRead
                      ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Icon */}
                      <div
                        className={`text-2xl ${
                          notificationColors[notification.type]
                        } px-3 py-2 rounded-lg`}
                      >
                        {notificationIcons[notification.type]}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                          <span>타입: {notification.type}</span>
                          <span>
                            {new Date(notification.createdAt).toLocaleString('ko-KR')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead.mutate(notification.id)}
                          disabled={markAsRead.isPending}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          읽음
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification.mutate(notification.id)}
                        disabled={deleteNotification.isPending}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            💡 테스트 가이드
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li>• 알림 타입을 선택하고 "테스트 알림 추가" 버튼을 클릭하세요</li>
            <li>• 각 알림의 "읽음" 버튼으로 읽음 처리를 테스트하세요</li>
            <li>• "모두 읽음으로 표시" 버튼으로 일괄 처리를 테스트하세요</li>
            <li>• "삭제" 버튼으로 개별 알림 삭제를 테스트하세요</li>
            <li>• 페이지를 새로고침해도 알림이 유지되는지 확인하세요 (localStorage)</li>
            <li>• 읽지 않은 알림 개수가 자동으로 업데이트되는지 확인하세요</li>
          </ul>
        </div>

        {/* Technical Info */}
        <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            🔧 기술 정보
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <span className="font-medium">상태 관리:</span> Zustand + localStorage
            </div>
            <div>
              <span className="font-medium">데이터 페칭:</span> React Query (Mock 모드)
            </div>
            <div>
              <span className="font-medium">Mock 서비스:</span> 활성화됨 (백엔드 불필요)
            </div>
            <div>
              <span className="font-medium">자동 갱신:</span> 1분마다 읽지 않은 개수 갱신
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
