import { useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useDismiss, useFocusTrap, useScrollLock } from '../../a11y'
import styles from './Sheet.module.css'

interface SheetProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  // false там, где закрытие стоит денег: тап мимо не отменяет подписание.
  dismissable?: boolean
  children: ReactNode
}

export function Sheet({
  open,
  onClose,
  title,
  description,
  dismissable = true,
  children,
}: SheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descriptionId = `${titleId}-description`

  useFocusTrap(sheetRef, open)
  useScrollLock(open)
  useDismiss(sheetRef, open && dismissable, { onDismiss: onClose })

  if (!open) return null

  return createPortal(
    <div className={styles.overlay}>
      <div
        ref={sheetRef}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
      >
        <div className={styles.grabber} aria-hidden="true" />
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        {description === undefined ? null : (
          <p id={descriptionId} className={styles.description}>
            {description}
          </p>
        )}
        {children}
      </div>
    </div>,
    document.body,
  )
}
