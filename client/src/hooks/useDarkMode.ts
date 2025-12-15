import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'mycafe_theme'

/**
 * 시스템 다크모드 선호도 감지
 */
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * localStorage에서 저장된 테마 가져오기
 */
function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null

  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  return null
}

/**
 * 실제 적용될 테마 계산
 */
function getResolvedTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return getSystemTheme()
  }
  return theme
}

/**
 * 다크모드 훅
 *
 * 시스템 설정 감지, localStorage 저장, 부드러운 전환 지원
 */
export function useDarkMode() {
  // 초기 테마 설정: localStorage > 시스템 설정 > light
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = getStoredTheme()
    return stored || 'system'
  })

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    const stored = getStoredTheme()
    return getResolvedTheme(stored || 'system')
  })

  // 테마 적용
  useEffect(() => {
    const resolved = getResolvedTheme(theme)
    setResolvedTheme(resolved)

    // HTML 요소에 class 적용
    const root = document.documentElement

    if (resolved === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // localStorage에 저장
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  // 시스템 설정 변경 감지
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      const resolved = e.matches ? 'dark' : 'light'
      setResolvedTheme(resolved)

      const root = document.documentElement
      if (resolved === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    // 이벤트 리스너 등록
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  // 테마 변경 함수
  const setDarkMode = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  // 토글 함수 (light <-> dark)
  const toggleDarkMode = () => {
    setTheme(prevTheme => {
      const resolved = getResolvedTheme(prevTheme)
      return resolved === 'dark' ? 'light' : 'dark'
    })
  }

  return {
    theme, // 사용자가 선택한 테마 ('light' | 'dark' | 'system')
    resolvedTheme, // 실제 적용된 테마 ('light' | 'dark')
    isDark: resolvedTheme === 'dark',
    setTheme: setDarkMode,
    toggleTheme: toggleDarkMode,
  }
}
