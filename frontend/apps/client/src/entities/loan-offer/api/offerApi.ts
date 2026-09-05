import { money, type Money } from '@ds/lib'
import { api } from '@shared/api'
import type { CalculatorParams, Quote } from '../model/types'

interface MoneyDto {
  amount: string
  currency: 'RUB'
}

const toMoney = (dto: MoneyDto): Money => money(dto.amount, dto.currency)

export async function fetchCalculatorParams(signal: AbortSignal): Promise<CalculatorParams> {
  const { data } = await api.get<{
    amounts: MoneyDto[]
    defaultAmountIndex: number
    terms: { days: number; label: string }[]
    defaultTermDays: number
  }>('/calculator/params', { signal })

  return { ...data, amounts: data.amounts.map(toMoney) }
}

export async function fetchQuote(
  params: { amount: string; termDays: number },
  signal: AbortSignal,
): Promise<Quote> {
  const { data } = await api.get<{
    principal: MoneyDto
    totalDue: MoneyDto
    interest: MoneyDto
    dueDate: string
    termDays: number
    fullCostRate: string
    interestFree: boolean
  }>('/calculator/quote', {
    params: { amount: params.amount, termDays: params.termDays },
    signal,
  })

  return {
    ...data,
    principal: toMoney(data.principal),
    totalDue: toMoney(data.totalDue),
    interest: toMoney(data.interest),
  }
}
