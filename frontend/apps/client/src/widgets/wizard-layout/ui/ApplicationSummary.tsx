import { formatDayMonth, formatMoneyWhole, formatPercent } from '@ds/lib'
import type { ApplicationDraft } from '@entities/application'
import { useLoanParams } from '@entities/loan-offer'
import styles from './ApplicationSummary.module.css'

const NEXT = [
  'Решение — обычно 3 минуты, максимум 15',
  'Подписание пакета кодом из SMS',
  'Деньги на карту сразу после подписания',
]

/** Боковая сводка десктопа: клиент всё время видит, на что соглашается. */
export function ApplicationSummary({ draft }: { draft: ApplicationDraft }) {
  // На первом шаге расчёт ещё не сдан на сервер — берём текущий выбор.
  const live = useLoanParams()
  const quote = draft.quote ?? live.quote.data ?? null

  return (
    <>
      {quote ? (
        <section className={styles.card} aria-label="Ваша заявка">
          <h2 className={styles.title}>Ваша заявка</h2>

          <div className={styles.total}>
            <span>К возврату</span>
            <span className={styles.totalValue}>
              {formatMoneyWhole(quote.totalDue, { symbol: true })}
            </span>
          </div>
          <div className={styles.line}>
            <span>Дата платежа</span>
            <span className={styles.value}>{formatDayMonth(quote.dueDate)}</span>
          </div>
          <div className={styles.line}>
            <span>Проценты</span>
            <span className={styles.value}>
              {formatMoneyWhole(quote.interest, { symbol: true })}
            </span>
          </div>
          <div className={styles.line}>
            <span>Ставка</span>
            <span className={styles.value}>
              {quote.interestFree ? '0 % — первый займ' : '0,8 % в день'}
            </span>
          </div>

          <div className={styles.psk}>
            <span className={styles.pskLabel}>Полная стоимость кредита</span>
            <span className={styles.pskValue}>{formatPercent(quote.fullCostRate)}</span>
          </div>
        </section>
      ) : null}

      <section className={styles.next} aria-label="Что дальше">
        <h2 className={styles.nextTitle}>Что дальше</h2>
        <ul className={styles.steps}>
          {NEXT.map((item) => (
            <li key={item} className={styles.step}>
              <span className={styles.dot} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
