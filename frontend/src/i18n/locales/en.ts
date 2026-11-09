/** English texts. The source of truth for the translation keys: every locale must match it. */
export const en = {
  app: {
    name: 'ParcelFlow',
    demoNotice: 'Practice project: payments and notifications are simulated.',
  },
  language: {
    label: 'Language',
    en: 'English',
    'es-419': 'Español (Latinoamérica)',
  },
  theme: {
    toLight: 'Switch to light theme',
    toDark: 'Switch to dark theme',
  },
  home: {
    title: 'Local deliveries, tracked from pickup to doorstep.',
    subtitle:
      'Request a shipment, get an instant quote and follow your courier on the map. Couriers and administrators manage everything from the same place.',
    comingSoon: 'Coming soon',
    roles: {
      customer: {
        title: 'Customers',
        description: 'Create shipments, choose pickup and delivery slots, pay and track them.',
      },
      courier: {
        title: 'Couriers',
        description: 'Receive new jobs, follow the best route and confirm each delivery.',
      },
      admin: {
        title: 'Administrators',
        description: 'Assign orders, set rates, manage users and review performance.',
      },
    },
  },
  apiStatus: {
    checking: 'Checking the service…',
    online: 'Service online',
    offline: 'Service unavailable',
  },
  notFound: {
    title: 'Page not found',
    back: 'Back to home',
  },
  errors: {
    tooManyRequests: 'Too many requests. Wait a moment and try again.',
    server: 'The service is not available right now. Try again later.',
    network: 'Could not reach the server. Check your connection and try again.',
  },
}

/** The shape every locale must have: the same keys as English, any text. */
export type Translation = typeof en
