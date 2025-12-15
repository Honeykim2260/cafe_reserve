import { BusinessHours } from '@/types'

/**
 * 가격을 한국 원화 형식으로 포맷팅
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * 날짜를 한국어 형식으로 포맷팅
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(d)
}

/**
 * 날짜와 시간을 포맷팅
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)
}

/**
 * 시간을 포맷팅 (HH:MM)
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)
}

/**
 * 현재 요일의 영업시간 정보를 가져오기
 */
export function getCurrentBusinessHours(businessHours: BusinessHours): {
  isOpen: boolean
  hours: string
  currentDay: string
} {
  const now = new Date()
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  
  const currentDayIndex = now.getDay()
  const currentDay = days[currentDayIndex] as keyof BusinessHours
  const currentDayName = dayNames[currentDayIndex]
  
  const todayHours = businessHours[currentDay]
  
  if (!todayHours.isOpen) {
    return {
      isOpen: false,
      hours: '휴무',
      currentDay: currentDayName
    }
  }
  
  // 현재 시간이 영업시간 내인지 확인
  const currentTime = now.getHours() * 100 + now.getMinutes()
  const openTime = parseInt(todayHours.open.replace(':', ''))
  const closeTime = parseInt(todayHours.close.replace(':', ''))
  
  const isCurrentlyOpen = currentTime >= openTime && currentTime <= closeTime
  
  return {
    isOpen: isCurrentlyOpen,
    hours: `${todayHours.open} - ${todayHours.close}`,
    currentDay: currentDayName
  }
}

/**
 * 숫자를 줄임표(...) 형식으로 포맷팅
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * 시간 간격을 사람이 읽기 쉬운 형식으로 변환
 */
export function getTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)
  
  const intervals = [
    { label: '년', seconds: 31536000 },
    { label: '개월', seconds: 2592000 },
    { label: '주', seconds: 604800 },
    { label: '일', seconds: 86400 },
    { label: '시간', seconds: 3600 },
    { label: '분', seconds: 60 },
  ]
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count > 0) {
      return `${count}${interval.label} 전`
    }
  }
  
  return '방금 전'
}

/**
 * 전화번호 형식 포맷팅
 */
export function formatPhoneNumber(phone: string): string {
  const numbers = phone.replace(/[^0-9]/g, '')
  
  if (numbers.length === 11) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`
  } else if (numbers.length === 10) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`
  } else if (numbers.startsWith('02')) {
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`
  }
  
  return phone
}

/**
 * 지정된 날짜의 영업시간 정보 가져오기
 */
export function getBusinessHoursForDate(businessHours: BusinessHours, date: string): {
  isOpen: boolean
  openTime: string
  closeTime: string
  dayName: string
} {
  const targetDate = new Date(date)
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  
  const dayIndex = targetDate.getDay()
  const dayKey = days[dayIndex] as keyof BusinessHours
  const dayName = dayNames[dayIndex]
  
  const dayHours = businessHours[dayKey]
  
  return {
    isOpen: dayHours.isOpen,
    openTime: dayHours.open,
    closeTime: dayHours.close,
    dayName
  }
}

/**
 * 영업시간 내의 유효한 시간 옵션 생성
 */
export function getValidTimeOptions(businessHours: BusinessHours, date: string, duration: number): string[] {
  const dayInfo = getBusinessHoursForDate(businessHours, date)
  
  if (!dayInfo.isOpen) {
    return []
  }
  
  const options: string[] = []
  const [openHour, openMinute] = dayInfo.openTime.split(':').map(Number)
  const [closeHour, closeMinute] = dayInfo.closeTime.split(':').map(Number)
  
  let currentHour = openHour
  let currentMinute = openMinute
  
  while (true) {
    const reservationEndHour = currentHour + Math.floor((currentMinute + duration * 60) / 60)
    const reservationEndMinute = (currentMinute + duration * 60) % 60
    
    if (reservationEndHour > closeHour || 
        (reservationEndHour === closeHour && reservationEndMinute > closeMinute)) {
      break
    }
    
    const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
    options.push(timeString)
    
    currentMinute += 30
    if (currentMinute >= 60) {
      currentHour += 1
      currentMinute = 0
    }
    
    if (currentHour > closeHour || 
        (currentHour === closeHour && currentMinute > closeMinute)) {
      break
    }
  }
  
  return options
}

/**
 * 현재 시간 이전의 시간 옵션 필터링
 */
export function filterPastTimeOptions(timeOptions: string[], date: string): string[] {
  const today = new Date()
  const selectedDate = new Date(date)
  
  if (selectedDate.toDateString() !== today.toDateString()) {
    return timeOptions
  }
  
  const currentTime = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`
  
  return timeOptions.filter(time => time > currentTime)
}