import { useQuery } from '@tanstack/react-query'
import type { Money } from '@ds/lib'
import { fetchCalculatorParams, fetchQuote } from '../api/offerApi'

export const offerKeys = {
  all: ['loan-offer'] as const,
  params: () => [...offerKeys.all, 'params'] as const,
  quote: (amount: string, termDays: number) =>
    [...offerKeys.all, 'quote', amount, termDays] as const,
}

export function useCalculatorParams() {
  return useQuery({
    queryKey: offerKeys.params(),
    queryFn: ({ signal }) => fetchCalculatorParams(signal),
    staleTime: 10 * 60_000,
  })
}

export function useQuote(amount: Money | undefined, termDays: number | undefined) {
  return useQuery({
    queryKey: offerKeys.quote(amount?.amount ?? '', termDays ?? 0),
    queryFn: ({ signal }) => fetchQuote({ amount: amount!.amount, termDays: termDays! }, signal),
    enabled: amount !== undefined && termDays !== undefined,
    // Расчёт меняется на каждый сдвиг ползунка — прошлый ответ держим,
    // чтобы карточка итога не мигала пустотой.
    placeholderData: (previous) => previous,
    staleTime: 60_000,
  })
}
