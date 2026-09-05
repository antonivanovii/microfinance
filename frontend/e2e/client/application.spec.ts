import { expect, test } from '@playwright/test'

test.describe('Воронка заявки', () => {
  test('доходит от параметров до отправки, ветку укорачивают Госуслуги', async ({ page }) => {
    await page.goto('/application')

    await expect(page.getByRole('heading', { name: 'Проверьте условия' })).toBeVisible()
    await expect(page.getByText('Шаг 1 из 7 · Параметры займа')).toBeVisible()
    await page.getByRole('button', { name: 'Продолжить' }).click()

    await expect(page.getByRole('heading', { name: 'Как вас зовут' })).toBeVisible()
    await page.getByRole('button', { name: /Заполнить с Госуслуг/ }).click()

    // Паспорт и адрес сервер отдал заполненными — осталось пять шагов.
    await expect(page.getByRole('heading', { name: 'Работа и доход' })).toBeVisible()
    await expect(page.getByText('Шаг 3 из 5 · Работа и доход')).toBeVisible()

    await page.getByLabel('ИНН работодателя').fill('7812445990')
    await expect(page.getByText(/Северная типография/)).toBeVisible()
    await page.getByLabel('Доход в месяц').fill('78000')
    await page.getByRole('button', { name: 'Дальше' }).click()

    await expect(page.getByRole('heading', { name: 'Куда прислать деньги' })).toBeVisible()
    await page.getByLabel('Номер карты').fill('4276550012349012')
    await page.getByLabel('Срок').fill('0928')
    await page.getByLabel('CVC').fill('123')
    await page.getByRole('button', { name: 'Привязать карту' }).click()

    await expect(page.getByRole('heading', { name: 'Согласия' })).toBeVisible()
    // Сумма и карта видны в сводке перед отправкой.
    await expect(page.getByText('МИР · 9012')).toBeVisible()

    // Текст согласия — часть метки: человек нажимает по формулировке,
    // а не по квадрату 26 px.
    for (const name of [
      'Обработка персональных данных',
      'Запрос кредитной истории в бюро',
      'Использование простой электронной подписи',
    ]) {
      await page.getByText(name, { exact: false }).click()
      await expect(page.getByRole('checkbox', { name: new RegExp(name) })).toBeChecked()
    }

    await page.getByRole('button', { name: 'Отправить заявку' }).click()
    await expect(page).toHaveURL(/\/decision$/)
  })

  test('обязательные согласия нельзя пропустить', async ({ page }) => {
    await page.goto('/application')
    await page.getByRole('button', { name: 'Продолжить' }).click()
    await page.getByRole('button', { name: /Заполнить с Госуслуг/ }).click()
    await page.getByLabel('ИНН работодателя').fill('7812445990')
    await page.getByLabel('Доход в месяц').fill('78000')
    await page.getByRole('button', { name: 'Дальше' }).click()
    await page.getByRole('button', { name: 'Получить на счёт по реквизитам' }).click()

    await expect(page.getByRole('heading', { name: 'Согласия' })).toBeVisible()
    await page.getByRole('button', { name: 'Отправить заявку' }).click()

    await expect(page.getByRole('alert').first()).toHaveText(
      'Без этого согласия заявку принять нельзя',
    )
    await expect(page).not.toHaveURL(/\/decision$/)
  })
})
