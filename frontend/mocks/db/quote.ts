import type { CalculatorParams, Quote } from './schema'

const DAILY_RATE_BP = 80n
const BP = 10_000n

const rub = (amount: bigint) => ({ amount: amount.toString(), currency: 'RUB' as const })

const STEP = 1_000_00n
const MIN = 3_000_00n
const MAX = 30_000_00n

export const PARAMS: CalculatorParams = {
  amounts: Array.from({ length: Number((MAX - MIN) / STEP) + 1 }, (_, i) =>
    rub(MIN + STEP * BigInt(i)),
  ),
  defaultAmountIndex: 12,
  terms: [
    { days: 7, label: '7 дней' },
    { days: 14, label: '14 дней' },
    { days: 21, label: '21 день' },
    { days: 30, label: '30 дней' },
  ],
  defaultTermDays: 14,
}

/**
 * Считает мок-BFF, не фронт: на клиенте арифметика с деньгами запрещена.
 * HALF_UP на целых копейках, как @org/money на бэке.
 */
export function quote(principalMinor: string, termDays: number, interestFree: boolean): Quote {
  const principal = BigInt(principalMinor)
  const interest = interestFree
    ? 0n
    : (principal * DAILY_RATE_BP * BigInt(termDays) * 2n + BP) / (BP * 2n)

  const dueDate = new Date()
  dueDate.setHours(12, 0, 0, 0)
  dueDate.setDate(dueDate.getDate() + termDays)

  return {
    principal: rub(principal),
    interest: rub(interest),
    totalDue: rub(principal + interest),
    dueDate: dueDate.toISOString().slice(0, 10),
    termDays,
    fullCostRate: interestFree ? '0.000' : '292.000',
    interestFree,
  }
}
