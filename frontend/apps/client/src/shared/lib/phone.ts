/** Хранится в E.164 (+79214801204), показывается как +7 921 480-12-04. */
export const PHONE_DIGITS = 11

export function phoneDigits(input: string): string {
  const digits = input.replace(/\D/g, '')
  const withCountry = digits.startsWith('8') ? `7${digits.slice(1)}` : digits
  return withCountry.startsWith('7')
    ? withCountry.slice(0, PHONE_DIGITS)
    : `7${withCountry}`.slice(0, PHONE_DIGITS)
}

export function formatPhoneInput(digits: string): string {
  const rest = digits.slice(1)
  if (rest.length === 0) return '+7 '

  const parts = [rest.slice(0, 3), rest.slice(3, 6), rest.slice(6, 8), rest.slice(8, 10)]
  return `+7 ${parts[0]}${parts[1] ? ` ${parts[1]}` : ''}${parts[2] ? `-${parts[2]}` : ''}${parts[3] ? `-${parts[3]}` : ''}`
}

export const toE164 = (digits: string): string => `+${digits}`
