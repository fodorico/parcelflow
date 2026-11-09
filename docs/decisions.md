# Decisions

| Date | Decision | Why |
|---|---|---|
| 2026-11-08 | Project name: ParcelFlow (`parcelflow`) | Chosen by Claude; the owner had no preference |
| 2026-11-08 | Practice and portfolio project, based on a real client brief | Learning goal; no real client delivery |
| 2026-11-08 | All payments are mocked, but must look real | No real money involved; keep a provider interface for a future real gateway |
| 2026-11-08 | Web only; the courier app is a responsive web app, no native/store app | Practice scope |
| 2026-11-08 | UI in English and Latin American Spanish (`es-419`) | Owner's request |
| 2026-11-08 | Start with local shipments only; national and international later | Incremental scope |
| 2026-11-08 | Multiple currencies supported from the start | Owner's request |
| 2026-11-08 | Stack: starter project v2 | Workspace default for new full-stack apps |
| 2026-11-08 | Currencies: ARS, USD and EUR | The basic set the owner wants first |
| 2026-11-08 | Operating areas are defined per country | Owner's choice for "local" shipments |
| 2026-11-08 | Demo countries: Argentina, United States and Spain | Owner's choice |
| 2026-11-08 | Each country sets its currency: Argentina → ARS, United States → USD, Spain → EUR | Owner's choice; a shipment is priced in its country's currency |
| 2026-11-08 | A "local" shipment is any shipment inside one country, across its administrative divisions (provinces/states, municipalities, cities); never across countries | Owner's definition; cross-border shipments are the "international" phase |
| 2026-11-08 | Maps: OpenStreetMap-based provider instead of Google Maps | Free, no API key or billing account; kept behind an interface |
| 2026-11-08 | Public repository | Owner's request: public repos get rulesets and GitHub features on the free plan |
| 2026-11-08 | i18n with i18next + react-i18next; translation keys typed from the English file, and a test checks every locale has the same keys | Missing or misspelled texts fail the build instead of showing raw keys |
| 2026-11-08 | Any Spanish browser locale (es, es-AR, es-MX…) maps to `es-419`; anything else to `en` | Only two UI languages |
| 2026-11-08 | i18next 26 / react-i18next 17 instead of the new majors (27 / 18) | The new majors were released 1–2 days before; Dependabot will propose them once they settle |
| 2026-11-08 | No LLM SDK in the backend (starter v2 lists `anthropic`) | No feature needs it yet |
| 2026-11-08 | Web served on host port 8080 (`WEB_PORT`); the `claude-platform-101` containers were stopped to free it | Owner's request |
