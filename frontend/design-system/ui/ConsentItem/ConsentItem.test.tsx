import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ConsentItem } from './ConsentItem'

describe('ConsentItem', () => {
  it('обязательное согласие помечено, но не предустановлено', () => {
    render(
      <ConsentItem checked={false} onChange={() => {}} required>
        Согласие на обработку персональных данных
      </ConsentItem>,
    )

    expect(screen.getByRole('checkbox')).not.toBeChecked()
    expect(screen.getByText('обязательно')).toBeInTheDocument()
  })

  it('рекламное согласие не помечено обязательным', () => {
    render(
      <ConsentItem checked={false} onChange={() => {}}>
        Получать рекламу
      </ConsentItem>,
    )
    expect(screen.queryByText('обязательно')).not.toBeInTheDocument()
  })

  it('ставится по клику на текст', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <ConsentItem checked={false} onChange={onChange}>
        Запрос кредитной истории
      </ConsentItem>,
    )

    await user.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('выключенное объясняет причину вместо текста согласия', () => {
    render(
      <ConsentItem
        checked={false}
        onChange={() => {}}
        disabled
        disabledReason="Недоступно до подтверждения телефона"
      >
        Получать рекламу
      </ConsentItem>,
    )

    expect(screen.getByRole('checkbox')).toBeDisabled()
    expect(screen.getByText('Недоступно до подтверждения телефона')).toBeInTheDocument()
    expect(screen.queryByText('Получать рекламу')).not.toBeInTheDocument()
  })
})
