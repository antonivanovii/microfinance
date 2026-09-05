import type { ReactNode } from 'react'
import { Checkbox } from '../Checkbox'
import styles from './ConsentItem.module.css'

interface ConsentItemProps {
  checked: boolean
  onChange: (checked: boolean) => void
  onBlur?: () => void
  /** Обязательное для продолжения. Помечается, но не предустанавливается. */
  required?: boolean
  disabled?: boolean
  disabledReason?: string
  /** Пояснение и ссылка на документ. Вне метки, чтобы ссылка кликалась. */
  meta?: ReactNode
  error?: string | undefined
  children: ReactNode
}

export function ConsentItem({
  checked,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  disabledReason,
  meta,
  error,
  children,
}: ConsentItemProps) {
  const label = disabled && disabledReason ? disabledReason : children

  return (
    <div className={styles.root}>
      <div className={[styles.control, disabled ? styles.disabled : ''].filter(Boolean).join(' ')}>
        <Checkbox
          checked={checked}
          disabled={disabled}
          onChange={(event) => {
            onChange(event.target.checked)
          }}
          {...(onBlur ? { onBlur } : {})}
        >
          <span className={styles.text}>
            {label}
            {required && !disabled ? (
              <>
                {' '}
                <span className={styles.marker}>·</span>{' '}
                <span className={styles.required}>обязательно</span>
              </>
            ) : null}
          </span>
        </Checkbox>
      </div>

      {meta === undefined ? null : <span className={styles.meta}>{meta}</span>}
      {error === undefined ? null : (
        <span className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
