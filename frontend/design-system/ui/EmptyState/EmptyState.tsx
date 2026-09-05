import type { MascotName } from '../../assets'
import { Button } from '../Button'
import { Mascot } from '../Mascot'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
  mascot?: MascotName
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  actionVariant?: 'primary' | 'secondary'
}

export function EmptyState({
  mascot = 'empty',
  title,
  description,
  action,
  actionVariant = 'secondary',
}: EmptyStateProps) {
  return (
    <div className={styles.root}>
      <Mascot name={mascot} size="md" />
      <span className={styles.title}>{title}</span>
      {description === undefined ? null : <span className={styles.description}>{description}</span>}
      {action ? (
        <div className={styles.action}>
          <Button variant={actionVariant} size="md" fullWidth onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export function ErrorState({
  title = 'Не получилось загрузить',
  description,
  onRetry,
}: {
  title?: string
  description?: string
  onRetry: () => void
}) {
  return (
    <div role="alert">
      <EmptyState
        mascot="error"
        title={title}
        {...(description === undefined ? {} : { description })}
        action={{ label: 'Обновить', onClick: onRetry }}
        actionVariant="primary"
      />
    </div>
  )
}
