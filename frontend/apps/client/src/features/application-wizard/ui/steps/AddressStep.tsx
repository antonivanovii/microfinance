import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Checkbox, TextField } from '@ds/ui'
import { useAddressSuggestions } from '@entities/application'
import { FieldCard } from '../FieldCard'
import { StepShell } from '../StepShell'
import { addressSchema, type AddressValues } from '../../model/schemas'
import styles from './AddressStep.module.css'

interface AddressStepProps {
  defaults: Partial<AddressValues>
  onSubmit: (values: AddressValues) => void
  pending: boolean
}

export function AddressStep({ defaults, onSubmit, pending }: AddressStepProps) {
  const { control, register, handleSubmit, formState, setValue } = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: defaults.address ?? '',
      flat: defaults.flat ?? '',
      postalCode: defaults.postalCode ?? '',
      sameAsActual: defaults.sameAsActual ?? true,
    },
  })
  const errors = formState.errors

  // Подсказки зависят только от адреса — подписываемся на одно поле.
  const address = useWatch({ control, name: 'address' })
  const [open, setOpen] = useState(false)
  const suggestions = useAddressSuggestions(address)

  return (
    <StepShell
      title="Адрес регистрации"
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event)
      }}
      submitLabel="Дальше"
      pending={pending}
    >
      <FieldCard>
        <div className={styles.field}>
          <TextField
            label="Улица и дом"
            autoComplete="street-address"
            {...register('address', {
              onChange: () => {
                setOpen(true)
              },
            })}
            error={errors.address?.message}
          />

          {open && suggestions.data && suggestions.data.length > 0 ? (
            <div className={styles.suggestions}>
              {suggestions.data.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={styles.suggestion}
                  onClick={() => {
                    setValue('address', `${item.city}, ${item.value}`, { shouldValidate: true })
                    setValue('postalCode', item.postalCode, { shouldValidate: true })
                    setOpen(false)
                  }}
                >
                  <span className={styles.suggestionValue}>{item.value}</span>
                  <span className={styles.suggestionMeta}>
                    {item.postalCode}, {item.city}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className={styles.row}>
          <TextField label="Квартира" numeric inputMode="numeric" {...register('flat')} />
          <TextField
            label="Индекс"
            numeric
            inputMode="numeric"
            maxLength={6}
            {...register('postalCode')}
            error={errors.postalCode?.message}
          />
        </div>

        <div className={styles.same}>
          <Checkbox {...register('sameAsActual')}>
            Фактический адрес совпадает с регистрацией
          </Checkbox>
        </div>
      </FieldCard>
    </StepShell>
  )
}
