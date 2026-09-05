import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { env } from '@shared/config'
import { AppProviders } from './providers'
import { router } from './router'
import './styles/global.css'

async function startMocks(): Promise<void> {
  if (!env.enableMocks) return
  const { worker } = await import('@mocks/client/browser')
  await worker.start({
    onUnhandledRequest: 'warn',
    serviceWorker: { url: '/mockServiceWorker.js' },
  })
}

async function bootstrap(): Promise<void> {
  // До первого рендера: иначе стартовые запросы уйдут мимо воркера.
  await startMocks()

  const container = document.getElementById('root')
  if (!container) throw new Error('Не найден #root')

  createRoot(container).render(
    <StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </StrictMode>,
  )
}

void bootstrap()
