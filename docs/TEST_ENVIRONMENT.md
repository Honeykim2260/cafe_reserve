# Test Environment Setup Guide

## Overview

This guide provides comprehensive instructions for setting up and running the MyCafe reservation system test environment across different platforms and scenarios.

## Prerequisites

### System Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: Latest version
- **Docker**: v20.0.0 or higher (optional)
- **Docker Compose**: v2.0.0 or higher (optional)

### Development Tools
- **Code Editor**: VS Code (recommended) with TypeScript extension
- **Browser**: Chrome, Firefox, or Safari (latest versions)
- **Terminal**: Command line interface

### Check Prerequisites
```bash
# Check Node.js version
node --version
# Expected: v18.0.0+

# Check npm version
npm --version
# Expected: v9.0.0+

# Check Git
git --version

# Check Docker (optional)
docker --version
docker-compose --version
```

## Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd cafe_reservation_service
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Return to root
cd ..
```

### 3. Start Development Environment
```bash
# Start both frontend and backend concurrently
npm run dev
```

**Expected Output:**
- Frontend: http://localhost:3002
- Backend: http://localhost:3005

### 4. Access Test Accounts
```bash
# Regular User Account
Email: user1@test.com
Password: password

# Admin Account
Email: admin@mycafe.com
Password: admin123

# Customer Account
Email: customer1@gmail.com
Password: customer123
```

## Detailed Setup Instructions

### Manual Setup (Recommended for Development)

#### Step 1: Environment Configuration
```bash
# Create environment files (optional - defaults are provided)
# Backend environment
cd server
cp .env.example .env
# Edit JWT_SECRET and other settings if needed

# Frontend environment
cd ../client
cp .env.example .env
# Edit VITE_API_URL if backend runs on different port
```

#### Step 2: Start Backend Server
```bash
cd server
npm run dev
```

**Expected Output:**
```
🚀 Server running on http://localhost:3005
Mock data loaded successfully
Available routes:
  - GET  /api/auth/me
  - POST /api/auth/login
  - POST /api/auth/register
  - GET  /api/cafes
  - GET  /api/cafes/:id
  - GET  /api/cafes/:id/seats
```

#### Step 3: Start Frontend Development Server
```bash
# In new terminal
cd client
npm run dev
```

**Expected Output:**
```
  VITE v5.4.19  ready in 119ms

  ➜  Local:   http://localhost:3002/
  ➜  Network: http://192.168.0.56:3002/
```

### Docker Setup (Alternative)

#### Option 1: Docker Compose (Full Stack)
```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Option 2: Individual Docker Containers
```bash
# Build and run backend
cd server
docker build -t mycafe-backend .
docker run -p 3005:3005 mycafe-backend

# Build and run frontend
cd client
docker build -t mycafe-frontend .
docker run -p 3002:3002 mycafe-frontend
```

## Testing Framework Setup

### Unit Testing Setup

#### Frontend Testing (React Testing Library + Jest)
```bash
cd client
npm run test
```

**Test Configuration:**
- **Framework**: Jest with React Testing Library
- **Config**: `jest.config.js`
- **Test Files**: `src/**/*.test.{ts,tsx}`
- **Coverage**: `npm run test:coverage`

**Example Test Run:**
```bash
 PASS  src/components/CafeCard.test.tsx
 PASS  src/pages/CafesPage.test.tsx
 PASS  src/services/api.test.ts

Test Suites: 3 passed, 3 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        2.5 s
```

#### Backend Testing (Jest + Supertest)
```bash
cd server
npm run test
```

**Test Configuration:**
- **Framework**: Jest with Supertest
- **Config**: `jest.config.js`
- **Test Files**: `src/**/*.test.ts`
- **API Testing**: Supertest for endpoint testing

### E2E Testing Setup

#### Playwright Installation
```bash
# Install Playwright (if not already installed)
npx playwright install

# Run E2E tests
npm run test:e2e
```

**Playwright Configuration:**
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3002',
    reuseExistingServer: !process.env.CI,
  },
});
```

### API Testing with Postman/Insomnia

#### Postman Collection
Import the provided Postman collection:

```json
{
  "info": {
    "name": "MyCafe API",
    "description": "Complete API collection for MyCafe reservation system"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register User",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
            }
          }
        },
        {
          "name": "Login User",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"user1@test.com\",\"password\":\"password\"}"
            }
          }
        }
      ]
    }
  ]
}
```

#### Environment Variables
```json
{
  "baseUrl": "http://localhost:3005",
  "authToken": "{{token_from_login}}"
}
```

## Test Data Management

### Mock Data Reset
```bash
# Restart server to reset mock data
cd server
npm run dev
```

### Custom Test Data
Create custom test scenarios by modifying mock data files:

```bash
# Edit user data
vi server/src/routes/auth-mock.ts

# Edit cafe data
vi server/src/routes/cafes-mock.ts

# Restart server to apply changes
npm run dev
```

### Test Account Management
```typescript
// Add new test user in auth-mock.ts
{
  id: 'test-user-1',
  email: 'testuser@example.com',
  name: '테스트 유저',
  password: 'testpass123',
  role: 'USER',
  isActive: true
}
```

## Browser Testing

### Supported Browsers
- **Chrome**: v90+ (recommended for development)
- **Firefox**: v88+
- **Safari**: v14+
- **Edge**: v90+

### Cross-Browser Testing
```bash
# Run Playwright tests across all browsers
npx playwright test

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Mobile Testing
```bash
# Test mobile viewports
npx playwright test --project='Mobile Chrome'
npx playwright test --project='Mobile Safari'
```

## Performance Testing

### Frontend Performance
```bash
# Build for production and analyze
cd client
npm run build
npm run preview

# Lighthouse CI (if configured)
npm run lighthouse
```

### Load Testing (Backend)
```bash
# Install Artillery
npm install -g artillery

# Run load tests
cd server
artillery run load-test.yml
```

**Sample Load Test Configuration:**
```yaml
# load-test.yml
config:
  target: 'http://localhost:3005'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Get cafes"
    requests:
      - get:
          url: "/api/cafes"
```

## Debugging Setup

### VS Code Configuration
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/src/app.ts",
      "outFiles": ["${workspaceFolder}/server/dist/**/*.js"],
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "name": "Debug Frontend",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/client",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"]
    }
  ]
}
```

### Chrome DevTools
1. Open Chrome DevTools (F12)
2. Go to Network tab to monitor API calls
3. Use Console for debugging React components
4. Application tab for localStorage/sessionStorage inspection

### Network Debugging
```bash
# Monitor API requests
cd client
# Add to package.json scripts:
"dev:debug": "VITE_API_DEBUG=true vite --host 0.0.0.0 --port 3002"

# Run with debug logging
npm run dev:debug
```

## CI/CD Testing Setup

### GitHub Actions Configuration
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd client && npm ci
      - run: cd client && npm run test
      - run: cd client && npm run build

  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd server && npm ci
      - run: cd server && npm run test
      - run: cd server && npm run build

  test-e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npx playwright install
      - run: npm run test:e2e
```

## Troubleshooting

### Common Issues

#### Port Conflicts
**Problem**: Port 3002 or 3005 already in use
**Solution**:
```bash
# Kill processes on ports
lsof -ti:3002 | xargs kill -9
lsof -ti:3005 | xargs kill -9

# Or use different ports
cd client
VITE_PORT=3003 npm run dev

cd server
PORT=3006 npm run dev
```

#### CORS Issues
**Problem**: API calls blocked by CORS policy
**Solution**: Check CORS configuration in `server/src/app.ts`:
```typescript
app.use(cors({
  origin: ['http://localhost:3002', 'http://localhost:3003'],
  credentials: true
}))
```

#### Authentication Issues
**Problem**: JWT token invalid or expired
**Solution**:
```bash
# Clear localStorage in browser
localStorage.clear()

# Or use test accounts with known credentials
# Email: user1@test.com, Password: password
```

#### Build Failures
**Problem**: TypeScript compilation errors
**Solution**:
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Install missing types
npm install @types/missing-package

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Docker Issues
**Problem**: Docker containers not starting
**Solution**:
```bash
# Check Docker status
docker --version
docker-compose --version

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check container logs
docker-compose logs -f
```

### Debug Logs

#### Enable Debug Logging
```bash
# Backend debug logs
cd server
DEBUG=mycafe:* npm run dev

# Frontend debug logs
cd client
VITE_DEBUG=true npm run dev
```

#### Log Analysis
```bash
# View application logs
tail -f server/logs/app.log

# View access logs
tail -f server/logs/access.log

# View error logs
tail -f server/logs/error.log
```

## Test Automation

### Continuous Testing
```bash
# Watch mode for development
cd client
npm run test:watch

cd server
npm run test:watch

# Coverage reports
npm run test:coverage
```

### Pre-commit Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{js,jsx}": ["eslint --fix", "prettier --write"]
  }
}
```

## Performance Monitoring

### Metrics Collection
- **Frontend**: Web Vitals, bundle size analysis
- **Backend**: Response times, memory usage
- **Database**: Query performance (when implemented)
- **Network**: API request/response times

### Monitoring Tools
- **Frontend**: Lighthouse, Web Vitals extension
- **Backend**: Node.js performance monitoring
- **Full Stack**: New Relic, DataDog (production)

---

This test environment setup ensures reliable development and testing across all aspects of the MyCafe reservation system.