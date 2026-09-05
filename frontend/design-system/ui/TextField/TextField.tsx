import { useId, type InputHTMLAttributes, type Ref } from 'react'
import styles from './TextField.module.css'

type NativeProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'id' | 'aria-invalid' | 'aria-describedby'
>

interface TextFieldProps extends NativeProps {
  label: string
  hint?: string | undefined
  error?: string | undefined
  numeric?: boolean
  ref?: Ref<HTMLInputElement>
}

export function TextField({
  label,
  hint,
  error,
  numeric = false,
  disabled,
  placeholder,
  ref,
  ...rest
}: TextFieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? hint

  return (
    <div className={styles.root}>
      <div
        className={[
          styles.field,
          // Свой плейсхолдер и метка-плейсхолдер не могут занимать одно место.
          placeholder ? styles.withPlaceholder : '',
          error ? styles.invalid : '',
          disabled ? styles.disabled : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <input
          {...rest}
          ref={ref}
          id={id}
          disabled={disabled}
          placeholder={placeholder ?? ' '}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={[styles.input, numeric ? styles.numeric : ''].filter(Boolean).join(' ')}
        />
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      </div>

      {message ? (
        <span
          id={messageId}
          className={error ? styles.error : styles.hint}
          role={error ? 'alert' : undefined}
        >
          {message}
        </span>
      ) : null}
    </div>
  )
}
