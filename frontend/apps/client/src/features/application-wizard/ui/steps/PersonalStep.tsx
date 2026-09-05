import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField } from '@ds/ui'
import { FieldCard } from '../FieldCard'
import { StepShell } from '../StepShell'
import { personalSchema, type PersonalValues } from '../../model/schemas'
import styles from './PersonalStep.module.css'

interface PersonalStepProps {
  defaults: Partial<PersonalValues>
  onSubmit: (values: PersonalValues) => void
  onUseEsia: () => void
  pending: boolean
  esiaPending: boolean
}

export function PersonalStep({
  defaults,
  onSubmit,
  onUseEsia,
  pending,
  esiaPending,
}: PersonalStepProps) {
  const { register, handleSubmit, formState } = useForm<PersonalValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      lastName: defaults.lastName ?? '',
      firstName: defaults.firstName ?? '',
      middleName: defaults.middleName ?? '',
      birthDate: defaults.birthDate ?? '',
    },
  })
  const errors = formState.errors

  return (
    <StepShell
      title="Как вас зовут"
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event)
      }}
      submitLabel="Дальше"
      pending={pending}
    >
      {/* Госуслуги предлагаются первыми — они вырезают три экрана из семи. */}
      <button type="button" className={styles.esia} onClick={onUseEsia} disabled={esiaPending}>
        <span className={styles.esiaMark} aria-hidden="true">
          ЕСИА
        </span>
        <span>
          <span className={styles.esiaTitle}>
            {esiaPending ? 'Получаем данные…' : 'Заполнить с Госуслуг'}
          </span>
          <span className={styles.esiaText}>Данные, паспорт и адрес — за 40 секунд</span>
        </span>
      </button>

      <div className={styles.divider}>или вручную</div>

      <FieldCard>
        <TextField
          label="Фамилия"
          autoComplete="family-name"
          {...register('lastName')}
          error={errors.lastName?.message}
        />
        <TextField
          label="Имя"
          autoComplete="given-name"
          {...register('firstName')}
          error={errors.firstName?.message}
        />
        <TextField label="Отчество" autoComplete="additional-name" {...register('middleName')} />
        <TextField
          label="Дата рождения"
          type="date"
          numeric
          {...register('birthDate')}
          error={errors.birthDate?.message}
        />
      </FieldCard>
    </StepShell>
  )
}
