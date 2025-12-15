import { useState, useMemo, useEffect } from 'react'
import { CafeCard } from '@/components/cafes/CafeCard'
import { Cafe } from '@/types'
import { api } from '@/services/api'

export function CafesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'priceRange'>('rating')
  const [cafes, setCafes] = useState<Cafe[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch cafes from API
  useEffect(() => {
    const fetchCafes = async () => {
      try {
        setLoading(true)
        const response = await api.get('/api/cafes')
        setCafes(response.data.cafes || [])
      } catch (error) {
        console.error('Failed to fetch cafes:', error)
        setCafes([])
      } finally {
        setLoading(false)
      }
    }

    fetchCafes()
  }, [])

  // Get all unique amenities for filter options
  const allAmenities = useMemo(() => {
    const amenitySet = new Set<string>()
    cafes.forEach(cafe => {
      cafe.amenities?.forEach(amenity => amenitySet.add(amenity))
    })
    return Array.from(amenitySet).sort()
  }, [cafes])

  // Filter and sort cafes
  const filteredAndSortedCafes = useMemo(() => {
    let filtered = cafes.filter((cafe: Cafe) => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        cafe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cafe.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cafe.description?.toLowerCase().includes(searchTerm.toLowerCase())

      // Price range filter
      const matchesPriceRange = selectedPriceRange === '' || cafe.priceRange === selectedPriceRange

      // Amenities filter
      const matchesAmenities = selectedAmenities.length === 0 || 
        selectedAmenities.every(amenity => cafe.amenities?.includes(amenity))

      return matchesSearch && matchesPriceRange && matchesAmenities
    })

    // Sort cafes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rating':
          return b.rating - a.rating
        case 'priceRange':
          const priceOrder = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3 }
          return priceOrder[a.priceRange as keyof typeof priceOrder] - priceOrder[b.priceRange as keyof typeof priceOrder]
        default:
          return 0
      }
    })

    return filtered
  }, [cafes, searchTerm, selectedPriceRange, selectedAmenities, sortBy])

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">카페 목록을 불러오는 중...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">카페 찾기</h1>
        <p className="text-gray-600 dark:text-gray-400">
          원하는 카페를 찾아 편안한 시간을 보내보세요. 총 {filteredAndSortedCafes.length}개의 카페가 있습니다.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 mb-8">
        {/* Search Bar */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            카페 검색
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="카페명, 주소, 설명으로 검색..."
            className="w-full input-base"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              가격대
            </label>
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="w-full input-base"
            >
              <option value="">전체</option>
              <option value="LOW">저렴함 (₩)</option>
              <option value="MEDIUM">보통 (₩₩)</option>
              <option value="HIGH">비쌈 (₩₩₩)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              정렬
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'rating' | 'priceRange')}
              className="w-full input-base"
            >
              <option value="rating">평점 높은 순</option>
              <option value="name">이름 순</option>
              <option value="priceRange">가격 낮은 순</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedPriceRange('')
                setSelectedAmenities([])
              }}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              필터 초기화
            </button>
          </div>
        </div>

        {/* Amenities Filter */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            편의시설
          </label>
          <div className="flex flex-wrap gap-2">
            {allAmenities.map((amenity) => (
              <button
                key={amenity}
                onClick={() => handleAmenityToggle(amenity)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  selectedAmenities.includes(amenity)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredAndSortedCafes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">☕</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            검색 결과가 없습니다
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            다른 검색어나 필터 조건을 시도해보세요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCafes.map((cafe) => (
            <CafeCard key={cafe.id} cafe={cafe} />
          ))}
        </div>
      )}
    </div>
  )
}