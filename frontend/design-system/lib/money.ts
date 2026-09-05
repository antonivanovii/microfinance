declare const moneyBrand: unique symbol

// Строка, а не number: int64 копеек не помещается в double.
// Бренд не даёт сложить две суммы — считает сервер.
export type MinorUnits = string & { readonly [moneyBrand]: 'MinorUnits' }

export type CurrencyCode = 'RUB'

export interface Money {
  readonly amount: MinorUnits
  readonly currency: CurrencyCode
}

export function asMinorUnits(raw: string): MinorUnits {
  if (!/^-?\d+$/.test(raw)) {
    throw new TypeError(
      `Сумма должна быть целым в минорных единицах, строкой. Получено: ${JSON.stringify(raw)}`,
    )
  }
  return raw as MinorUnits
}

export function money(amount: string, currency: CurrencyCode = 'RUB'): Money {
  return { amount: asMinorUnits(amount), currency }
}

const MINOR_DIGITS: Record<CurrencyCode, number> = { RUB: 2 }

const FORMATTERS = new Map<string, Intl.NumberFormat>()

function formatter(currency: CurrencyCode, withSymbol: boolean): Intl.NumberFormat {
  const key = `${currency}:${String(withSymbol)}`
  let cached = FORMATTERS.get(key)
  if (!cached) {
    const digits = MINOR_DIGITS[currency]
    cached = new Intl.NumberFormat('ru-RU', {
      ...(withSymbol ? { style: 'currency' as const, currency } : {}),
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
    FORMATTERS.set(key, cached)
  }
  return cached
}

export function formatMoney(value: Money, options: { symbol?: boolean } = {}): string {
  const { symbol = true } = options
  const digits = MINOR_DIGITS[value.currency]

  const negative = value.amount.startsWith('-')
  const raw = negative ? value.amount.slice(1) : value.amount
  const padded = raw.padStart(digits + 1, '0')
  const whole = padded.slice(0, padded.length - digits)
  const fraction = padded.slice(padded.length - digits)

  const parts = formatter(value.currency, symbol).formatToParts(BigInt(whole))
  const rendered = parts.map((part) => (part.type === 'fraction' ? fraction : part.value)).join('')

  return negative ? `−${rendered}` : rendered
}

export function formatMoneyWhole(value: Money, options: { symbol?: boolean } = {}): string {
  const { symbol = false } = options
  const digits = MINOR_DIGITS[value.currency]
  const negative = value.amount.startsWith('-')
  const raw = (negative ? value.amount.slice(1) : value.amount).padStart(digits + 1, '0')
  const whole = raw.slice(0, raw.length - digits)

  const parts = formatter(value.currency, symbol).formatToParts(BigInt(whole))
  const rendered = parts
    .filter((part) => part.type !== 'decimal' && part.type !== 'fraction')
    .map((part) => part.value)
    .join('')

  return negative ? `−${rendered}` : rendered
}

export function isZero(value: Money): boolean {
  return /^-?0+$/.test(value.amount)
}

export function isNegative(value: Money): boolean {
  return value.amount.startsWith('-') && !isZero(value)
}
