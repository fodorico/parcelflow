# ParcelFlow — project rules

These rules take precedence over `~/Proyectos/CLAUDE.md` for this project.

## Purpose

- Practice and portfolio project, inspired by a real client brief (`docs/brief.md`).
- It must **look** production-ready, but nothing real is charged, sent or tracked unless a
  decision in `docs/decisions.md` says otherwise.

## Scope rules

- **Web only.** The courier app is a responsive web app (PWA-friendly: geolocation, camera),
  never a native/store app.
- **Payments are always mocked** behind a provider interface, so a real gateway could be plugged
  in later without touching business logic.
- External providers (maps, email, SMS, push) also go behind interfaces with a mock/dev
  implementation; real providers are optional and configured via `.env`.
- **Local shipments first.** National and international shipments come later (see
  `docs/ideas.md`); don't design them in until the roadmap says so, but don't block them either.
- **Multiple currencies from the start:** store money as integer minor units + ISO 4217 currency
  code, never floats.

## Internationalization

- UI available in English (`en`) and Latin American Spanish (`es-419`) from day one.
- No hard-coded user-facing strings: every UI and notification text goes through the i18n layer,
  with both translations added in the same change.
- Dates, numbers and currencies are formatted per locale.

## Stack

- Starter project v2 (`~/Proyectos/docs/starter-project.md`).

## Project state

- `docs/roadmap.md`: phases and current status.
- `docs/decisions.md`: decisions taken and why.
- `docs/open-questions.md`: questions waiting for an answer.
- `docs/ideas.md`: future ideas and out-of-scope items to revisit.
