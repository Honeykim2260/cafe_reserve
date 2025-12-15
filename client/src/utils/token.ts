/**
 * JWT 토큰 유틸리티
 */

interface JWTPayload {
  exp?: number
  iat?: number
  [key: string]: any
}

/**
 * JWT 토큰 디코딩
 * @param token JWT 토큰 문자열
 * @returns 디코딩된 payload 또는 null
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Token decode error:', error)
    return null
  }
}

/**
 * 토큰 만료 여부 확인
 * @param token JWT 토큰 문자열
 * @returns 만료되었으면 true, 아니면 false
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) {
    return true
  }

  // exp는 초 단위이므로 밀리초로 변환
  const expirationTime = decoded.exp * 1000
  const currentTime = Date.now()

  return currentTime >= expirationTime
}

/**
 * 토큰 만료까지 남은 시간(밀리초)
 * @param token JWT 토큰 문자열
 * @returns 남은 시간(밀리초) 또는 0
 */
export function getTokenTimeRemaining(token: string): number {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) {
    return 0
  }

  const expirationTime = decoded.exp * 1000
  const currentTime = Date.now()
  const timeRemaining = expirationTime - currentTime

  return timeRemaining > 0 ? timeRemaining : 0
}

/**
 * 토큰 유효성 검증
 * @param token JWT 토큰 문자열
 * @returns 유효하면 true, 아니면 false
 */
export function isTokenValid(token: string | null): boolean {
  if (!token) return false

  try {
    const decoded = decodeToken(token)
    if (!decoded) return false

    return !isTokenExpired(token)
  } catch {
    return false
  }
}
