import section from './section.module.css'
import styles from './Examples.module.css'

/**
 * Иллюстрация тарифа из макета, а не живой расчёт: живой считает сервер
 * в калькуляторе выше.
 */
const EXAMPLES = [
  {
    chip: 'Первый займ',
    tone: 'featured' as const,
    amount: '10 000 ₽',
    rows: [
      ['Срок', '14 дней'],
      ['Проценты', '0 ₽'],
    ],
    total: '10 000 ₽',
  },
  {
    chip: 'Повторный',
    tone: 'neutral' as const,
    amount: '15 000 ₽',
    rows: [
      ['Срок', '14 дней'],
      ['Проценты', '2 100 ₽'],
    ],
    total: '17 100 ₽',
  },
  {
    chip: 'Досрочно на 9-й день',
    tone: 'success' as const,
    amount: '15 000 ₽',
    rows: [
      ['Фактический срок', '9 дней'],
      ['Проценты', '1 350 ₽'],
    ],
    total: '16 350 ₽',
  },
]

const CHIP = {
  featured: styles.chipOnFeatured,
  neutral: styles.chipNeutral,
  success: styles.chipSuccess,
}

export function Examples() {
  return (
    <section className={section.section}>
      <div className={section.inner}>
        <div className={section.head}>
          <span className={section.overline}>Сколько стоит</span>
          <h2 className={section.title}>Примеры расчёта</h2>
          <p className={section.lead}>
            Ставка 0,8 % в день, первый займ — без процентов. Досрочное погашение в любой день:
            пересчитаем по фактическому сроку.
          </p>
        </div>

        <div className={styles.grid}>
          {EXAMPLES.map((example) => (
            <div
              key={example.chip}
              className={[styles.card, example.tone === 'featured' ? styles.featured : '']
                .filter(Boolean)
                .join(' ')}
            >
              <span className={[styles.chip, CHIP[example.tone]].join(' ')}>{example.chip}</span>
              <p className={styles.amount}>{example.amount}</p>
              {example.rows.map(([label, value]) => (
                <div key={label} className={styles.row}>
                  <span>{label}</span>
                  <span className={styles.rowValue}>{value}</span>
                </div>
              ))}
              <div className={[styles.row, styles.total].join(' ')}>
                <span>К возврату</span>
                <span className={styles.totalValue}>{example.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
