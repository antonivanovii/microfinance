import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { Button } from '@ds/ui'
import { ApiError } from '@shared/api'
import { ROUTES } from '@shared/config'
import { formatPhoneInput, phoneDigits, toE164 } from '@shared/lib'
import { useRequestOtp } from '../model/mutations'
import { phoneSchema, type PhoneForm as PhoneFormValues } from '../model/schemas'
import styles from './PhoneForm.module.css'

export function PhoneForm({ onSent }: { onSent: () => void }) {
  const requestOtp = useRequestOtp()
  const { control, handleSubmit, formState } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '7' },
  })

  const serverError = requestOtp.error instanceof ApiError ? requestOtp.error : null
  const message = formState.errors.phone?.message ?? serverError?.detail ?? serverError?.message

  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={(event) => {
        void handleSubmit((values) => {
          requestOtp.mutate(toE164(values.phone), { onSuccess: onSent })
        })(event)
      }}
    >
      <div className={styles.fieldBlock}>
        <label className={styles.label} htmlFor="phone">
          Номер телефона
        </label>
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <input
              id="phone"
              className={[styles.field, message ? styles.invalid : ''].filter(Boolean).join(' ')}
              value={formatPhoneInput(field.value)}
              onChange={(event) => {
                field.onChange(phoneDigits(event.target.value))
              }}
              onBlur={field.onBlur}
              // Каретка всегда в конец: маска не даёт править середину,
              // а произвольная позиция ломает ввод.
              onFocus={(event) => {
                const end = event.target.value.length
                event.target.setSelectionRange(end, end)
              }}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              aria-label="Номер телефона"
              aria-invalid={message ? true : undefined}
              aria-describedby={message ? 'phone-error' : undefined}
            />
          )}
        />
        {message ? (
          <p id="phone-error" className={styles.error} role="alert">
            {message}
          </p>
        ) : null}
      </div>

      <p className={styles.consent}>
        Нажимая «Продолжить», вы соглашаетесь с{' '}
        <Link to={ROUTES.legal('terms')}>условиями использования</Link> и{' '}
        <Link to={ROUTES.legal('privacy')}>политикой обработки данных</Link>.
      </p>

      <div className={styles.footer}>
        <Button type="submit" size="lg" fullWidth loading={requestOtp.isPending}>
          Продолжить
        </Button>
        <p className={styles.secure}>
          <span className={styles.mark} aria-hidden="true">
            <svg
              width="11"
              height="11"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2.5 7.5 5.5 10.5 11.5 3.5" />
            </svg>
          </span>
          Данные передаются по защищённому каналу
        </p>
      </div>

      <p className={styles.offer}>
        <span className={styles.mark} aria-hidden="true">
          <svg
            width="11"
            height="11"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 7.5 5.5 10.5 11.5 3.5" />
          </svg>
        </span>
        Первый займ — без процентов
      </p>
    </form>
  )
}
