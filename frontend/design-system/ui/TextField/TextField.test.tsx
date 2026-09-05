import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TextField } from './TextField'

describe('TextField', () => {
  it('метка подписывает поле для скринридера', () => {
    render(<TextField label="Серия и номер паспорта" />)
    expect(screen.getByRole('textbox', { name: 'Серия и номер паспорта' })).toBeInTheDocument()
  })

  it('поле неконтролируемое: значение не требует пропа value', async () => {
    const user = userEvent.setup()
    render(<TextField label="Кем выдан" />)

    const input = screen.getByRole('textbox', { name: 'Кем выдан' })
    await user.type(input, 'ОУФМС')
    expect(input).toHaveValue('ОУФМС')
  })

  it('свой плейсхолдер не спорит с меткой', () => {
    render(<TextField label="Код подразделения" placeholder="780-001" />)
    expect(screen.getByPlaceholderText('780-001')).toBeInTheDocument()
  })

  it('ошибка помечает поле невалидным, связывается с ним и озвучивается', () => {
    render(<TextField label="Дата выдачи" error="Такой даты не бывает" />)

    const input = screen.getByRole('textbox')
    const message = screen.getByRole('alert')

    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(message).toHaveTextContent('Такой даты не бывает')
    expect(input).toHaveAccessibleDescription('Такой даты не бывает')
  })

  it('подсказку не озвучивает как ошибку', () => {
    render(<TextField label="ИНН" hint="12 цифр" />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
  })
})
