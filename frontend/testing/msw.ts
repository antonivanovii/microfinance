import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from '../mocks/client/node'
import { resetDb } from '../mocks/db'

export function setupMockApi(): void {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })
  afterEach(() => {
    server.resetHandlers()
    resetDb()
  })
  afterAll(() => {
    server.close()
  })
}
