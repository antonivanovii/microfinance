import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type UserConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

const feRoot = fileURLToPath(new URL('.', import.meta.url))

type AppName = 'client' | 'backoffice'

interface AppConfig {
  /** Folder under apps/ */
  name: AppName
  /** Dev-server port. Fixed per app so MSW, Playwright and CORS setups stay predictable. */
  port: number
}

/**
 * Shared Vite setup for both clients.
 *
 * React Compiler runs through Babel (the official, non-experimental path) rather
 * than the Rust port — a money product is the wrong place to sit on an
 * experimental compiler backend.
 */
export function createAppConfig({ name, port }: AppConfig): UserConfig {
  const appRoot = fileURLToPath(new URL(`./apps/${name}/`, import.meta.url))
  const srcRoot = `${appRoot}src`

  return defineConfig({
    root: appRoot,
    envDir: feRoot,
    /*
      Свой кэш пре-бандлинга на приложение. По умолчанию это общий
      node_modules/.vite: два дев-сервера, поднятые одновременно, затирают
      оптимизацию друг друга и отдают 504 Outdated Optimize Dep.
    */
    cacheDir: `${feRoot}node_modules/.vite/${name}`,
    plugins: [
      react(),
      // reactCompilerPreset сам ограничивает себя нужными файлами через
      // rolldown.filter — свой include здесь только сломал бы его.
      babel({ presets: [reactCompilerPreset()] }),
    ],
    resolve: {
      alias: {
        '@app': `${srcRoot}/app`,
        '@pages': `${srcRoot}/pages`,
        '@widgets': `${srcRoot}/widgets`,
        '@features': `${srcRoot}/features`,
        '@entities': `${srcRoot}/entities`,
        '@shared': `${srcRoot}/shared`,
        '@ds': `${feRoot}design-system`,
        '@mocks': `${feRoot}mocks`,
      },
    },
    css: {
      modules: {
        generateScopedName:
          process.env.NODE_ENV === 'production'
            ? '[hash:base64:8]'
            : '[name]__[local]___[hash:base64:5]',
      },
    },
    server: {
      port,
      strictPort: true,
      // design-system/ and mocks/ live outside the app root.
      fs: { allow: [feRoot] },
    },
    preview: { port: port + 1000, strictPort: true },
    build: {
      outDir: `${feRoot}dist/${name}`,
      emptyOutDir: true,
      sourcemap: true,
      target: 'es2022',
    },
  })
}
