# CLAUDE.md

이 파일은 카페 예약 시스템 프로젝트에서 Claude Code와 함께 작업할 때 참고할 지침을 제공합니다.

## 프로젝트 개요

**MyCafe**는 사용자가 카페를 검색하고 좌석을 예약할 수 있는 종합 예약 관리 시스템입니다.

### 주요 기능
- 카페 검색 및 정보 조회
- 실시간 좌석 예약 시스템
- 사용자 계정 관리 및 예약 이력
- 카페 사장님용 관리자 대시보드
- 결제 시스템 (PG사 연동)
- 리뷰 및 평점 시스템
- 알림 시스템 (예약 확인, 취소 등)

### 기술 스택

#### Frontend
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Routing**: React Router v6

#### Backend  
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **File Upload**: multer
- **Validation**: Zod

#### Infrastructure
- **Package Manager**: npm
- **Build Tool**: Vite (Frontend), tsc (Backend)
- **Testing**: Jest + React Testing Library
- **Deployment**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

## 개발 환경 설정

### 필수 명령어

#### 전체 프로젝트
```bash
# 의존성 설치 (루트에서)
npm install

# 전체 개발 서버 시작 (Frontend + Backend)
npm run dev

# 전체 빌드
npm run build

# 전체 테스트
npm run test
```

#### Frontend (React)
```bash
# Frontend 개발 서버
npm run dev:frontend

# Frontend 빌드
npm run build:frontend

# Frontend 테스트
npm run test:frontend

# Storybook 실행
npm run storybook
```

#### Backend (Node.js)
```bash
# Backend 개발 서버
npm run dev:backend

# Backend 빌드
npm run build:backend

# Backend 테스트
npm run test:backend

# API 문서 생성
npm run docs
```

#### 데이터베이스 관리
```bash
# Prisma 클라이언트 생성
npx prisma generate

# 마이그레이션 실행
npx prisma migrate dev

# 시드 데이터 입력
npx prisma db seed

# 데이터베이스 스튜디오
npx prisma studio

# 마이그레이션 배포
npx prisma migrate deploy
```

#### Docker
```bash
# 개발 환경 실행
docker-compose up -d

# 프로덕션 빌드
docker-compose -f docker-compose.prod.yml up -d

# 컨테이너 로그 확인
docker-compose logs -f
```

## 프로젝트 구조

```
my-cafe-app/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # 재사용 컴포넌트
│   │   │   ├── ui/         # shadcn/ui 컴포넌트
│   │   │   ├── forms/      # 폼 컴포넌트
│   │   │   └── layout/     # 레이아웃 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── hooks/          # 커스텀 훅
│   │   ├── stores/         # Zustand 스토어
│   │   ├── services/       # API 서비스
│   │   ├── utils/          # 유틸 함수
│   │   ├── types/          # TypeScript 타입
│   │   └── constants/      # 상수 정의
│   ├── public/             # 정적 파일
│   └── index.html
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── routes/         # API 라우트
│   │   ├── controllers/    # 컨트롤러
│   │   ├── services/       # 비즈니스 로직
│   │   ├── middleware/     # 미들웨어
│   │   ├── models/         # 데이터 모델
│   │   ├── utils/          # 유틸 함수
│   │   ├── types/          # TypeScript 타입
│   │   └── config/         # 설정 파일
│   └── uploads/            # 업로드 파일
├── shared/                 # 공통 타입 및 유틸
│   ├── types/              # 공통 타입 정의
│   └── utils/              # 공통 유틸 함수
├── prisma/                 # 데이터베이스
│   ├── schema.prisma       # 스키마 정의
│   ├── migrations/         # 마이그레이션
│   └── seed.ts             # 시드 데이터
├── docs/                   # 문서화
├── tests/                  # E2E 테스트
└── docker-compose.yml      # Docker 설정
```

## 코딩 컨벤션

### 네이밍 규칙
- **컴포넌트**: PascalCase (`CafeCard.tsx`)
- **파일명**: kebab-case (`cafe-list.tsx`)
- **함수/변수**: camelCase (`getCafeList`)
- **상수**: SCREAMING_SNAKE_CASE (`MAX_RESERVATION_TIME`)
- **인터페이스**: PascalCase with 'I' prefix (`ICafe`)
- **타입**: PascalCase (`CafeType`)

### 폴더 구조 규칙
- **컴포넌트**: 기능별 폴더 구조
- **페이지**: 라우트 구조와 일치
- **서비스**: 도메인별 분리 (`cafeService`, `userService`)
- **타입**: 도메인별 분리 및 shared 활용

### 코드 스타일
- **Linting**: ESLint + Prettier
- **TypeScript**: Strict 모드 사용
- **Import**: 절대 경로 사용 (`@/components`)
- **CSS**: Tailwind 유틸리티 클래스 우선
- **함수**: Arrow Function 우선 사용

## API 설계

### REST API 엔드포인트
```
GET    /api/cafes              # 카페 목록 조회
GET    /api/cafes/:id          # 카페 상세 조회
POST   /api/cafes              # 카페 등록 (관리자)
PUT    /api/cafes/:id          # 카페 정보 수정
DELETE /api/cafes/:id          # 카페 삭제

GET    /api/reservations       # 예약 목록
POST   /api/reservations       # 예약 생성
PUT    /api/reservations/:id   # 예약 수정
DELETE /api/reservations/:id   # 예약 취소

POST   /api/auth/register      # 회원가입
POST   /api/auth/login         # 로그인
POST   /api/auth/logout        # 로그아웃
GET    /api/auth/me            # 사용자 정보
```

### API 응답 형식
```typescript
// 성공 응답
{
  success: true,
  data: T,
  message?: string,
  meta?: {
    page: number,
    limit: number,
    total: number
  }
}

// 에러 응답
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

## 데이터베이스 스키마

### 주요 모델
```prisma
model User {
  id          String @id @default(uuid())
  email       String @unique
  name        String
  phone       String?
  role        Role   @default(USER)
  reservations Reservation[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Cafe {
  id          String @id @default(uuid())
  name        String
  description String?
  address     String
  phone       String
  seats       Seat[]
  reservations Reservation[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Seat {
  id          String @id @default(uuid())
  cafeId      String
  seatNumber  String
  capacity    Int
  isAvailable Boolean @default(true)
  cafe        Cafe @relation(fields: [cafeId], references: [id])
  reservations Reservation[]
}

model Reservation {
  id          String @id @default(uuid())
  userId      String
  cafeId      String
  seatId      String
  startTime   DateTime
  endTime     DateTime
  status      ReservationStatus @default(PENDING)
  user        User @relation(fields: [userId], references: [id])
  cafe        Cafe @relation(fields: [cafeId], references: [id])
  seat        Seat @relation(fields: [seatId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 환경 설정

### 환경 변수
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mycafe"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="development"

# Client
VITE_API_URL="http://localhost:3001"
VITE_APP_NAME="MyCafe"

# Upload
UPLOAD_MAX_SIZE="5mb"
UPLOAD_DIR="./uploads"
```

## 테스트 전략

### 테스트 구조
- **Frontend**: Jest + React Testing Library
- **Backend**: Jest + Supertest
- **E2E**: Playwright
- **Component**: Storybook

### 테스트 명령어
```bash
# 단위 테스트
npm run test:unit

# 통합 테스트
npm run test:integration

# E2E 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:coverage

# 테스트 watch 모드
npm run test:watch
```

## 팀 협업 규칙

### Git 워크플로우
- **브랜치 전략**: Git Flow
- **메인 브랜치**: `main` (배포), `develop` (개발)
- **피처 브랜치**: `feature/기능명`
- **핫픽스 브랜치**: `hotfix/이슈명`

### 커밋 메시지 규칙
```
type(scope): subject

body

footer
```

**타입**:
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 스타일 변경 (코드 동작에 영향 없음)
- `refactor`: 리팩토링
- `test`: 테스트 추가 또는 수정
- `chore`: 빌드 프로세스 또는 보조 도구 변경

**예시**:
```
feat(reservation): add seat selection functionality

- Add seat layout visualization
- Implement seat availability check
- Add seat reservation logic

Closes #123
```

### 코드 리뷰 가이드라인
- **필수 체크 항목**:
  - [ ] TypeScript 타입 안전성
  - [ ] 에러 핸들링
  - [ ] 성능 고려사항
  - [ ] 테스트 코드 포함
  - [ ] 문서 업데이트
- **PR 규칙**: 최소 1명 승인 필요
- **리뷰어**: 팀 로테이션으로 배정

### 이슈 관리
- **레이블 사용**: `bug`, `feature`, `enhancement`, `urgent`
- **마일스톤**: 스프린트 단위로 관리
- **담당자**: 각 이슈별 명확한 담당자 배정

## 배포 전략

### 개발 환경
- **로컬**: Docker Compose
- **개발 서버**: AWS EC2 + Docker
- **데이터베이스**: PostgreSQL (Docker)

### 스테이징 환경
- **서버**: AWS ECS Fargate
- **데이터베이스**: AWS RDS PostgreSQL
- **스토리지**: AWS S3 (파일 업로드)

### 프로덕션 환경
- **CDN**: CloudFront
- **로드밸런서**: AWS ALB
- **모니터링**: CloudWatch
- **백업**: 자동 백업 설정

## 개발 일정 (3개월)

### 1개월차: 기반 구축
- 프로젝트 셋업 및 기본 구조
- 사용자 인증 시스템
- 기본 UI 컴포넌트 개발

### 2개월차: 핵심 기능
- 카페 검색 및 조회
- 실시간 예약 시스템
- 결제 연동

### 3개월차: 완성도 향상
- 관리자 대시보드
- 알림 시스템
- 성능 최적화 및 배포

## 문제 해결

### 자주 발생하는 이슈

#### Frontend
- **Hydration 에러**: SSR 관련 이슈 확인
- **상태 동기화**: Zustand 스토어 구조 검토
- **빌드 에러**: TypeScript 타입 검사

#### Backend
- **CORS 이슈**: Express CORS 미들웨어 설정 확인
- **DB 연결 에러**: PostgreSQL 서비스 상태 확인
- **JWT 인증 실패**: 시크릿 키 및 만료시간 확인

#### 일반적인 해결법
```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# 캐시 클리어
npm run clean

# 데이터베이스 리셋
npm run db:reset

# 포트 충돌 해결
lsof -ti:3000 | xargs kill -9
```

## 성능 최적화

### Frontend 최적화
- React.memo, useMemo, useCallback 활용
- 코드 스플리팅 (lazy loading)
- 이미지 최적화 (WebP, 지연 로딩)
- 번들 크기 최적화

### Backend 최적화
- 데이터베이스 쿼리 최적화
- Redis 캐싱 적용
- API 응답 압축
- 연결 풀 관리

### 모니터링
- **성능**: Web Vitals, Lighthouse
- **에러**: Sentry
- **로깅**: Winston + CloudWatch
- **메트릭**: Prometheus + Grafana

---

**프로젝트**: MyCafe 예약 시스템  
**개발 기간**: 3개월  
**팀 구성**: 개발자 2명, 디자이너 1명  
**목표**: 실시간 카페 좌석 예약 시스템 구축