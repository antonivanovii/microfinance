import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Switch } from './Switch'

function Harness({ initial = false }: { initial?: boolean }) {
  const [on, setOn] = useState(initial)
  return (
    <Switch checked={on} onChange={setOn}>
      Автоплатёж
    </Switch>
  )
}

describe('Switch', () => {
  it('это настоящий switch, доступный по имени', () => {
    render(<Harness />)
    expect(screen.getByRole('switch', { name: 'Автоплатёж' })).toBeInTheDocument()
  })

  it('отключается одним нажатием, без подтверждения', async () => {
    const user = userEvent.setup()
    render(<Harness initial />)

    const control = screen.getByRole('switch')
    expect(control).toBeChecked()

    await user.click(control)
    expect(control).not.toBeChecked()
  })

  it('работает с клавиатуры', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.tab()
    await user.keyboard(' ')

    expect(screen.getByRole('switch')).toBeChecked()
  })
})
