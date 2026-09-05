import type { ReactNode } from 'react'
import styles from './Toast.module.css'

interface ToastProps {
  action?: { label: string; onClick: () => void }
  children: ReactNode
}

export function Toast({ action, children }: ToastProps) {
  return (
    <div className={styles.root} role="status">
      <span className={styles.text}>{children}</span>
      {action ? (
        <button type="button" className={styles.action} onClick={action.onClick}>
          {action.label}
        </button>
      ) : null}
    </div>
  )
}
