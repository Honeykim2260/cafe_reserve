# Deployment & Development Workflow

## Overview

This document outlines the complete development workflow, CI/CD pipeline, and deployment strategies for the MyCafe reservation system.

## Development Workflow

### Git Branching Strategy

We follow a simplified Git Flow model:

```
main (production)
├── develop (integration)
│   ├── feature/user-authentication
│   ├── feature/cafe-reservation
│   └── feature/admin-dashboard
├── hotfix/critical-bug-fix
└── release/v1.0.0
```

#### Branch Types

1. **main**: Production-ready code, protected branch
2. **develop**: Integration branch for features
3. **feature/***: New features or enhancements
4. **bugfix/***: Bug fixes for develop branch
5. **hotfix/***: Emergency fixes for production
6. **release/***: Prepare release versions

#### Branch Rules
- All feature branches created from `develop`
- Pull requests required for `main` and `develop`
- Minimum 1 reviewer required for PRs
- All tests must pass before merge
- No direct commits to `main` or `develop`

### Commit Convention

We use Conventional Commits format:

```
type(scope): description

[optional body]

[optional footer]
```

#### Commit Types
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

#### Examples
```bash
feat(auth): add JWT token refresh mechanism
fix(cafe): resolve image loading issue on mobile devices
docs(api): update authentication endpoint documentation
refactor(reservation): extract booking logic into service layer
```

### Code Review Process

#### Before Creating PR
1. Ensure all tests pass locally
2. Run linting and formatting
3. Update relevant documentation
4. Write clear PR description

#### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

#### Review Criteria
- Code functionality and correctness
- Code style and consistency
- Test coverage
- Performance implications
- Security considerations
- Documentation completeness

### Development Environment Setup

#### Prerequisites
```bash
# Node.js and npm
node --version  # v18.0.0+
npm --version   # v9.0.0+

# Git configuration
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# IDE setup (VS Code recommended)
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-eslint
```

#### Local Development Workflow
```bash
# 1. Clone repository
git clone <repository-url>
cd cafe_reservation_service

# 2. Install dependencies
npm install

# 3. Start development servers
npm run dev

# 4. Create feature branch
git checkout -b feature/new-feature

# 5. Make changes, commit, and push
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 6. Create Pull Request
```

## CI/CD Pipeline

### GitHub Actions Workflow

#### Main Workflow (.github/workflows/main.yml)
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '18'

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: |
          npm ci
          cd client && npm ci
          cd ../server && npm ci
          
      - name: Lint code
        run: |
          cd client && npm run lint
          cd ../server && npm run lint
          
      - name: Run tests
        run: |
          cd client && npm run test:coverage
          cd ../server && npm run test:coverage
          
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          
  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install and build
        run: |
          npm ci
          cd client && npm ci && npm run build
          cd ../server && npm ci && npm run build
          
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: |
            client/dist
            server/dist
            
  e2e-test:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: build
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright
        run: npx playwright install
        
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: e2e-results
          path: |
            playwright-report/
            test-results/
            
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [test, build, e2e-test]
    if: github.ref == 'refs/heads/develop'
    
    steps:
      - name: Deploy to staging
        run: echo "Deploy to staging environment"
        # Add actual deployment steps
        
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [test, build, e2e-test]
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Deploy to production
        run: echo "Deploy to production environment"
        # Add actual deployment steps
```

#### Quality Gates
- All tests must pass (unit, integration, E2E)
- Code coverage threshold: 80%
- No linting errors
- Security vulnerability check passes
- Performance budget not exceeded

### Pre-commit Hooks

#### Husky Configuration (.husky/pre-commit)
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run lint-staged
npx lint-staged

# Run type checking
cd client && npx tsc --noEmit
cd ../server && npx tsc --noEmit

echo "✅ Pre-commit checks passed"
```

#### Lint-staged Configuration (package.json)
```json
{
  "lint-staged": {
    "client/**/*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "server/**/*.{ts,js}": [
      "eslint --fix",
      "prettier --write"
    ],
    "**/*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

## Deployment Environments

### Environment Overview

| Environment | Branch | URL | Purpose |
|-------------|--------|-----|---------|
| Development | feature/* | localhost | Local development |
| Staging | develop | staging.mycafe.com | Testing & QA |
| Production | main | mycafe.com | Live application |

### Environment Variables

#### Development (.env.development)
```bash
# Server
NODE_ENV=development
PORT=3005
JWT_SECRET=development-secret-key
JWT_EXPIRES_IN=7d

# Database
DATABASE_URL=file:./dev.db

# Client
VITE_API_URL=http://localhost:3005
VITE_APP_NAME=MyCafe Dev
VITE_DEBUG=true
```

#### Staging (.env.staging)
```bash
# Server
NODE_ENV=staging
PORT=3005
JWT_SECRET=${STAGING_JWT_SECRET}
JWT_EXPIRES_IN=7d

# Database
DATABASE_URL=${STAGING_DATABASE_URL}

# Client
VITE_API_URL=https://api-staging.mycafe.com
VITE_APP_NAME=MyCafe Staging
VITE_DEBUG=false
```

#### Production (.env.production)
```bash
# Server
NODE_ENV=production
PORT=3005
JWT_SECRET=${PRODUCTION_JWT_SECRET}
JWT_EXPIRES_IN=7d

# Database
DATABASE_URL=${PRODUCTION_DATABASE_URL}

# Client
VITE_API_URL=https://api.mycafe.com
VITE_APP_NAME=MyCafe
VITE_DEBUG=false
```

### Docker Configuration

#### Development (docker-compose.yml)
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile.dev
    ports:
      - "3002:3002"
    volumes:
      - ./client:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:3005
    depends_on:
      - backend

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile.dev
    ports:
      - "3005:3005"
    volumes:
      - ./server:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - PORT=3005
      - JWT_SECRET=dev-secret

  database:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=mycafe_dev
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### Production (docker-compose.prod.yml)
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=https://api.mycafe.com
    depends_on:
      - backend

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "3005:3005"
    environment:
      - NODE_ENV=production
      - PORT=3005
      - JWT_SECRET=${JWT_SECRET}
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - database

  database:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
```

### Dockerfile Configuration

#### Frontend Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Backend Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3005

USER node

CMD ["node", "dist/app.js"]
```

## Deployment Strategies

### Rolling Deployment

#### Zero-Downtime Deployment Process
1. Build new version
2. Deploy to subset of servers
3. Health check new deployment
4. Gradually route traffic to new version
5. Monitor for issues
6. Complete rollout or rollback

#### Health Checks
```typescript
// server/src/routes/health.ts
import { Router } from 'express'

const router = Router()

router.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: 'connected' // Check actual DB connection
  }
  
  res.json(health)
})

router.get('/ready', (req, res) => {
  // More comprehensive readiness check
  const ready = {
    status: 'ready',
    checks: {
      database: true, // Check DB connection
      cache: true,    // Check Redis connection
      storage: true   // Check file storage
    }
  }
  
  const allReady = Object.values(ready.checks).every(Boolean)
  
  res.status(allReady ? 200 : 503).json(ready)
})

export default router
```

### Blue-Green Deployment

#### Environment Setup
- **Blue**: Current production environment
- **Green**: New version deployment
- **Router**: Load balancer switching between environments

#### Deployment Process
1. Deploy new version to green environment
2. Run smoke tests on green
3. Switch router to green environment
4. Monitor for issues
5. Keep blue as fallback
6. After validation, blue becomes new green

### Database Migrations

#### Migration Strategy
```bash
# Development migrations
npm run migrate:dev

# Production migrations (with backup)
npm run db:backup
npm run migrate:deploy
npm run db:verify
```

#### Migration Scripts (package.json)
```json
{
  "scripts": {
    "migrate:dev": "prisma migrate dev",
    "migrate:deploy": "prisma migrate deploy",
    "db:seed": "prisma db seed",
    "db:backup": "pg_dump $DATABASE_URL > backup.sql",
    "db:verify": "npm run test:integration"
  }
}
```

## Monitoring & Observability

### Application Monitoring

#### Health Monitoring
- Uptime monitoring (every 30 seconds)
- Response time tracking
- Error rate monitoring
- Database connection status

#### Performance Metrics
```typescript
// Middleware for performance tracking
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    const route = req.route?.path || req.path
    
    // Log performance metrics
    console.log({
      method: req.method,
      route,
      statusCode: res.statusCode,
      duration,
      timestamp: new Date().toISOString()
    })
    
    // Send to monitoring service
    metrics.histogram('http_request_duration', duration, {
      method: req.method,
      route,
      status: res.statusCode
    })
  })
  
  next()
}
```

#### Error Tracking
```typescript
// Global error handler
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const errorInfo = {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    userId: req.user?.id
  }
  
  // Log error
  console.error('Application error:', errorInfo)
  
  // Send to error tracking service (Sentry, etc.)
  errorTracker.captureError(err, {
    user: req.user,
    request: req
  })
  
  // Return user-friendly error
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  })
}
```

### Infrastructure Monitoring

#### Docker Monitoring
```bash
# Monitor container health
docker stats

# Check container logs
docker logs -f <container_id>

# Monitor resource usage
docker system df
docker system events
```

#### Database Monitoring
- Connection pool status
- Query performance
- Disk usage
- Backup status

## Backup & Recovery

### Database Backup Strategy

#### Automated Backups
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DATE}.sql"

# Create backup
pg_dump $DATABASE_URL > /backups/$BACKUP_FILE

# Compress backup
gzip /backups/$BACKUP_FILE

# Upload to cloud storage
aws s3 cp /backups/${BACKUP_FILE}.gz s3://mycafe-backups/

# Clean old local backups (keep 7 days)
find /backups -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: ${BACKUP_FILE}.gz"
```

#### Backup Schedule
- **Full backup**: Daily at 2 AM
- **Transaction log backup**: Every 15 minutes
- **Retention**: 30 days online, 1 year archived

### Disaster Recovery

#### Recovery Procedures
1. **Database Recovery**:
   ```bash
   # Stop application
   docker-compose down
   
   # Restore from backup
   gunzip backup_20240101_020000.sql.gz
   psql $DATABASE_URL < backup_20240101_020000.sql
   
   # Start application
   docker-compose up -d
   ```

2. **Application Recovery**:
   ```bash
   # Rollback to previous version
   git checkout <previous_tag>
   docker-compose up -d
   
   # Or use blue-green deployment
   # Switch traffic back to blue environment
   ```

#### Recovery Time Objectives (RTO)
- **Critical**: 15 minutes
- **High**: 1 hour
- **Medium**: 4 hours
- **Low**: 24 hours

#### Recovery Point Objectives (RPO)
- **Database**: 15 minutes (transaction log frequency)
- **Files**: 24 hours (daily backup)
- **Configuration**: 1 hour (version control)

## Security Considerations

### Deployment Security

#### Environment Separation
- Separate AWS accounts/subscriptions for each environment
- VPC isolation between environments
- Different access keys and secrets per environment

#### Secrets Management
```yaml
# GitHub Secrets for CI/CD
STAGING_DATABASE_URL
STAGING_JWT_SECRET
PRODUCTION_DATABASE_URL
PRODUCTION_JWT_SECRET
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
DOCKER_HUB_USERNAME
DOCKER_HUB_PASSWORD
```

#### Security Scanning
```yaml
# Security scanning in CI/CD
- name: Run security audit
  run: |
    cd client && npm audit --audit-level=high
    cd ../server && npm audit --audit-level=high

- name: Scan Docker images
  run: |
    docker scan mycafe-frontend:latest
    docker scan mycafe-backend:latest
```

### Production Hardening

#### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name mycafe.com;
    
    ssl_certificate /etc/ssl/certs/mycafe.crt;
    ssl_certificate_key /etc/ssl/private/mycafe.key;
    
    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://backend:3005;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Application Security
- Helmet.js for security headers
- Rate limiting middleware
- Input validation and sanitization
- HTTPS enforcement
- Regular dependency updates

## Performance Optimization

### Build Optimization

#### Frontend Optimization
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-button'],
          utils: ['date-fns', 'lodash']
        }
      }
    }
  },
  esbuild: {
    drop: ['console', 'debugger']
  }
})
```

#### Backend Optimization
```typescript
// Production optimizations
app.use(compression()) // Gzip compression
app.use(helmet()) // Security headers
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Cache headers for static assets
app.use('/uploads', express.static('uploads', {
  maxAge: '1d',
  etag: true
}))
```

### Deployment Performance
- CDN integration for static assets
- Database connection pooling
- Caching strategy implementation
- Image optimization pipeline

---

This deployment and development workflow ensures reliable, secure, and efficient delivery of the MyCafe reservation system from development to production.