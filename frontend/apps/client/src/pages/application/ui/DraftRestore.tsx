import { MASCOTS } from '@ds/assets'
import { formatDateTime, pluralize } from '@ds/lib'
import { Button } from '@ds/ui'
import type { ApplicationDraft } from '@entities/application'
import styles from './DraftRestore.module.css'

interface DraftRestoreProps {
  draft: ApplicationDraft
  onContinue: () => void
  onRestart: () => void
  restarting: boolean
}

/**
 * Черновик хранится на сервере, а не в браузере: человек начал в метро с
 * телефона и продолжает вечером с ноутбука — это нормальный сценарий.
 */
export function DraftRestore({ draft, onContinue, onRestart, restarting }: DraftRestoreProps) {
  const step = draft.currentStep
  const done = draft.completedSteps.length
  const total = step?.total ?? draft.completedSteps.length

  return (
    <div className={styles.root}>
      <div className={styles.body}>
        <img className={styles.mascot} src={MASCOTS.docs} alt="" />
        <h1 className={styles.title}>
          {step ? `Продолжим с шага ${step.index}?` : 'Продолжим заявку?'}
        </h1>
        <p className={styles.lead}>
          {draft.savedAt
            ? `Мы сохранили всё, что вы ввели ${formatDateTime(draft.savedAt)}.`
            : 'Мы сохранили всё, что вы успели ввести.'}
          {step ? ` Осталось: ${step.title.toLowerCase()}.` : ''}
        </p>

        <div className={styles.progress}>
          <span className={styles.progressLabel}>Заполнено</span>
          <span className={styles.progressValue}>
            {done} из {pluralize(total, ['шага', 'шагов', 'шагов'])}
          </span>
        </div>

        <div className={styles.actions}>
          <Button size="lg" fullWidth onClick={onContinue}>
            Продолжить
          </Button>
          <Button variant="ghost" size="lg" fullWidth loading={restarting} onClick={onRestart}>
            Начать заново
          </Button>
        </div>

        <p className={styles.note}>
          Черновик живёт 30 дней. Условия при возврате пересчитываются по актуальным тарифам.
        </p>
      </div>
    </div>
  )
}
