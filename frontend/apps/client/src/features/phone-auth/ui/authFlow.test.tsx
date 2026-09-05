import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import type { RouteObject } from 'react-router-dom'
import { renderRoutes } from '@testing/render'
import { setupMockApi } from '@testing/msw'
import { LoginPage } from '@pages/login'
import { LoginCodePage } from '@pages/login-code'
import { ROUTES } from '@shared/config'
import { useChallengeStore } from '../model/challengeStore'

setupMockApi()

const routes: RouteObject[] = [
  { path: ROUTES.login, element: <LoginPage /> },
  { path: ROUTES.loginCode, element: <LoginCodePage /> },
  { path: ROUTES.application, element: <h1>Анкета</h1> },
  { path: ROUTES.home, element: <h1>Кабинет</h1> },
]

const NEW_PHONE = '9995551122'
const RETURNING_PHONE = '9214801204'

beforeEach(() => {
  useChallengeStore.getState().reset()
})

async function submitPhone(user: ReturnType<typeof userEvent.setup>, digits: string) {
  await user.type(screen.getByLabelText('Номер телефона'), digits)
  await user.click(screen.getByRole('button', { name: 'Продолжить' }))
}

const cells = () => screen.getAllByRole('textbox')

describe('Вход по номеру телефона', () => {
  it('не отправляет неполный номер', async () => {
    const user = userEvent.setup()
    renderRoutes(routes, ROUTES.login)

    await submitPhone(user, '999')

    expect(await screen.findByRole('alert')).toHaveTextContent('Введите номер полностью')
    expect(screen.getByLabelText('Номер телефона')).toHaveAttribute('aria-invalid', 'true')
  })

  it('маскирует ввод по мере набора', async () => {
    const user = userEvent.setup()
    renderRoutes(routes, ROUTES.login)

    const input = screen.getByLabelText('Номер телефона')
    await user.type(input, NEW_PHONE)

    expect(input).toHaveValue('+7 999 555-11-22')
  })

  it('новый клиент после кода попадает в анкету', async () => {
    const user = userEvent.setup()
    renderRoutes(routes, ROUTES.login)

    await submitPhone(user, NEW_PHONE)

    expect(await screen.findByText(/Отправили на/)).toBeInTheDocument()
    await user.click(cells()[0]!)
    await user.paste('4823')

    expect(await screen.findByRole('heading', { name: 'Анкета' })).toBeInTheDocument()
  })

  it('повторный клиент после кода попадает в кабинет', async () => {
    const user = userEvent.setup()
    renderRoutes(routes, ROUTES.login)

    await submitPhone(user, RETURNING_PHONE)
    await screen.findByText(/Отправили на/)
    await user.click(cells()[0]!)
    await user.paste('4823')

    expect(await screen.findByRole('heading', { name: 'Кабинет' })).toBeInTheDocument()
  })

  it('неверный код тратит попытку и сообщает остаток', async () => {
    const user = userEvent.setup()
    renderRoutes(routes, ROUTES.login)

    await submitPhone(user, NEW_PHONE)
    await screen.findByText(/Отправили на/)

    await user.click(cells()[0]!)
    await user.paste('1111')

    expect(await screen.findByRole('alert')).toHaveTextContent('Код не подошёл')
    expect(await screen.findByText(/Осталось 2 попытки/)).toBeInTheDocument()
  })

  it('после исчерпания попыток блокирует и предлагает поддержку', async () => {
    const user = userEvent.setup()
    renderRoutes(routes, ROUTES.login)

    await submitPhone(user, NEW_PHONE)
    await screen.findByText(/Отправили на/)

    // Вставка заменяет код целиком, так что чистить ячейки между попытками
    // не нужно — это и есть поведение из макета.
    for (const wrong of ['1111', '2222', '3333']) {
      await user.click(cells()[0]!)
      await user.paste(wrong)
      await screen.findByRole('alert')
    }

    expect(await screen.findByText('Не приходит SMS?')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Написать в поддержку' })).toBeInTheDocument()
    // Обе кнопки повтора выключены на время блокировки: и в поле кода,
    // и главная внизу — с явным временем разблокировки.
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Отправить снова через/ })).toBeDisabled()
    })
    expect(screen.getByRole('button', { name: /Отправить снова · / })).toBeDisabled()
  })

  it('прямой заход на экран кода без запроса уводит на ввод телефона', () => {
    renderRoutes(routes, ROUTES.loginCode)
    expect(screen.getByLabelText('Номер телефона')).toBeInTheDocument()
  })
})
