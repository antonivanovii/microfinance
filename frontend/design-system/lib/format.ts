export type IsoDate = string
export type IsoDateTime = string

const dateFormatters = new Map<string, Intl.DateTimeFormat>()

function dateFormatter(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = JSON.stringify(options)
  let cached = dateFormatters.get(key)
  if (!cached) {
    cached = new Intl.DateTimeFormat('ru-RU', options)
    dateFormatters.set(key, cached)
  }
  return cached
}

export function formatDate(iso: IsoDate): string {
  return dateFormatter({ day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
}

export function formatDateShort(iso: IsoDate): string {
  return dateFormatter({ day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso))
}

export function formatDateTime(iso: IsoDateTime): string {
  return dateFormatter({
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function formatDayMonth(iso: IsoDate): string {
  return dateFormatter({ day: 'numeric', month: 'long' }).format(new Date(iso))
}

const RELATIVE = new Intl.RelativeTimeFormat('ru-RU', { numeric: 'auto' })

export function formatRelativeDays(iso: IsoDate, now: Date = new Date()): string {
  const target = new Date(iso)
  const startOf = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
  const days = Math.round((startOf(target) - startOf(now)) / 86_400_000)
  return RELATIVE.format(days, 'day')
}

export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, Math.trunc(totalSeconds))
  const minutes = Math.trunc(safe / 60)
  const seconds = safe % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function formatPercent(raw: string, options: { fractionDigits?: number } = {}): string {
  const { fractionDigits = 3 } = options
  const [whole = '0', fraction = ''] = raw.split('.')
  const paddedFraction = fraction.padEnd(fractionDigits, '0').slice(0, fractionDigits)
  const wholeFormatted = new Intl.NumberFormat('ru-RU').format(BigInt(whole))
  return paddedFraction ? `${wholeFormatted},${paddedFraction} %` : `${wholeFormatted} %`
}

export function formatPhone(e164: string): string {
  const digits = e164.replace(/\D/g, '')
  if (digits.length !== 11) return e164
  return `+${digits[0]} ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`
}

export function formatCardMask(last4: string, bin?: string): string {
  return `${bin ?? '••••'} •••• •••• ${last4}`
}

export function formatPassport(series: string, number: string): string {
  return `${series.slice(0, 2)} ${series.slice(2, 4)} ${number}`
}

const PLURAL = new Intl.PluralRules('ru-RU')

export function plural(count: number, forms: [one: string, few: string, many: string]): string {
  const rule = PLURAL.select(count)
  if (rule === 'one') return forms[0]
  if (rule === 'few') return forms[1]
  return forms[2]
}

export function pluralize(count: number, forms: [string, string, string]): string {
  return `${new Intl.NumberFormat('ru-RU').format(count)} ${plural(count, forms)}`
}
