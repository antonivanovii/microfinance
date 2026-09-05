import type { ReactNode } from 'react'
import { MASCOTS, OBJECTS, type MascotName } from '@ds/assets'
import styles from './AuthLayout.module.css'

interface AuthLayoutProps {
  title: string
  subtitle?: ReactNode
  /** Показывается только на мобильном: на десктопе место занимает панель слева. */
  mascot?: MascotName
  onBack?: () => void
  children: ReactNode
}

const ASIDE_STEPS = [
  { name: 'Код из SMS', text: 'Приходит за несколько секунд, действует 15 минут' },
  { name: 'Проверка условий', text: 'Для повторных клиентов — три экрана вместо семи' },
  { name: 'Деньги на карту', text: 'Обычно пара минут после подписания' },
]

export function AuthLayout({ title, subtitle, mascot, onBack, children }: AuthLayoutProps) {
  return (
    <div className={styles.root}>
      <div className={styles.topbar}>
        <span className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">
            ₽
          </span>
          Рублик
        </span>
        <a className={styles.phone} href="tel:+78007002299">
          8 800 700-22-99
        </a>
      </div>

      <div className={styles.shell}>
        <aside className={styles.aside}>
          <h2 className={styles.asideTitle}>Войдите по номеру телефона</h2>
          <p className={styles.asideLead}>
            Пароля нет — только код из SMS. Если вы уже брали займ, попадёте в свой кабинет; если
            нет — начнём заявку.
          </p>
          <ol className={styles.steps}>
            {ASIDE_STEPS.map((step, index) => (
              <li key={step.name} className={styles.step}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <p className={styles.stepName}>{step.name}</p>
                  <p className={styles.stepText}>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className={styles.asideNote}>
            <img className={styles.asideNoteIcon} src={OBJECTS.shield} alt="" />
            Данные передаются по защищённому каналу. Номер карты целиком мы не храним
          </p>
        </aside>

        <div className={styles.form}>
          {onBack ? (
            <button type="button" className={styles.back} onClick={onBack} aria-label="Назад">
              ‹
            </button>
          ) : null}

          {mascot ? <img className={styles.mascot} src={MASCOTS[mascot]} alt="" /> : null}

          <h1 className={styles.title}>{title}</h1>
          {subtitle === undefined ? null : <p className={styles.subtitle}>{subtitle}</p>}

          {children}
        </div>
      </div>
    </div>
  )
}
