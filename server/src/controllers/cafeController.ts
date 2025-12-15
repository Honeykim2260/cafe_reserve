import { Request, Response } from 'express'
import { AuthRequest } from '@/middleware/auth'
import { ApiResponse } from '../../../shared/src/types'

export async function getCafes(req: AuthRequest, res: Response<ApiResponse>) {
  // Mock cafe data for development
  const mockCafes = [
    {
      id: '1',
      name: '스타벅스 강남점',
      description: '강남역 근처의 대형 스타벅스 매장입니다.',
      address: '서울특별시 강남구 테헤란로 142',
      phone: '02-1234-5678',
      businessHours: {
        mon: { open: '07:00', close: '22:00' },
        tue: { open: '07:00', close: '22:00' },
        wed: { open: '07:00', close: '22:00' },
        thu: { open: '07:00', close: '22:00' },
        fri: { open: '07:00', close: '22:00' },
        sat: { open: '08:00', close: '23:00' },
        sun: { open: '08:00', close: '23:00' }
      },
      rating: 4.2,
      reviewCount: 156,
      priceRange: 'MEDIUM',
      amenities: ['WiFi', '콘센트', '주차가능', '금연'],
      images: [
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=300&fit=crop'
      ],
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-08-30T14:00:00Z'
    },
    {
      id: '2',
      name: '블루보틀 한남점',
      description: '프리미엄 스페셜티 커피 전문점입니다.',
      address: '서울특별시 용산구 이태원로55가길 29',
      phone: '02-2345-6789',
      businessHours: {
        mon: { open: '08:00', close: '21:00' },
        tue: { open: '08:00', close: '21:00' },
        wed: { open: '08:00', close: '21:00' },
        thu: { open: '08:00', close: '21:00' },
        fri: { open: '08:00', close: '21:00' },
        sat: { open: '09:00', close: '22:00' },
        sun: { open: '09:00', close: '22:00' }
      },
      rating: 4.6,
      reviewCount: 89,
      priceRange: 'HIGH',
      amenities: ['WiFi', '조용한 분위기', '프리미엄 원두'],
      images: [
        'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&h=600&fit=crop'
      ],
      createdAt: '2024-02-01T10:00:00Z',
      updatedAt: '2024-08-25T16:30:00Z'
    },
    {
      id: '3',
      name: '카페 그라운드',
      description: '조용하고 아늑한 분위기의 독립 카페입니다.',
      address: '서울특별시 마포구 홍익로 63',
      phone: '02-3456-7890',
      businessHours: {
        mon: { open: '09:00', close: '23:00' },
        tue: { open: '09:00', close: '23:00' },
        wed: { open: '09:00', close: '23:00' },
        thu: { open: '09:00', close: '23:00' },
        fri: { open: '09:00', close: '23:00' },
        sat: { open: '10:00', close: '24:00' },
        sun: { open: '10:00', close: '24:00' }
      },
      rating: 4.4,
      reviewCount: 73,
      priceRange: 'LOW',
      amenities: ['WiFi', '콘센트', '스터디룸', '24시간'],
      images: [
        'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&h=600&fit=crop'
      ],
      createdAt: '2024-03-10T11:00:00Z',
      updatedAt: '2024-08-20T12:00:00Z'
    }
  ]

  res.json({
    success: true,
    data: mockCafes,
    message: 'Cafes retrieved successfully'
  })
}

export async function searchCafes(req: AuthRequest, res: Response<ApiResponse>) {
  // TODO: Implement cafe search by location, name, etc.
  res.json({
    success: true,
    data: [],
    message: 'searchCafes 구현 예정'
  })
}

export async function getCafeById(req: Request, res: Response<ApiResponse>) {
  const { id } = req.params
  
  // Mock cafe data (same as in getCafes)
  const mockCafes = [
    {
      id: '1',
      name: '스타벅스 강남점',
      description: '강남역 근처의 대형 스타벅스 매장입니다.',
      address: '서울특별시 강남구 테헤란로 142',
      phone: '02-1234-5678',
      businessHours: {
        mon: { open: '07:00', close: '22:00' },
        tue: { open: '07:00', close: '22:00' },
        wed: { open: '07:00', close: '22:00' },
        thu: { open: '07:00', close: '22:00' },
        fri: { open: '07:00', close: '22:00' },
        sat: { open: '08:00', close: '23:00' },
        sun: { open: '08:00', close: '23:00' }
      },
      rating: 4.2,
      reviewCount: 156,
      priceRange: 'MEDIUM',
      amenities: ['WiFi', '콘센트', '주차가능', '금연'],
      images: [
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=300&fit=crop'
      ],
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-08-30T14:00:00Z'
    },
    {
      id: '2',
      name: '블루보틀 한남점',
      description: '프리미엄 스페셜티 커피 전문점입니다.',
      address: '서울특별시 용산구 이태원로55가길 29',
      phone: '02-2345-6789',
      businessHours: {
        mon: { open: '08:00', close: '21:00' },
        tue: { open: '08:00', close: '21:00' },
        wed: { open: '08:00', close: '21:00' },
        thu: { open: '08:00', close: '21:00' },
        fri: { open: '08:00', close: '21:00' },
        sat: { open: '09:00', close: '22:00' },
        sun: { open: '09:00', close: '22:00' }
      },
      rating: 4.6,
      reviewCount: 89,
      priceRange: 'HIGH',
      amenities: ['WiFi', '조용한 분위기', '프리미엄 원두'],
      images: [
        'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&h=600&fit=crop'
      ],
      createdAt: '2024-02-01T10:00:00Z',
      updatedAt: '2024-08-25T16:30:00Z'
    },
    {
      id: '3',
      name: '카페 그라운드',
      description: '조용하고 아늑한 분위기의 독립 카페입니다.',
      address: '서울특별시 마포구 홍익로 63',
      phone: '02-3456-7890',
      businessHours: {
        mon: { open: '09:00', close: '23:00' },
        tue: { open: '09:00', close: '23:00' },
        wed: { open: '09:00', close: '23:00' },
        thu: { open: '09:00', close: '23:00' },
        fri: { open: '09:00', close: '23:00' },
        sat: { open: '10:00', close: '24:00' },
        sun: { open: '10:00', close: '24:00' }
      },
      rating: 4.4,
      reviewCount: 73,
      priceRange: 'LOW',
      amenities: ['WiFi', '콘센트', '스터디룸', '24시간'],
      images: [
        'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&h=600&fit=crop'
      ],
      createdAt: '2024-03-10T11:00:00Z',
      updatedAt: '2024-08-20T12:00:00Z'
    }
  ]

  const cafe = mockCafes.find(c => c.id === id)
  
  if (!cafe) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'CAFE_NOT_FOUND',
        message: '카페를 찾을 수 없습니다'
      }
    })
  }

  res.json({
    success: true,
    data: cafe,
    message: 'Cafe retrieved successfully'
  })
}

export async function getCafeSeats(req: Request, res: Response<ApiResponse>) {
  const { id } = req.params
  
  // Mock seat data for each cafe
  const mockSeats = [
    {
      id: 'seat1-1',
      cafeId: '1',
      seatNumber: 'A01',
      seatType: 'SINGLE',
      description: '창가 자리',
      capacity: 1,
      hourlyRate: 6000,
      isAvailable: true,
      amenities: ['콘센트', '창가']
    },
    {
      id: 'seat1-2',
      cafeId: '1',
      seatNumber: 'A02',
      seatType: 'DOUBLE',
      description: '2인 테이블',
      capacity: 2,
      hourlyRate: 8000,
      isAvailable: true,
      amenities: ['콘센트']
    },
    {
      id: 'seat1-3',
      cafeId: '1',
      seatNumber: 'B01',
      seatType: 'GROUP',
      description: '4인 그룹석',
      capacity: 4,
      hourlyRate: 12000,
      isAvailable: false,
      amenities: ['콘센트', '화이트보드']
    },
    {
      id: 'seat2-1',
      cafeId: '2',
      seatNumber: 'C01',
      seatType: 'SINGLE',
      description: '조용한 1인석',
      capacity: 1,
      hourlyRate: 7500,
      isAvailable: true,
      amenities: ['콘센트', '조용한 분위기']
    },
    {
      id: 'seat2-2',
      cafeId: '2',
      seatNumber: 'C02',
      seatType: 'STUDY',
      description: '스터디 전용석',
      capacity: 1,
      hourlyRate: 8000,
      isAvailable: true,
      amenities: ['콘센트', '스탠드 조명', '책상 정리함']
    },
    {
      id: 'seat3-1',
      cafeId: '3',
      seatNumber: 'D01',
      seatType: 'SINGLE',
      description: '24시간 이용 가능',
      capacity: 1,
      hourlyRate: 4000,
      isAvailable: true,
      amenities: ['콘센트', '24시간']
    },
    {
      id: 'seat3-2',
      cafeId: '3',
      seatNumber: 'D02',
      seatType: 'DOUBLE',
      description: '커플석',
      capacity: 2,
      hourlyRate: 6000,
      isAvailable: true,
      amenities: ['콘센트', '소파']
    }
  ]

  const cafeSeats = mockSeats.filter(seat => seat.cafeId === id)
  
  res.json({
    success: true,
    data: cafeSeats,
    message: 'Cafe seats retrieved successfully'
  })
}

export async function getCafeAvailability(req: Request, res: Response<ApiResponse>) {
  // TODO: Implement get cafe availability for a specific date/time range
  res.json({
    success: true,
    data: {},
    message: 'getCafeAvailability 구현 예정'
  })
}

export async function createCafe(req: AuthRequest, res: Response<ApiResponse>) {
  // TODO: Implement create new cafe (owner only)
  res.status(201).json({
    success: true,
    data: {},
    message: 'createCafe 구현 예정'
  })
}

export async function updateCafe(req: AuthRequest, res: Response<ApiResponse>) {
  // TODO: Implement update cafe (owner only)
  res.json({
    success: true,
    data: {},
    message: 'updateCafe 구현 예정'
  })
}

export async function deleteCafe(req: AuthRequest, res: Response<ApiResponse>) {
  // TODO: Implement delete cafe (owner only)
  res.json({
    success: true,
    message: 'deleteCafe 구현 예정'
  })
}

export async function getCafeReservations(req: AuthRequest, res: Response<ApiResponse>) {
  // TODO: Implement get cafe reservations (owner only)
  res.json({
    success: true,
    data: [],
    message: 'getCafeReservations 구현 예정'
  })
}

export async function getCafeReviews(req: Request, res: Response<ApiResponse>) {
  // TODO: Implement get cafe reviews
  res.json({
    success: true,
    data: [],
    message: 'getCafeReviews 구현 예정'
  })
}

export async function getCafeAnalytics(req: AuthRequest, res: Response<ApiResponse>) {
  // TODO: Implement get cafe analytics (owner only)
  res.json({
    success: true,
    data: {},
    message: 'getCafeAnalytics 구현 예정'
  })
}