import section from './section.module.css'
import styles from './Steps.module.css'

const STEPS = [
  { name: 'Выберите сумму', text: 'Сразу видно дату платежа и итог к возврату' },
  { name: 'Заполните анкету', text: 'Семь коротких шагов. Через Госуслуги — три' },
  { name: 'Получите решение', text: 'Автоматически, без звонков' },
  { name: 'Подпишите и заберите', text: 'Подпись — код из SMS, деньги уходят сразу' },
]

export function Steps() {
  return (
    <section className={section.section}>
      <div className={section.inner}>
        <div className={section.head}>
          <span className={section.overline}>Как получить деньги</span>
          <h2 className={section.title}>Четыре шага, три минуты</h2>
        </div>
        <ol className={styles.list}>
          {STEPS.map((step, index) => (
            <li key={step.name} className={styles.item}>
              <span className={styles.number} aria-hidden="true">
                {index + 1}
              </span>
              <div>
                <p className={styles.name}>{step.name}</p>
                <p className={styles.text}>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
