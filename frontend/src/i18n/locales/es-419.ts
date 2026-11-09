import type { Translation } from './en'

/** Latin American Spanish texts. */
export const es419: Translation = {
  app: {
    name: 'ParcelFlow',
    demoNotice: 'Proyecto de práctica: los pagos y las notificaciones son simulados.',
  },
  language: {
    label: 'Idioma',
    en: 'English',
    'es-419': 'Español (Latinoamérica)',
  },
  theme: {
    toLight: 'Cambiar al tema claro',
    toDark: 'Cambiar al tema oscuro',
  },
  nav: {
    logIn: 'Ingresar',
    signUp: 'Registrarse',
    logOut: 'Cerrar sesión',
    myPanel: 'Mi panel',
  },
  roles: {
    customer: 'Cliente',
    courier: 'Repartidor',
    admin: 'Administrador',
  },
  home: {
    title: 'Envíos locales, seguidos desde el retiro hasta la puerta.',
    subtitle:
      'Pedí un envío, recibí una cotización al instante y seguí a tu repartidor en el mapa. Repartidores y administradores gestionan todo desde el mismo lugar.',
    comingSoon: 'Próximamente',
    roles: {
      customer: {
        title: 'Clientes',
        description: 'Creá envíos, elegí franjas de retiro y entrega, pagá y seguilos.',
      },
      courier: {
        title: 'Repartidores',
        description: 'Recibí nuevos servicios, seguí la mejor ruta y confirmá cada entrega.',
      },
      admin: {
        title: 'Administradores',
        description: 'Asigná pedidos, definí tarifas, gestioná usuarios y revisá el desempeño.',
      },
    },
  },
  auth: {
    fields: {
      email: 'Email',
      password: 'Contraseña',
      fullName: 'Nombre completo',
      country: 'País',
    },
    passwordHint: 'Al menos 10 caracteres. Una frase corta es fácil de recordar.',
    logIn: {
      title: 'Ingresar',
      submit: 'Ingresar',
      noAccount: '¿No tenés cuenta?',
      signUpLink: 'Registrate',
    },
    signUp: {
      title: 'Creá tu cuenta',
      subtitle:
        'Solo cuentas de cliente: los repartidores y administradores los crea un administrador.',
      submit: 'Crear cuenta',
      haveAccount: '¿Ya tenés cuenta?',
      logInLink: 'Ingresá',
    },
    demo: {
      title: 'Probá la demo',
      description: 'Ingresá con un clic como cliente, repartidor o administrador de prueba.',
      country: 'País de la demo',
      logInAs: 'Ingresar como {{role}}',
    },
  },
  dashboard: {
    welcome: '¡Hola, {{name}}!',
    signedInAs: 'Ingresaste como {{role}} en {{country}}.',
    comingSoon: 'Tu espacio de trabajo está en camino: acá van a aparecer las próximas funciones.',
  },
  apiStatus: {
    checking: 'Verificando el servicio…',
    online: 'Servicio en línea',
    offline: 'Servicio no disponible',
  },
  notFound: {
    title: 'Página no encontrada',
    back: 'Volver al inicio',
  },
  forbidden: {
    title: 'No tenés acceso a esta página',
    back: 'Ir a mi panel',
  },
  validation: {
    required: 'Obligatorio.',
    email: 'Ingresá un email válido.',
    passwordTooShort: 'Usá al menos 10 caracteres.',
    passwordTooLong: 'Usá como máximo 128 caracteres.',
    tooLong: 'Demasiado largo.',
  },
  errors: {
    tooManyRequests: 'Demasiadas solicitudes. Esperá un momento y volvé a intentar.',
    server: 'El servicio no está disponible en este momento. Intentá más tarde.',
    network: 'No se pudo conectar con el servidor. Revisá tu conexión y volvé a intentar.',
    invalid_credentials: 'Email o contraseña incorrectos.',
    email_taken: 'Ya existe una cuenta con este email.',
    not_authenticated: 'Tu sesión terminó. Volvé a ingresar.',
    forbidden: 'No tenés permiso para hacer esto.',
    demo_disabled: 'La demo no está disponible.',
    demo_account_missing: 'Esta cuenta de prueba no está disponible.',
    invalidData: 'Algunos campos no son válidos. Revisalos y volvé a intentar.',
  },
}
