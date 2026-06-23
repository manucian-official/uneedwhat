# UneedWhat I Need U

Recruitment landing page for HR teams and job seekers.

## What it does

- Landing page with a strong hero section and recruitment-focused layout
- Basic login/logout flow stored in `localStorage`
- Featured jobs, hiring workflow, and audience cards for HR and candidates
- Playwright E2E coverage for landing load and login/logout

## Run locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

## Build

```bash
npm run build
```

## E2E tests

```bash
npm run test:e2e
```

## Structure

- `src/main.jsx` - app UI and auth state
- `src/styles.css` - full visual system and responsive layout
- `tests/auth.spec.js` - login/logout end-to-end checks
- `playwright.config.js` - Playwright test runner config

## Notes

- Login is intentionally lightweight for demo and review flows.
- You can swap the auth flow for a real backend later without changing the layout.
