# MyCafe - 카페 예약 시스템

카페 좌석을 검색하고 예약할 수 있는 종합 예약 관리 시스템입니다.

## 🚀 빠른 시작

### Docker로 실행하기 (권장)

```bash
# 프로젝트 클론 및 이동
git clone <repository-url>
cd cafe_reservation_service

# Docker Compose로 전체 시스템 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

### 로컬 개발 환경

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (Frontend + Backend)
npm run dev

# 또는 개별 실행
npm run dev:frontend  # Frontend (Port 3000)
npm run dev:backend   # Backend (Port 3005)
```

## 📋 테스트 계정

### 관리자 계정
- **이메일**: `admin@mycafe.com`
- **비밀번호**: `admin123`
- **권한**: 관리자 대시보드 접근 가능

### 일반 사용자 계정
- **이메일**: `customer1@gmail.com`
- **비밀번호**: `customer123`
- **권한**: 카페 예약, 내 예약 관리

- **이메일**: `user1@test.com`
- **비밀번호**: `password`
- **권한**: 카페 예약, 내 예약 관리

## 🌐 접속 정보

### Frontend (클라이언트)
- **개발 환경**: http://localhost:3000
- **Docker 환경**: http://localhost:3000

### Backend (API 서버)
- **개발 환경**: http://localhost:3005
- **Docker 환경**: http://localhost:3005
- **Health Check**: http://localhost:3005/health
- **API 문서**: http://localhost:3005/api

## 🏗️ 기술 스택

### Frontend
- **React 18** with **Vite**
- **TypeScript** 
- **Tailwind CSS** + **shadcn/ui**
- **Zustand** (상태 관리)
- **React Router v6** (라우팅)
- **Axios** (HTTP 클라이언트)

### Backend
- **Node.js** + **Express.js**
- **TypeScript**
- **Mock Data** (개발 환경용)
- **JWT** 인증
- **CORS** 설정 완료

### Infrastructure
- **Docker** + **Docker Compose**
- **Vite Proxy** (개발 환경 CORS 해결)

## 📁 주요 디렉토리 구조

```
cafe_reservation_service/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # 재사용 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── services/       # API 서비스
│   │   ├── stores/         # Zustand 스토어
│   │   └── constants/      # 상수 정의
│   └── vite.config.ts      # Vite 설정
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── routes/         # API 라우트 (Mock)
│   │   ├── middleware/     # 인증 미들웨어
│   │   └── data/          # Mock 데이터
│   └── package.json
├── shared/                 # 공통 타입 정의
└── docker-compose.yml      # Docker 설정
```

## 🎯 주요 기능

### ✅ 구현 완료
- [x] **사용자 인증**: 로그인/로그아웃/회원가입
- [x] **카페 목록**: 카페 검색 및 조회
- [x] **좌석 예약**: 실시간 좌석 선택 및 예약
- [x] **내 예약 관리**: 예약 목록 조회, 취소
- [x] **결제 시스템**: 기본 결제 정보 입력
- [x] **반응형 UI**: 모바일/데스크톱 최적화

### 🔄 개발 중
- [ ] **실제 결제 연동**: PG사 API 연동
- [ ] **실시간 알림**: 예약 확인/취소 알림
- [ ] **리뷰 시스템**: 카페 평점 및 리뷰 작성
- [ ] **관리자 대시보드**: 카페 관리 및 통계

## 🧪 테스트 시나리오

### 1. 기본 플로우
1. http://localhost:3000 접속
2. 테스트 계정으로 로그인
3. "카페 찾기" → 카페 선택
4. 좌석 및 시간 선택 → 예약하기
5. "내 예약" → 예약 내역 확인

### 2. 예약 취소 테스트
1. "내 예약" 페이지 접속
2. 기존 예약 카드에서 "취소하기" 클릭
3. 취소 수수료 확인 후 취소 진행
4. 환불 정보 확인

### 3. 에러 처리 테스트
1. 잘못된 계정으로 로그인 시도 → 에러 메시지 확인
2. 토큰 만료 후 API 호출 → 자동 로그인 페이지 이동
3. 네트워크 에러 상황 → 사용자 친화적 에러 표시

## 🔧 개발자 정보

### API 엔드포인트

#### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보

#### 카페
- `GET /api/cafes` - 카페 목록
- `GET /api/cafes/:id` - 카페 상세

#### 예약
- `GET /api/reservations/my` - 내 예약 목록
- `POST /api/reservations` - 예약 생성
- `POST /api/reservations/:id/cancel` - 예약 취소
- `GET /api/reservations/:id/cancellation/preview` - 취소 수수료 미리보기

### 환경 변수

```bash
# Server
PORT=3005
NODE_ENV=development
USE_MOCK_DATA=true
JWT_SECRET=your-super-secret-jwt-key-development
JWT_EXPIRES_IN=7d

# Client (Vite)
VITE_API_URL=http://localhost:3005
VITE_APP_NAME=MyCafe
```

### Mock 데이터 위치
- **사용자**: `server/src/routes/auth-mock.ts`
- **카페**: `server/src/routes/cafes-mock.ts` 
- **예약**: `server/src/routes/reservations-mock.ts`

## 🐛 알려진 이슈 및 해결 방법

### CORS 에러
- **문제**: 클라이언트에서 API 요청 시 CORS 에러 발생
- **해결**: Vite 프록시 사용하도록 `API_BASE_URL` 설정 완료
- **확인**: 개발 환경에서 `API_BASE_URL = ''` (빈 문자열)

### 캐시 문제
- **문제**: 예약 목록이 실시간으로 업데이트되지 않음
- **해결**: Cache-Control 헤더 추가 완료
- **확인**: 새로고침 버튼으로 최신 데이터 가져오기 가능

### 토큰 만료 처리
- **문제**: 로그인 페이지에서 에러 시 페이지 새로고침 발생
- **해결**: 로그인 페이지에서는 자동 리다이렉트 방지 적용 완료

## 🤝 기여 가이드

### 코드 스타일
- **ESLint** + **Prettier** 사용
- **TypeScript Strict** 모드
- **컴포넌트**: PascalCase (`CafeCard.tsx`)
- **파일명**: kebab-case (`cafe-list.tsx`)
- **함수/변수**: camelCase (`getCafeList`)

### 커밋 메시지
```bash
feat: 새로운 기능 추가
fix: 버그 수정  
docs: 문서 변경
style: 코드 스타일 변경
refactor: 리팩토링
test: 테스트 추가/수정
chore: 빌드 도구/라이브러리 업데이트
```

## 📞 문의사항

개발 관련 문의나 버그 리포트는 Issues를 통해 제출해주세요.

---

**개발 기간**: 2025년 8월  
**버전**: v1.0.0  
**최종 업데이트**: 2025-08-30