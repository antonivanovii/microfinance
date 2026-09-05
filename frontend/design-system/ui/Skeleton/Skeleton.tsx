import styles from './Skeleton.module.css'

interface SkeletonProps {
  width?: string
  height?: string
  radius?: string
  soft?: boolean
}

export function Skeleton({ width = '100%', height = '14px', radius, soft = false }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={[styles.block, styles.animated, soft ? styles.soft : ''].filter(Boolean).join(' ')}
      style={{ display: 'block', width, height, ...(radius ? { borderRadius: radius } : {}) }}
    />
  )
}

export function SkeletonRow() {
  return (
    <div className={styles.row}>
      <span className={[styles.block, styles.animated, styles.tile].join(' ')} aria-hidden="true" />
      <span className={styles.lines}>
        <Skeleton width="62%" height="14px" radius="7px" />
        <Skeleton width="38%" height="12px" radius="6px" soft />
      </span>
    </div>
  )
}

export function SkeletonList({ rows = 3 }: { rows?: number }) {
  return (
    <div className={styles.list} role="status" aria-label="Загрузка">
      {Array.from({ length: rows }, (_, index) => (
        <SkeletonRow key={index} />
      ))}
    </div>
  )
}
