# Open questions

- **Exchange rates:** with one currency per country, do we ever need to show a quote in another
  currency (mocked exchange rates), e.g. for reports that add up all countries?
- **Address model:** administrative divisions differ by country (Argentina: provincia /
  partido or departamento / localidad; US: state / county / city; Spain: comunidad autónoma /
  provincia / municipio). Model a generic hierarchy, or a fixed set of levels per country?
- **Pricing model:** how is a quote calculated (base fee + distance, zones, package size/weight,
  time-slot surcharge, urgency)?
- **Real-time transport:** WebSockets vs. Server-Sent Events for live tracking.
- **Deployment:** where to host the demo for the portfolio (CD is not standardized yet).
- **Demo data:** seed users per role and sample shipments so the portfolio demo works out of the
  box?
