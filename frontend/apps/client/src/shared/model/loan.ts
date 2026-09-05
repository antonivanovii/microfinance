import type { Money } from '@ds/lib'

/**
 * Условия займа в том виде, в каком их считает сервер. Тип нужен и заявке,
 * и предложению, поэтому живёт ниже обоих — в shared, а не в одной из сущностей.
 */
export interface Quote {
  principal: Money
  totalDue: Money
  interest: Money
  dueDate: string
  termDays: number
  fullCostRate: string
  interestFree: boolean
}

export interface LoanTerm {
  days: number
  label: string
}

export interface CalculatorParams {
  /** Шкала сумм: слайдер ходит по индексам, не по рублям. */
  amounts: Money[]
  defaultAmountIndex: number
  terms: LoanTerm[]
  defaultTermDays: number
}
