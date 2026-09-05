interface ImportMetaEnv {
  readonly VITE_BACKOFFICE_API_URL?: string
  readonly VITE_ENABLE_MOCKS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
