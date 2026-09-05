import styles from './SelectList.module.css'

export interface SelectOption<T extends string> {
  value: T
  label: string
  hint?: string
  disabled?: boolean
}

interface SelectListProps<T extends string> {
  options: readonly SelectOption<T>[]
  value: T | null
  onChange: (value: T) => void
  ariaLabel: string
}

export function SelectList<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: SelectListProps<T>) {
  const selectable = options.filter((option) => !option.disabled)

  const move = (delta: number) => {
    if (selectable.length === 0) return
    const index = selectable.findIndex((option) => option.value === value)
    const next = selectable[(index + delta + selectable.length) % selectable.length]
    if (next) onChange(next.value)
  }

  return (
    <div
      className={styles.root}
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={(event) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
          event.preventDefault()
          move(-1)
        }
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
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
            disabled={option.disabled}
            onClick={() => {
              onChange(option.value)
            }}
            className={[styles.option, selected ? styles.selected : ''].filter(Boolean).join(' ')}
          >
            <span className={styles.label}>
              {option.label}
              {option.hint === undefined ? null : (
                <span className={styles.hint}>{option.hint}</span>
              )}
            </span>
            {selected ? (
              <span className={styles.mark} aria-hidden="true">
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
                  <path d="M2.5 7.5 5.5 10.5 11.5 3.5" />
                </svg>
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
