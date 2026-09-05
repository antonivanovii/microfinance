import {
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
type Size = 'lg' | 'md' | 'sm'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  loading?: boolean
  /**
   * Отдать стили единственному дочернему элементу вместо <button>.
   * Для навигации: ссылка должна остаться ссылкой — открываться в новой
   * вкладке, копироваться, индексироваться.
   */
  asChild?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  loading = false,
  asChild = false,
  disabled,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  const className = [styles.root, styles[size], styles[variant], fullWidth ? styles.fullWidth : '']
    .filter(Boolean)
    .join(' ')

  if (asChild && isValidElement<{ className?: string }>(children)) {
    return cloneElement(children as ReactElement<{ className?: string }>, { className })
  }

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      className={className}
    >
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
      {children}
    </button>
  )
}
