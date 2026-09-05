import { formatDayMonth, formatMoneyWhole, formatPercent } from '@ds/lib'
import { AmountSlider, SegmentedControl, Skeleton } from '@ds/ui'
import { useLoanParams } from '@entities/loan-offer'
import styles from './LoanCalculator.module.css'

export function LoanCalculator() {
  const { params, quote, amount, amountIndex, termDays, setAmountIndex, setTermDays } =
    useLoanParams()

  if (params.isPending || !amount) {
    return (
      <div className={styles.root}>
        <Skeleton height="38px" radius="12px" />
        <Skeleton height="32px" radius="12px" />
        <Skeleton height="54px" radius="14px" />
        <Skeleton height="108px" radius="18px" />
      </div>
    )
  }

  if (params.isError) {
    return (
      <div className={styles.root}>
        <p className={styles.caption}>Расчёт временно недоступен. Обновите страницу.</p>
      </div>
    )
  }

  const { amounts, terms } = params.data
  const first = amounts[0]
  const last = amounts[amounts.length - 1]

  return (
    <div className={styles.root}>
      <div className={styles.group}>
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
      </div>

      <div className={styles.group}>
        <span className={styles.caption}>Срок</span>
        <SegmentedControl
          options={terms.map((t) => ({ value: String(t.days), label: t.label }))}
          value={String(termDays)}
          onChange={(value) => {
            setTermDays(Number(value))
          }}
          ariaLabel="Срок займа"
        />
      </div>

      {quote.data ? (
        <div className={styles.summary}>
          <div className={styles.line}>
            <span className={styles.lineLabel}>Вернуть</span>
            <span className={styles.total}>
              {formatMoneyWhole(quote.data.totalDue, { symbol: true })}
            </span>
          </div>
          <div className={styles.line}>
            <span className={styles.lineLabel}>Дата платежа</span>
            <span className={styles.value}>{formatDayMonth(quote.data.dueDate)}</span>
          </div>
          <div className={styles.line}>
            <span className={styles.lineLabel}>ПСК</span>
            <span
              className={[styles.value, quote.data.interestFree ? styles.free : '']
                .filter(Boolean)
                .join(' ')}
            >
              {formatPercent(quote.data.fullCostRate)}
            </span>
          </div>
        </div>
      ) : (
        <Skeleton height="108px" radius="18px" />
      )}
    </div>
  )
}
