import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { ROUTES } from '@shared/config'

// Воронка и лендинг почти не пересекаются по коду: человек, пришедший
// с телефона на лендинг, не должен тянуть бандл входа.
const routes: RouteObject[] = [
  {
    path: ROUTES.landing,
    lazy: async () => ({ Component: (await import('@pages/landing')).LandingPage }),
  },
  {
    path: ROUTES.login,
    lazy: async () => ({ Component: (await import('@pages/login')).LoginPage }),
  },
  {
    path: ROUTES.loginCode,
    lazy: async () => ({ Component: (await import('@pages/login-code')).LoginCodePage }),
  },
  {
    path: ROUTES.application,
    lazy: async () => ({ Component: (await import('@pages/application')).ApplicationPage }),
  },
  {
    path: '/legal/:document',
    lazy: async () => ({ Component: (await import('@pages/legal')).LegalPage }),
  },
  {
    path: '*',
    lazy: async () => ({ Component: (await import('@pages/not-found')).NotFoundPage }),
  },
]

export const router = createBrowserRouter([
  {
    // Корневой маршрут без пути: держит общий фолбэк на время загрузки
    // чанка первого экрана. Без него роутер ругается на гидратацию.
    HydrateFallback: () => null,
    children: routes,
  },
])
