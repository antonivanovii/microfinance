import { setupServer } from 'msw/node'
import { clientHandlers } from './handlers'

/** Тот же мок-BFF, что в браузере, — для vitest. */
export const server = setupServer(...clientHandlers)
