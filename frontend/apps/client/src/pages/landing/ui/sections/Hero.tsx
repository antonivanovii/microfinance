import { OBJECTS } from '@ds/assets'
import { LoanCalculator } from '@features/loan-calculator'
import { SiteHeader } from '@widgets/site-header'
import styles from './Hero.module.css'

const CHIPS = ['Без справок', 'Решение 3 мин', 'На карту']

const STATS = [
  { value: '3 мин', label: 'среднее решение' },
  { value: '0 %', label: 'первый займ' },
  { value: '24/7', label: 'приём заявок' },
]

export function Hero() {
  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <SiteHeader />
      </div>

      <div className={styles.banner}>
        <img className={styles.object} src={OBJECTS.notes} alt="" />
        <h1 className={styles.title}>Займ до 30 000 ₽ на 30 дней</h1>
        <p className={styles.subtitle}>Первый займ — без процентов. Деньги на карту за 3 минуты</p>
        <ul className={styles.chips}>
          {CHIPS.map((chip) => (
            <li key={chip} className={styles.chip}>
              {chip}
            </li>
          ))}
        </ul>
        <dl className={styles.stats}>
          {STATS.map((stat) => (
            <div key={stat.value} className={styles.stat}>
              <dt className={styles.statValue}>{stat.value}</dt>
              <dd className={styles.statLabel}>{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className={styles.calculator} id="calculator">
        <LoanCalculator />
      </div>
    </section>
  )
}
