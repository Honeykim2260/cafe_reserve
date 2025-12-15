# Mock Data Documentation

## Overview

This document describes the mock data structure and API endpoints used in the MyCafe reservation system for development and testing purposes.

## Mock Data Architecture

The system uses in-memory JavaScript objects to simulate a database during development. Mock data is organized into separate route files:

- `server/src/routes/auth-mock.ts` - User authentication data
- `server/src/routes/cafes-mock.ts` - Cafe and seat data
- `server/src/routes/reservations-mock.ts` - Reservation data (planned)

## Authentication Mock Data

### Mock Users

Located in: `server/src/routes/auth-mock.ts`

```typescript
const mockUsers = [
  {
    id: 'user-1',
    email: 'admin@mycafe.com',
    name: '관리자',
    phone: '010-1234-5678',
    password: 'admin123', // Plain text in mock
    role: 'ADMIN',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-4',
    email: 'customer1@gmail.com',
    name: '김고객',
    phone: '010-4567-8901',
    password: 'customer123', // Plain text in mock
    role: 'USER',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user1',
    email: 'user1@test.com',
    name: '테스트 사용자',
    phone: '010-1111-1111',
    password: 'password', // Plain text in mock
    role: 'USER',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]
```

### Authentication Endpoints

#### POST `/api/auth/register`
Creates a new user account.

**Request Body:**
```typescript
{
  name: string
  email: string
  phone?: string
  password: string
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    user: User, // without password
    token: string
  },
  message: string
}
```

#### POST `/api/auth/login`
Authenticates user and returns JWT token.

**Request Body:**
```typescript
{
  email: string
  password: string
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    user: User, // without password
    token: string
  },
  message: string
}
```

#### GET `/api/auth/me`
Returns current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```typescript
{
  success: true,
  data: {
    user: User // without password
  }
}
```

#### POST `/api/auth/logout`
Logs out user (mock implementation).

**Response:**
```typescript
{
  success: true,
  message: string
}
```

## Cafe Mock Data

### Mock Cafes

Located in: `server/src/routes/cafes-mock.ts`

The system contains 5 mock cafes with complete information:

#### Cafe 1: 커피스토리 강남점
```typescript
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
}
```

#### Cafe 2: 북카페 홍대
```typescript
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
}
```

#### Cafe 3: 스터디카페 신촌 (24시간 운영)
```typescript
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
}
```

#### Cafe 4: 조용한카페 이태원
```typescript
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
}
```

#### Cafe 5: 테라스카페 한강
```typescript
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
```

### Cafe API Endpoints

#### GET `/api/cafes`
List all cafes with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 10)
- `search` (string): Search term for name/description/address
- `sortBy` (string): Sort field ('name', 'rating', 'price')
- `sortOrder` (string): Sort direction ('asc', 'desc')

**Response:**
```typescript
{
  success: true,
  data: {
    cafes: Cafe[],
    pagination: {
      page: number,
      limit: number,
      total: number,
      totalPages: number
    }
  }
}
```

#### GET `/api/cafes/:id`
Get specific cafe details.

**Response:**
```typescript
{
  success: true,
  data: {
    cafe: Cafe
  }
}
```

#### GET `/api/cafes/search`
Advanced cafe search with multiple filters.

**Query Parameters:**
- `q` (string): Search query
- `location` (string): Location filter
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `amenities` (string): Comma-separated amenities
- `page` (number): Page number
- `limit` (number): Results per page

**Response:**
```typescript
{
  success: true,
  data: {
    cafes: Cafe[],
    pagination: PaginationInfo
  }
}
```

#### GET `/api/cafes/:id/seats`
Get available seats for a specific cafe.

**Response:**
```typescript
{
  success: true,
  data: Seat[]
}
```

### Mock Seats Data

Each cafe has associated seat data:

```typescript
const mockSeats = [
  {
    id: 'seat1',
    cafeId: 'cafe-1',
    seatNumber: 'A01',
    seatType: 'SINGLE',
    description: '창가 자리',
    capacity: 1,
    hourlyRate: 3000,
    isAvailable: true,
    amenities: ['콘센트', '창가']
  },
  {
    id: 'seat2',
    cafeId: 'cafe-1',
    seatNumber: 'A02',
    seatType: 'DOUBLE',
    description: '2인 테이블',
    capacity: 2,
    hourlyRate: 5000,
    isAvailable: true,
    amenities: ['콘센트']
  },
  {
    id: 'seat3',
    cafeId: 'cafe-1',
    seatNumber: 'B01',
    seatType: 'GROUP',
    description: '4인 그룹석',
    capacity: 4,
    hourlyRate: 8000,
    isAvailable: false,
    amenities: ['콘센트', '화이트보드']
  }
  // ... more seats for each cafe
]
```

## Data Structure Details

### Business Hours Structure
```typescript
interface BusinessHours {
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
  sunday: DayHours
}

interface DayHours {
  open: string    // Format: "HH:mm"
  close: string   // Format: "HH:mm"
  isOpen: boolean
}
```

### Price Range Values
- `LOW`: ₩ (1,000-3,000 per hour)
- `MEDIUM`: ₩₩ (3,000-5,000 per hour)
- `HIGH`: ₩₩₩ (5,000+ per hour)

### Seat Types
- `SINGLE`: Individual seat (1 person)
- `DOUBLE`: Two-person table
- `GROUP`: Group table (3-6 people)
- `STUDY`: Study-optimized seat

### Amenities List
Available amenities across all cafes:
- `WiFi`: Wireless internet
- `콘센트`: Power outlets
- `주차장`: Parking available
- `화장실`: Restroom
- `금연`: Non-smoking
- `도서`: Books available
- `개인사물함`: Personal lockers
- `프린터`: Printer access
- `24시간`: 24-hour operation
- `조용한환경`: Quiet environment
- `테라스`: Outdoor terrace
- `한강뷰`: Han River view

## Image Management

### Image URLs
All cafe images use Unsplash URLs with consistent parameters:
- **Format**: `https://images.unsplash.com/photo-{id}?w=800&h=600&fit=crop`
- **Dimensions**: 800x600 pixels
- **Optimization**: Automatic format selection

### Image Categories
- Cafe interiors
- Coffee and atmosphere shots
- Study environments
- Terrace and outdoor spaces

## Mock Data Limitations

### Current Limitations
1. **No Persistence**: Data resets on server restart
2. **No Relationships**: No foreign key constraints
3. **Simple Validation**: Basic type checking only
4. **No Transactions**: No atomic operations
5. **Limited Search**: Basic string matching only

### Development Benefits
1. **Fast Setup**: No database configuration required
2. **Easy Modification**: Direct code changes
3. **Consistent Data**: Predictable test scenarios
4. **Offline Development**: No external dependencies

## Migration to Real Database

### Planned Database Schema
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'USER',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cafes table
CREATE TABLE cafes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  phone VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  images TEXT[],
  amenities TEXT[],
  business_hours JSONB,
  price_per_hour INTEGER,
  max_reservation_hours INTEGER,
  price_range VARCHAR(10),
  is_active BOOLEAN DEFAULT true,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seats table
CREATE TABLE seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id UUID REFERENCES cafes(id),
  seat_number VARCHAR(10) NOT NULL,
  seat_type VARCHAR(20),
  description TEXT,
  capacity INTEGER DEFAULT 1,
  hourly_rate INTEGER,
  is_available BOOLEAN DEFAULT true,
  amenities TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Migration Strategy
1. **Prisma Integration**: Use Prisma ORM for type-safe database access
2. **Data Seeding**: Convert mock data to database seed scripts
3. **API Compatibility**: Maintain existing API contracts
4. **Gradual Migration**: Route-by-route database integration
5. **Testing**: Comprehensive integration testing

---

This mock data structure provides a solid foundation for development and testing while maintaining compatibility with the planned production database schema.