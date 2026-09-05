import { useSyncExternalStore } from 'react'

const TICK_MS = 500

const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | null = null
let now = Date.now()

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange)
  if (timer === null) {
    now = Date.now()
    timer = setInterval(() => {
      now = Date.now()
      listeners.forEach((listener) => {
        listener()
      })
    }, TICK_MS)
  }

  return () => {
    listeners.delete(onChange)
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }
}

const getSnapshot = () => now

/**
 * Секунды до метки времени. Считает от абсолютной метки, а не вычитанием
 * по тику: вкладка в фоне тормозит таймеры, и счётчик на декременте
 * отстаёт от реальности на минуты.
 */
export function useCountdown(until: number | null): number {
  const current = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  if (until === null) return 0
  return Math.max(0, Math.ceil((until - current) / 1000))
}
