import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Sheet } from './Sheet'

describe('Sheet', () => {
  it('закрытая не рендерится вовсе', () => {
    render(
      <Sheet open={false} onClose={() => {}} title="Полное досрочное">
        <button type="button">Оплатить</button>
      </Sheet>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('подписана заголовком и описанием', () => {
    render(
      <Sheet open onClose={() => {}} title="Полное досрочное" description="Котировка до 23:59">
        <button type="button">Оплатить</button>
      </Sheet>,
    )

    const dialog = screen.getByRole('dialog', { name: 'Полное досрочное' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleDescription('Котировка до 23:59')
  })

  it('забирает фокус внутрь при открытии', () => {
    render(
      <Sheet open onClose={() => {}} title="Полное досрочное">
        <button type="button">Оплатить</button>
      </Sheet>,
    )
    expect(screen.getByRole('button', { name: 'Оплатить' })).toHaveFocus()
  })

  it('держит Tab внутри и заворачивает по кругу', async () => {
    const user = userEvent.setup()
    render(
      <>
        <button type="button">Снаружи</button>
        <Sheet open onClose={() => {}} title="Полное досрочное">
          <button type="button">Отмена</button>
          <button type="button">Оплатить</button>
        </Sheet>
      </>,
    )

    expect(screen.getByRole('button', { name: 'Отмена' })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('button', { name: 'Оплатить' })).toHaveFocus()

    // С последнего — назад на первый, а не на кнопку снаружи.
    await user.tab()
    expect(screen.getByRole('button', { name: 'Отмена' })).toHaveFocus()
  })

  it('Escape закрывает', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <Sheet open onClose={onClose} title="Полное досрочное">
        <button type="button">Оплатить</button>
      </Sheet>,
    )

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('неотменяемая шторка не закрывается ни Escape, ни кликом мимо', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <Sheet open onClose={onClose} title="Подтвердите подписание" dismissable={false}>
        <button type="button">Подписать</button>
      </Sheet>,
    )

    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('dialog').parentElement!)

    expect(onClose).not.toHaveBeenCalled()
  })

  it('блокирует прокрутку фона и отпускает её при закрытии', () => {
    const { unmount } = render(
      <Sheet open onClose={() => {}} title="Полное досрочное">
        <button type="button">Оплатить</button>
      </Sheet>,
    )
    expect(document.body.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('вложенные шторки не отпускают фон раньше времени', () => {
    // Замок считает открытые слои: наивная реализация разблокирует прокрутку
    // на закрытии верхней шторки, пока нижняя ещё открыта.
    const { unmount: closeOuter } = render(
      <Sheet open onClose={() => {}} title="Условия">
        <button type="button">Дальше</button>
      </Sheet>,
    )
    const { unmount: closeInner } = render(
      <Sheet open onClose={() => {}} title="Подтверждение">
        <button type="button">Подписать</button>
      </Sheet>,
    )

    closeInner()
    expect(document.body.style.overflow).toBe('hidden')

    closeOuter()
    expect(document.body.style.overflow).toBe('')
  })
})
