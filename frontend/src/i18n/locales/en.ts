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
  nav: {
    logIn: 'Log in',
    signUp: 'Sign up',
    logOut: 'Log out',
    myPanel: 'My panel',
  },
  roles: {
    customer: 'Customer',
    courier: 'Courier',
    admin: 'Administrator',
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
  auth: {
    fields: {
      email: 'Email',
      password: 'Password',
      fullName: 'Full name',
      country: 'Country',
    },
    passwordHint: 'At least 10 characters. A short phrase is easy to remember.',
    logIn: {
      title: 'Log in',
      submit: 'Log in',
      noAccount: "Don't have an account?",
      signUpLink: 'Sign up',
    },
    signUp: {
      title: 'Create your account',
      subtitle: 'Customer accounts only: couriers and administrators are created by an admin.',
      submit: 'Create account',
      haveAccount: 'Already have an account?',
      logInLink: 'Log in',
    },
    demo: {
      title: 'Try the demo',
      description: 'Log in with one click as a demo customer, courier or administrator.',
      country: 'Demo country',
      logInAs: 'Log in as {{role}}',
    },
  },
  dashboard: {
    welcome: 'Hi, {{name}}!',
    signedInAs: 'You are signed in as {{role}} in {{country}}.',
    comingSoon: 'Your workspace is on its way: this is where the next features will appear.',
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
  forbidden: {
    title: "You don't have access to this page",
    back: 'Go to my panel',
  },
  validation: {
    required: 'Required.',
    email: 'Enter a valid email address.',
    passwordTooShort: 'Use at least 10 characters.',
    passwordTooLong: 'Use at most 128 characters.',
    tooLong: 'Too long.',
  },
  errors: {
    tooManyRequests: 'Too many requests. Wait a moment and try again.',
    server: 'The service is not available right now. Try again later.',
    network: 'Could not reach the server. Check your connection and try again.',
    invalid_credentials: 'Incorrect email or password.',
    email_taken: 'There is already an account with this email.',
    not_authenticated: 'Your session has ended. Log in again.',
    forbidden: "You don't have permission to do this.",
    demo_disabled: 'The demo is not available.',
    demo_account_missing: 'This demo account is not available.',
    invalidData: 'Some fields are not valid. Check them and try again.',
  },
}

/** The shape every locale must have: the same keys as English, any text. */
export type Translation = typeof en
