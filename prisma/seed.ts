import { PrismaClient, Role, SeatType, ReservationStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 시드 데이터 생성 시작...')

  // 기존 데이터 정리
  await prisma.reservation.deleteMany()
  await prisma.review.deleteMany()
  await prisma.seat.deleteMany()
  await prisma.cafe.deleteMany()
  await prisma.user.deleteMany()

  // 사용자 데이터 생성
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const users = await prisma.user.createMany({
    data: [
      {
        id: 'user-1',
        email: 'admin@mycafe.com',
        name: '관리자',
        phone: '010-1234-5678',
        password: hashedPassword,
        role: Role.ADMIN,
      },
      {
        id: 'user-2',
        email: 'owner1@mycafe.com',
        name: '카페사장1',
        phone: '010-2345-6789',
        password: hashedPassword,
        role: Role.OWNER,
      },
      {
        id: 'user-3',
        email: 'owner2@mycafe.com',
        name: '카페사장2',
        phone: '010-3456-7890',
        password: hashedPassword,
        role: Role.OWNER,
      },
      {
        id: 'user-4',
        email: 'customer1@gmail.com',
        name: '김고객',
        phone: '010-4567-8901',
        password: hashedPassword,
        role: Role.USER,
      },
      {
        id: 'user-5',
        email: 'customer2@gmail.com',
        name: '이고객',
        phone: '010-5678-9012',
        password: hashedPassword,
        role: Role.USER,
      },
    ]
  })

  console.log(`👤 사용자 ${users.count}명 생성 완료`)

  // 카페 데이터 생성
  const cafes = [
    {
      id: 'cafe-1',
      name: '스터디 카페 강남점',
      description: '조용하고 편안한 분위기의 스터디 카페입니다. 24시간 운영으로 언제든 이용하실 수 있습니다.',
      address: '서울시 강남구 테헤란로 123',
      phone: '02-1234-5678',
      email: 'gangnam@studycafe.com',
      website: 'https://studycafe-gangnam.com',
      images: ['/images/cafe1-1.jpg', '/images/cafe1-2.jpg'],
      openTime: '00:00',
      closeTime: '23:59',
      isOpen: true,
      latitude: 37.5665,
      longitude: 126.9780,
      basePrice: 3000,
      ownerId: 'user-2',
    },
    {
      id: 'cafe-2',
      name: '코지 카페 홍대점',
      description: '아늑하고 따뜻한 분위기의 카페입니다. 맛있는 커피와 디저트를 함께 즐기세요.',
      address: '서울시 마포구 홍익로 456',
      phone: '02-2345-6789',
      email: 'hongdae@cozycafe.com',
      openTime: '07:00',
      closeTime: '22:00',
      isOpen: true,
      latitude: 37.5561,
      longitude: 126.9244,
      basePrice: 2500,
      ownerId: 'user-3',
    },
    {
      id: 'cafe-3',
      name: '북 카페 종로점',
      description: '책과 함께하는 조용한 공간. 다양한 장르의 도서와 편안한 좌석을 제공합니다.',
      address: '서울시 종로구 종로 789',
      phone: '02-3456-7890',
      email: 'jongro@bookcafe.com',
      openTime: '08:00',
      closeTime: '21:00',
      isOpen: true,
      latitude: 37.5696,
      longitude: 126.9911,
      basePrice: 3500,
      ownerId: 'user-2',
    }
  ]

  for (const cafeData of cafes) {
    await prisma.cafe.create({
      data: cafeData
    })
  }

  console.log(`☕ 카페 ${cafes.length}개 생성 완료`)

  // 좌석 데이터 생성
  const seatData = []
  
  // 카페 1: 스터디 카페 (개인석 중심)
  for (let i = 1; i <= 20; i++) {
    seatData.push({
      seatNumber: `A${i.toString().padStart(2, '0')}`,
      seatType: SeatType.INDIVIDUAL,
      capacity: 1,
      hasOutlet: true,
      hasWindow: i <= 8,
      isQuietZone: i > 15,
      cafeId: 'cafe-1',
      priceMultiplier: i > 15 ? 1.2 : 1.0, // 조용한 구역은 20% 할증
    })
  }
  
  // 카페 1: 커플석과 그룹석 추가
  for (let i = 1; i <= 5; i++) {
    seatData.push({
      seatNumber: `B${i.toString().padStart(2, '0')}`,
      seatType: SeatType.COUPLE,
      capacity: 2,
      hasOutlet: true,
      hasWindow: i <= 2,
      isQuietZone: false,
      cafeId: 'cafe-1',
      priceMultiplier: 1.5,
    })
  }

  // 카페 2: 코지 카페 (다양한 좌석)
  for (let i = 1; i <= 15; i++) {
    seatData.push({
      seatNumber: `T${i.toString().padStart(2, '0')}`,
      seatType: i <= 10 ? SeatType.INDIVIDUAL : SeatType.GROUP,
      capacity: i <= 10 ? 1 : 4,
      hasOutlet: i % 2 === 0,
      hasWindow: i <= 5,
      isQuietZone: false,
      cafeId: 'cafe-2',
      priceMultiplier: i > 10 ? 2.0 : 1.0,
    })
  }

  // 카페 3: 북 카페 (개인석과 미팅룸)
  for (let i = 1; i <= 12; i++) {
    seatData.push({
      seatNumber: `R${i.toString().padStart(2, '0')}`,
      seatType: SeatType.INDIVIDUAL,
      capacity: 1,
      hasOutlet: true,
      hasWindow: i <= 6,
      isQuietZone: true,
      cafeId: 'cafe-3',
      priceMultiplier: 1.0,
    })
  }
  
  // 미팅룸 추가
  for (let i = 1; i <= 3; i++) {
    seatData.push({
      seatNumber: `M${i}`,
      seatType: SeatType.MEETING_ROOM,
      capacity: 6,
      hasOutlet: true,
      hasWindow: i <= 2,
      isQuietZone: true,
      cafeId: 'cafe-3',
      priceMultiplier: 3.0,
    })
  }

  await prisma.seat.createMany({
    data: seatData
  })

  console.log(`🪑 좌석 ${seatData.length}개 생성 완료`)

  // 예약 데이터 생성 (최근 및 향후 예약들)
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  
  await prisma.reservation.createMany({
    data: [
      {
        startTime: new Date(tomorrow.getTime() + 9 * 60 * 60 * 1000), // 내일 오전 9시
        endTime: new Date(tomorrow.getTime() + 12 * 60 * 60 * 1000), // 내일 오후 12시
        duration: 180,
        totalPrice: 9000,
        status: ReservationStatus.CONFIRMED,
        userId: 'user-4',
        cafeId: 'cafe-1',
        seatId: (await prisma.seat.findFirst({ where: { cafeId: 'cafe-1' } }))!.id,
        paymentStatus: 'paid',
      },
      {
        startTime: new Date(tomorrow.getTime() + 14 * 60 * 60 * 1000), // 내일 오후 2시
        endTime: new Date(tomorrow.getTime() + 17 * 60 * 60 * 1000), // 내일 오후 5시
        duration: 180,
        totalPrice: 7500,
        status: ReservationStatus.PENDING,
        userId: 'user-5',
        cafeId: 'cafe-2',
        seatId: (await prisma.seat.findFirst({ where: { cafeId: 'cafe-2' } }))!.id,
        paymentStatus: 'pending',
      },
    ]
  })

  console.log('📅 예약 데이터 생성 완료')

  // 리뷰 데이터 생성
  await prisma.review.createMany({
    data: [
      {
        rating: 5,
        comment: '정말 조용하고 집중하기 좋은 환경이에요. 콘센트도 모든 좌석에 있어서 편해요!',
        userId: 'user-4',
        cafeId: 'cafe-1',
      },
      {
        rating: 4,
        comment: '분위기가 아늑하고 커피도 맛있어요. 다만 주말에는 좀 시끄러워요.',
        userId: 'user-5',
        cafeId: 'cafe-2',
      },
      {
        rating: 5,
        comment: '책 읽기에 최고의 장소입니다. 조용하고 편안해요.',
        userId: 'user-4',
        cafeId: 'cafe-3',
      },
    ]
  })

  console.log('⭐ 리뷰 데이터 생성 완료')

  console.log('✅ 시드 데이터 생성 완료!')
}

main()
  .catch((e) => {
    console.error('❌ 시드 데이터 생성 실패:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })