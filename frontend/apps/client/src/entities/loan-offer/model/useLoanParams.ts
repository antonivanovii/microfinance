import { create } from 'zustand'
import { useCalculatorParams, useQuote } from './queries'

interface SelectionState {
  amountIndex: number | null
  termDays: number | null
  setAmountIndex: (index: number) => void
  setTermDays: (days: number) => void
}

/**
 * Выбор на шкале живёт в сторе, а не в состоянии компонента: его читают
 * калькулятор на лендинге, первый шаг анкеты и боковая сводка. Заодно
 * параметры сами переезжают с лендинга в воронку — клиент их подтверждает,
 * а не вводит заново.
 */
const useSelection = create<SelectionState>((set) => ({
  amountIndex: null,
  termDays: null,
  setAmountIndex: (amountIndex) => {
    set({ amountIndex })
  },
  setTermDays: (termDays) => {
    set({ termDays })
  },
}))

export function useLoanParams() {
  const params = useCalculatorParams()
  const { amountIndex, termDays, setAmountIndex, setTermDays } = useSelection()

  const data = params.data
  const index = amountIndex ?? data?.defaultAmountIndex ?? 0
  const term = termDays ?? data?.defaultTermDays ?? 0
  const amount = data?.amounts[index]

  const quote = useQuote(amount, data ? term : undefined)

  return { params, quote, amount, amountIndex: index, termDays: term, setAmountIndex, setTermDays }
}
