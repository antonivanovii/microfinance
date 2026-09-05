import type { ReactNode } from 'react'
import styles from './StatusChip.module.css'

export type StatusTone = 'success' | 'info' | 'warning' | 'danger' | 'neutral'

interface StatusChipProps {
  tone?: StatusTone
  children: ReactNode
}

export function StatusChip({ tone = 'neutral', children }: StatusChipProps) {
  return <span className={[styles.root, styles[tone]].join(' ')}>{children}</span>
}
