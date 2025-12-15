import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '@/schemas/auth'
import { useLogin } from '@/hooks/useLogin'
import { useUiStore } from '@/stores/uiStore'
import { ROUTES } from '@/constants'

export function LoginPage() {
  const location = useLocation()
  const { addNotification } = useUiStore()
  const loginMutation = useLogin()

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur', // 필드에서 벗어날 때 검증
  })

  // 리다이렉트 메시지 표시
  useEffect(() => {
    const state = location.state as any
    if (state?.message) {
      addNotification({
        type: 'info',
        title: '로그인 필요',
        message: state.message,
      })
    }
  }, [location.state, addNotification])

  // 폼 제출 핸들러
  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }

  const isLoading = isSubmitting || loginMutation.isPending

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          로그인
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          계정에 로그인하여 서비스를 이용해보세요
        </p>
      </div>

      {/* 리다이렉트 안내 메시지 */}
      {location.state?.message && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                로그인 필요
              </h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                {location.state.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 이메일 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            이메일
          </label>
          <input
            type="email"
            {...register('email')}
            className={`input-base ${
              errors.email
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : ''
            }`}
            placeholder="이메일을 입력해주세요"
            disabled={isLoading}
            autoComplete="email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            비밀번호
          </label>
          <input
            type="password"
            {...register('password')}
            className={`input-base ${
              errors.password
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : ''
            }`}
            placeholder="비밀번호를 입력해주세요"
            disabled={isLoading}
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              로그인 중...
            </span>
          ) : (
            '로그인'
          )}
        </button>
      </form>

      {/* 회원가입 링크 */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          계정이 없으신가요?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
