import type { FormEventHandler, ReactNode } from 'react'
import { Button } from '@ds/ui'
import styles from './StepShell.module.css'

interface StepShellProps {
  title: string
  lead?: string
  onSubmit: FormEventHandler<HTMLFormElement>
  submitLabel: string
  submitDisabled?: boolean
  pending?: boolean
  note?: ReactNode
  children: ReactNode
}

export function StepShell({
  title,
  lead,
  onSubmit,
  submitLabel,
  submitDisabled = false,
  pending = false,
  note,
  children,
}: StepShellProps) {
  return (
    <form className={styles.root} onSubmit={onSubmit} noValidate>
      <h1 className={styles.title}>{title}</h1>
      {lead === undefined ? null : <p className={styles.lead}>{lead}</p>}

      <div className={styles.body}>{children}</div>

      <div className={styles.footer}>
        <div className={styles.submit}>
          <Button type="submit" size="lg" fullWidth loading={pending} disabled={submitDisabled}>
            {submitLabel}
          </Button>
        </div>
        {note === undefined ? null : <p className={styles.note}>{note}</p>}
      </div>
    </form>
  )
}
