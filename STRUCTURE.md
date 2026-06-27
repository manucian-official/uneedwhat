# uneedwhat Project Structure

This document classifies files into **main files** (entry points and orchestration) versus **parent files** (modules, shared utilities, and domain logic grouped by concern).

## Overview

`uneedwhat` is a privacy-first recruitment platform connecting HR professionals and job seekers. The repository is organized as a monorepo with a NestJS backend and a React (Vite) frontend.

## Main Files (Entry Points & Orchestration)

These files bootstrap the application, wire modules together, or define top-level deployment.

| Path | Role |
|------|------|
| `backend/src/main.ts` | NestJS API bootstrap (CORS, Swagger, validation) |
| `backend/src/app.module.ts` | Root module: DB, guards, feature module imports |
| `frontend/src/main.jsx` | React app entry point |
| `frontend/index.html` | Vite HTML shell |
| `package.json` | Monorepo scripts (`build`, `dev:*`) |
| `docker-compose.yml` | Full-stack orchestration (Postgres, Redis, API, UI) |
| `.github/workflows/ci-cd.yml` | CI/CD pipeline |

## Parent Files (Modules & Shared Logic)

### Backend — `backend/src/`

| Area | Path | Purpose |
|------|------|---------|
| **Config** | `config/` | App and database configuration |
| **Database** | `database/entities/` | TypeORM entities (User, Job, Application, etc.) |
| **Common** | `common/` | Guards, decorators, filters, interceptors, DTOs |
| **Auth** | `modules/auth/` | Register, login, refresh, logout (JWT) |
| **Users** | `modules/users/` | User CRUD and search |
| **Jobs** | `modules/jobs/` | Job posting, filtering, analytics |
| **Applications** | `modules/applications/` | Application workflow and status updates |
| **Profiles** | `modules/profiles/` | HR and job-seeker profiles, resume upload |
| **Interviews** | `modules/interviews/` | Scheduling, feedback, cancellation |
| **Bookmarks** | `modules/bookmarks/` | Save/unsave jobs |
| **Analytics** | `modules/analytics/` | HR and job-seeker dashboards |
| **Health** | `modules/health/` | `/api/v1/health` probe |

### Frontend — `frontend/src/`

| Area | Path | Purpose |
|------|------|---------|
| **Pages** | `main.jsx` | Landing page with auth demo UI |
| **Styles** | `styles.css` | Global styles and design tokens |
| **Components** | `components/` | UI and dashboard reference components |
| **Services** | `services/api.ts` | Axios API client (for backend integration) |
| **Hooks** | `hooks/` | React hooks (reference implementations) |

### Documentation & Reference — `docs/`

| Path | Purpose |
|------|---------|
| `docs/reference/backend-architecture.ts` | Original API contract and entity spec |
| `docs/reference/frontend-*.tsx` | Reference UI components |
| `docs/reference/DEPLOYMENT-GUIDE.md` | Production deployment runbook |

## API Surface (Backend)

All routes are prefixed with `/api/v1`:

- `POST /auth/register|login|refresh|logout`
- `GET|PATCH|DELETE /users/:id`, `GET /users/search`
- `GET|POST|PATCH|DELETE /jobs`, `GET /jobs/:id/analytics`
- `GET|POST|PATCH|DELETE /applications`, bulk status updates
- `GET|PATCH /profiles/job-seeker`, `GET|PATCH /profiles/hr`, `POST /profiles/resume`
- `GET|POST|PATCH|DELETE /interviews`, feedback submission
- `GET|POST|DELETE /bookmarks/jobs/:jobId`
- `GET /analytics/dashboard`, `GET /analytics/job/:jobId`
- `GET /health`

Swagger UI: `http://localhost:3000/api/docs`

## Local Development

```bash
# Install dependencies
npm run install:all

# Backend (SQLite by default)
cd backend && npm run start:dev

# Frontend
cd frontend && npm run dev
```

Set `DATABASE_TYPE=postgres` in `.env` to use PostgreSQL (e.g. via `docker-compose up postgres redis`).
