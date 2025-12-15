interface Seat {
  id: string
  cafeId: string
  seatNumber: string
  seatType: 'SINGLE' | 'DOUBLE' | 'GROUP' | 'STUDY'
  capacity: number
  hourlyRate: number
  amenities: string[]
  isAvailable: boolean
  description: string
  position: { x: number; y: number }
  createdAt: string
  updatedAt: string
}

export const mockSeats: Record<string, Seat[]> = {
  '1': [ // 스타벅스 강남점
    {
      id: 'seat1-1',
      cafeId: '1',
      seatNumber: 'A01',
      seatType: 'SINGLE',
      capacity: 1,
      hourlyRate: 6000,
      amenities: ['WiFi', '콘센트'],
      isAvailable: true,
      description: '창가 싱글석',
      position: { x: 1, y: 1 },
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-08-30T00:00:00Z'
    },
    {
      id: 'seat1-2',
      cafeId: '1',
      seatNumber: 'A02',
      seatType: 'SINGLE',
      capacity: 1,
      hourlyRate: 6000,
      amenities: ['WiFi', '콘센트'],
      isAvailable: true,
      description: '창가 싱글석',
      position: { x: 2, y: 1 },
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-08-30T00:00:00Z'
    },
    {
      id: 'seat1-3',
      cafeId: '1',
      seatNumber: 'B01',
      seatType: 'DOUBLE',
      capacity: 2,
      hourlyRate: 9000,
      amenities: ['WiFi', '콘센트', '대화 가능'],
      isAvailable: true,
      description: '2인용 테이블',
      position: { x: 1, y: 2 },
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-08-30T00:00:00Z'
    },
    {
      id: 'seat1-4',
      cafeId: '1',
      seatNumber: 'B02',
      seatType: 'DOUBLE',
      capacity: 2,
      hourlyRate: 9000,
      amenities: ['WiFi', '콘센트', '대화 가능'],
      isAvailable: false,
      description: '2인용 테이블',
      position: { x: 2, y: 2 },
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-08-30T00:00:00Z'
    },
    {
      id: 'seat1-5',
      cafeId: '1',
      seatNumber: 'G01',
      seatType: 'GROUP',
      capacity: 4,
      hourlyRate: 15000,
      amenities: ['WiFi', '콘센트', '화이트보드', '회의실'],
      isAvailable: true,
      description: '4인용 그룹석',
      position: { x: 3, y: 1 },
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-08-30T00:00:00Z'
    },
    {
      id: 'seat1-6',
      cafeId: '1',
      seatNumber: 'S01',
      seatType: 'STUDY',
      capacity: 1,
      hourlyRate: 5000,
      amenities: ['WiFi', '콘센트', '조용한 환경', '개인 조명'],
      isAvailable: true,
      description: '스터디 전용석',
      position: { x: 4, y: 1 },
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-08-30T00:00:00Z'
    }
  ],
  '2': [ // 블루보틀 한남점
    {
      id: 'seat2-1',
      cafeId: '2',
      seatNumber: 'A01',
      seatType: 'SINGLE',
      capacity: 1,
      hourlyRate: 8000,
      amenities: ['WiFi', '프리미엄 환경'],
      isAvailable: true,
      description: '카운터석',
      position: { x: 1, y: 1 },
      createdAt: '2024-02-10T00:00:00Z',
      updatedAt: '2024-08-30T00:00:00Z'
    },
    {
      id: 'seat2-2',
      cafeId: '2',
      seatNumber: 'B01',
      seatType: 'DOUBLE',
      capacity: 2,
      hourlyRate: 12000,
      amenities: ['WiFi', '조용한 환경', '프리미엄 환경'],
      isAvailable: true,
      description: '2인용 원목 테이블',
      position: { x: 2, y: 1 },
      createdAt: '2024-02-10T00:00:00Z',
      updatedAt: '2024-08-30T00:00:00Z'
    },
    {
      id: 'seat2-3',
      cafeId: '2',
      seatNumber: 'B02',
      seatType: 'DOUBLE',
      capacity: 2,
      hourlyRate: 12000,
      amenities: ['WiFi', '조용한 환경', '프리미엄 환경'],
      isAvailable: false,
      description: '2인용 원목 테이블',
      position: { x: 1, y: 2 },
      createdAt: '2024-02-10T00:00:00Z',
      updatedAt: '2024-08-30T00:00:00Z'
    }
  ],
  '3': [ // 카페 그라운드
    {
      id: 'seat3-1',
      cafeId: '3',
      seatNumber: 'A01',
      seatType: 'SINGLE',
      capacity: 1,
      hourlyRate: 4000,
      amenities: ['WiFi', '콘센트', '독서 환경'],
      isAvailable: true,
      description: '독서용 싱글석',
      position: { x: 1, y: 1 },
      createdAt: '2024-03-05T00:00:00Z',
      updatedAt: '2024-08-30T00:00:00Z'
    },
    {
      id: 'seat3-2',
      cafeId: '3',
      seatNumber: 'A02',
      seatType: 'SINGLE',
      capacity: 1,
      hourlyRate: 4000,
      amenities: ['WiFi', '콘센트', '독서 환경'],
      isAvailable: true,
      description: '독서용 싱글석',
      position: { x: 2, y: 1 },
      createdAt: '2024-03-05T00:00:00Z',
      updatedAt: '2024-08-30T00:00:00Z'
    },
    {
      id: 'seat3-3',
      cafeId: '3',
      seatNumber: 'B01',
      seatType: 'DOUBLE',
      capacity: 2,
      hourlyRate: 6000,
      amenities: ['WiFi', '콘센트', '브런치 가능'],
      isAvailable: true,
      description: '브런치용 테이블',
      position: { x: 3, y: 1 },
      createdAt: '2024-03-05T00:00:00Z',
      updatedAt: '2024-08-30T00:00:00Z'
    }
  ],
  '4': [ // 투썸플레이스 여의도점
    {
      id: 'seat4-1',
      cafeId: '4',
      seatNumber: 'A01',
      seatType: 'SINGLE',
      capacity: 1,
      hourlyRate: 5500,
      amenities: ['WiFi', '콘센트'],
      isAvailable: true,
      description: '일반 싱글석',
      position: { x: 1, y: 1 },
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-08-30T00:00:00Z'
    },
    {
      id: 'seat4-2',
      cafeId: '4',
      seatNumber: 'B01',
      seatType: 'DOUBLE',
      capacity: 2,
      hourlyRate: 8000,
      amenities: ['WiFi', '콘센트', '케이크 주문 가능'],
      isAvailable: true,
      description: '2인용 테이블',
      position: { x: 2, y: 1 },
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-08-30T00:00:00Z'
    },
    {
      id: 'seat4-3',
      cafeId: '4',
      seatNumber: 'M01',
      seatType: 'GROUP',
      capacity: 6,
      hourlyRate: 20000,
      amenities: ['WiFi', '콘센트', '회의실', '화이트보드', '프로젝터'],
      isAvailable: true,
      description: '회의실',
      position: { x: 3, y: 1 },
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-08-30T00:00:00Z'
    }
  ],
  '5': [ // 빈브라더스 성수점
    {
      id: 'seat5-1',
      cafeId: '5',
      seatNumber: 'A01',
      seatType: 'SINGLE',
      capacity: 1,
      hourlyRate: 7000,
      amenities: ['WiFi', '콘센트', '로스터리 뷰'],
      isAvailable: true,
      description: '로스터리 뷰 싱글석',
      position: { x: 1, y: 1 },
      createdAt: '2024-04-12T00:00:00Z',
      updatedAt: '2024-08-30T00:00:00Z'
    },
    {
      id: 'seat5-2',
      cafeId: '5',
      seatNumber: 'T01',
      seatType: 'DOUBLE',
      capacity: 2,
      hourlyRate: 10000,
      amenities: ['WiFi', '콘센트', '테라스', '야외 환경'],
      isAvailable: true,
      description: '테라스 2인석',
      position: { x: 1, y: 2 },
      createdAt: '2024-04-12T00:00:00Z',
      updatedAt: '2024-08-30T00:00:00Z'
    }
  ],
  '6': [ // 메가커피 건대점
    {
      id: 'seat6-1',
      cafeId: '6',
      seatNumber: 'A01',
      seatType: 'SINGLE',
      capacity: 1,
      hourlyRate: 3000,
      amenities: ['WiFi', '콘센트', '24시간'],
      isAvailable: true,
      description: '24시간 이용 가능 싱글석',
      position: { x: 1, y: 1 },
      createdAt: '2024-02-28T00:00:00Z',
      updatedAt: '2024-08-30T00:00:00Z'
    },
    {
      id: 'seat6-2',
      cafeId: '6',
      seatNumber: 'A02',
      seatType: 'SINGLE',
      capacity: 1,
      hourlyRate: 3000,
      amenities: ['WiFi', '콘센트', '24시간'],
      isAvailable: true,
      description: '24시간 이용 가능 싱글석',
      position: { x: 2, y: 1 },
      createdAt: '2024-02-28T00:00:00Z',
      updatedAt: '2024-08-30T00:00:00Z'
    },
    {
      id: 'seat6-3',
      cafeId: '6',
      seatNumber: 'S01',
      seatType: 'STUDY',
      capacity: 1,
      hourlyRate: 2500,
      amenities: ['WiFi', '콘센트', '24시간', '조용한 환경', '개인 조명'],
      isAvailable: true,
      description: '24시간 스터디룸',
      position: { x: 3, y: 1 },
      createdAt: '2024-02-28T00:00:00Z',
      updatedAt: '2024-08-30T00:00:00Z'
    },
    {
      id: 'seat6-4',
      cafeId: '6',
      seatNumber: 'B01',
      seatType: 'DOUBLE',
      capacity: 2,
      hourlyRate: 5000,
      amenities: ['WiFi', '콘센트', '24시간'],
      isAvailable: false,
      description: '24시간 이용 가능 2인석',
      position: { x: 1, y: 2 },
      createdAt: '2024-02-28T00:00:00Z',
      updatedAt: '2024-08-30T00:00:00Z'
    }
  ]
}