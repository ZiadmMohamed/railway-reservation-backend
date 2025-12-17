# Railway Reservation Backend

Railway reservation backend built with NestJS, PostgreSQL, Drizzle ORM, and Better Auth. It includes i18n-aware validation, global rate limiting, and structured Winston logging.

## What’s in this repo

- **Framework**: NestJS 11 (TypeScript)
- **Database**: PostgreSQL + Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
- **Auth**: Better Auth (`better-auth`, `@thallesp/nestjs-better-auth`) with email OTP + OpenAPI plugin
- **Validation/i18n**: `nestjs-i18n` + `class-validator` (localized validation errors)
- **Rate limiting**: `@nestjs/throttler` (10 requests / 60s globally)
- **Logging**: Winston + daily rotated log files (`logs/`)
- **Docs**: Swagger UI at `/api-docs`
- **Docker**: dev + prod Compose files, multi-stage Dockerfile

## API base paths

- **API prefix**: `/v1/api` (global prefix)
- **Health**: `GET /health` (excluded from the prefix)
- **Swagger UI**: `/api-docs`

## Implemented controllers (current)

All routes below are under `/v1/api` unless stated otherwise:

- **App**
  - `GET /v1/api/` (welcome)
  - `GET /health` (health check)
- **Onboarding**
  - `GET /v1/api/onboarding/languages`
- **Passengers**
  - `POST /v1/api/passengers`
  - `GET /v1/api/passengers` (pagination via `page`, `limit`)
  - `PATCH /v1/api/passengers/:id`
  - `DELETE /v1/api/passengers/:id`
- **Auth**
  - Auth routes are served by Better Auth under `basePath=/v1/api/auth`.
  - `src/auth/auth.controller.ts` exists mainly for Swagger documentation (handlers are intentionally empty).
  - Better Auth OpenAPI reference: `http://localhost:3000/v1/api/auth/reference`

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL 16+ (or use Docker Compose)

## Setup (local)

1) Install dependencies

```bash
npm install
```

2) Create `.env`

Create a `.env` file in the project root with (at minimum) the following:

```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=info

# Local (when running Postgres on your machine):
DATABASE_URL=postgresql://railway:railway@localhost:5432/railway

# Better Auth (required)
BETTER_AUTH_SECRET=change-me
BETTER_AUTH_URL=http://localhost:3000

# Email (SMTP) - required for email OTP/verification
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user
SMTP_PASSWORD=pass
EMAIL_FROM=noreply@example.com
EMAIL_FROM_NAME=Railway Reservation
```

3) Start PostgreSQL (recommended via Docker)

```bash
docker compose -f docker-compose.dev.yml up -d postgres
```

4) Run migrations (Drizzle)

```bash
npm run db:migrate
```

5) Start the API

```bash
npm run start:dev
```

## Setup (Docker)

### Development (hot reload)

```bash
docker compose -f docker-compose.dev.yml up --build
```

Optional: Drizzle Studio is exposed at `http://localhost:4983`.

### Production

```bash
docker compose up --build
```

## Environment variables

Common variables:

| Variable | Description | Example |
|---|---|---|
| `NODE_ENV` | `development` / `production` / `test` | `development` |
| `PORT` | API port | `3000` |
| `LOG_LEVEL` | Winston level | `info` |
| `DATABASE_URL` | Postgres connection string | `postgresql://railway:railway@localhost:5432/railway` |
| `BETTER_AUTH_SECRET` | Better Auth secret | `change-me` |
| `BETTER_AUTH_URL` | Public base URL used by Better Auth | `http://localhost:3000` |
| `SMTP_HOST` | SMTP host for OTP emails | `smtp.example.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP username | `user` |
| `SMTP_PASSWORD` | SMTP password | `pass` |
| `EMAIL_FROM` | From email | `noreply@example.com` |
| `EMAIL_FROM_NAME` | From name | `Railway Reservation` |

## Useful scripts

```bash
# Dev / build
npm run start:dev
npm run build
npm run start:prod

# Tests
npm run test
npm run test:cov
npm run test:e2e

# Lint/format
npm run lint
npm run format

# Database (Drizzle)
npm run db:generate --name=init
npm run db:migrate
npm run db:studio

# Better Auth
npm run auth:generate
```

## Logging

Log files are written to `logs/` (daily rotated). Docker Compose mounts `./logs` into the container.

## Notes

- Several modules exist as scaffolding (e.g. `stations`, `trips`, `tickets`, etc.) but currently have no controllers wired up.
- The API uses i18n resolvers: `Accept-Language` and `x-custom-lang`.
