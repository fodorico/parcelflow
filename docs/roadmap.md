# Roadmap

Phased MVP. Each phase should be usable end to end before moving on.

| # | Phase | Status |
|---|---|---|
| 0 | Project setup | In progress |
| 1 | Foundation | Not started |
| 2 | Core shipment flow | Not started |
| 3 | Operations | Not started |
| 4 | Real-time tracking and routes | Not started |
| 5 | Integrations | Not started |
| 6 | Reports and metrics | Not started |

## 0. Project setup

- [x] Name, folder, docs and rules.
- [x] Private GitHub repo.
- [x] Scaffold with starter v2: backend (health check), frontend (home page in `en` and
  `es-419`, language and theme switchers), docker-compose, CI.
- [x] Make the repo public and protect `main` with `scripts/protect-main.sh`.
- [x] Public repo hardening (same settings as `claude-platform-101`). Interaction limits expire
  on 2027-05-09: renew them.
- [ ] Structured JSON logs + OpenTelemetry and Sentry (starter v2 items not in the reference app).

## 1. Foundation

- Authentication and roles: customer, courier, admin.
- i18n (`en`, `es-419`) wired in frontend and backend (emails/notifications).
- Currency model (minor units + ISO 4217) and locale formatting.
- Base layouts for the three roles, responsive.

## 2. Core shipment flow

- Customer creates a shipment: origin, destination, pickup and delivery time slots.
- Instant quote from admin-defined rates.
- Shipment status machine with history (created, picked up, in transit, delivered, cancelled…).
- Customer sees their shipments and status history.

## 3. Operations

- Admin assigns shipments to couriers; rate management; user management.
- Courier web app: assigned jobs, status updates, proof of delivery (signature + photo).
- In-app notifications of new jobs.

## 4. Real-time tracking and routes

- Courier location sharing from the browser; live map for customer and admin.
- Route optimization for the courier's jobs.
- Map provider behind an interface (see open questions).

## 5. Integrations (mocked)

- Payment gateway mock (checkout, success/failure, refunds).
- Email / SMS / push notifications (mock providers + dev inbox).

## 6. Reports and metrics

- Admin performance metrics (deliveries, times, couriers).
- Reports and data export (CSV / Excel).
