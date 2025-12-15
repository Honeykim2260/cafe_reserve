import { Link } from 'react-router-dom'
import { Cafe } from '@/types'
import { ROUTES } from '@/constants'

interface CafeCardProps {
  cafe: Cafe
}

export function CafeCard({ cafe }: CafeCardProps) {
  const getPriceRangeText = (priceRange: string) => {
    switch (priceRange) {
      case 'LOW': return '₩'
      case 'MEDIUM': return '₩₩'
      case 'HIGH': return '₩₩₩'
      default: return '₩₩'
    }
  }

  const getCurrentStatus = () => {
    const now = new Date()
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const currentDay = dayNames[now.getDay()]
    
    const todayHours = cafe.businessHours[currentDay]
    if (!todayHours || !todayHours.isOpen) {
      return { isOpen: false, text: '오늘 휴무' }
    }

    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0')
    const isCurrentlyOpen = currentTime >= todayHours.open && currentTime <= todayHours.close
    
    return {
      isOpen: isCurrentlyOpen,
      text: isCurrentlyOpen ? `${todayHours.close}에 마감` : `${todayHours.open}에 오픈`
    }
  }

  const status = getCurrentStatus()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={cafe.images[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop'}
          alt={cafe.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            status.isOpen 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {status.text}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
            {getPriceRangeText(cafe.priceRange)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
            {cafe.name}
          </h3>
          <div className="flex items-center ml-2">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
              {cafe.rating.toFixed(1)} ({cafe.reviewCount})
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {cafe.description}
        </p>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="line-clamp-1">{cafe.address}</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mb-4">
          {cafe.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded"
            >
              {amenity}
            </span>
          ))}
          {cafe.amenities.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded">
              +{cafe.amenities.length - 3}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Link
            to={`${ROUTES.CAFES}/${cafe.id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            자세히 보기
          </Link>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
            ♡
          </button>
        </div>
      </div>
    </div>
  )
}