import type { MoneyDto, Quote } from './schema'

export type StepId =
  'loan-params' | 'personal' | 'passport' | 'address' | 'employment' | 'payout' | 'consents'

export interface StepDescriptor {
  id: StepId
  title: string
  /** Позиция в текущей ветке, с единицы. Ветвление решает сервер. */
  index: number
  total: number
}

export type DraftStatus = 'draft' | 'submitted'

export interface ApplicationDraft {
  id: string
  status: DraftStatus
  currentStep: StepDescriptor | null
  completedSteps: StepId[]
  quote: Quote | null
  /** Когда черновик последний раз сохранён — для экрана восстановления. */
  savedAt: string | null
  values: Record<string, unknown>
  card: { brand: string; last4: string } | null
}

export const STEP_TITLES: Record<StepId, string> = {
  'loan-params': 'Параметры займа',
  personal: 'Личные данные',
  passport: 'Паспорт',
  address: 'Адрес',
  employment: 'Работа и доход',
  payout: 'Способ получения',
  consents: 'Согласия',
}

/** Полная ветка. Предзаполнение через Госуслуги вырезает три шага. */
export const FULL_FLOW: StepId[] = [
  'loan-params',
  'personal',
  'passport',
  'address',
  'employment',
  'payout',
  'consents',
]

export const ESIA_FLOW: StepId[] = ['loan-params', 'personal', 'employment', 'payout', 'consents']

export interface AddressSuggestion {
  value: string
  postalCode: string
  city: string
}

export const ADDRESSES: AddressSuggestion[] = [
  { value: 'Разъезжая ул., 12', postalCode: '191002', city: 'Санкт-Петербург' },
  { value: 'Разъезжая ул., 26–28', postalCode: '191002', city: 'Санкт-Петербург' },
  { value: 'Разъезжая ул., 43', postalCode: '191002', city: 'Санкт-Петербург' },
]

export const EMPLOYERS: Record<string, string> = {
  '7812445990': 'ООО «Северная типография»',
  '7712345678': 'ООО МКК «Рублик»',
}

/** Данные, которые «распознаются» с фото паспорта. */
export const PASSPORT_OCR: Record<string, string> = {
  series: '4516',
  number: '872340',
  issuedAt: '2016-03-18',
  issuedBy: 'ОУФМС России по г. Санкт-Петербургу',
}

export type { MoneyDto }
