import { useMutation } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { loginWithEmail, getUserData } from '@/services/authService'
import { useUiStore } from '@/stores/uiStore'
import { ROUTES } from '@/constants'

interface LoginRequest {
  email: string
  password: string
}

/**
 * 로그인 mutation hook - Firebase Authentication 사용
 */
export function useLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addNotification } = useUiStore()

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      // Firebase Authentication으로 로그인
      const user = await loginWithEmail(credentials.email, credentials.password)

      // Firestore에서 사용자 추가 정보 가져오기
      const userData = await getUserData(user.uid)

      return {
        user: {
          uid: user.uid,
          email: user.email!,
          name: userData?.name || user.displayName || '',
          phone: userData?.phone
        },
        firebaseUser: user
      }
    },
    onSuccess: (data) => {
      // 성공 알림
      addNotification({
        type: 'success',
        title: '로그인 성공',
        message: `환영합니다, ${data.user.name || data.user.email}님!`,
      })

      // 원래 페이지로 리다이렉트 또는 홈으로 이동
      const state = location.state as any
      const redirectTo = state?.from || ROUTES.HOME
      navigate(redirectTo, { replace: true })
    },
    onError: (error: any) => {
      // Firebase 에러 메시지는 이미 한글로 변환되어 있음
      const errorMessage = error.message || '로그인에 실패했습니다.'

      // 에러 알림
      addNotification({
        type: 'error',
        title: '로그인 실패',
        message: errorMessage,
      })
    },
  })
}
