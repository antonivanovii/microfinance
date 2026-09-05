import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react'
import { formatCountdown, plural } from '../../lib'
import styles from './OtpInput.module.css'

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  resendAfterSeconds: number
  onResend: () => void
  attemptsLeft?: number
  error?: string
  disabled?: boolean
}

const DIGITS = /^\d+$/

export function OtpInput({
  value,
  onChange,
  length = 4,
  resendAfterSeconds,
  onResend,
  attemptsLeft,
  error,
  disabled = false,
}: OtpInputProps) {
  const cells = useRef<(HTMLInputElement | null)[]>([])

  const focusCell = (index: number) => {
    cells.current[Math.max(0, Math.min(length - 1, index))]?.focus()
  }

  const write = (next: string) => {
    const digits = next.replace(/\D/g, '').slice(0, length)
    onChange(digits)
    focusCell(digits.length >= length ? length - 1 : digits.length)
  }

  const handleCell = (index: number, raw: string) => {
    // Автоподстановка кладёт всю строку в одну ячейку.
    if (raw.length > 1) {
      write(raw)
      return
    }
    if (raw !== '' && !DIGITS.test(raw)) return

    const chars = value.padEnd(length, ' ').split('')
    chars[index] = raw === '' ? ' ' : raw
    onChange(chars.join('').trimEnd().replace(/ /g, ''))

    if (raw !== '') focusCell(index + 1)
  }

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && value[index] === undefined) {
      event.preventDefault()
      onChange(value.slice(0, Math.max(0, index - 1)))
      focusCell(index - 1)
      return
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusCell(index - 1)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusCell(index + 1)
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    write(event.clipboardData.getData('text'))
  }

  const canResend = resendAfterSeconds <= 0

  return (
    <div className={[styles.root, error ? styles.invalid : ''].filter(Boolean).join(' ')}>
      <div className={styles.cells}>
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(node) => {
              cells.current[index] = node
            }}
            className={styles.cell}
            value={value[index] ?? ''}
            onChange={(event) => {
              handleCell(index, event.target.value)
            }}
            onKeyDown={(event) => {
              handleKeyDown(index, event)
            }}
            onPaste={handlePaste}
            disabled={disabled}
            type="text"
            inputMode="numeric"
            // Только первой: с one-time-code на всех ячейках iOS вставит
            // по одной цифре в каждую.
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={length}
            aria-label={`Цифра ${String(index + 1)} из ${String(length)}`}
            aria-invalid={error ? true : undefined}
          />
        ))}
      </div>

      {error ? (
        <span className={styles.error} role="alert">
          {error}
        </span>
      ) : null}

      <div className={styles.meta}>
        <button type="button" className={styles.resend} onClick={onResend} disabled={!canResend}>
          {canResend
            ? 'Отправить снова'
            : `Отправить снова через ${formatCountdown(resendAfterSeconds)}`}
        </button>
        {attemptsLeft === undefined ? null : (
          <span>
            Осталось {attemptsLeft} {plural(attemptsLeft, ['попытка', 'попытки', 'попыток'])}
          </span>
        )}
      </div>
    </div>
  )
}
