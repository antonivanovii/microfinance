import type { ReactNode } from 'react'
import styles from './Callout.module.css'

type CalloutTone = 'info' | 'warning' | 'danger'

interface CalloutProps {
  tone?: CalloutTone
  action?: { label: string; onClick: () => void }
  children: ReactNode
}

const BADGE: Record<CalloutTone, string> = {
  info: 'i',
  warning: '!',
  danger: '!',
}

export function Callout({ tone = 'info', action, children }: CalloutProps) {
  return (
    <div
      className={[styles.root, styles[tone], action ? styles.centered : '']
        .filter(Boolean)
        .join(' ')}
      role={tone === 'danger' ? 'alert' : undefined}
    >
      <span className={styles.badge} aria-hidden="true">
        {BADGE[tone]}
      </span>
      <span className={styles.text}>{children}</span>
      {action ? (
        <button type="button" className={styles.action} onClick={action.onClick}>
          {action.label}
        </button>
      ) : null}
    </div>
  )
}
