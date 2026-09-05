import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { formatMoneyWhole } from '@ds/lib'
import { ConsentItem } from '@ds/ui'
import type { ApplicationDraft } from '@entities/application'
import { ROUTES, type LegalDocument } from '@shared/config'
import { FieldCard } from '../FieldCard'
import { StepShell } from '../StepShell'
import { consentsSchema, type ConsentsValues } from '../../model/schemas'
import styles from './ConsentsStep.module.css'

/**
 * Раздельные чекбоксы, никакого «согласен со всем». Ни один не предустановлен,
 * включая обязательные: галочка за клиента — имитация согласия, а не согласие.
 */
const CONSENTS: {
  name: keyof ConsentsValues
  label: string
  document: LegalDocument
  linkText: string
  required: boolean
  note?: string
}[] = [
  {
    name: 'personalData',
    label: 'Обработка персональных данных',
    document: 'privacy',
    linkText: 'текст согласия',
    required: true,
  },
  {
    name: 'creditHistory',
    label: 'Запрос кредитной истории в бюро',
    document: 'terms',
    linkText: 'текст согласия',
    required: true,
  },
  {
    name: 'pep',
    label: 'Использование простой электронной подписи',
    document: 'pep',
    linkText: 'соглашение о ПЭП',
    required: true,
  },
  {
    name: 'marketing',
    label: 'Реклама и предложения партнёров',
    document: 'privacy',
    linkText: 'подробнее',
    required: false,
    note: 'Не обязательно, отключается в профиле',
  },
]

interface ConsentsStepProps {
  draft: ApplicationDraft
  onSubmit: (values: ConsentsValues) => void
  pending: boolean
}

export function ConsentsStep({ draft, onSubmit, pending }: ConsentsStepProps) {
  const { control, handleSubmit, formState } = useForm<ConsentsValues>({
    resolver: zodResolver(consentsSchema),
    defaultValues: {
      personalData: false,
      creditHistory: false,
      pep: false,
      marketing: false,
    },
  })

  return (
    <StepShell
      title="Согласия"
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event)
      }}
      submitLabel="Отправить заявку"
      pending={pending}
    >
      <FieldCard>
        {CONSENTS.map((consent) => (
          <Controller
            key={consent.name}
            control={control}
            name={consent.name}
            render={({ field }) => (
              <ConsentItem
                checked={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                required={consent.required}
                error={formState.errors[consent.name]?.message}
                meta={
                  <>
                    {consent.note ? `${consent.note} · ` : null}
                    <Link to={ROUTES.legal(consent.document)}>{consent.linkText}</Link>
                  </>
                }
              >
                {consent.label}
              </ConsentItem>
            )}
          />
        ))}
      </FieldCard>

      <div className={styles.summary}>
        <p className={styles.summaryTitle}>Заявка</p>
        {draft.quote ? (
          <>
            <div className={styles.line}>
              <span>Сумма и срок</span>
              <span className={styles.value}>
                {formatMoneyWhole(draft.quote.principal, { symbol: true })} · {draft.quote.termDays}{' '}
                дней
              </span>
            </div>
            <div className={styles.line}>
              <span>К возврату</span>
              <span className={styles.value}>
                {formatMoneyWhole(draft.quote.totalDue, { symbol: true })}
              </span>
            </div>
          </>
        ) : null}
        {draft.card ? (
          <div className={styles.line}>
            <span>Карта</span>
            <span className={styles.value}>
              {draft.card.brand} · {draft.card.last4}
            </span>
          </div>
        ) : null}
      </div>
    </StepShell>
  )
}
