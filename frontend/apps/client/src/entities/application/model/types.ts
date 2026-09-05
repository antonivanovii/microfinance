import type { Quote } from '@shared/model'

export type StepId =
  'loan-params' | 'personal' | 'passport' | 'address' | 'employment' | 'payout' | 'consents'

export interface StepDescriptor {
  id: StepId
  title: string
  index: number
  total: number
}

export interface ApplicationDraft {
  id: string
  status: 'draft' | 'submitted'
  /** null — анкета пройдена. Какой шаг следующий, решает сервер. */
  currentStep: StepDescriptor | null
  completedSteps: StepId[]
  quote: Quote | null
  savedAt: string | null
  values: Record<string, unknown>
  card: { brand: string; last4: string } | null
}

export interface AddressSuggestion {
  value: string
  postalCode: string
  city: string
}

export interface PassportFields {
  series: string
  number: string
  issuedAt: string
  issuedBy: string
}
