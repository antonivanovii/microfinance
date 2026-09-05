import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

const feRoot = fileURLToPath(new URL('.', import.meta.url))

const appProject = (name: 'client' | 'backoffice') => {
  const srcRoot = `${feRoot}apps/${name}/src`
  return {
    extends: `./apps/${name}/vite.config.ts`,
    test: {
      name,
      environment: 'jsdom',
      globals: true,
      setupFiles: [`${feRoot}testing/setup.ts`],
      include: [`apps/${name}/src/**/*.{test,spec}.{ts,tsx}`],
    },
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
        '@testing': `${feRoot}testing`,
      },
    },
  }
}

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'design-system',
          environment: 'jsdom',
          globals: true,
          setupFiles: [`${feRoot}testing/setup.ts`],
          include: ['design-system/**/*.{test,spec}.{ts,tsx}', 'mocks/**/*.{test,spec}.ts'],
        },
        resolve: { alias: { '@ds': `${feRoot}design-system`, '@mocks': `${feRoot}mocks` } },
      },
      appProject('client'),
      appProject('backoffice'),
    ],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      exclude: ['**/index.ts', '**/*.config.ts', 'e2e/**', 'mocks/**', 'dist/**'],
    },
  },
})
