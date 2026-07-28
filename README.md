# UneedWhat I Need U

Enterprise ATS platform for HR teams and growing companies.

## What is included

- Modern landing page with hero, feature blocks, testimonials and pricing
- Login, register and forgot password flows
- Dashboard shell with Jobs, Candidates, Interviews, Reports, Team and Settings
- Prisma schema for users, companies, jobs, candidates, applications, interviews, evaluations and notifications
- NestJS backend scaffold for future API expansion
- Playwright E2E coverage for landing and auth flow

## Tech Stack

- Frontend: Next.js 15, TypeScript, TailwindCSS, Framer Motion, React Query, Zustand
- Backend: NestJS, PostgreSQL, Prisma, JWT-ready scaffold
- Infra: Docker, Docker Compose, environment-based configuration

## Run locally

### Web app

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

### E2E

```bash
npm run test:e2e
```

### Backend scaffold

```bash
cd backend
npm install
npm run dev
```

## Database

Prisma schema is in `prisma/schema.prisma`.

## Docker

Use `docker compose up --build` to spin up PostgreSQL, Redis and the app services after wiring environment variables.

## Folder map

- `app/` - Next.js routes and API handlers
- `components/` - UI shell, landing page and modal components
- `lib/` - shared data and helpers
- `store/` - Zustand state
- `prisma/` - database schema
- `backend/` - NestJS API scaffold
- `tests/` - Playwright tests

## Roadmap fit

- Phase 2: AI CV parsing, matching, summaries and skill analysis
- Phase 3: Multi-company SaaS, billing, recruiting assistant and mobile app
- Phase 4: Video interviews, talent pool, internal mobility and advanced analytics
