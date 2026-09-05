import { Link } from 'react-router-dom'
import { ROUTES } from '@shared/config'
import styles from './SiteHeader.module.css'

const NAV = [
  { href: '#calculator', label: 'Займ' },
  { href: '#requirements', label: 'Условия' },
  { href: '#faq', label: 'Вопросы' },
  { href: '#about', label: 'О компании' },
]

export function SiteHeader() {
  return (
    <header className={styles.root}>
      <Link to={ROUTES.landing} className={styles.brand}>
        <span className={styles.mark} aria-hidden="true">
          ₽
        </span>
        <span className={styles.name}>Рублик</span>
      </Link>

      <nav className={styles.nav} aria-label="Разделы сайта">
        {NAV.map((item) => (
          <a key={item.href} href={item.href} className={styles.navLink}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className={styles.actions}>
        <a className={styles.phone} href="tel:+78007002299">
          8 800 700-22-99
        </a>
        <Link to={ROUTES.login} className={styles.login}>
          Войти
        </Link>
        <a href="#calculator" className={styles.cta}>
          Оформить займ
        </a>
      </div>
    </header>
  )
}
