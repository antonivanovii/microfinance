import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import styles from './Checkbox.module.css'

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'id' | 'type'
> {
  children?: ReactNode
}

export function Checkbox({ children, disabled, ...rest }: CheckboxProps) {
  const id = useId()

  return (
    <label
      htmlFor={id}
      className={[styles.root, disabled ? styles.disabled : ''].filter(Boolean).join(' ')}
    >
      <input {...rest} id={id} type="checkbox" disabled={disabled} className={styles.input} />
      <span className={styles.box} aria-hidden="true">
        <svg
          className={styles.check}
          width="14"
          height="14"
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
      {children === undefined ? null : <span className={styles.label}>{children}</span>}
    </label>
  )
}
