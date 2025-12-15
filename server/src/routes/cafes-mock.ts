import express from 'express'

const router = express.Router()

// Mock cafe data
const mockCafes = [
  {
    id: 'cafe-1',
    name: '커피스토리 강남점',
    description: '강남역 근처 분위기 좋은 카페입니다. 넓은 공간과 조용한 분위기로 업무나 스터디에 최적화되어 있습니다.',
    address: '서울특별시 강남구 강남대로 123길 45',
    phone: '02-1234-5678',
    latitude: 37.497952,
    longitude: 127.027619,
    images: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&h=600&fit=crop'
    ],
    amenities: ['WiFi', '콘센트', '주차장', '화장실', '금연'],
    businessHours: {
      monday: { open: '08:00', close: '22:00', isOpen: true },
      tuesday: { open: '08:00', close: '22:00', isOpen: true },
      wednesday: { open: '08:00', close: '22:00', isOpen: true },
      thursday: { open: '08:00', close: '22:00', isOpen: true },
      friday: { open: '08:00', close: '22:00', isOpen: true },
      saturday: { open: '09:00', close: '23:00', isOpen: true },
      sunday: { open: '09:00', close: '23:00', isOpen: true }
    },
    openTime: '08:00',
    closeTime: '22:00',
    pricePerHour: 3000,
    maxReservationHours: 4,
    priceRange: 'MEDIUM',
    isActive: true,
    rating: 4.5,
    reviewCount: 127,
    ownerId: 'user-2',
    owner: {
      name: '카페사장1',
      phone: '010-2345-6789'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cafe-2',
    name: '북카페 홍대',
    description: '홍대입구역에서 도보 3분 거리에 위치한 북카페입니다. 다양한 도서와 함께 편안한 독서 환경을 제공합니다.',
    address: '서울특별시 마포구 양화로 234',
    phone: '02-2345-6789',
    latitude: 37.556785,
    longitude: 126.922442,
    images: [
      'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&h=600&fit=crop'
    ],
    amenities: ['WiFi', '도서', '콘센트', '화장실', '금연'],
    businessHours: {
      monday: { open: '09:00', close: '23:00', isOpen: true },
      tuesday: { open: '09:00', close: '23:00', isOpen: true },
      wednesday: { open: '09:00', close: '23:00', isOpen: true },
      thursday: { open: '09:00', close: '23:00', isOpen: true },
      friday: { open: '09:00', close: '23:00', isOpen: true },
      saturday: { open: '10:00', close: '24:00', isOpen: true },
      sunday: { open: '10:00', close: '24:00', isOpen: true }
    },
    openTime: '09:00',
    closeTime: '23:00',
    pricePerHour: 2500,
    maxReservationHours: 6,
    priceRange: 'LOW',
    isActive: true,
    rating: 4.2,
    reviewCount: 89,
    ownerId: 'user-3',
    owner: {
      name: '카페사장2',
      phone: '010-3456-7890'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cafe-3',
    name: '스터디카페 신촌',
    description: '신촌역 바로 앞에 위치한 24시간 스터디카페입니다. 개인석과 그룹스터디룸을 모두 제공합니다.',
    address: '서울특별시 서대문구 신촌로 567',
    phone: '02-3456-7890',
    latitude: 37.555946,
    longitude: 126.936893,
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop'
    ],
    amenities: ['WiFi', '콘센트', '개인사물함', '프린터', '화장실', '금연', '24시간'],
    businessHours: {
      monday: { open: '00:00', close: '23:59', isOpen: true },
      tuesday: { open: '00:00', close: '23:59', isOpen: true },
      wednesday: { open: '00:00', close: '23:59', isOpen: true },
      thursday: { open: '00:00', close: '23:59', isOpen: true },
      friday: { open: '00:00', close: '23:59', isOpen: true },
      saturday: { open: '00:00', close: '23:59', isOpen: true },
      sunday: { open: '00:00', close: '23:59', isOpen: true }
    },
    openTime: '00:00',
    closeTime: '23:59',
    pricePerHour: 3500,
    maxReservationHours: 12,
    priceRange: 'MEDIUM',
    isActive: true,
    rating: 4.7,
    reviewCount: 203,
    ownerId: 'user-2',
    owner: {
      name: '카페사장1',
      phone: '010-2345-6789'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cafe-4',
    name: '조용한카페 이태원',
    description: '이태원의 한적한 골목에 위치한 조용한 카페입니다. 독서와 작업에 집중할 수 있는 환경을 제공합니다.',
    address: '서울특별시 용산구 이태원로 89',
    phone: '02-4567-8901',
    latitude: 37.534567,
    longitude: 126.994678,
    images: [
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=600&fit=crop'
    ],
    amenities: ['WiFi', '콘센트', '조용한환경', '화장실', '금연'],
    businessHours: {
      monday: { open: '10:00', close: '20:00', isOpen: true },
      tuesday: { open: '10:00', close: '20:00', isOpen: true },
      wednesday: { open: '10:00', close: '20:00', isOpen: true },
      thursday: { open: '10:00', close: '20:00', isOpen: true },
      friday: { open: '10:00', close: '20:00', isOpen: true },
      saturday: { open: '11:00', close: '21:00', isOpen: true },
      sunday: { open: '11:00', close: '21:00', isOpen: true }
    },
    openTime: '10:00',
    closeTime: '20:00',
    pricePerHour: 2800,
    maxReservationHours: 5,
    priceRange: 'LOW',
    isActive: true,
    rating: 4.3,
    reviewCount: 45,
    ownerId: 'user-3',
    owner: {
      name: '카페사장2',
      phone: '010-3456-7890'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cafe-5',
    name: '테라스카페 한강',
    description: '한강이 보이는 테라스가 있는 특별한 카페입니다. 야외 테라스석에서 한강을 바라보며 휴식을 취하세요.',
    address: '서울특별시 영등포구 여의도동 한강대로 101',
    phone: '02-5678-9012',
    latitude: 37.529188,
    longitude: 126.932918,
    images: [
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop'
    ],
    amenities: ['WiFi', '콘센트', '테라스', '한강뷰', '화장실', '금연'],
    businessHours: {
      monday: { open: '11:00', close: '21:00', isOpen: true },
      tuesday: { open: '11:00', close: '21:00', isOpen: true },
      wednesday: { open: '11:00', close: '21:00', isOpen: true },
      thursday: { open: '11:00', close: '21:00', isOpen: true },
      friday: { open: '11:00', close: '21:00', isOpen: true },
      saturday: { open: '10:00', close: '22:00', isOpen: true },
      sunday: { open: '10:00', close: '22:00', isOpen: true }
    },
    openTime: '11:00',
    closeTime: '21:00',
    pricePerHour: 4000,
    maxReservationHours: 3,
    priceRange: 'HIGH',
    isActive: true,
    rating: 4.8,
    reviewCount: 312,
    ownerId: 'user-2',
    owner: {
      name: '카페사장1',
      phone: '010-2345-6789'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

// Get all cafes
router.get('/', (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'name', sortOrder = 'asc' } = req.query

    let filteredCafes = [...mockCafes]

    // Search filter
    if (search) {
      const searchTerm = (search as string).toLowerCase()
      filteredCafes = filteredCafes.filter(cafe =>
        cafe.name.toLowerCase().includes(searchTerm) ||
        cafe.description.toLowerCase().includes(searchTerm) ||
        cafe.address.toLowerCase().includes(searchTerm)
      )
    }

    // Sort
    if (sortBy === 'name') {
      filteredCafes.sort((a, b) => {
        const comparison = a.name.localeCompare(b.name)
        return sortOrder === 'desc' ? -comparison : comparison
      })
    } else if (sortBy === 'rating') {
      filteredCafes.sort((a, b) => {
        const comparison = a.rating - b.rating
        return sortOrder === 'desc' ? -comparison : comparison
      })
    } else if (sortBy === 'price') {
      filteredCafes.sort((a, b) => {
        const comparison = a.pricePerHour - b.pricePerHour
        return sortOrder === 'desc' ? -comparison : comparison
      })
    }

    // Pagination
    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const startIndex = (pageNum - 1) * limitNum
    const endIndex = startIndex + limitNum
    const paginatedCafes = filteredCafes.slice(startIndex, endIndex)

    res.json({
      success: true,
      data: {
        cafes: paginatedCafes,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: filteredCafes.length,
          totalPages: Math.ceil(filteredCafes.length / limitNum)
        }
      }
    })

  } catch (error) {
    console.error('Get cafes error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '카페 목록을 불러오는 중 오류가 발생했습니다'
      }
    })
  }
})

// Get cafe by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params
    const cafe = mockCafes.find(cafe => cafe.id === id)

    if (!cafe) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CAFE_NOT_FOUND',
          message: '해당 카페를 찾을 수 없습니다'
        }
      })
    }

    res.json({
      success: true,
      data: {
        cafe
      }
    })

  } catch (error) {
    console.error('Get cafe error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '카페 정보를 불러오는 중 오류가 발생했습니다'
      }
    })
  }
})

// Search cafes
router.get('/search', (req, res) => {
  try {
    const { 
      q: query, 
      location, 
      minPrice, 
      maxPrice, 
      amenities,
      page = 1, 
      limit = 10 
    } = req.query

    let filteredCafes = [...mockCafes]

    // Text search
    if (query) {
      const searchTerm = (query as string).toLowerCase()
      filteredCafes = filteredCafes.filter(cafe =>
        cafe.name.toLowerCase().includes(searchTerm) ||
        cafe.description.toLowerCase().includes(searchTerm) ||
        cafe.address.toLowerCase().includes(searchTerm)
      )
    }

    // Location filter
    if (location) {
      const locationTerm = (location as string).toLowerCase()
      filteredCafes = filteredCafes.filter(cafe =>
        cafe.address.toLowerCase().includes(locationTerm)
      )
    }

    // Price range filter
    if (minPrice) {
      const minPriceNum = parseInt(minPrice as string)
      filteredCafes = filteredCafes.filter(cafe => cafe.pricePerHour >= minPriceNum)
    }

    if (maxPrice) {
      const maxPriceNum = parseInt(maxPrice as string)
      filteredCafes = filteredCafes.filter(cafe => cafe.pricePerHour <= maxPriceNum)
    }

    // Amenities filter
    if (amenities) {
      const amenityList = (amenities as string).split(',')
      filteredCafes = filteredCafes.filter(cafe =>
        amenityList.every(amenity => cafe.amenities.includes(amenity.trim()))
      )
    }

    // Pagination
    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const startIndex = (pageNum - 1) * limitNum
    const endIndex = startIndex + limitNum
    const paginatedCafes = filteredCafes.slice(startIndex, endIndex)

    res.json({
      success: true,
      data: {
        cafes: paginatedCafes,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: filteredCafes.length,
          totalPages: Math.ceil(filteredCafes.length / limitNum)
        }
      }
    })

  } catch (error) {
    console.error('Search cafes error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '카페 검색 중 오류가 발생했습니다'
      }
    })
  }
})

// Get cafe seats
router.get('/:id/seats', (req, res) => {
  try {
    const { id } = req.params
    
    // Mock seat data
    const mockSeats = [
      { id: 'seat1', cafeId: 'cafe-1', seatNumber: 'A01', seatType: 'SINGLE', description: '창가 자리', capacity: 1, hourlyRate: 3000, isAvailable: true, amenities: ['콘센트', '창가'] },
      { id: 'seat2', cafeId: 'cafe-1', seatNumber: 'A02', seatType: 'DOUBLE', description: '2인 테이블', capacity: 2, hourlyRate: 5000, isAvailable: true, amenities: ['콘센트'] },
      { id: 'seat3', cafeId: 'cafe-1', seatNumber: 'B01', seatType: 'GROUP', description: '4인 그룹석', capacity: 4, hourlyRate: 8000, isAvailable: false, amenities: ['콘센트', '화이트보드'] },
      
      { id: 'seat4', cafeId: 'cafe-2', seatNumber: 'C01', seatType: 'SINGLE', description: '조용한 1인석', capacity: 1, hourlyRate: 2500, isAvailable: true, amenities: ['콘센트', '조용한 분위기'] },
      { id: 'seat5', cafeId: 'cafe-2', seatNumber: 'C02', seatType: 'STUDY', description: '스터디 전용석', capacity: 1, hourlyRate: 3000, isAvailable: true, amenities: ['콘센트', '스탠드 조명'] },
      
      { id: 'seat6', cafeId: 'cafe-3', seatNumber: 'D01', seatType: 'SINGLE', description: '24시간 이용 가능', capacity: 1, hourlyRate: 3500, isAvailable: true, amenities: ['콘센트', '24시간'] },
      { id: 'seat7', cafeId: 'cafe-3', seatNumber: 'D02', seatType: 'DOUBLE', description: '커플석', capacity: 2, hourlyRate: 6000, isAvailable: true, amenities: ['콘센트', '소파'] },
      
      { id: 'seat8', cafeId: 'cafe-4', seatNumber: 'E01', seatType: 'SINGLE', description: '조용한 환경', capacity: 1, hourlyRate: 2800, isAvailable: true, amenities: ['콘센트', '조용한환경'] },
      
      { id: 'seat9', cafeId: 'cafe-5', seatNumber: 'F01', seatType: 'SINGLE', description: '한강뷰 테라스', capacity: 1, hourlyRate: 4000, isAvailable: true, amenities: ['콘센트', '테라스', '한강뷰'] },
      { id: 'seat10', cafeId: 'cafe-5', seatNumber: 'F02', seatType: 'DOUBLE', description: '테라스 2인석', capacity: 2, hourlyRate: 7000, isAvailable: false, amenities: ['콘센트', '테라스', '한강뷰'] }
    ]

    const cafeSeats = mockSeats.filter(seat => seat.cafeId === id)
    
    res.json({
      success: true,
      data: cafeSeats
    })

  } catch (error) {
    console.error('Get cafe seats error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '좌석 정보를 불러오는 중 오류가 발생했습니다'
      }
    })
  }
})

export default router