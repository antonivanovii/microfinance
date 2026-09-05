import { useId } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SegmentedControl, TextField } from '@ds/ui'
import { useEmployer } from '@entities/application'
import { FieldCard } from '../FieldCard'
import { StepShell } from '../StepShell'
import { employmentSchema, type EmploymentValues } from '../../model/schemas'
import styles from './EmploymentStep.module.css'

const KINDS = [
  { value: 'employed', label: 'По найму' },
  { value: 'self-employed', label: 'Самозанятый' },
  { value: 'pension', label: 'Пенсия' },
  { value: 'none', label: 'Не работаю' },
] as const

interface EmploymentStepProps {
  defaults: Partial<EmploymentValues>
  onSubmit: (values: EmploymentValues) => void
  pending: boolean
}

export function EmploymentStep({ defaults, onSubmit, pending }: EmploymentStepProps) {
  const { control, register, handleSubmit, formState, setValue } = useForm<EmploymentValues>({
    resolver: zodResolver(employmentSchema),
    defaultValues: {
      employment: defaults.employment ?? 'employed',
      employerInn: defaults.employerInn ?? '',
      monthlyIncome: defaults.monthlyIncome ?? '',
    },
  })
  const errors = formState.errors
  const incomeId = useId()

  // Точечная подписка: watch() целиком делает форму контролируемой.
  const employment = useWatch({ control, name: 'employment' })
  const employerInn = useWatch({ control, name: 'employerInn' })

  const employer = useEmployer(employerInn ?? '')

  return (
    <StepShell
      title="Работа и доход"
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event)
      }}
      submitLabel="Дальше"
      pending={pending}
    >
      <FieldCard>
        <div className={styles.group}>
          <span className={styles.caption}>Занятость</span>
          <SegmentedControl
            options={KINDS}
            value={employment}
            onChange={(value) => {
              setValue('employment', value, { shouldValidate: true })
            }}
            ariaLabel="Занятость"
          />
        </div>

        {employment === 'employed' ? (
          <div className={styles.group}>
            <TextField
              label="ИНН работодателя"
              numeric
              inputMode="numeric"
              maxLength={12}
              {...register('employerInn')}
              error={errors.employerInn?.message}
            />
            {employer.data ? (
              <span className={styles.found}>{employer.data.name} — нашли по ИНН</span>
            ) : null}
          </div>
        ) : null}

        <div className={styles.group}>
          <label className={styles.caption} htmlFor={incomeId}>
            Доход в месяц
          </label>
          <div
            className={[styles.income, errors.monthlyIncome ? styles.incomeInvalid : '']
              .filter(Boolean)
              .join(' ')}
          >
            <input
              id={incomeId}
              className={styles.incomeInput}
              inputMode="numeric"
              placeholder="0"
              aria-invalid={errors.monthlyIncome ? true : undefined}
              {...register('monthlyIncome')}
            />
            <span className={styles.currency} aria-hidden="true">
              ₽
            </span>
          </div>
          {errors.monthlyIncome?.message ? (
            <span className={styles.error} role="alert">
              {errors.monthlyIncome.message}
            </span>
          ) : (
            <span className={styles.hint}>
              Указывайте доход после налогов — так расчёт ПДН будет точнее
            </span>
          )}
        </div>
      </FieldCard>
    </StepShell>
  )
}
