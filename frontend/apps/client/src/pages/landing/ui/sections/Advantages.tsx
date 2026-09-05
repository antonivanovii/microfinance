import { OBJECTS } from '@ds/assets'
import section from './section.module.css'
import styles from './Advantages.module.css'

const ITEMS = [
  {
    icon: OBJECTS.clock,
    name: 'Решение за 3 минуты',
    text: 'Автоматически, без звонков. Если понадобится специалист — скажем сразу и назовём срок',
  },
  {
    icon: OBJECTS.cards,
    name: 'Деньги на вашу карту',
    text: 'Карту проверяем до одобрения, а не в момент выплаты. Списанием 1 ₽ с возвратом',
  },
  {
    icon: OBJECTS.shield,
    name: 'Без звонков родным',
    text: 'Контакты близких не спрашиваем и не обзваниваем. Общаемся только с вами',
  },
]

export function Advantages() {
  return (
    <section className={[section.section, styles.root].join(' ')}>
      <div className={section.inner}>
        <ul className={styles.grid}>
          {ITEMS.map((item) => (
            <li key={item.name} className={styles.card}>
              <img className={styles.icon} src={item.icon} alt="" />
              <div>
                <p className={styles.name}>{item.name}</p>
                <p className={styles.text}>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
