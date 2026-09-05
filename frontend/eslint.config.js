import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import boundaries from 'eslint-plugin-boundaries'
import prettier from 'eslint-config-prettier'

/**
 * FSD layers, top to bottom. A layer may import only from layers strictly below it.
 */
const LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']

/**
 * Политики зависимостей: слой видит только слои ниже себя, только в своём
 * приложении и только через публичный index. Всё остальное — ошибка.
 */
const layerPolicies = [
  // Файлы внутри одного элемента ходят друг к другу свободно.
  { allow: { dependency: { relationship: { from: 'internal' } } } },

  // Сегменты shared собираются друг из друга: api берёт конфиг, ui — хелперы
  // из lib. Это единственный слой, где горизонтальная связь легальна, но и
  // здесь — только через публичный index.
  {
    from: { element: { type: 'shared' } },
    allow: {
      to: {
        element: {
          type: 'shared',
          captured: { app: '{{from.app}}' },
          fileInternalPath: ['index.ts', 'index.tsx'],
        },
      },
    },
  },

  ...LAYERS.slice(0, -1).map((layer, index) => ({
    from: { element: { type: layer } },
    allow: {
      to: {
        element: {
          types: { anyOf: LAYERS.slice(index + 1) },
          // Один клиент не тянет код другого.
          captured: { app: '{{from.app}}' },
          // Публичный API слайса — только index. Внутренности приватны.
          fileInternalPath: ['index.ts', 'index.tsx'],
        },
      },
    },
  })),
]

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'node_modules/**',
      'apps/*/public/mockServiceWorker.js',
      'design-system/assets/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  {
    languageOptions: {
      ecmaVersion: 2023,
      globals: { ...globals.browser, ...globals.es2021 },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    settings: {
      // Без резолвера алиасов плагин не видит, куда ведёт '@features/...',
      // считает импорт внешним и молча пропускает — правило границ становится
      // декоративным. Проверяется тем, что заведомое нарушение действительно падает.
      'import/resolver': {
        // Корневой solution-конфиг: резолвер сам идёт по references
        // в конфиги приложений.
        typescript: { project: './tsconfig.json' },
      },
      'boundaries/include': ['apps/*/src/**/*'],
      'boundaries/elements': [
        // Слой app — композиционный корень, он один на приложение и не режется
        // на слайсы: провайдеры, роутер и точка входа обязаны видеть друг друга.
        { type: 'app', pattern: 'apps/*/src/app', capture: ['app'] },
        ...LAYERS.filter((layer) => layer !== 'app').map((layer) => ({
          type: layer,
          pattern: `apps/*/src/${layer}/*`,
          capture: ['app', 'slice'],
        })),
      ],
    },
    plugins: { boundaries },
    rules: {
      // --- Деньги -------------------------------------------------------
      // Суммы приходят с сервера посчитанными, в минорных единицах, строкой.
      // Тип Money (design-system/lib/money.ts) не даёт складывать их в TS;
      // это добивает единственную дырку — приведение строки к float.
      'no-restricted-globals': [
        'error',
        {
          name: 'parseFloat',
          message:
            'Арифметика с деньгами на фронте запрещена. Суммы приходят посчитанными, см. design-system/lib/money.ts',
        },
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'Number',
          property: 'parseFloat',
          message:
            'Арифметика с деньгами на фронте запрещена. Суммы приходят посчитанными, см. design-system/lib/money.ts',
        },
      ],

      // --- FSD ----------------------------------------------------------
      'boundaries/dependencies': ['error', { default: 'disallow', policies: layerPolicies }],

      // --- Прочее --------------------------------------------------------
      // Тесты сравнивают вывод Intl, а он содержит неразрывные пробелы.
      'no-irregular-whitespace': ['error', { skipComments: true, skipStrings: true }],

      // --- TS -----------------------------------------------------------
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },

  reactHooks.configs.flat['recommended-latest'],
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-refresh': reactRefresh },
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // Конфиги и тулинг — вне FSD и вне браузера.
  {
    files: ['*.{ts,js}', 'e2e/**/*.ts', 'mocks/**/*.ts', 'apps/*/vite.config.ts'],
    languageOptions: { globals: { ...globals.node } },
    rules: {
      'boundaries/dependencies': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },

  // Тесты.
  {
    files: ['**/*.{test,spec}.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}', 'e2e/**/*.ts'],
    languageOptions: { globals: { ...globals.node } },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/unbound-method': 'off',
      // `() => {}` как заглушка обязательного пропа — нормальная запись в тесте.
      '@typescript-eslint/no-empty-function': 'off',
      'boundaries/dependencies': 'off',
    },
  },

  // Конфиг ESLint — обычный JS вне tsconfig, типизированные правила к нему
  // применить нельзя.
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: { globals: { ...globals.node } },
    ...tseslint.configs.disableTypeChecked,
  },

  prettier,
)
