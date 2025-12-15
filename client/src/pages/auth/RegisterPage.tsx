import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { registerWithEmail } from '@/services/authService'

// Password validation helper functions
const validatePassword = (password: string) => {
  const hasEnglish = /[a-zA-Z]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  const hasMinLength = password.length >= 8

  return {
    hasEnglish,
    hasUppercase,
    hasSpecialChar,
    hasMinLength,
    isValid: hasEnglish && hasUppercase && hasSpecialChar && hasMinLength
  }
}

// Password requirement item component
interface PasswordRequirementProps {
  met: boolean
  text: string
}

function PasswordRequirement({ met, text }: PasswordRequirementProps) {
  return (
    <li className="flex items-center text-xs">
      <span className={`mr-2 ${met ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
        {met ? '✓' : '○'}
      </span>
      <span className={met ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
        {text}
      </span>
    </li>
  )
}

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordFocused, setPasswordFocused] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('') // Clear error when user types
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('필수 필드를 모두 입력해주세요')
      return
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      if (!passwordValidation.hasEnglish) {
        setError('비밀번호에 영문이 포함되어야 합니다')
        return
      }
      if (!passwordValidation.hasUppercase) {
        setError('비밀번호에 대문자가 1글자 이상 포함되어야 합니다')
        return
      }
      if (!passwordValidation.hasSpecialChar) {
        setError('비밀번호에 특수문자가 1글자 이상 포함되어야 합니다')
        return
      }
      if (!passwordValidation.hasMinLength) {
        setError('비밀번호는 8자 이상이어야 합니다')
        return
      }
    }

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Register user with Firebase Authentication
      await registerWithEmail(
        formData.email,
        formData.password,
        formData.name,
        formData.phone || undefined
      )

      // Show success message
      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.')

      // Redirect to login page
      navigate(ROUTES.LOGIN)

    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          회원가입
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          새 계정을 만들어 서비스를 시작해보세요
        </p>
      </div>

      {/* Display error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            이름
          </label>
          <input 
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-base"
            placeholder="이름을 입력해주세요"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            이메일
          </label>
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-base"
            placeholder="이메일을 입력해주세요"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            전화번호 (선택)
          </label>
          <input 
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input-base"
            placeholder="전화번호를 입력해주세요"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            비밀번호 (영대문자, 특수기호 포함 8글자 이상.)
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            className="input-base"
            placeholder="비밀번호를 입력해주세요"
            required
          />

          {/* Password requirements indicator */}
          {(passwordFocused || formData.password) && (
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                비밀번호 요구사항:
              </p>
              <ul className="space-y-1">
                <PasswordRequirement
                  met={validatePassword(formData.password).hasMinLength}
                  text="8자 이상"
                />
                <PasswordRequirement
                  met={validatePassword(formData.password).hasEnglish}
                  text="영문 포함"
                />
                <PasswordRequirement
                  met={validatePassword(formData.password).hasUppercase}
                  text="대문자 1글자 이상"
                />
                <PasswordRequirement
                  met={validatePassword(formData.password).hasSpecialChar}
                  text="특수문자 1글자 이상 (!@#$%^&* 등)"
                />
              </ul>
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            비밀번호 확인 (영대문자, 특수기호 포함 8글자 이상.)
          </label>
          <input 
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="input-base"
            placeholder="비밀번호를 다시 입력해주세요"
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? '등록 중...' : '회원가입'}
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          이미 계정이 있으신가요?{' '}
          <Link 
            to={ROUTES.LOGIN}
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}