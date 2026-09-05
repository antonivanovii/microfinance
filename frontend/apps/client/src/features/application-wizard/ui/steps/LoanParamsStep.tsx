import { formatDayMonth, formatMoneyWhole, formatPercent } from '@ds/lib'
import { AmountSlider, SegmentedControl, Skeleton } from '@ds/ui'
import { useLoanParams } from '@entities/loan-offer'
import { StepShell } from '../StepShell'
import styles from './LoanParamsStep.module.css'

interface LoanParamsStepProps {
  onSubmit: (values: { amount: string; termDays: number }) => void
  pending: boolean
}

/** Значения перенесены из калькулятора: клиент их подтверждает, а не вводит заново. */
export function LoanParamsStep({ onSubmit, pending }: LoanParamsStepProps) {
  const { params, quote, amount, amountIndex, termDays, setAmountIndex, setTermDays } =
    useLoanParams()

  if (!params.data || !amount) {
    return (
      <div className={styles.card}>
        <Skeleton height="52px" radius="12px" />
        <Skeleton height="120px" radius="18px" />
      </div>
    )
  }

  const { amounts, terms } = params.data
  const first = amounts[0]
  const last = amounts[amounts.length - 1]

  return (
    <StepShell
      title="Проверьте условия"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit({ amount: amount.amount, termDays })
      }}
      submitLabel="Продолжить"
      pending={pending}
      note={
        <>
          Заполнение анкеты не влияет
          <br />
          на кредитную историю
        </>
      }
    >
      <div className={styles.card}>
        <span className={styles.caption}>Сумма</span>
        <AmountSlider
          formattedValue={formatMoneyWhole(amount, { symbol: true })}
          step={amountIndex}
          stepCount={amounts.length}
          onStepChange={setAmountIndex}
          formattedMin={first ? formatMoneyWhole(first, { symbol: true }) : ''}
          formattedMax={last ? formatMoneyWhole(last, { symbol: true }) : ''}
          ariaLabel="Сумма займа"
          ariaValueText={formatMoneyWhole(amount, { symbol: true })}
        />

        <div className={styles.term}>
          <span className={styles.caption}>Срок</span>
          <SegmentedControl
            options={terms.map((term) => ({ value: String(term.days), label: term.label }))}
            value={String(termDays)}
            onChange={(value) => {
              setTermDays(Number(value))
            }}
            ariaLabel="Срок займа"
          />
        </div>
      </div>

      {quote.data ? (
        <div className={styles.summary}>
          <div className={styles.line}>
            <span className={styles.caption}>К возврату</span>
            <span className={styles.value}>
              {formatMoneyWhole(quote.data.totalDue, { symbol: true })}
            </span>
          </div>
          <div className={styles.line}>
            <span className={styles.caption}>Дата платежа</span>
            <span className={styles.value}>{formatDayMonth(quote.data.dueDate)}</span>
          </div>
          <div className={styles.line}>
            <span className={styles.caption}>ПСК</span>
            <span className={styles.value}>{formatPercent(quote.data.fullCostRate)}</span>
          </div>
        </div>
      ) : (
        <Skeleton height="108px" radius="20px" />
      )}
    </StepShell>
  )
}
