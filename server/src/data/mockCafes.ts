interface Cafe {
  id: string
  name: string
  description: string
  address: string
  phone: string
  email: string
  website: string | null
  images: string[]
  businessHours: {
    monday: { open: string; close: string; isOpen: boolean }
    tuesday: { open: string; close: string; isOpen: boolean }
    wednesday: { open: string; close: string; isOpen: boolean }
    thursday: { open: string; close: string; isOpen: boolean }
    friday: { open: string; close: string; isOpen: boolean }
    saturday: { open: string; close: string; isOpen: boolean }
    sunday: { open: string; close: string; isOpen: boolean }
  }
  amenities: string[]
  priceRange: 'LOW' | 'MEDIUM' | 'HIGH'
  rating: number
  reviewCount: number
  latitude: number
  longitude: number
  ownerId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const mockCafes: Cafe[] = [
  {
    id: '1',
    name: '스타벅스 강남점',
    description: '바쁜 도심 속에서 여유로운 커피 한잔과 함께 편안한 시간을 보낼 수 있는 공간입니다.',
    address: '서울특별시 강남구 테헤란로 142',
    phone: '02-1234-5678',
    email: 'gangnam@starbucks.co.kr',
    website: 'https://www.starbucks.co.kr',
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    ],
    businessHours: {
      monday: { open: '07:00', close: '22:00', isOpen: true },
      tuesday: { open: '07:00', close: '22:00', isOpen: true },
      wednesday: { open: '07:00', close: '22:00', isOpen: true },
      thursday: { open: '07:00', close: '22:00', isOpen: true },
      friday: { open: '07:00', close: '23:00', isOpen: true },
      saturday: { open: '08:00', close: '23:00', isOpen: true },
      sunday: { open: '08:00', close: '22:00', isOpen: true }
    },
    amenities: ['WiFi', '콘센트', '스터디룸', '주차장'],
    priceRange: 'MEDIUM',
    rating: 4.5,
    reviewCount: 128,
    latitude: 37.5012767,
    longitude: 127.0396597,
    ownerId: 'owner1',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-08-30T00:00:00Z'
  },
  {
    id: '2',
    name: '블루보틀 한남점',
    description: '정성스럽게 로스팅된 원두로 내린 고품질 커피를 맛볼 수 있는 프리미엄 카페입니다.',
    address: '서울특별시 용산구 이태원로55가길 29',
    phone: '02-2345-6789',
    email: 'hannam@bluebottle.co.kr',
    website: 'https://bluebottlecoffee.com',
    images: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop'
    ],
    businessHours: {
      monday: { open: '08:00', close: '20:00', isOpen: true },
      tuesday: { open: '08:00', close: '20:00', isOpen: true },
      wednesday: { open: '08:00', close: '20:00', isOpen: true },
      thursday: { open: '08:00', close: '20:00', isOpen: true },
      friday: { open: '08:00', close: '21:00', isOpen: true },
      saturday: { open: '09:00', close: '21:00', isOpen: true },
      sunday: { open: '09:00', close: '20:00', isOpen: true }
    },
    amenities: ['WiFi', '조용한 환경', '프리미엄 원두', '디저트'],
    priceRange: 'HIGH',
    rating: 4.8,
    reviewCount: 89,
    latitude: 37.5338225,
    longitude: 126.9953364,
    ownerId: 'owner2',
    isActive: true,
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-08-30T00:00:00Z'
  },
  {
    id: '3',
    name: '카페 그라운드',
    description: '아늑하고 편안한 분위기에서 책을 읽고 공부할 수 있는 동네 카페입니다.',
    address: '서울특별시 마포구 홍익로 63',
    phone: '02-3456-7890',
    email: 'info@cafeground.com',
    website: null,
    images: [
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop'
    ],
    businessHours: {
      monday: { open: '09:00', close: '22:00', isOpen: true },
      tuesday: { open: '09:00', close: '22:00', isOpen: true },
      wednesday: { open: '09:00', close: '22:00', isOpen: true },
      thursday: { open: '09:00', close: '22:00', isOpen: true },
      friday: { open: '09:00', close: '23:00', isOpen: true },
      saturday: { open: '10:00', close: '23:00', isOpen: true },
      sunday: { open: '10:00', close: '22:00', isOpen: true }
    },
    amenities: ['WiFi', '콘센트', '독서 공간', '브런치'],
    priceRange: 'LOW',
    rating: 4.3,
    reviewCount: 67,
    latitude: 37.5511694,
    longitude: 126.9239556,
    ownerId: 'owner3',
    isActive: true,
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-08-30T00:00:00Z'
  },
  {
    id: '4',
    name: '투썸플레이스 여의도점',
    description: '깔끔하고 모던한 인테리어의 체인 카페로 다양한 디저트와 함께 커피를 즐길 수 있습니다.',
    address: '서울특별시 영등포구 여의대로 108',
    phone: '02-4567-8901',
    email: 'yeouido@twosome.co.kr',
    website: 'https://www.twosome.co.kr',
    images: [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=400&h=300&fit=crop'
    ],
    businessHours: {
      monday: { open: '07:30', close: '22:00', isOpen: true },
      tuesday: { open: '07:30', close: '22:00', isOpen: true },
      wednesday: { open: '07:30', close: '22:00', isOpen: true },
      thursday: { open: '07:30', close: '22:00', isOpen: true },
      friday: { open: '07:30', close: '22:30', isOpen: true },
      saturday: { open: '08:00', close: '22:30', isOpen: true },
      sunday: { open: '08:00', close: '22:00', isOpen: true }
    },
    amenities: ['WiFi', '콘센트', '케이크', '주차장', '회의실'],
    priceRange: 'MEDIUM',
    rating: 4.2,
    reviewCount: 156,
    latitude: 37.5219067,
    longitude: 126.9245306,
    ownerId: 'owner4',
    isActive: true,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-08-30T00:00:00Z'
  },
  {
    id: '5',
    name: '빈브라더스 성수점',
    description: '로컬 로스터리 카페로 신선한 원두와 수제 디저트를 함께 즐길 수 있는 힙한 공간입니다.',
    address: '서울특별시 성동구 아차산로15길 52',
    phone: '02-5678-9012',
    email: 'seongsu@beanbrothers.com',
    website: 'https://www.beanbrothers.com',
    images: [
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&h=300&fit=crop'
    ],
    businessHours: {
      monday: { open: '08:00', close: '20:00', isOpen: true },
      tuesday: { open: '08:00', close: '20:00', isOpen: true },
      wednesday: { open: '08:00', close: '20:00', isOpen: true },
      thursday: { open: '08:00', close: '20:00', isOpen: true },
      friday: { open: '08:00', close: '21:00', isOpen: true },
      saturday: { open: '09:00', close: '21:00', isOpen: true },
      sunday: { open: '09:00', close: '20:00', isOpen: true }
    },
    amenities: ['WiFi', '콘센트', '로스터리', '테라스', '수제 디저트'],
    priceRange: 'MEDIUM',
    rating: 4.6,
    reviewCount: 93,
    latitude: 37.5445853,
    longitude: 127.055722,
    ownerId: 'owner5',
    isActive: true,
    createdAt: '2024-04-12T00:00:00Z',
    updatedAt: '2024-08-30T00:00:00Z'
  },
  {
    id: '6',
    name: '메가커피 건대점',
    description: '합리적인 가격으로 맛있는 커피를 즐길 수 있는 친근한 동네 카페입니다.',
    address: '서울특별시 광진구 아차산로 273',
    phone: '02-6789-0123',
    email: 'konkuk@megacoffee.co.kr',
    website: 'https://www.megacoffee.me',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400&h=300&fit=crop'
    ],
    businessHours: {
      monday: { open: '07:00', close: '23:00', isOpen: true },
      tuesday: { open: '07:00', close: '23:00', isOpen: true },
      wednesday: { open: '07:00', close: '23:00', isOpen: true },
      thursday: { open: '07:00', close: '23:00', isOpen: true },
      friday: { open: '07:00', close: '24:00', isOpen: true },
      saturday: { open: '08:00', close: '24:00', isOpen: true },
      sunday: { open: '08:00', close: '23:00', isOpen: true }
    },
    amenities: ['WiFi', '콘센트', '24시간', '스터디 공간'],
    priceRange: 'LOW',
    rating: 4.1,
    reviewCount: 234,
    latitude: 37.5400456,
    longitude: 127.0687486,
    ownerId: 'owner6',
    isActive: true,
    createdAt: '2024-02-28T00:00:00Z',
    updatedAt: '2024-08-30T00:00:00Z'
  }
]