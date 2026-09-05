import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField } from '@ds/ui'
import type { PassportFields } from '@entities/application'
import { FieldCard } from '../FieldCard'
import { StepShell } from '../StepShell'
import { passportSchema, type PassportValues } from '../../model/schemas'
import styles from './PassportStep.module.css'

interface PassportStepProps {
  defaults: Partial<PassportValues>
  onSubmit: (values: PassportValues) => void
  onRecognize: () => Promise<PassportFields>
  pending: boolean
  serverErrors?: Record<string, string[]> | undefined
}

export function PassportStep({
  defaults,
  onSubmit,
  onRecognize,
  pending,
  serverErrors,
}: PassportStepProps) {
  const { register, handleSubmit, formState, setValue } = useForm<PassportValues>({
    resolver: zodResolver(passportSchema),
    defaultValues: {
      series: defaults.series ?? '',
      number: defaults.number ?? '',
      issuedAt: defaults.issuedAt ?? '',
      issuedBy: defaults.issuedBy ?? '',
      departmentCode: defaults.departmentCode ?? '',
    },
  })
  const errors = formState.errors
  const errorFor = (field: keyof PassportValues) =>
    errors[field]?.message ?? serverErrors?.[field]?.[0]

  const recognize = () => {
    void onRecognize().then((fields) => {
      // Распознанное подставляем, но оставляем редактируемым: OCR ошибается.
      setValue('series', fields.series, { shouldValidate: true })
      setValue('number', fields.number, { shouldValidate: true })
      setValue('issuedAt', fields.issuedAt, { shouldValidate: true })
      setValue('issuedBy', fields.issuedBy, { shouldValidate: true })
    })
  }

  return (
    <StepShell
      title="Паспорт"
      lead="Сфотографируйте главную страницу — заполним поля сами. Фото не покидает защищённый контур."
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event)
      }}
      submitLabel="Дальше"
      pending={pending}
    >
      <button type="button" className={styles.drop} onClick={recognize}>
        <span className={styles.dropTitle}>Сделать фото</span>
        <span className={styles.dropHint}>JPG или PDF, до 10 МБ</span>
      </button>

      <FieldCard>
        <div className={styles.row}>
          <TextField
            label="Серия"
            numeric
            inputMode="numeric"
            maxLength={4}
            {...register('series')}
            error={errorFor('series')}
          />
          <TextField
            label="Номер"
            numeric
            inputMode="numeric"
            maxLength={6}
            {...register('number')}
            error={errorFor('number')}
          />
        </div>

        <TextField
          label="Дата выдачи"
          type="date"
          numeric
          {...register('issuedAt')}
          error={errorFor('issuedAt')}
        />
        <TextField label="Кем выдан" {...register('issuedBy')} error={errorFor('issuedBy')} />
        <TextField
          label="Код подразделения"
          numeric
          inputMode="numeric"
          placeholder="780-001"
          maxLength={7}
          {...register('departmentCode')}
          error={errorFor('departmentCode')}
        />
      </FieldCard>
    </StepShell>
  )
}
