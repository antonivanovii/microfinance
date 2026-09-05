import type { CSSProperties } from 'react'
import styles from './AmountSlider.module.css'

// Работает в шагах, а не в рублях: шкалу и сумму считает сервер.
interface AmountSliderProps {
  formattedValue: string
  step: number
  stepCount: number
  onStepChange: (step: number) => void
  formattedMin: string
  formattedMax: string
  disabled?: boolean
  ariaLabel: string
  ariaValueText: string
}

export function AmountSlider({
  formattedValue,
  step,
  stepCount,
  onStepChange,
  formattedMin,
  formattedMax,
  disabled = false,
  ariaLabel,
  ariaValueText,
}: AmountSliderProps) {
  const lastStep = Math.max(1, stepCount - 1)
  const fill = `${String((step / lastStep) * 100)}%`

  return (
    <div className={styles.root}>
      <div className={styles.value}>{formattedValue}</div>

      <div className={styles.control}>
        <input
          className={styles.input}
          style={{ '--fill': fill } as CSSProperties}
          type="range"
          min={0}
          max={lastStep}
          step={1}
          value={step}
          disabled={disabled}
          onChange={(event) => {
            onStepChange(Number(event.target.value))
          }}
          aria-label={ariaLabel}
          aria-valuetext={ariaValueText}
        />
      </div>

      <div className={styles.bounds}>
        <span>{formattedMin}</span>
        <span>{formattedMax}</span>
      </div>
    </div>
  )
}
