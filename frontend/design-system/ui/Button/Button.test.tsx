import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('в состоянии загрузки не пускает второе нажатие', async () => {
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        Подписать
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Подписать' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')

    await userEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('по умолчанию type=button — не сабмитит форму случайно', () => {
    render(<Button>Дальше</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('disabled приоритетнее loading', () => {
    render(
      <Button disabled={false} loading={false}>
        Готово
      </Button>,
    )
    expect(screen.getByRole('button')).toBeEnabled()
  })
})

describe('Button asChild', () => {
  it('отдаёт стили ссылке и не оборачивает её в кнопку', () => {
    render(
      <Button asChild>
        <a href="/login">Получить деньги</a>
      </Button>,
    )

    const link = screen.getByRole('link', { name: 'Получить деньги' })
    expect(link).toHaveAttribute('href', '/login')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(link.className).not.toBe('')
  })
})
