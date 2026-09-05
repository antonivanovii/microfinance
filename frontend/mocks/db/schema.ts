export interface MoneyDto {
  amount: string
  currency: 'RUB'
}

export interface CalculatorParams {
  amounts: MoneyDto[]
  defaultAmountIndex: number
  terms: { days: number; label: string }[]
  defaultTermDays: number
}

export interface Quote {
  principal: MoneyDto
  totalDue: MoneyDto
  interest: MoneyDto
  dueDate: string
  termDays: number
  fullCostRate: string
  /** Первый займ без процентов — сервер решает, не фронт. */
  interestFree: boolean
}

export interface OtpChallenge {
  challengeId: string
  phone: string
  resendAfterSeconds: number
  attemptsLeft: number
  codeLength: number
  /** Мок отдаёт код наружу, чтобы экран показал превью SMS как в макете. */
  previewCode: string
}

export type SessionStatus = 'anonymous' | 'authenticated'

export interface Session {
  status: SessionStatus
  customerId: string | null
  /** Есть ли уже займы: повторный клиент идёт в кабинет, новый — в анкету. */
  returning: boolean
}
