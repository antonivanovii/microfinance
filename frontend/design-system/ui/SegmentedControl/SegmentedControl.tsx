import styles from './SegmentedControl.module.css'

export interface Segment<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  options: readonly Segment<T>[]
  value: T
  onChange: (value: T) => void
  disabled?: boolean
  ariaLabel: string
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  disabled = false,
  ariaLabel,
}: SegmentedControlProps<T>) {
  const move = (delta: number) => {
    const index = options.findIndex((option) => option.value === value)
    const next = options[(index + delta + options.length) % options.length]
    if (next) onChange(next.value)
  }

  return (
    <div
      className={styles.root}
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault()
          move(-1)
        }
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault()
          move(1)
        }
      }}
    >
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            disabled={disabled}
            onClick={() => {
              onChange(option.value)
            }}
            className={[styles.option, selected ? styles.selected : ''].filter(Boolean).join(' ')}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
