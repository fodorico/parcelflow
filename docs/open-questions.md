# Open questions

- **Currencies:** which currencies to support first? Is the currency chosen per customer, per
  operating city/zone, or per shipment? Do we need mocked exchange rates (e.g. show a quote in
  another currency)?
- **Operating area:** which city/country is the "local" area for the demo (affects default
  currency, map center, addresses)?
- **Map provider:** Google Maps (needs an API key and billing account) vs. an open option
  (OpenStreetMap + Leaflet/MapLibre, OSRM/Valhalla for routing). Leaning towards open/free for a
  practice project.
- **Pricing model:** how is a quote calculated (base fee + distance, zones, package size/weight,
  time-slot surcharge, urgency)?
- **Real-time transport:** WebSockets vs. Server-Sent Events for live tracking.
- **Deployment:** where to host the demo for the portfolio (CD is not standardized yet).
- **Demo data:** seed users per role and sample shipments so the portfolio demo works out of the
  box?
