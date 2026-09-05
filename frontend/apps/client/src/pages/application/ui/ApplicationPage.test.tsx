import type { RouteObject } from 'react-router-dom'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderRoutes } from '@testing/render'
import { setupMockApi } from '@testing/msw'
import { ROUTES } from '@shared/config'
import { ApplicationPage } from './ApplicationPage'

setupMockApi()

const routes: RouteObject[] = [
  { path: ROUTES.application, element: <ApplicationPage /> },
  { path: ROUTES.decision, element: <h1>Решение</h1> },
  { path: ROUTES.landing, element: <h1>Лендинг</h1> },
]

const open = () => renderRoutes(routes, ROUTES.application)

describe('Воронка заявки', () => {
  it('открывается с первого шага и показывает счётчик из ответа сервера', async () => {
    open()
    expect(await screen.findByRole('heading', { name: 'Проверьте условия' })).toBeInTheDocument()
    expect(screen.getByText(/Шаг 1 из 7/)).toBeInTheDocument()
  })

  it('следующий шаг приходит с сервера, фронт его не вычисляет', async () => {
    const user = userEvent.setup()
    open()

    await screen.findByRole('heading', { name: 'Проверьте условия' })
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(await screen.findByRole('heading', { name: 'Как вас зовут' })).toBeInTheDocument()
    expect(screen.getByText(/Шаг 2 из 7/)).toBeInTheDocument()
  })

  it('Госуслуги укорачивают ветку: семь шагов превращаются в пять', async () => {
    const user = userEvent.setup()
    open()

    await screen.findByRole('heading', { name: 'Проверьте условия' })
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))
    await screen.findByRole('heading', { name: 'Как вас зовут' })

    await user.click(screen.getByRole('button', { name: /Заполнить с Госуслуг/ }))

    // Паспорт и адрес сервер отметил пройденными и отдал сразу занятость.
    expect(await screen.findByRole('heading', { name: 'Работа и доход' })).toBeInTheDocument()
    expect(screen.getByText(/Шаг 3 из 5/)).toBeInTheDocument()
  })

  it('ошибку валидации паспорта показывает сервер, а не клиент', async () => {
    const user = userEvent.setup()
    open()

    await screen.findByRole('heading', { name: 'Проверьте условия' })
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))
    await screen.findByRole('heading', { name: 'Как вас зовут' })

    await user.type(screen.getByRole('textbox', { name: 'Фамилия' }), 'Ковалёва')
    await user.type(screen.getByRole('textbox', { name: 'Имя' }), 'Анна')
    await user.type(screen.getByLabelText('Дата рождения'), '1994-06-12')
    await user.click(screen.getByRole('button', { name: 'Дальше' }))

    const passport = await screen.findByRole('heading', { name: 'Паспорт' })
    expect(passport).toBeInTheDocument()

    // Распознавание заполняет поля, но код подразделения остаётся за клиентом.
    await user.click(screen.getByRole('button', { name: /Сделать фото/ }))
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Серия' })).toHaveValue('4516')
    })

    await user.type(screen.getByRole('textbox', { name: 'Код подразделения' }), '780-0')
    await user.click(screen.getByRole('button', { name: 'Дальше' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Нужно 6 цифр — посмотрите на второй строке штампа',
    )
  })

  it('вернувшемуся клиенту предлагает продолжить с сохранённого шага', async () => {
    const user = userEvent.setup()
    const { unmount } = open()

    await screen.findByRole('heading', { name: 'Проверьте условия' })
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))
    await screen.findByRole('heading', { name: 'Как вас зовут' })
    unmount()

    open()
    expect(await screen.findByRole('heading', { name: /Продолжим с шага 2/ })).toBeInTheDocument()
    expect(screen.getByText('1 из 7 шагов')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Продолжить' }))
    expect(await screen.findByRole('heading', { name: 'Как вас зовут' })).toBeInTheDocument()
  })

  it('«Начать заново» сбрасывает черновик на первый шаг', async () => {
    const user = userEvent.setup()
    const { unmount } = open()

    await screen.findByRole('heading', { name: 'Проверьте условия' })
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))
    await screen.findByRole('heading', { name: 'Как вас зовут' })
    unmount()

    open()
    await screen.findByRole('heading', { name: /Продолжим с шага 2/ })
    await user.click(screen.getByRole('button', { name: 'Начать заново' }))

    expect(await screen.findByRole('heading', { name: 'Проверьте условия' })).toBeInTheDocument()
  })
})
