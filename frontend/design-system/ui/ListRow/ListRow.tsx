import type { ReactNode } from 'react'
import styles from './ListRow.module.css'

type Tone = 'success' | 'neutral' | 'accent'

interface ListRowProps {
  tile?: ReactNode
  tone?: Tone
  title: string
  subtitle?: string
  amount?: string
  onClick?: () => void
}

const TILE: Record<Tone, string> = {
  success: styles.tileSuccess ?? '',
  neutral: styles.tileNeutral ?? '',
  accent: styles.tileAccent ?? '',
}

export function ListRow({
  tile,
  tone = 'neutral',
  title,
  subtitle,
  amount,
  onClick,
}: ListRowProps) {
  const content = (
    <>
      <span className={styles.main}>
        {tile === undefined ? null : (
          <span className={[styles.tile, TILE[tone]].join(' ')} aria-hidden="true">
            {tile}
          </span>
        )}
        <span className={styles.text}>
          <span className={styles.title}>{title}</span>
          {subtitle === undefined ? null : <span className={styles.subtitle}>{subtitle}</span>}
        </span>
      </span>
      {amount === undefined ? null : <span className={styles.amount}>{amount}</span>}
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={[styles.root, styles.interactive].join(' ')}
      >
        {content}
      </button>
    )
  }

  return <div className={styles.root}>{content}</div>
}

export function ListDivider() {
  return <div className={styles.divider} />
}
