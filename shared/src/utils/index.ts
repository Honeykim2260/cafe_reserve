// Date utilities
export function formatTime(time: string): string {
  return time.slice(0, 5) // "09:00:00" -> "09:00"
}

export function isTimeInRange(time: string, start: string, end: string): boolean {
  return time >= start && time <= end
}

export function calculateDuration(startTime: Date, endTime: Date): number {
  return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString('ko-KR')
}

// Price utilities
export function calculatePrice(basePrice: number, duration: number, multiplier: number = 1): number {
  const hours = Math.ceil(duration / 60)
  return basePrice * hours * multiplier
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString()}원`
}

// Distance utilities
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Seat utilities
export function getSeatTypeLabel(type: string): string {
  const labels = {
    'INDIVIDUAL': '개인석',
    'COUPLE': '커플석',
    'GROUP': '그룹석',
    'MEETING_ROOM': '미팅룸'
  }
  return labels[type as keyof typeof labels] || type
}

// Array utilities
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key])
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}