import { describe, expect, it } from 'vitest'
import { asMinorUnits, formatMoney, formatMoneyWhole, isNegative, isZero, money } from './money'

describe('asMinorUnits', () => {
  it('принимает целое строкой', () => {
    expect(asMinorUnits('1250000')).toBe('1250000')
    expect(asMinorUnits('-1')).toBe('-1')
    expect(asMinorUnits('0')).toBe('0')
  })

  it.each(['12.50', '1 250', '', 'abc', '1e5', '+5'])('отвергает %o', (raw) => {
    expect(() => asMinorUnits(raw)).toThrow(TypeError)
  })
})

describe('formatMoney', () => {
  it('форматирует рубли с копейками', () => {
    //   — неразрывный пробел, его ставит Intl для ru-RU
    expect(formatMoney(money('1250000'))).toBe('12 500,00 ₽')
  })

  it('не теряет копейки', () => {
    expect(formatMoney(money('1250099'))).toBe('12 500,99 ₽')
    expect(formatMoney(money('1'))).toBe('0,01 ₽')
    expect(formatMoney(money('0'))).toBe('0,00 ₽')
  })

  it('переживает суммы за пределами Number.MAX_SAFE_INTEGER', () => {
    // 90 071 992 547 409,93 ₽ — целых копеек больше, чем double держит точно
    expect(formatMoney(money('9007199254740993'))).toBe('90 071 992 547 409,93 ₽')
  })

  it('умеет без символа валюты', () => {
    expect(formatMoney(money('1250000'), { symbol: false })).toBe('12 500,00')
  })

  it('ставит типографский минус', () => {
    expect(formatMoney(money('-50000'))).toBe('−500,00 ₽')
  })
})

describe('formatMoneyWhole', () => {
  it('отбрасывает копейки без округления', () => {
    expect(formatMoneyWhole(money('1250099'))).toBe('12 500')
    expect(formatMoneyWhole(money('99'))).toBe('0')
  })
})

describe('предикаты', () => {
  it('распознают ноль и минус', () => {
    expect(isZero(money('0'))).toBe(true)
    expect(isZero(money('-0'))).toBe(true)
    expect(isZero(money('1'))).toBe(false)
    expect(isNegative(money('-1'))).toBe(true)
    expect(isNegative(money('-0'))).toBe(false)
    expect(isNegative(money('1'))).toBe(false)
  })
})

describe('formatMoneyWhole со знаком валюты', () => {
  it('крупные суммы показываются без копеек', () => {
    expect(formatMoneyWhole(money('1500000'), { symbol: true })).toBe('15 000 ₽')
    expect(formatMoneyWhole(money('1710000'), { symbol: true })).toBe('17 100 ₽')
  })

  it('копейки отбрасываются, а не округляются', () => {
    expect(formatMoneyWhole(money('1500099'), { symbol: true })).toBe('15 000 ₽')
  })
})
