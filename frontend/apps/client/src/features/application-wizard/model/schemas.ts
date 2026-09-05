import { z } from 'zod'

const required = 'Заполните поле'

export const personalSchema = z.object({
  lastName: z.string().trim().min(2, required),
  firstName: z.string().trim().min(2, required),
  middleName: z.string().trim().optional(),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Укажите дату рождения')
    .refine((value) => {
      const years = (Date.now() - new Date(value).getTime()) / (365.25 * 24 * 3600 * 1000)
      return years >= 21 && years <= 65
    }, 'Займы выдаём с 21 до 65 лет'),
})

export const passportSchema = z.object({
  series: z.string().regex(/^\d{4}$/, 'Четыре цифры'),
  number: z.string().regex(/^\d{6}$/, 'Шесть цифр'),
  issuedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Укажите дату выдачи'),
  issuedBy: z.string().trim().min(5, required),
  departmentCode: z
    .string()
    .regex(/^\d{3}-\d{3}$/, 'Нужно 6 цифр — посмотрите на второй строке штампа'),
})

export const addressSchema = z.object({
  address: z.string().trim().min(5, 'Выберите адрес из подсказок'),
  flat: z.string().trim().optional(),
  postalCode: z.string().regex(/^\d{6}$/, 'Шесть цифр'),
  sameAsActual: z.boolean(),
})

export const employmentSchema = z
  .object({
    employment: z.enum(['employed', 'self-employed', 'pension', 'none']),
    employerInn: z.string().optional(),
    /** Целые рубли строкой: на клиенте деньги не считаем, только передаём. */
    monthlyIncome: z.string().regex(/^\d{4,7}$/, 'Укажите доход в рублях'),
  })
  .refine(
    (value) => value.employment !== 'employed' || /^\d{10}(\d{2})?$/.test(value.employerInn ?? ''),
    { path: ['employerInn'], message: 'ИНН работодателя — 10 или 12 цифр' },
  )

export const payoutSchema = z
  .object({
    method: z.enum(['card', 'account']),
    pan: z.string().optional(),
    expiry: z.string().optional(),
    cvc: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.method !== 'card') return
    if (!/^\d{16,19}$/.test((value.pan ?? '').replace(/\s/g, ''))) {
      ctx.addIssue({ code: 'custom', path: ['pan'], message: 'Номер карты — 16 цифр' })
    }
    if (!/^\d{2}\/\d{2}$/.test(value.expiry ?? '')) {
      ctx.addIssue({ code: 'custom', path: ['expiry'], message: 'ММ/ГГ' })
    }
    if (!/^\d{3}$/.test(value.cvc ?? '')) {
      ctx.addIssue({ code: 'custom', path: ['cvc'], message: 'Три цифры' })
    }
  })

const mandatory = z.boolean().refine((value) => value, 'Без этого согласия заявку принять нельзя')

export const consentsSchema = z.object({
  personalData: mandatory,
  creditHistory: mandatory,
  pep: mandatory,
  marketing: z.boolean(),
})

export type PersonalValues = z.infer<typeof personalSchema>
export type PassportValues = z.infer<typeof passportSchema>
export type AddressValues = z.infer<typeof addressSchema>
export type EmploymentValues = z.infer<typeof employmentSchema>
export type PayoutValues = z.infer<typeof payoutSchema>
export type ConsentsValues = z.infer<typeof consentsSchema>
