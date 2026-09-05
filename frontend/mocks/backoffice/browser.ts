import { setupWorker } from 'msw/browser'
import { backofficeHandlers } from './handlers'

export const worker = setupWorker(...backofficeHandlers)
