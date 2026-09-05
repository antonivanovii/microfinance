import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OtpInput } from './OtpInput'

function Harness({ onResend = () => {} }: { onResend?: () => void }) {
  const [value, setValue] = useState('')
  return <OtpInput value={value} onChange={setValue} resendAfterSeconds={0} onResend={onResend} />
}

const cells = () => screen.getAllByRole('textbox')

describe('OtpInput', () => {
  it('переводит фокус на следующую ячейку по мере ввода', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.click(cells()[0]!)
    await user.keyboard('48')

    expect(cells()[0]).toHaveValue('4')
    expect(cells()[1]).toHaveValue('8')
    expect(cells()[2]).toHaveFocus()
  })

  it('игнорирует буквы', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.click(cells()[0]!)
    await user.keyboard('a')

    expect(cells()[0]).toHaveValue('')
  })

  it('разбирает вставку кода целиком', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.click(cells()[0]!)
    await user.paste('1234')

    expect(cells().map((cell) => (cell as HTMLInputElement).value)).toEqual(['1', '2', '3', '4'])
  })

  it('обрезает вставку длиннее кода', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.click(cells()[0]!)
    await user.paste('123456789')

    expect(cells().map((cell) => (cell as HTMLInputElement).value)).toEqual(['1', '2', '3', '4'])
  })

  it('из пустой ячейки Backspace уводит назад и стирает там', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.click(cells()[0]!)
    await user.keyboard('12')
    await user.keyboard('{Backspace}')

    expect(cells()[1]).toHaveValue('')
    expect(cells()[1]).toHaveFocus()
  })

  it('автоподстановку из SMS предлагает только первой ячейке', () => {
    render(<Harness />)
    expect(cells()[0]).toHaveAttribute('autocomplete', 'one-time-code')
    expect(cells()[1]).toHaveAttribute('autocomplete', 'off')
  })

  it('пока таймер не вышел, повторная отправка выключена', () => {
    const onResend = vi.fn()
    render(<OtpInput value="" onChange={() => {}} resendAfterSeconds={42} onResend={onResend} />)
    expect(screen.getByRole('button', { name: /Отправить снова через 00:42/ })).toBeDisabled()
  })

  it('склоняет остаток попыток', () => {
    render(
      <OtpInput
        value=""
        onChange={() => {}}
        resendAfterSeconds={0}
        onResend={() => {}}
        attemptsLeft={2}
      />,
    )
    expect(screen.getByText('Осталось 2 попытки')).toBeInTheDocument()
  })
})
