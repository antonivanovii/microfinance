import { useEffect, type RefObject } from 'react'

interface DismissOptions {
  onDismiss: () => void
  onEscape?: boolean
  onOutsidePointer?: boolean
}

export function useDismiss(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  { onDismiss, onEscape = true, onOutsidePointer = true }: DismissOptions,
): void {
  useEffect(() => {
    if (!active) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (onEscape && event.key === 'Escape') {
        event.stopPropagation()
        onDismiss()
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!onOutsidePointer) return
      const target = event.target
      if (target instanceof Node && ref.current && !ref.current.contains(target)) {
        onDismiss()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown, true)
    }
  }, [ref, active, onDismiss, onEscape, onOutsidePointer])
}
