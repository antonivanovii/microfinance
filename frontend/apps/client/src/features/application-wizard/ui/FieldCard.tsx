import type { ReactNode } from 'react'
import styles from './FieldCard.module.css'

export function FieldCard({ children }: { children: ReactNode }) {
  return <div className={styles.root}>{children}</div>
}
