import { http, HttpResponse } from 'msw'
import { PARAMS, db, quote } from '../db'
import { networkDelay, notFound, problem } from '../lib/http'
import { applicationHandlers } from './application'

const BASE = '/api'

const RESEND_SECONDS = 45
const BLOCK_MINUTES = 15
const MAX_ATTEMPTS = 3

const secondsUntil = (timestamp: number) => Math.max(0, Math.ceil((timestamp - Date.now()) / 1000))

export const clientHandlers = [
  ...applicationHandlers,

  http.get(`${BASE}/calculator/params`, async () => {
    await networkDelay(120)
    return HttpResponse.json(PARAMS)
  }),

  http.get(`${BASE}/calculator/quote`, async ({ request }) => {
    await networkDelay(140)
    const url = new URL(request.url)
    const amount = url.searchParams.get('amount')
    const termDays = Number(url.searchParams.get('termDays'))

    if (!amount || !/^\d+$/.test(amount) || !Number.isInteger(termDays) || termDays < 1) {
      return problem({
        status: 422,
        title: 'Некорректные параметры расчёта',
        code: 'INVALID_QUOTE_PARAMS',
      })
    }

    return HttpResponse.json(quote(amount, termDays, !db.session.returning))
  }),

  http.get(`${BASE}/auth/session`, async () => {
    await networkDelay(80)
    return HttpResponse.json(db.session)
  }),

  http.post(`${BASE}/auth/otp/request`, async ({ request }) => {
    await networkDelay()
    const { phone } = (await request.json()) as { phone: string }

    const existing = [...db.challenges.values()].find((c) => c.phone === phone)

    if (existing?.blockedUntil && existing.blockedUntil > Date.now()) {
      return problem({
        status: 429,
        title: 'Попытки закончились',
        code: 'OTP_BLOCKED',
        detail: `Новый код можно запросить через ${String(secondsUntil(existing.blockedUntil))} с`,
      })
    }

    // Повторная отправка шлёт ТОТ ЖЕ код, а не генерирует новый.
    if (existing) {
      return HttpResponse.json({
        challengeId: existing.challengeId,
        phone,
        resendAfterSeconds: RESEND_SECONDS,
        attemptsLeft: existing.attemptsLeft,
        codeLength: 4,
        previewCode: existing.code,
      })
    }

    const challengeId = crypto.randomUUID()
    const code = '4823'
    db.challenges.set(challengeId, {
      challengeId,
      phone,
      code,
      previewCode: code,
      resendAfterSeconds: RESEND_SECONDS,
      attemptsLeft: MAX_ATTEMPTS,
      codeLength: 4,
      blockedUntil: null,
    })

    return HttpResponse.json({
      challengeId,
      phone,
      resendAfterSeconds: RESEND_SECONDS,
      attemptsLeft: MAX_ATTEMPTS,
      codeLength: 4,
      previewCode: code,
    })
  }),

  http.post(`${BASE}/auth/otp/verify`, async ({ request }) => {
    await networkDelay()
    const { challengeId, code } = (await request.json()) as {
      challengeId: string
      code: string
    }
    const challenge = db.challenges.get(challengeId)
    if (!challenge) return notFound('Код')

    if (challenge.blockedUntil && challenge.blockedUntil > Date.now()) {
      return problem({
        status: 429,
        title: 'Попытки закончились',
        code: 'OTP_BLOCKED',
        detail: `Новый код можно запросить через ${String(secondsUntil(challenge.blockedUntil))} с`,
      })
    }

    if (challenge.code !== code) {
      challenge.attemptsLeft -= 1
      if (challenge.attemptsLeft <= 0) {
        challenge.blockedUntil = Date.now() + BLOCK_MINUTES * 60_000
        return problem({
          status: 429,
          title: 'Код не подошёл',
          code: 'OTP_BLOCKED',
          detail: `Попытки закончились. Новый код можно запросить через ${String(BLOCK_MINUTES)} минут — это защита от подбора`,
        })
      }
      return problem({
        status: 422,
        title: 'Код не подошёл',
        code: 'OTP_INVALID',
        detail: `Осталось попыток: ${String(challenge.attemptsLeft)}`,
      })
    }

    db.challenges.delete(challengeId)
    db.session = {
      status: 'authenticated',
      customerId: 'cust-1',
      returning: db.returningPhones.has(challenge.phone),
    }
    return HttpResponse.json(db.session)
  }),

  http.post(`${BASE}/auth/logout`, async () => {
    await networkDelay(80)
    db.session = { status: 'anonymous', customerId: null, returning: false }
    return new HttpResponse(null, { status: 204 })
  }),
]
