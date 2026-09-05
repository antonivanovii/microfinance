import { useId, type ReactNode } from 'react'
import styles from './Switch.module.css'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  children: ReactNode
}

export function Switch({ checked, onChange, disabled = false, children }: SwitchProps) {
  const id = useId()

  return (
    <label
      htmlFor={id}
      className={[styles.root, checked ? '' : styles.off, disabled ? styles.disabled : '']
        .filter(Boolean)
        .join(' ')}
    >
      <span className={styles.label}>{children}</span>
      <input
        id={id}
        type="checkbox"
        role="switch"
        className={styles.input}
        checked={checked}
        disabled={disabled}
        onChange={(event) => {
          onChange(event.target.checked)
        }}
      />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.knob} />
      </span>
    </label>
  )
}
