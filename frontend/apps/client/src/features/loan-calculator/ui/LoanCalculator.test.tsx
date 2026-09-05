import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { formatMoneyWhole, money } from '@ds/lib'
import { renderWithProviders } from '@testing/render'
import { setupMockApi } from '@testing/msw'
import { LoanCalculator } from './LoanCalculator'

setupMockApi()

// Intl отдаёт неразрывные пробелы. В атрибутах они остаются как есть,
// а getByText прогоняет DOM через нормализатор пробелов — отсюда две формы.
const rub = (minor: string) => formatMoneyWhole(money(minor), { symbol: true })
const rubText = (minor: string) => rub(minor).replace(/\s/g, ' ')

describe('Калькулятор', () => {
  it('показывает расчёт с сервера: итог, дату и ПСК', async () => {
    renderWithProviders(<LoanCalculator />)

    const total = await screen.findByText('Вернуть')
    const row = total.parentElement!

    // Первый займ без процентов: сервер вернул 0 %, к возврату ровно сумма.
    expect(within(row).getByText(rubText('1500000'))).toBeInTheDocument()
    expect(screen.getByText('0,000 %')).toBeInTheDocument()
    expect(screen.getByText('Дата платежа')).toBeInTheDocument()
  })

  it('срок переключается', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoanCalculator />)

    await screen.findByRole('radiogroup', { name: 'Срок займа' })
    expect(screen.getByRole('radio', { name: '14 дней' })).toBeChecked()

    await user.click(screen.getByRole('radio', { name: '30 дней' }))
    expect(screen.getByRole('radio', { name: '30 дней' })).toBeChecked()
  })

  it('слайдер ходит по шагам шкалы, а не по рублям', async () => {
    renderWithProviders(<LoanCalculator />)

    const slider = await screen.findByRole('slider', { name: 'Сумма займа' })
    expect(slider).toHaveAttribute('min', '0')
    expect(slider).toHaveAttribute('step', '1')
    expect(slider).toHaveAttribute('aria-valuetext', rub('1500000'))
  })

  it('сдвиг ползунка меняет сумму и итог пересчитывает сервер', async () => {
    renderWithProviders(<LoanCalculator />)
    const slider = await screen.findByRole('slider', { name: 'Сумма займа' })

    // fireEvent, а не клавиатура: нативное поведение range в jsdom не работает,
    // а проверяем мы связку «шаг → сумма → расчёт», не браузер.
    fireEvent.change(slider, { target: { value: '13' } })

    await waitFor(() => {
      expect(slider).toHaveAttribute('aria-valuetext', rub('1600000'))
    })
    const row = (await screen.findByText('Вернуть')).parentElement!
    await waitFor(() => {
      expect(within(row).getByText(rubText('1600000'))).toBeInTheDocument()
    })
  })
})

describe('Переключение срока', () => {
  it('не гасит карточку итога, пока считается новый расчёт', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoanCalculator />)

    await screen.findByText('Вернуть')

    await user.click(screen.getByRole('radio', { name: '30 дней' }))
    // Сразу после переключения, до ответа сервера, итог обязан остаться на месте.
    expect(screen.getByText('Вернуть')).toBeInTheDocument()
    expect(screen.getByText('Дата платежа')).toBeInTheDocument()
    expect(screen.getByText('ПСК')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Вернуть')).toBeInTheDocument()
    })
  })
})
