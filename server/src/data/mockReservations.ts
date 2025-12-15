import { ReservationStatus, CancellationReason } from '@prisma/client'

export const mockReservations = [
  {
    id: '1',
    userId: 'user1', // 테스트용 사용자 ID
    cafeId: '1',
    seatId: 'seat1',
    startTime: new Date('2024-09-01T14:00:00Z'),
    endTime: new Date('2024-09-01T16:00:00Z'),
    totalHours: 2,
    totalPrice: 12000,
    status: ReservationStatus.CONFIRMED,
    notes: '조용한 자리 부탁드립니다',
    createdAt: new Date('2024-08-30T10:00:00Z'),
    updatedAt: new Date('2024-08-30T10:00:00Z'),
    cafe: {
      id: '1',
      name: '스타벅스 강남점',
      address: '서울특별시 강남구 테헤란로 142',
      phone: '02-1234-5678',
      images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop']
    },
    seat: {
      id: 'seat1',
      seatNumber: 'A01',
      seatType: 'SINGLE',
      capacity: 1,
      hourlyRate: 6000,
      amenities: ['WiFi', '콘센트']
    }
  },
  {
    id: '2',
    userId: 'user1',
    cafeId: '2',
    seatId: 'seat2',
    startTime: new Date('2024-09-02T10:00:00Z'),
    endTime: new Date('2024-09-02T12:00:00Z'),
    totalHours: 2,
    totalPrice: 18000,
    status: ReservationStatus.CONFIRMED,
    notes: null,
    createdAt: new Date('2024-08-30T09:00:00Z'),
    updatedAt: new Date('2024-08-30T09:00:00Z'),
    cafe: {
      id: '2',
      name: '블루보틀 한남점',
      address: '서울특별시 용산구 이태원로55가길 29',
      phone: '02-2345-6789',
      images: ['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop']
    },
    seat: {
      id: 'seat2',
      seatNumber: 'B03',
      seatType: 'DOUBLE',
      capacity: 2,
      hourlyRate: 9000,
      amenities: ['WiFi', '조용한 환경']
    }
  },
  {
    id: '3',
    userId: 'user1',
    cafeId: '3',
    seatId: 'seat3',
    startTime: new Date('2024-08-29T16:00:00Z'),
    endTime: new Date('2024-08-29T18:00:00Z'),
    totalHours: 2,
    totalPrice: 8000,
    status: ReservationStatus.COMPLETED,
    notes: '감사합니다',
    createdAt: new Date('2024-08-29T10:00:00Z'),
    updatedAt: new Date('2024-08-29T18:30:00Z'),
    cafe: {
      id: '3',
      name: '카페 그라운드',
      address: '서울특별시 마포구 홍익로 63',
      phone: '02-3456-7890',
      images: ['https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop']
    },
    seat: {
      id: 'seat3',
      seatNumber: 'C05',
      seatType: 'SINGLE',
      capacity: 1,
      hourlyRate: 4000,
      amenities: ['WiFi', '콘센트', '독서 공간']
    }
  }
]

export const mockCancellationPolicies = {
  '1': {
    freeCancellationHours: 24,
    earlyRefundRate: 100,
    standardRefundRate: 80,
    lateRefundRate: 50,
    noRefundBeforeHours: 2
  },
  '2': {
    freeCancellationHours: 48,
    earlyRefundRate: 100,
    standardRefundRate: 90,
    lateRefundRate: 70,
    noRefundBeforeHours: 1
  },
  '3': {
    freeCancellationHours: 12,
    earlyRefundRate: 100,
    standardRefundRate: 70,
    lateRefundRate: 40,
    noRefundBeforeHours: 3
  }
}