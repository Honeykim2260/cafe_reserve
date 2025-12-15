# MyCafe Reservation System Documentation

## Overview

This directory contains comprehensive documentation for the MyCafe reservation system, a full-stack cafe reservation platform built with React, TypeScript, and Node.js.

## Documentation Structure

### 📋 Core Documentation

| Document | Description | Purpose |
|----------|-------------|---------|
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | System architecture and design | Understand the overall system structure, technology stack, and component interactions |
| **[MOCK_DATA.md](./MOCK_DATA.md)** | Mock data structure and API endpoints | Learn about the development data layer, API contracts, and test data |
| **[TEST_ENVIRONMENT.md](./TEST_ENVIRONMENT.md)** | Test environment setup guide | Set up development, testing, and debugging environments |
| **[ADR.md](./ADR.md)** | Architecture Decision Records | Understand why specific technologies and patterns were chosen |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | Deployment and development workflow | Learn about CI/CD, deployment strategies, and development processes |

### 🎯 Quick Navigation

#### For Developers New to the Project
1. Start with **[ARCHITECTURE.md](./ARCHITECTURE.md)** to understand the system
2. Follow **[TEST_ENVIRONMENT.md](./TEST_ENVIRONMENT.md)** to set up your environment
3. Review **[MOCK_DATA.md](./MOCK_DATA.md)** to understand the API structure
4. Check **[ADR.md](./ADR.md)** for context on technical decisions

#### For DevOps and Deployment
1. Review **[DEPLOYMENT.md](./DEPLOYMENT.md)** for CI/CD and deployment strategies
2. Check **[TEST_ENVIRONMENT.md](./TEST_ENVIRONMENT.md)** for environment configuration
3. Reference **[ARCHITECTURE.md](./ARCHITECTURE.md)** for infrastructure requirements

#### For Project Management
1. Read **[ADR.md](./ADR.md)** to understand technical decisions and their impacts
2. Review **[ARCHITECTURE.md](./ARCHITECTURE.md)** for scalability considerations
3. Check **[DEPLOYMENT.md](./DEPLOYMENT.md)** for development workflow and processes

## System Overview

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- Zustand (state management)
- React Router v6

**Backend:**
- Node.js with Express.js
- TypeScript
- JWT authentication
- Mock data (development)
- Planned: PostgreSQL + Prisma

**Development Tools:**
- Docker + Docker Compose
- ESLint + Prettier
- Jest (testing)
- Playwright (E2E testing)

### Key Features

- 🔐 **User Authentication**: JWT-based auth with role-based access (USER, ADMIN)
- ☕ **Cafe Management**: Browse cafes, view details, check availability
- 📅 **Reservation System**: Real-time seat booking and management
- 👨‍💼 **Admin Dashboard**: Manage cafes, users, and reservations
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔄 **Real-time Updates**: Live seat availability (planned)

## Getting Started

### Quick Start (5 minutes)

```bash
# 1. Clone the repository
git clone <repository-url>
cd cafe_reservation_service

# 2. Install dependencies
npm install

# 3. Start development servers
npm run dev
```

**Access Points:**
- Frontend: http://localhost:3002
- Backend: http://localhost:3005

**Test Accounts:**
- Regular User: `user1@test.com` / `password`
- Admin: `admin@mycafe.com` / `admin123`

### Detailed Setup

For comprehensive setup instructions, see **[TEST_ENVIRONMENT.md](./TEST_ENVIRONMENT.md)**.

## Project Status

### ✅ Completed Features

- [x] User authentication system
- [x] Cafe browsing and search
- [x] Responsive UI with Tailwind CSS
- [x] Admin dashboard for cafe management
- [x] Mock data API endpoints
- [x] Image display with Unsplash integration
- [x] JWT-based authorization
- [x] Role-based access control

### 🚧 In Progress

- [ ] Real-time seat availability
- [ ] Reservation booking system
- [ ] Payment integration
- [ ] Database migration (PostgreSQL)
- [ ] E2E testing with Playwright

### 📋 Planned Features

- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Third-party integrations

## Architecture Highlights

### Frontend Architecture
```
client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route-based page components
│   ├── stores/         # Zustand state management
│   ├── services/       # API communication layer
│   └── types/          # TypeScript definitions
```

### Backend Architecture
```
server/
├── src/
│   ├── routes/         # API route definitions
│   ├── middleware/     # Express middleware
│   └── types/          # Shared type definitions
```

### Key Architectural Decisions

1. **React + TypeScript**: Type safety and modern development experience
2. **Zustand**: Lightweight state management vs Redux complexity
3. **Mock Data**: Rapid development without database setup
4. **JWT Authentication**: Stateless, scalable authentication
5. **Tailwind CSS**: Utility-first styling for rapid UI development

For detailed reasoning, see **[ADR.md](./ADR.md)**.

## API Overview

### Authentication Endpoints
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/me         # Get current user
POST /api/auth/logout     # User logout
```

### Cafe Endpoints
```
GET    /api/cafes           # List cafes with pagination
GET    /api/cafes/:id       # Get cafe details
GET    /api/cafes/:id/seats # Get cafe seat availability
GET    /api/cafes/search    # Advanced cafe search
```

For complete API documentation, see **[MOCK_DATA.md](./MOCK_DATA.md)**.

## Development Workflow

### Git Workflow
- **main**: Production-ready code
- **develop**: Integration branch
- **feature/***: New feature development
- **hotfix/***: Emergency production fixes

### Commit Convention
```
type(scope): description

Examples:
feat(auth): add JWT token refresh
fix(cafe): resolve image loading issue
docs(api): update endpoint documentation
```

### Code Review Process
1. All PRs require review
2. Tests must pass
3. Linting must pass
4. Documentation updated

For detailed workflow, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

## Testing Strategy

### Test Types
- **Unit Tests**: Component and function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user journey testing

### Running Tests
```bash
# Frontend tests
cd client && npm run test

# Backend tests
cd server && npm run test

# E2E tests (planned)
npm run test:e2e
```

For complete testing guide, see **[TEST_ENVIRONMENT.md](./TEST_ENVIRONMENT.md)**.

## Deployment

### Environments
- **Development**: Local with Docker Compose
- **Staging**: Testing environment (planned)
- **Production**: Live application (planned)

### Deployment Methods
- Docker containerization
- CI/CD with GitHub Actions
- Blue-green deployment strategy
- Zero-downtime deployments

For deployment details, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

## Performance Considerations

### Frontend Optimization
- Code splitting with React.lazy()
- Optimized images with Unsplash CDN
- Efficient state management with Zustand
- Production build optimization with Vite

### Backend Optimization
- Response compression (gzip)
- Planned caching with Redis
- Database query optimization (future)
- API rate limiting (planned)

## Security

### Current Security Measures
- JWT token authentication
- bcrypt password hashing
- CORS configuration
- Input validation with Zod
- Role-based access control

### Planned Security Enhancements
- Rate limiting middleware
- HTTPS enforcement
- Security headers (Helmet.js)
- Dependency vulnerability scanning

## Monitoring & Observability

### Planned Monitoring
- Application performance monitoring
- Error tracking and logging
- User analytics
- Infrastructure monitoring

## Contributing

### Development Setup
1. Read **[TEST_ENVIRONMENT.md](./TEST_ENVIRONMENT.md)**
2. Set up local development environment
3. Review **[ARCHITECTURE.md](./ARCHITECTURE.md)**
4. Check **[ADR.md](./ADR.md)** for context

### Code Standards
- TypeScript strict mode
- ESLint + Prettier formatting
- Comprehensive testing
- Clear commit messages
- Updated documentation

### Pull Request Process
1. Create feature branch
2. Implement changes with tests
3. Update documentation
4. Submit PR with description
5. Address review feedback

## Troubleshooting

### Common Issues
- **Port conflicts**: Change ports in environment files
- **CORS errors**: Check API base URL configuration
- **Authentication issues**: Clear localStorage and retry
- **Build failures**: Clear cache and reinstall dependencies

For detailed troubleshooting, see **[TEST_ENVIRONMENT.md](./TEST_ENVIRONMENT.md)**.

## Support & Resources

### Internal Resources
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **API Documentation**: [MOCK_DATA.md](./MOCK_DATA.md)
- **Setup Guide**: [TEST_ENVIRONMENT.md](./TEST_ENVIRONMENT.md)
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Decisions**: [ADR.md](./ADR.md)

### External Resources
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Express.js](https://expressjs.com/)

## Changelog

### v1.0.0 (Current)
- Initial system architecture
- User authentication system
- Cafe browsing and management
- Admin dashboard
- Mock data integration
- Responsive UI implementation

---

**Last Updated**: 2024-01-01  
**Documentation Version**: 1.0.0  
**System Version**: 1.0.0