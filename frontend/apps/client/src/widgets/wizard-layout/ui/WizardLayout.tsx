import type { ReactNode } from 'react'
import type { StepDescriptor } from '@entities/application'
import styles from './WizardLayout.module.css'

interface WizardLayoutProps {
  step: StepDescriptor
  /** Показывается, когда сервер подтвердил приём предыдущего шага. */
  saved: boolean
  onBack: () => void
  onExit: () => void
  aside?: ReactNode
  children: ReactNode
}

export function WizardLayout({ step, saved, onBack, onExit, aside, children }: WizardLayoutProps) {
  return (
    <div className={styles.root}>
      <div className={styles.topbar}>
        <span className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">
            ₽
          </span>
          Рублик
        </span>

        <div className={styles.track}>
          <div className={styles.bar}>
            <button type="button" className={styles.back} onClick={onBack} aria-label="Назад">
              ‹
            </button>
            <span className={styles.counter}>
              Шаг {step.index} из {step.total} · {step.title}
            </span>
          </div>

          <div
            className={styles.progress}
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={step.total}
            aria-valuenow={step.index}
            aria-label="Прогресс анкеты"
          >
            {Array.from({ length: step.total }, (_, index) => (
              <span
                key={index}
                className={[styles.segment, index < step.index ? styles.done : '']
                  .filter(Boolean)
                  .join(' ')}
              />
            ))}
          </div>
        </div>

        {saved ? <span className={styles.saved}>Черновик сохранён</span> : null}
        <button type="button" className={styles.exit} onClick={onExit}>
          Выйти
        </button>
      </div>

      <div className={styles.shell}>
        <div className={styles.form}>{children}</div>
        {aside === undefined ? null : <aside className={styles.aside}>{aside}</aside>}
      </div>
    </div>
  )
}
