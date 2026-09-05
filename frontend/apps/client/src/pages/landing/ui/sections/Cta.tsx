import { Link } from 'react-router-dom'
import { MASCOTS } from '@ds/assets'
import { ROUTES } from '@shared/config'
import styles from './Cta.module.css'

export function Cta() {
  return (
    <section className={styles.root}>
      <div className={styles.body}>
        <h2 className={styles.title}>Посчитайте свой платёж прямо сейчас</h2>
        <p className={styles.note}>
          Расчёт ни к чему не обязывает и не влияет на кредитную историю.
        </p>
        <div className={styles.actions}>
          <a href="#calculator" className={styles.primary}>
            Получить деньги
          </a>
          <Link to={ROUTES.login} className={styles.secondary}>
            Войти в кабинет
          </Link>
        </div>
      </div>
      <img className={styles.mascot} src={MASCOTS.hello} alt="" />
    </section>
  )
}
