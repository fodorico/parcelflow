# Open questions

- **Countries:** operating areas are defined per country. Which countries for the demo
  (e.g. Argentina, United States, Spain)? Does each country set the default currency (ARS, USD,
  EUR), or can a customer pay any shipment in any of the three? Is "local" any shipment inside
  one country, or inside one city of that country?
- **Exchange rates:** do we show quotes in another currency (mocked exchange rates), or is each
  shipment priced only in its country's currency?
- **Pricing model:** how is a quote calculated (base fee + distance, zones, package size/weight,
  time-slot surcharge, urgency)?
- **Real-time transport:** WebSockets vs. Server-Sent Events for live tracking.
- **Deployment:** where to host the demo for the portfolio (CD is not standardized yet).
- **Demo data:** seed users per role and sample shipments so the portfolio demo works out of the
  box?
