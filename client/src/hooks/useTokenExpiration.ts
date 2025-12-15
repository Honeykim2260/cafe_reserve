import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import { isTokenValid, getTokenTimeRemaining } from '@/utils/token'
import { LOCAL_STORAGE_KEYS, ROUTES } from '@/constants'

/**
 * JWT 토큰 만료 체크 및 자동 로그아웃 훅
 *
 * 앱 전체에서 한 번만 사용되어야 하며,
 * 주기적으로 토큰 만료를 확인하고 만료 시 자동 로그아웃 처리
 */
export function useTokenExpiration() {
  const navigate = useNavigate()
  const { token, logout, isAuthenticated } = useAuthStore()
  const { addNotification } = useUiStore()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // 인증되지 않은 경우 체크 중단
    if (!isAuthenticated || !token) {
      // 타이머 정리
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
        checkIntervalRef.current = null
      }
      return
    }

    // 토큰 유효성 즉시 체크
    if (!isTokenValid(token)) {
      handleTokenExpired()
      return
    }

    // 만료 타이머 설정
    const timeRemaining = getTokenTimeRemaining(token)
    if (timeRemaining > 0) {
      // 토큰 만료 직전에 자동 로그아웃
      timeoutRef.current = setTimeout(() => {
        handleTokenExpired()
      }, timeRemaining)
    } else {
      handleTokenExpired()
      return
    }

    // 주기적으로 토큰 체크 (1분마다)
    checkIntervalRef.current = setInterval(() => {
      const currentToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)

      if (!currentToken || !isTokenValid(currentToken)) {
        handleTokenExpired()
      }
    }, 60 * 1000) // 1분

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
    }
  }, [token, isAuthenticated])

  const handleTokenExpired = async () => {
    // 타이머 정리
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current)
      checkIntervalRef.current = null
    }

    // 로그아웃 처리
    await logout()

    // 알림 표시
    addNotification({
      type: 'warning',
      title: '세션 만료',
      message: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.',
    })

    // 로그인 페이지로 리다이렉트
    navigate(ROUTES.LOGIN, {
      state: {
        message: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.',
        from: window.location.pathname
      },
      replace: true,
    })
  }
}
