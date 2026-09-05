import styles from './StepProgress.module.css'

interface StepProgressProps {
  current: number
  total: number
  label?: string
}

export function StepProgress({ current, total, label }: StepProgressProps) {
  const caption = `Шаг ${String(current)} из ${String(total)}${label ? ` · ${label}` : ''}`

  return (
    <div className={styles.root}>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={caption}
      >
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={[styles.segment, index < current ? styles.done : '']
              .filter(Boolean)
              .join(' ')}
          />
        ))}
      </div>
      <span className={styles.caption}>{caption}</span>
    </div>
  )
}
