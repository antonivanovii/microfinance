import { useEffect } from 'react'

let lockCount = 0
let restore: (() => void) | null = null

// Счётчик, а не флаг: шторка поверх шторки иначе разблокирует фон,
// когда закроется верхняя.
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return

    lockCount += 1
    if (lockCount === 1) {
      const { body } = document
      const previousOverflow = body.style.overflow
      const previousPaddingRight = body.style.paddingRight
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

      body.style.overflow = 'hidden'
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`
      }

      restore = () => {
        body.style.overflow = previousOverflow
        body.style.paddingRight = previousPaddingRight
      }
    }

    return () => {
      lockCount -= 1
      if (lockCount === 0) {
        restore?.()
        restore = null
      }
    }
  }, [active])
}
