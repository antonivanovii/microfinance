import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { SegmentedControl } from './SegmentedControl'

const TERMS = [
  { value: '7', label: '7 дней' },
  { value: '14', label: '14' },
  { value: '21', label: '21' },
  { value: '30', label: '30' },
] as const

function Harness() {
  const [value, setValue] = useState<'7' | '14' | '21' | '30'>('7')
  return (
    <SegmentedControl options={TERMS} value={value} onChange={setValue} ariaLabel="Срок займа" />
  )
}

describe('SegmentedControl', () => {
  it('в таб-порядке участвует только выбранный вариант', () => {
    render(<Harness />)
    const options = screen.getAllByRole('radio')
    expect(options[0]).toHaveAttribute('tabindex', '0')
    expect(options[1]).toHaveAttribute('tabindex', '-1')
  })

  it('стрелки переключают вариант', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.tab()
    expect(screen.getByRole('radio', { name: '7 дней' })).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: '14' })).toBeChecked()
  })

  it('стрелка с последнего варианта заворачивает на первый', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.click(screen.getByRole('radio', { name: '30' }))
    await user.keyboard('{ArrowRight}')

    expect(screen.getByRole('radio', { name: '7 дней' })).toBeChecked()
  })

  it('вся группа подписана для скринридера', () => {
    render(<Harness />)
    expect(screen.getByRole('radiogroup', { name: 'Срок займа' })).toBeInTheDocument()
  })
})
