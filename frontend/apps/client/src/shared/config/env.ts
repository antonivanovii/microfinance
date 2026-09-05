interface AppEnv {
  readonly apiBaseUrl: string
  readonly enableMocks: boolean
  readonly isProduction: boolean
}

export const env: AppEnv = {
  apiBaseUrl: import.meta.env.VITE_CLIENT_API_URL ?? '/api',
  enableMocks: import.meta.env.VITE_ENABLE_MOCKS !== 'false',
  isProduction: import.meta.env.PROD,
}
