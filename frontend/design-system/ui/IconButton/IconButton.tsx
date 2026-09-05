import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './IconButton.module.css'

interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className' | 'aria-label'
> {
  label: string
  size?: 'lg' | 'md' | 'sm'
  plain?: boolean
  children: ReactNode
}

export function IconButton({
  label,
  size = 'lg',
  plain = false,
  type = 'button',
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      aria-label={label}
      title={label}
      className={[styles.root, size === 'lg' ? '' : styles[size], plain ? styles.plain : '']
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  )
}
