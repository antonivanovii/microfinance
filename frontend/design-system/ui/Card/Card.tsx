import type { ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
  padding?: 'padded' | 'roomy' | 'flush'
  raised?: boolean
  children: ReactNode
}

export function Card({ padding = 'padded', raised = false, children }: CardProps) {
  return (
    <div
      className={[styles.root, styles[padding], raised ? styles.raised : '']
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
