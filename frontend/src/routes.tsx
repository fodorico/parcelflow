import type { RouteObject } from 'react-router'
import { Layout } from './components/Layout'
import { LoginPage } from './features/auth/LoginPage'
import { RequireAuth } from './features/auth/RequireAuth'
import { SignupPage } from './features/auth/SignupPage'
import { DashboardPage } from './pages/DashboardPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      {
        path: 'app',
        element: (
          <RequireAuth roles={['customer']}>
            <DashboardPage />
          </RequireAuth>
        ),
      },
      {
        path: 'courier',
        element: (
          <RequireAuth roles={['courier']}>
            <DashboardPage />
          </RequireAuth>
        ),
      },
      {
        path: 'admin',
        element: (
          <RequireAuth roles={['admin']}>
            <DashboardPage />
          </RequireAuth>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
