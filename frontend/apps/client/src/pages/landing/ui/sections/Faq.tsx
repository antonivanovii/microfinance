import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@shared/config'
import section from './section.module.css'
import styles from './Faq.module.css'

const QUESTIONS = [
  {
    q: 'Что будет, если не заплатить вовремя',
    a: 'Со следующего дня начисляется пеня 0,1 % в день от суммы долга. Переплата по закону ограничена 130 % от суммы займа — больше долг не вырастет. Если платить нечем, напишите нам: подберём график, это выгоднее просрочки.',
  },
  {
    q: 'Можно ли погасить раньше срока',
    a: 'Да, в любой день и без комиссий. В кабинете видно точную сумму на сегодня — проценты пересчитываются по фактическому сроку пользования.',
  },
  {
    q: 'Звоните ли вы родственникам и на работу',
    a: 'Нет. Контакты близких мы не запрашиваем при оформлении и не обзваниваем. Общаемся только с вами и только по вашему номеру.',
  },
  {
    q: 'Почему отказали и когда можно снова',
    a: 'Причину отказа мы не раскрываем — таково требование к оценке риска. Дату, с которой можно подать новую заявку, всегда показываем на экране отказа.',
  },
  {
    q: 'Как отозвать согласие на рекламу',
    a: 'Одной кнопкой в разделе «Профиль и согласия». Отзыв действует немедленно и не влияет на действующий договор.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const id = useId()

  return (
    <section className={[section.section, section.tinted].join(' ')} id="faq">
      <div className={section.inner}>
        <div className={styles.layout}>
          <div className={styles.aside}>
            <div className={section.head}>
              <span className={section.overline}>Вопросы</span>
              <h2 className={section.title}>Частые вопросы</h2>
              <p className={section.lead}>
                Не нашли ответ — напишите в чат, отвечаем без ботов в первой линии.
              </p>
            </div>
            <Link className={styles.all} to={ROUTES.legal('contacts')}>
              Все вопросы
            </Link>
          </div>

          <div className={styles.card}>
            {QUESTIONS.map((item, index) => {
              const isOpen = open === index
              return (
                <div key={item.q} className={styles.item}>
                  <button
                    type="button"
                    className={styles.trigger}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-${String(index)}`}
                    onClick={() => {
                      setOpen(isOpen ? null : index)
                    }}
                  >
                    {item.q}
                    <span className={styles.sign} aria-hidden="true">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  <div id={`${id}-${String(index)}`} className={styles.answer} hidden={!isOpen}>
                    {item.a}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
