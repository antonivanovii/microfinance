import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Callout, TextField } from '@ds/ui'
import { FieldCard } from '../FieldCard'
import { StepShell } from '../StepShell'
import { payoutSchema, type PayoutValues } from '../../model/schemas'
import styles from './PayoutStep.module.css'

interface PayoutStepProps {
  defaults: Partial<PayoutValues>
  onSubmit: (values: PayoutValues) => void
  pending: boolean
}

const groupPan = (raw: string) =>
  raw
    .replace(/\D/g, '')
    .slice(0, 19)
    .replace(/(.{4})/g, '$1 ')
    .trim()

const maskExpiry = (raw: string) => {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

export function PayoutStep({ defaults, onSubmit, pending }: PayoutStepProps) {
  const { register, handleSubmit, formState, setValue } = useForm<PayoutValues>({
    resolver: zodResolver(payoutSchema),
    defaultValues: {
      method: defaults.method ?? 'card',
      pan: defaults.pan ?? '',
      expiry: defaults.expiry ?? '',
      cvc: defaults.cvc ?? '',
    },
  })
  const errors = formState.errors

  return (
    <StepShell
      title="Куда прислать деньги"
      lead="Карта должна быть оформлена на вас. Проверим до одобрения, чтобы выплата не сорвалась."
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event)
      }}
      submitLabel="Привязать карту"
      pending={pending}
    >
      <FieldCard>
        <TextField
          label="Номер карты"
          numeric
          inputMode="numeric"
          autoComplete="cc-number"
          {...register('pan', {
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              setValue('pan', groupPan(event.target.value))
            },
          })}
          error={errors.pan?.message}
        />

        <div className={styles.row}>
          <TextField
            label="Срок"
            numeric
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="ММ/ГГ"
            {...register('expiry', {
              onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                setValue('expiry', maskExpiry(event.target.value))
              },
            })}
            error={errors.expiry?.message}
          />
          <TextField
            label="CVC"
            numeric
            inputMode="numeric"
            type="password"
            autoComplete="cc-csc"
            maxLength={3}
            {...register('cvc')}
            error={errors.cvc?.message}
          />
        </div>

        <Callout>Спишем и сразу вернём 1 ₽ — это проверка принадлежности карты</Callout>

        <div className={styles.alt}>
          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={() => {
              onSubmit({ method: 'account' })
            }}
          >
            Получить на счёт по реквизитам
          </Button>
        </div>
      </FieldCard>
    </StepShell>
  )
}
