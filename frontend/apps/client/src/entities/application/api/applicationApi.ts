import { money } from '@ds/lib'
import { api, idempotent } from '@shared/api'
import type { AddressSuggestion, ApplicationDraft, PassportFields, StepId } from '../model/types'

interface MoneyDto {
  amount: string
  currency: 'RUB'
}

interface DraftDto extends Omit<ApplicationDraft, 'quote'> {
  quote: {
    principal: MoneyDto
    totalDue: MoneyDto
    interest: MoneyDto
    dueDate: string
    termDays: number
    fullCostRate: string
    interestFree: boolean
  } | null
}

const toDraft = (dto: DraftDto): ApplicationDraft => ({
  ...dto,
  quote: dto.quote
    ? {
        ...dto.quote,
        principal: money(dto.quote.principal.amount),
        totalDue: money(dto.quote.totalDue.amount),
        interest: money(dto.quote.interest.amount),
      }
    : null,
})

export async function fetchCurrentDraft(signal: AbortSignal): Promise<ApplicationDraft | null> {
  const response = await api.get<DraftDto | ''>('/applications/current', { signal })
  return response.status === 204 || response.data === '' ? null : toDraft(response.data)
}

export async function createDraft(): Promise<ApplicationDraft> {
  const { data } = await api.post<DraftDto>('/applications')
  return toDraft(data)
}

export async function restartDraft(): Promise<ApplicationDraft> {
  const { data } = await api.post<DraftDto>('/applications/restart')
  return toDraft(data)
}

export async function submitStep(input: {
  draftId: string
  step: StepId
  values: Record<string, unknown>
  idempotencyKey: string
}): Promise<ApplicationDraft> {
  const { data } = await api.post<DraftDto>(
    `/applications/${input.draftId}/steps/${input.step}`,
    input.values,
    idempotent(input.idempotencyKey),
  )
  return toDraft(data)
}

export async function prefillFromEsia(draftId: string): Promise<ApplicationDraft> {
  const { data } = await api.post<DraftDto>(`/applications/${draftId}/esia`)
  return toDraft(data)
}

export async function submitApplication(input: {
  draftId: string
  idempotencyKey: string
}): Promise<ApplicationDraft> {
  const { data } = await api.post<DraftDto>(
    `/applications/${input.draftId}/submit`,
    undefined,
    idempotent(input.idempotencyKey),
  )
  return toDraft(data)
}

export async function recognizePassport(draftId: string): Promise<PassportFields> {
  const { data } = await api.post<PassportFields>(`/applications/${draftId}/passport-photo`)
  return data
}

export async function suggestAddress(
  query: string,
  signal: AbortSignal,
): Promise<AddressSuggestion[]> {
  const { data } = await api.get<AddressSuggestion[]>('/suggest/address', {
    params: { q: query },
    signal,
  })
  return data
}

export async function findEmployer(
  inn: string,
  signal: AbortSignal,
): Promise<{ inn: string; name: string }> {
  const { data } = await api.get<{ inn: string; name: string }>('/suggest/employer', {
    params: { inn },
    signal,
  })
  return data
}
