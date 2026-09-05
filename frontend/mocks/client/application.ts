import { http, HttpResponse } from 'msw'
import {
  ADDRESSES,
  EMPLOYERS,
  ESIA_FLOW,
  FULL_FLOW,
  PASSPORT_OCR,
  STEP_TITLES,
  db,
  quote,
  type ApplicationDraft,
  type StepDescriptor,
  type StepId,
} from '../db'
import { networkDelay, notFound, problem } from '../lib/http'

const BASE = '/api'

const flowOf = (draft: ApplicationDraft): StepId[] =>
  draft.values.esia === true ? ESIA_FLOW : FULL_FLOW

function describe(flow: StepId[], step: StepId | undefined): StepDescriptor | null {
  if (!step) return null
  return {
    id: step,
    title: STEP_TITLES[step],
    index: flow.indexOf(step) + 1,
    total: flow.length,
  }
}

function createDraft(): ApplicationDraft {
  const draft: ApplicationDraft = {
    id: crypto.randomUUID(),
    status: 'draft',
    currentStep: describe(FULL_FLOW, 'loan-params'),
    completedSteps: [],
    quote: null,
    savedAt: null,
    values: {},
    card: null,
  }
  db.application = draft
  return draft
}

export const applicationHandlers = [
  http.get(`${BASE}/applications/current`, async () => {
    await networkDelay(140)
    return db.application
      ? HttpResponse.json(db.application)
      : new HttpResponse(null, { status: 204 })
  }),

  http.post(`${BASE}/applications`, async () => {
    await networkDelay()
    return HttpResponse.json(createDraft(), { status: 201 })
  }),

  http.post(`${BASE}/applications/restart`, async () => {
    await networkDelay()
    return HttpResponse.json(createDraft(), { status: 201 })
  }),

  /**
   * Приём шага. Ответ всегда несёт следующий шаг: ветвление живёт здесь,
   * фронт его не вычисляет.
   */
  http.post(`${BASE}/applications/:id/steps/:step`, async ({ params, request }) => {
    await networkDelay()
    const draft = db.application
    if (draft?.id !== String(params.id)) return notFound('Заявка')

    const stepId = String(params.step) as StepId
    const payload = (await request.json()) as {
      amount?: string
      termDays?: number
      departmentCode?: string
      method?: string
      pan?: string
      [key: string]: unknown
    }

    if (stepId === 'loan-params') {
      const amount = payload.amount ?? ''
      const termDays = Number(payload.termDays)
      if (!/^\d+$/.test(amount)) {
        return problem({
          status: 422,
          title: 'Проверьте параметры займа',
          code: 'VALIDATION_FAILED',
          errors: { amount: ['Укажите сумму'] },
        })
      }
      draft.quote = quote(amount, termDays, true)
    }

    if (stepId === 'passport') {
      const code = payload.departmentCode ?? ''
      if (!/^\d{3}-\d{3}$/.test(code)) {
        return problem({
          status: 422,
          title: 'Проверьте паспорт',
          code: 'VALIDATION_FAILED',
          errors: {
            departmentCode: ['Нужно 6 цифр — посмотрите на второй строке штампа'],
          },
        })
      }
    }

    if (stepId === 'payout' && payload.method === 'card') {
      const pan = (payload.pan ?? '').replace(/\D/g, '')
      draft.card = { brand: 'МИР', last4: pan.slice(-4) }
    }

    draft.values = { ...draft.values, ...payload }
    if (!draft.completedSteps.includes(stepId)) draft.completedSteps.push(stepId)
    draft.savedAt = new Date().toISOString()

    const flow = flowOf(draft)
    draft.currentStep = describe(flow, flow[flow.indexOf(stepId) + 1])

    return HttpResponse.json(draft)
  }),

  http.post(`${BASE}/applications/:id/submit`, async ({ params }) => {
    await networkDelay(320)
    const draft = db.application
    if (draft?.id !== String(params.id)) return notFound('Заявка')

    draft.status = 'submitted'
    draft.currentStep = null
    return HttpResponse.json(draft)
  }),

  /** Предзаполнение через Госуслуги: подтягивает данные и укорачивает ветку. */
  http.post(`${BASE}/applications/:id/esia`, async ({ params }) => {
    await networkDelay(420)
    const draft = db.application
    if (draft?.id !== String(params.id)) return notFound('Заявка')

    draft.values = {
      ...draft.values,
      esia: true,
      lastName: 'Ковалёва',
      firstName: 'Анна',
      middleName: 'Сергеевна',
      birthDate: '1994-06-12',
      ...PASSPORT_OCR,
      address: 'Санкт-Петербург, Разъезжая ул., 12',
      flat: '41',
      postalCode: '191002',
    }
    for (const step of ['personal', 'passport', 'address'] as StepId[]) {
      if (!draft.completedSteps.includes(step)) draft.completedSteps.push(step)
    }
    draft.savedAt = new Date().toISOString()

    const flow = flowOf(draft)
    draft.currentStep = describe(flow, 'employment')
    return HttpResponse.json(draft)
  }),

  http.post(`${BASE}/applications/:id/passport-photo`, async () => {
    await networkDelay(700)
    return HttpResponse.json(PASSPORT_OCR)
  }),

  http.get(`${BASE}/suggest/address`, async ({ request }) => {
    await networkDelay(120)
    const query = new URL(request.url).searchParams.get('q') ?? ''
    if (query.trim().length < 3) return HttpResponse.json([])
    return HttpResponse.json(ADDRESSES)
  }),

  http.get(`${BASE}/suggest/employer`, async ({ request }) => {
    await networkDelay(160)
    const inn = (new URL(request.url).searchParams.get('inn') ?? '').replace(/\D/g, '')
    const name = EMPLOYERS[inn]
    return name ? HttpResponse.json({ inn, name }) : notFound('Работодатель')
  }),
]
