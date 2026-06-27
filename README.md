# 🎯 uneedwhat - Modern Recruitment Platform

> A sophisticated, privacy-first recruitment platform connecting HR professionals and job seekers with intelligent matching, real-time collaboration, and seamless workflow automation.

**Status**: Production-Ready | **License**: MIT | **Stack**: TypeScript, React, NestJS, PostgreSQL

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Frontend Guide](#frontend-guide)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Security](#security)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)

---

## 🎨 Overview

**uneedwhat** is a modern, privacy-first recruitment platform designed for the contemporary hiring landscape. It bridges the gap between HR professionals and job seekers through intuitive interfaces, intelligent job matching, and collaborative hiring workflows.

### For HR Professionals
- Post and manage job openings across multiple locations
- Review applications with structured evaluation workflows
- Schedule and conduct interviews with built-in feedback systems
- Track candidate pipelines from screening to offer
- Access real-time analytics and hiring metrics

### For Job Seekers
- Build comprehensive professional profiles
- Discover relevant opportunities with AI-powered recommendations
- Track application status in real-time
- Prepare for interviews with scheduling and reminders
- Receive personalized notifications and opportunities

---

## ✨ Key Features

### 1. **Intelligent Job Matching**
- Smart job recommendations based on skills and preferences
- Advanced search with filters (location, salary, job type, industry)
- Skill-based matching algorithm
- Save and bookmark favorite positions

### 2. **Application Management**
- Structured application workflow (Draft → Submitted → Screening → Interview → Offer)
- Bulk application management for HR teams
- Automatic status tracking and notifications
- Custom rejection templates and feedback
- Resume upload and parsing

### 3. **Interview Management**
- Flexible interview scheduling (video, phone, in-person, panel)
- Integration with video conferencing platforms
- Interview feedback forms with ratings
- Automated interview reminders
- Interviewer availability management

### 4. **User Profiles**
- **Job Seekers**: Professional profiles, resume uploads, skill endorsements, portfolio links
- **HR Professionals**: Company verification, team management, hiring preferences

### 5. **Real-Time Collaboration**
- WebSocket-based notifications
- Live application status updates
- Team collaboration for hiring managers
- Comment threads on applications
- Activity logs and audit trails

### 6. **Analytics & Insights**
- Hiring funnel analytics
- Time-to-hire metrics
- Application source tracking
- Candidate pipeline visualization
- Custom reports and exports

### 7. **Privacy & Security**
- End-to-end encryption for sensitive data
- GDPR compliant data handling
- Role-based access control (RBAC)
- Audit logs for all actions
- Secure file upload and storage

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ React 18 + Vite | TypeScript | Tailwind CSS        │   │
│  │ Real-time Updates (Socket.io) | State Mgmt (Zustand) │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTPS / WSS
┌──────────────────┴──────────────────────────────────────────┐
│                  API GATEWAY & AUTH LAYER                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ NestJS API | JWT Auth | Rate Limiting | CORS       │   │
│  │ Request Validation | Error Handling                │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┼──────────┬─────────────────┐
        │          │          │                 │
┌───────▼──┐  ┌────▼───┐  ┌──▼─────────┐  ┌───▼──────┐
│  SERVICE  │  │ CACHE  │  │  MESSAGE   │  │  STORAGE │
│  LAYER    │  │ LAYER  │  │   QUEUE    │  │  LAYER   │
│ (Business │  │ Redis  │  │   Bull     │  │  S3/CDN  │
│  Logic)   │  │        │  │            │  │          │
└───────┬──┘  └────┬───┘  └──┬─────────┘  └───┬──────┘
        │          │          │                │
        └──────────┼──────────┼────────────────┘
                   │
        ┌──────────▼──────────────┐
        │   DATA ACCESS LAYER     │
        │  TypeORM | Migrations   │
        │  Query Optimization     │
        └──────────┬──────────────┘
                   │
        ┌──────────▼──────────────┐
        │   DATABASE LAYER        │
        │  PostgreSQL / MongoDB   │
        │  Replication & Backup   │
        └─────────────────────────┘
```

### Data Flow

**Authentication Flow:**
```
User Input → API Gateway → Passport Strategy → JWT Generation → 
Refresh Token Storage → Authorized Request → Role Check → Response
```

**Job Application Flow:**
```
Job Seeker Views Job → Create Application → Resume Upload → 
Notification to HR → Application Review → Status Update → 
Interview Scheduling → Feedback Collection → Offer Decision
```

---

## 🛠️ Tech Stack

### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | 18+ |
| Framework | NestJS | 10+ |
| Language | TypeScript | 5+ |
| ORM | TypeORM | 0.3+ |
| Database | PostgreSQL | 14+ |
| Cache | Redis | 7+ |
| Auth | Passport.js | 0.6+ |
| File Upload | Multer + S3 | Latest |
| Validation | class-validator | 0.14+ |
| Real-time | Socket.io | 4+ |
| Queue | Bull | 4+ |

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| Library | React | 18+ |
| Build Tool | Vite | 4+ |
| Language | TypeScript | 5+ |
| Styling | Tailwind CSS | 3+ |
| UI Components | Radix UI / Headless UI | Latest |
| State Mgmt | Zustand | 4+ |
| HTTP Client | Axios | 1+ |
| Real-time | Socket.io Client | 4+ |
| Forms | React Hook Form | 7+ |
| Animation | Framer Motion | 10+ |

### DevOps & Infrastructure
| Component | Technology |
|-----------|-----------|
| Containerization | Docker |
| Orchestration | Docker Compose |
| CI/CD | GitHub Actions |
| Monitoring | ELK Stack / Datadog |
| Logging | Winston |
| Error Tracking | Sentry |

---

## 📁 Project Structure

See **[STRUCTURE.md](./STRUCTURE.md)** for the full layout. Summary:

- **Main files** (entry/orchestration): `backend/src/main.ts`, `backend/src/app.module.ts`, `frontend/src/main.jsx`, `docker-compose.yml`
- **Parent files** (modules/domain): `backend/src/modules/*`, `backend/src/common/*`, `backend/src/database/*`, `frontend/src/components/*`, `frontend/src/services/*`
- **Reference deliverables** (original flat files): `docs/reference/`

The repo was reorganized from a flat deliverable package into a runnable monorepo with `backend/` and `frontend/` directories.

```
uneedwhat/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/              # Authentication & authorization
│   │   │   ├── users/             # User management
│   │   │   ├── jobs/              # Job posting & management
│   │   │   ├── applications/      # Application tracking
│   │   │   ├── profiles/          # User profiles
│   │   │   ├── interviews/        # Interview management
│   │   │   ├── notifications/     # Real-time notifications
│   │   │   ├── bookmarks/         # Job bookmarks
│   │   │   └── analytics/         # Analytics & insights
│   │   ├── common/
│   │   │   ├── decorators/        # Custom decorators
│   │   │   ├── filters/           # Exception filters
│   │   │   ├── guards/            # Auth & role guards
│   │   │   ├── interceptors/      # Request/response interceptors
│   │   │   └── pipes/             # Validation pipes
│   │   ├── database/
│   │   │   ├── entities/          # TypeORM entities
│   │   │   ├── migrations/        # Database migrations
│   │   │   └── seeds/             # Database seeding
│   │   ├── config/                # Configuration files
│   │   └── main.ts                # Application entry point
│   ├── test/
│   │   ├── unit/                  # Unit tests
│   │   ├── integration/           # Integration tests
│   │   └── e2e/                   # End-to-end tests
│   ├── docker/
│   │   ├── Dockerfile
│   │   └── docker-compose.yml
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/              # Authentication components
│   │   │   ├── job/               # Job listing components
│   │   │   ├── application/       # Application components
│   │   │   ├── profile/           # Profile components
│   │   │   ├── dashboard/         # Dashboard components
│   │   │   ├── common/            # Shared components
│   │   │   └── layout/            # Layout components
│   │   ├── pages/                 # Page components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── services/              # API services
│   │   ├── store/                 # State management
│   │   ├── types/                 # TypeScript types
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   ├── animations.css
│   │   │   └── tailwind.config.js
│   │   └── main.tsx               # Entry point
│   ├── public/                    # Static assets
│   ├── tests/                     # Frontend tests
│   └── package.json
│
├── docs/
│   ├── API.md                     # API documentation
│   ├── ARCHITECTURE.md            # System architecture
│   ├── DEPLOYMENT.md              # Deployment guide
│   └── CONTRIBUTING.md            # Contribution guidelines
│
├── .github/
│   └── workflows/                 # GitHub Actions CI/CD
│
├── docker-compose.yml             # Full stack Docker setup
├── .env.example                   # Environment template
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (check with `node --version`)
- **npm** 9+ or **yarn** (check with `npm --version`)
- **Docker** & **Docker Compose** (optional, for containerized setup)
- **PostgreSQL** 14+ (or use Docker)
- **Redis** 7+ (or use Docker)

### Quick Start (Local Development)

#### 1. Clone Repository
```bash
git clone https://github.com/manucian-official/uneedwhat.git
cd uneedwhat
```

#### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

#### 3. Configure Environment Variables

**Backend (.env):**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

**Frontend (.env):**
```bash
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your API endpoints
```

See [Environment Configuration](#environment-configuration) for details.

#### 4. Database Setup

```bash
cd backend

# Create database
npm run db:create

# Run migrations
npm run db:migrate

# Seed sample data (optional)
npm run db:seed
```

#### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
# Backend runs on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Docker Setup (Recommended for Development)

```bash
# Start entire stack
docker-compose up -d

# View logs
docker-compose logs -f

# Stop stack
docker-compose down
```

---

## ⚙️ Environment Configuration

### Backend Configuration

**backend/.env:**
```env
# Application
NODE_ENV=development
APP_NAME=uneedwhat
APP_PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=uneedwhat
DATABASE_USER=postgres
DATABASE_PASSWORD=your_secure_password
DATABASE_SSL=false

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRATION=30d

# Email Service
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=noreply@uneedwhat.com

# AWS S3 (for file uploads)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=uneedwhat-uploads

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Sentry (error tracking)
SENTRY_DSN=your_sentry_dsn

# CORS
CORS_ORIGIN=http://localhost:5173,https://yourdomain.com
```

### Frontend Configuration

**frontend/.env:**
```env
VITE_APP_NAME=uneedwhat
VITE_API_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=30000
VITE_WS_URL=ws://localhost:3000

# Feature flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_VIDEO_INTERVIEW=false

# Third-party integrations
VITE_GOOGLE_ANALYTICS_ID=GA_ID
VITE_SENTRY_DSN=
```

---

## 🗄️ Database Setup

### Running Migrations

```bash
# Create a new migration
npm run typeorm:migration:create -- -n AddNewFeature

# Run pending migrations
npm run db:migrate

# Revert last migration
npm run db:migrate:revert

# Show migration status
npm run db:migrate:show
```

### Database Seeding

```bash
# Seed initial data (users, jobs, etc.)
npm run db:seed

# Custom seed script
npm run db:seed:custom -- --users --jobs --applications
```

### Backup & Restore

```bash
# Backup database
npm run db:backup

# Restore from backup
npm run db:restore -- backup-file-name.sql
```

---

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
POST /api/v1/auth/verify-email
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
```

### Job Endpoints

```
GET    /api/v1/jobs                 # List all jobs with filters
POST   /api/v1/jobs                 # Create new job (HR only)
GET    /api/v1/jobs/:id             # Get job details
PATCH  /api/v1/jobs/:id             # Update job
DELETE /api/v1/jobs/:id             # Delete job
GET    /api/v1/jobs/:id/analytics   # Get job metrics
```

### Application Endpoints

```
POST   /api/v1/applications              # Submit application
GET    /api/v1/applications              # Get user's applications
GET    /api/v1/applications/:id          # Get application details
PATCH  /api/v1/applications/:id/status   # Update application status
DELETE /api/v1/applications/:id          # Withdraw application
GET    /api/v1/applications/job/:jobId   # Get job applications (HR)
```

### Profile Endpoints

```
GET    /api/v1/profiles/job-seeker/:id       # Get job seeker profile
PATCH  /api/v1/profiles/job-seeker           # Update job seeker profile
POST   /api/v1/profiles/resume               # Upload resume
GET    /api/v1/profiles/hr/:id               # Get HR profile
PATCH  /api/v1/profiles/hr                   # Update HR profile
```

### Interview Endpoints

```
POST   /api/v1/interviews                    # Schedule interview
GET    /api/v1/interviews                    # Get upcoming interviews
GET    /api/v1/interviews/:id                # Get interview details
PATCH  /api/v1/interviews/:id/status         # Update interview status
POST   /api/v1/interviews/:id/feedback       # Submit feedback
DELETE /api/v1/interviews/:id                # Cancel interview
```

**Complete API docs available at:** `http://localhost:3000/api/docs` (Swagger UI)

---

## 🎨 Frontend Guide

### Component Architecture

```
App
├── Layout
│   ├── Header
│   ├── Sidebar
│   └── Footer
├── Pages
│   ├── AuthPage
│   ├── JobListPage
│   ├── JobDetailPage
│   ├── ApplicationPage
│   ├── ProfilePage
│   ├── DashboardPage
│   └── InterviewPage
└── Services
    ├── AuthService
    ├── JobService
    ├── ApplicationService
    └── NotificationService
```

### Key Features

#### Real-Time Updates
```typescript
// Using WebSocket for real-time notifications
import { useNotifications } from '@/hooks/useNotifications';

function ApplicationList() {
  const { notifications, subscribe } = useNotifications();
  
  useEffect(() => {
    subscribe('application:status-changed', (data) => {
      // Handle status update
    });
  }, [subscribe]);
}
```

#### State Management with Zustand
```typescript
// Global state for jobs
import { create } from 'zustand';

export const useJobStore = create((set) => ({
  jobs: [],
  setJobs: (jobs) => set({ jobs }),
  addJob: (job) => set((state) => ({ 
    jobs: [...state.jobs, job] 
  })),
}));
```

#### Custom Hooks
- `useAuth()` - Authentication context
- `useJobs()` - Jobs data fetching
- `useApplications()` - Application management
- `useNotifications()` - Real-time notifications
- `useDebounce()` - Search debouncing
- `usePagination()` - Pagination logic

---

## 🔄 Development Workflow

### Git Workflow

```bash
# Feature branch
git checkout -b feat/feature-name

# Bugfix branch
git checkout -b fix/bug-name

# Chore branch
git checkout -b chore/chore-name

# Commit with conventional commits
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "chore: update dependencies"

# Push and create PR
git push origin feat/feature-name
```

### Commit Message Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

**Examples:**
```
feat(job): add advanced filtering
fix(auth): resolve token refresh issue
chore(deps): update nestjs to 10.2.0
docs: update API documentation
```

### Testing

```bash
# Backend tests
npm run test              # Unit tests
npm run test:e2e         # E2E tests
npm run test:coverage    # Coverage report

# Frontend tests
npm run test:unit        # Vitest
npm run test:e2e         # Playwright
```

---

## 📦 Deployment

### Docker Deployment

```bash
# Build image
docker build -t uneedwhat:latest .

# Run container
docker run -p 3000:3000 --env-file .env uneedwhat:latest
```

### Production Checklist

- [ ] Environment variables configured securely
- [ ] Database backups enabled
- [ ] HTTPS/SSL certificates configured
- [ ] Rate limiting enabled
- [ ] CORS whitelist set
- [ ] Error monitoring (Sentry) configured
- [ ] Logging aggregation setup (ELK)
- [ ] CI/CD pipeline tested
- [ ] Load testing completed
- [ ] Security audit passed

### Scaling Strategy

- **Horizontal Scaling:** Deploy multiple API instances behind load balancer
- **Database Sharding:** Partition data by user/company
- **Caching Strategy:** Redis for sessions, queries, and job listings
- **CDN:** CloudFront/Cloudflare for static assets
- **Async Jobs:** Bull queue for heavy operations (email, file processing)

---

## 🤝 Contributing

We welcome contributions! Please follow our process:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit changes with conventional commits
4. Push to branch: `git push origin feat/your-feature`
5. Submit a Pull Request with comprehensive description

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for detailed guidelines.

---

## 🔐 Security

### Security Best Practices

- ✅ JWT-based authentication with refresh tokens
- ✅ Role-based access control (RBAC)
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection (Content Security Policy)
- ✅ CSRF tokens for state-changing operations
- ✅ Rate limiting to prevent abuse
- ✅ Password hashing with bcrypt
- ✅ Secure file uploads with virus scanning
- ✅ GDPR compliance and data privacy

### Reporting Security Issues

Please report security vulnerabilities to: **security@uneedwhat.com**

Do not create public GitHub issues for security vulnerabilities.

---

## ⚡ Performance

### Optimization Strategies

1. **Database:** Indexing on frequently queried fields, query optimization
2. **Caching:** Redis for job listings, user data, session storage
3. **Frontend:** Code splitting, lazy loading, image optimization
4. **API:** Pagination, response compression, field selection
5. **Infrastructure:** CDN for static assets, horizontal scaling

### Monitoring

- **APM:** DataDog or New Relic for application monitoring
- **Logging:** Winston/ELK for centralized logging
- **Metrics:** Prometheus for performance metrics
- **Uptime:** UptimeRobot for availability monitoring

---

## 🐛 Troubleshooting

### Common Issues

**Database connection error:**
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Verify connection string in .env
# Check database exists: createdb uneedwhat
```

**Redis connection error:**
```bash
# Check Redis is running
redis-cli ping
# Should return: PONG

# Or use Docker: docker run -d -p 6379:6379 redis
```

**Port already in use:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

**TypeORM migration issues:**
```bash
# Revert to sync schema (development only)
npm run typeorm:schema:sync

# Recreate migrations
npm run typeorm:migration:create -- -n InitialMigration
```

---

## 📖 Additional Resources

- [API Documentation](./docs/API.md)
- [Architecture Documentation](./docs/ARCHITECTURE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing Guidelines](./docs/CONTRIBUTING.md)
- [NestJS Docs](https://docs.nestjs.com)
- [React Docs](https://react.dev)
- [TypeORM Docs](https://typeorm.io)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 👥 Authors & Contributors

**Founder & Lead Developer:** Khôi Manucian ([GitHub](https://github.com/manucian-official))

### Core Team
- **Backend Lead:** Backend Development
- **Frontend Lead:** UI/UX Design & Development
- **DevOps:** Infrastructure & Deployment

### Special Thanks
Contributors and supporters who have helped shape this project.

---

**uneedwhat** — Connecting talent with opportunity. 🚀

Last Updated: June 2024 | Version: 1.0.0
