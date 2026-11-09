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
  apiStatus: {
    checking: 'Verificando el servicio…',
    online: 'Servicio en línea',
    offline: 'Servicio no disponible',
  },
  notFound: {
    title: 'Página no encontrada',
    back: 'Volver al inicio',
  },
  errors: {
    tooManyRequests: 'Demasiadas solicitudes. Esperá un momento y volvé a intentar.',
    server: 'El servicio no está disponible en este momento. Intentá más tarde.',
    network: 'No se pudo conectar con el servidor. Revisá tu conexión y volvé a intentar.',
  },
}
