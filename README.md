# ParcelFlow

Shipment management platform with end-to-end logistics control: a responsive web app for
customers, couriers and administrators.

> Practice and portfolio project. Payments and other external providers are mocked: they look
> real but no real money or data is involved.

## Features (planned)

- **Customers:** create a shipment (origin, destination, pickup and delivery time slots), get an
  instant quote, pay (mocked) and track the courier on a map with the status history.
- **Couriers:** new job notifications, optimized route, status updates and proof of delivery
  (signature and photo).
- **Administrators:** order assignment, pricing, performance metrics and user management.
- Email / SMS / push alerts, reports and data export.
- English and Latin American Spanish UI; multiple currencies.

See [`docs/roadmap.md`](docs/roadmap.md) for the phased plan.

## Stack

FastAPI + SQLAlchemy 2 (async) + PostgreSQL on the backend; React + TypeScript + Vite,
TanStack Query, Tailwind CSS + daisyUI and i18next on the frontend. The frontend API client is
generated from the backend's OpenAPI schema.

## Running it

With Docker (API, web and PostgreSQL):

```bash
cp .env.example .env   # optional: every value has a default
docker compose up --build
```

Open <http://localhost:8081> (change it with `WEB_PORT`). The API applies its database
migrations on start.

For development, run the database with `docker compose up db`, then:

```bash
cd backend && uv sync && uv run alembic upgrade head && uv run uvicorn app.main:app --reload
cd frontend && npm install && npm run dev   # http://localhost:5173, proxies /api to :8000
```

## Checks

```bash
cd backend && uv run ruff check . && uv run ruff format --check . && uv run mypy && uv run pytest
cd frontend && npm run lint && npm run format:check && npm run typecheck && npm test && npm run test:e2e
npm --prefix frontend run api:generate   # after any backend API change
```

Backend tests start PostgreSQL with Testcontainers (Docker required) once per run. Playwright
tests mock the API in the browser, so they need no backend.
