import { z } from 'zod'
import { PHONE_DIGITS } from '@shared/lib'

export const phoneSchema = z.object({
  phone: z
    .string()
    .regex(new RegExp(`^7\\d{${String(PHONE_DIGITS - 1)}}$`), 'Введите номер полностью'),
})

export type PhoneForm = z.infer<typeof phoneSchema>
