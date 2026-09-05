import { defineConfig, devices } from '@playwright/test'

const CLIENT_PORT = 5173
const BACKOFFICE_PORT = 5174

/**
 * E2E поверх MSW: бэкенда нет, сценарии гоняются против мок-BFF.
 *
 * Два проекта, потому что приложения живут в разных контурах и профилях:
 * воронка проверяется на телефоне, бэк-офис — на десктопе.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: process.env.CI ? [['github'], ['html']] : [['list']],

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    locale: 'ru-RU',
    timezoneId: 'Europe/Moscow',
  },

  projects: [
    {
      name: 'client',
      testMatch: /client\/.*\.spec\.ts/,
      use: { ...devices['Pixel 7'], baseURL: `http://localhost:${String(CLIENT_PORT)}` },
    },
    {
      name: 'backoffice',
      testMatch: /backoffice\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${String(BACKOFFICE_PORT)}` },
    },
  ],

  webServer: [
    {
      command: 'pnpm run dev:client',
      port: CLIENT_PORT,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'pnpm run dev:backoffice',
      port: BACKOFFICE_PORT,
      reuseExistingServer: !process.env.CI,
    },
  ],
})
