import { OBJECTS } from '@ds/assets'
import section from './section.module.css'
import styles from './Requirements.module.css'

const APPROVE = [
  'Гражданство РФ и постоянная регистрация',
  'Возраст от 21 до 65 лет',
  'Свой доход — зарплата, самозанятость, ИП или пенсия',
  'Карта МИР, оформленная на ваше имя',
]

const EXCLUDE = ['Действующая процедура банкротства']

const NEEDED = [
  ['Паспорт РФ', 'фото главной страницы'],
  ['Телефон', 'для кода из SMS'],
  ['Карта', 'проверим списанием 1 ₽'],
  ['ИНН работодателя', 'если работаете по найму'],
]

function Badge({ no = false }: { no?: boolean }) {
  return (
    <span
      className={[styles.badge, no ? styles.badgeNo : ''].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {no ? <path d="M4 4 10 10M10 4 4 10" /> : <path d="M2.5 7.5 5.5 10.5 11.5 3.5" />}
      </svg>
    </span>
  )
}

export function Requirements() {
  return (
    <section className={[section.section, section.tinted].join(' ')} id="requirements">
      <div className={section.inner}>
        <div className={styles.layout}>
          <div className={styles.main}>
            <div className={section.head}>
              <span className={section.overline}>Требования</span>
              <h2 className={section.title}>Кому одобряем</h2>
              <p className={section.lead}>
                Список короткий и честный. Если что-то из этого не про вас — заявку лучше не
                подавать: отказ попадёт в кредитную историю.
              </p>
            </div>

            <ul className={styles.list}>
              {APPROVE.map((item) => (
                <li key={item} className={styles.item}>
                  <Badge />
                  {item}
                </li>
              ))}
              {EXCLUDE.map((item) => (
                <li key={item} className={[styles.item, styles.excluded].join(' ')}>
                  <Badge no />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <img className={styles.cardIcon} src={OBJECTS.doc} alt="" />
              <div>
                <p className={styles.cardTitle}>Что понадобится</p>
                <p className={styles.cardNote}>Справки о доходах не нужны</p>
              </div>
            </div>
            {NEEDED.map(([name, hint]) => (
              <div key={name} className={styles.row}>
                <span className={styles.rowName}>{name}</span>
                <span className={styles.rowHint}>{hint}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
