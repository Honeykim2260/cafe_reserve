import { Router } from 'express'
import { authenticate } from '../middleware/auth-mock'

// Mock 카페 데이터 (client의 mockCafes.ts와 동일한 ID 사용)
const mockCafes = [
  {
    id: '1',
    name: '스타벅스 강남점',
    address: '서울특별시 강남구 테헤란로 142'
  },
  {
    id: '2',
    name: '블루보틀 한남점',
    address: '서울특별시 용산구 이태원로55가길 29'
  },
  {
    id: '3',
    name: '카페 그라운드',
    address: '서울특별시 마포구 홍익로 63'
  },
  {
    id: '4',
    name: '투썸플레이스 여의도점',
    address: '서울특별시 영등포구 여의대로 108'
  },
  {
    id: '5',
    name: '빈브라더스 성수점',
    address: '서울특별시 성동구 아차산로15길 52'
  },
  {
    id: '6',
    name: '메가커피 건대점',
    address: '서울특별시 광진구 아차산로 273'
  }
]

// 카페 ID로 카페 정보 조회하는 헬퍼 함수
const getCafeById = async (cafeId: string) => {
  return mockCafes.find(cafe => cafe.id === cafeId)
}

const router = Router()

// Mock 예약 데이터 - 서버 재시작 시에도 보이도록 더 많은 데이터 추가
let mockReservations = [
  {
    id: 'res1',
    userId: 'user1',
    cafeId: '1',
    seatId: 'seat1-1',
    startTime: '2024-08-31T14:00:00Z',
    endTime: '2024-08-31T16:00:00Z',
    totalPrice: 12000,
    status: 'CONFIRMED',
    notes: '창가 자리 희망',
    cafe: {
      id: '1',
      name: '스타벅스 강남점',
      address: '서울특별시 강남구 테헤란로 142'
    },
    seat: {
      id: 'seat1-1',
      seatNumber: 'A01',
      seatType: '1인석'
    },
    createdAt: '2024-08-30T10:00:00Z'
  },
  {
    id: 'res2',
    userId: 'user1',
    cafeId: '3',
    seatId: 'seat3-2',
    startTime: '2024-08-29T10:00:00Z',
    endTime: '2024-08-29T12:00:00Z',
    totalPrice: 8000,
    status: 'COMPLETED',
    notes: '',
    cafe: {
      id: '3',
      name: '카페 그라운드',
      address: '서울특별시 마포구 홍익로 63'
    },
    seat: {
      id: 'seat3-2',
      seatNumber: 'B02',
      seatType: '2인석'
    },
    createdAt: '2024-08-28T15:30:00Z'
  },
  {
    id: 'res3',
    userId: 'user1',
    cafeId: '2',
    seatId: 'seat2-1',
    startTime: '2024-09-01T09:00:00Z',
    endTime: '2024-09-01T11:00:00Z',
    totalPrice: 15000,
    status: 'CONFIRMED',
    notes: '조용한 자리 부탁드립니다',
    cafe: {
      id: '2',
      name: '블루보틀 한남점',
      address: '서울특별시 용산구 이태원로55가길 29'
    },
    seat: {
      id: 'seat2-1',
      seatNumber: 'C01',
      seatType: '1인석'
    },
    createdAt: '2024-08-30T16:20:00Z'
  },
  {
    id: 'res4',
    userId: 'user2',
    cafeId: '4',
    seatId: 'seat4-3',
    startTime: '2024-09-02T13:00:00Z',
    endTime: '2024-09-02T15:00:00Z',
    totalPrice: 10000,
    status: 'CONFIRMED',
    notes: '',
    cafe: {
      id: '4',
      name: '투썸플레이스 여의도점',
      address: '서울특별시 영등포구 여의대로 108'
    },
    seat: {
      id: 'seat4-3',
      seatNumber: 'D03',
      seatType: '2인석'
    },
    createdAt: '2024-08-30T18:45:00Z'
  }
]

// 내 예약 목록 조회
router.get('/my', authenticate, (req, res) => {
  const userId = req.user?.id
  const userReservations = mockReservations.filter(r => r.userId === userId)
  
  // 캐시 방지 헤더 추가
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  })
  
  res.json({
    success: true,
    data: userReservations,
    message: '예약 목록을 성공적으로 조회했습니다'
  })
})

// 예약 생성 (간단한 Mock)
router.post('/', authenticate, async (req, res) => {
  try {
    const { cafeId, seatId, startTime, endTime, totalPrice, notes } = req.body
    
    // 실제 카페 정보 조회
    const cafe = await getCafeById(cafeId)
    if (!cafe) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CAFE_NOT_FOUND',
          message: '해당 카페를 찾을 수 없습니다'
        }
      })
    }
    
    const newReservation = {
      id: `res_${Date.now()}`,
      userId: req.user?.id,
      cafeId,
      seatId,
      startTime,
      endTime,
      totalPrice,
      status: 'CONFIRMED',
      notes: notes || '',
      cafe: {
        id: cafe.id,
        name: cafe.name,
        address: cafe.address
      },
      seat: {
        id: seatId,
        seatNumber: 'A01',
        seatType: '1인석'
      },
      createdAt: new Date().toISOString()
    }
    
    // Mock 데이터에 실제로 추가
    mockReservations.push(newReservation)
    
    res.status(201).json({
      success: true,
      data: newReservation,
      message: '예약이 성공적으로 생성되었습니다'
    })
  } catch (error) {
    console.error('Create reservation error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '예약 생성 중 오류가 발생했습니다'
      }
    })
  }
})

// 예약 상세 조회
router.get('/:id', authenticate, (req, res) => {
  const reservationId = req.params.id
  const reservation = mockReservations.find(r => r.id === reservationId && r.userId === req.user?.id)
  
  if (!reservation) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'RESERVATION_NOT_FOUND',
        message: '예약을 찾을 수 없습니다'
      }
    })
  }
  
  res.json({
    success: true,
    data: reservation
  })
})

export default router