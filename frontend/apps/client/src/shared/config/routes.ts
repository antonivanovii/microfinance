export const ROUTES = {
  landing: '/',
  login: '/login',
  loginCode: '/login/code',
  application: '/application',
  /* Экраны из макетов 04 и 05 — маршруты заведены, экраны ещё не собраны. */
  decision: '/decision',
  home: '/home',
  legal: (document: LegalDocument) => `/legal/${document}`,
} as const

export const LEGAL_DOCUMENTS = {
  terms: 'Общие условия договора',
  tariffs: 'Тарифы и ПСК',
  pep: 'Соглашение об использовании ПЭП',
  privacy: 'Обработка персональных данных',
  complaints: 'Порядок подачи обращений',
  contacts: 'Контакты',
} as const

export type LegalDocument = keyof typeof LEGAL_DOCUMENTS

export const isLegalDocument = (value: string): value is LegalDocument =>
  Object.hasOwn(LEGAL_DOCUMENTS, value)
