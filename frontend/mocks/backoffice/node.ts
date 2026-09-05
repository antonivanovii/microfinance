import { setupServer } from 'msw/node'
import { backofficeHandlers } from './handlers'

/** Тот же мок-BFF, что в браузере, — для vitest. */
export const server = setupServer(...backofficeHandlers)
