import { expect, test } from '@playwright/test'

test.describe('Лендинг', () => {
  test('калькулятор считает на сервере и ведёт во вход', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Займ до 30 000 ₽')
    await expect(page.getByText('Вернуть')).toBeVisible()

    await page.getByRole('radio', { name: '30 дней' }).click()
    await expect(page.getByRole('radio', { name: '30 дней' })).toBeChecked()

    // На лендинге две кнопки с этим текстом: якорь к калькулятору и липкая
    // внизу. В воронку уводит только липкая.
    await page.locator('footer ~ div').getByRole('link', { name: 'Получить деньги' }).click()
    await expect(page).toHaveURL(/\/login$/)
  })

  test('липкая кнопка есть на мобильном и скрыта на десктопе', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const sticky = page.getByRole('link', { name: 'Получить деньги' }).last()
    await expect(sticky).toBeInViewport()

    await page.setViewportSize({ width: 1440, height: 900 })
    await expect(page.locator('header').getByRole('link', { name: 'Войти' })).toBeVisible()
  })
})

test('вход по коду доводит до анкеты', async ({ page }) => {
  await page.goto('/login')

  await page.getByLabel('Номер телефона').fill('9995551122')
  await page.getByRole('button', { name: 'Продолжить' }).click()

  await expect(page.getByText(/Отправили на/)).toBeVisible()
  const cells = page.getByRole('textbox')
  for (const [index, digit] of [...'4823'].entries()) {
    await cells.nth(index).fill(digit)
  }

  await expect(page).toHaveURL(/\/application$/)
})
