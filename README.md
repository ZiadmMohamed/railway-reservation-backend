# Railway Reservation Backend

A modern railway reservation system backend built with NestJS, featuring Redis caching, rate limiting, Prometheus metrics, and comprehensive logging.

## Features

- 🚂 **Railway Reservation System** - Manage trains, schedules, stations, and bookings
- 🔒 **Rate Limiting** - Built-in throttling with 10 requests per 60 seconds
- 📊 **Monitoring** - Prometheus metrics endpoint at `/metrics`
- 📝 **Logging** - Winston logger with daily rotating file transport (HTTP & error logs)
- 💾 **Redis Caching** - High-performance caching layer
- 📚 **API Documentation** - Swagger/OpenAPI documentation
- 🐳 **Docker Ready** - Multi-stage Dockerfile with development and production targets
- ✅ **CI/CD** - GitHub Actions workflow with linting, testing, and build validation

## Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript
- **Cache**: Redis 7
- **Testing**: Jest
- **API Docs**: Swagger/OpenAPI
- **Monitoring**: Prometheus
- **Logging**: Winston

## Prerequisites

- Node.js 20+
- npm or yarn
- Redis (or use Docker Compose)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd railway-reservation-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file:

```bash
cp env.example .env
```

Required environment variables:

```env
NODE_ENV=development
PORT=3000
REDIS_URL=redis://localhost:6379
LOG_LEVEL=info  # optional, defaults to 'info'
```

### 4. Start Redis

Using Docker:

```bash
docker compose -f docker-compose.dev.yml up -d
```

Or install Redis locally and start it.

### 5. Run the application

Development mode with hot reload:

```bash
npm run start:dev
```

Production mode:

```bash
npm run build
npm run start:prod
```

The API will be available at:
- **API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/api/health
- **Metrics**: http://localhost:3000/metrics

## Docker Deployment

### Development

```bash
docker compose -f docker-compose.dev.yml up
```

### Production

```bash
docker compose up --build
```

This will start:
- Application container on port 3000
- Redis container on port 6379

## Scripts

```bash
# Development
npm run start:dev          # Start with watch mode
npm run start:debug        # Start with debug mode

# Build
npm run build              # Build for production

# Production
npm run start:prod         # Run production build

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:e2e           # Run end-to-end tests

# Code Quality
npm run lint               # Lint and fix files
npm run format             # Format code with Prettier

# CI Scripts
npm run ci:lint            # Lint without fixing (for CI)
npm run ci:format          # Check formatting (for CI)
npm run ci:docker          # Start Docker services for CI
npm run ci:test            # Run tests in CI mode
```

## Project Structure

```
src/
├── common/                 # Shared utilities, DTOs, decorators
│   ├── constants.ts       # App-wide constants
│   ├── docs/              # Swagger documentation helpers
│   └── dtos/              # Shared DTOs (pagination, etc.)
├── config/                # Configuration modules
│   └── logger/            # Winston logger configuration
├── app.module.ts          # Root application module
├── app.controller.ts      # Root controller with health endpoint
├── app.service.ts         # Root service
└── main.ts                # Application entry point
```

## API Documentation

Once the application is running, visit http://localhost:3000/api-docs to explore the API using Swagger UI.

### Available Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check endpoint (returns status and timestamp)
- `GET /metrics` - Prometheus metrics

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment (development/production/test) | development | No |
| `PORT` | Application port | 3000 | No |
| `REDIS_URL` | Redis connection URL | redis://localhost:6379 | Yes |
| `LOG_LEVEL` | Winston log level (error/warn/info/debug) | info | No |

## Logging

Logs are written to:
- Console (formatted with colors in development)
- `logs/http-YYYY-MM-DD.log` - HTTP request logs
- `logs/error-YYYY-MM-DD.log` - Error logs

Logs are rotated daily and compressed, with 14 days retention and 20MB max file size.

## Health Checks

The application includes a health check endpoint at `/api/health` that returns:

```json
{
  "status": "ok",
  "timestamp": "2024-12-01T00:00:00.000Z"
}
```

This is used by Docker healthcheck and can be used by load balancers.

## Rate Limiting

Global rate limiting is enabled:
- **Window**: 60 seconds
- **Max requests**: 10 per window

Requests exceeding the limit will receive a 429 (Too Many Requests) response.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## CI/CD

The project includes a GitHub Actions workflow that:
1. Installs dependencies
2. Runs ESLint
3. Checks code formatting with Prettier
4. Starts required Docker services (Redis)
5. Builds the application
6. Runs all tests

## License

This project is [UNLICENSED](LICENSE).

## Support

For questions and support, please open an issue in the repository.
