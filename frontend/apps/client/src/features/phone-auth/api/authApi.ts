import { api, idempotent, newIdempotencyKey } from '@shared/api'
import type { Session } from '@entities/session'

export interface OtpChallenge {
  challengeId: string
  phone: string
  resendAfterSeconds: number
  attemptsLeft: number
  codeLength: number
  /** Только в моках: экран показывает превью SMS, как в макете. */
  previewCode?: string
}

export async function requestOtp(phone: string): Promise<OtpChallenge> {
  const { data } = await api.post<OtpChallenge>('/auth/otp/request', { phone })
  return data
}

export async function verifyOtp(input: {
  challengeId: string
  code: string
  idempotencyKey: string
}): Promise<Session> {
  const { data } = await api.post<Session>(
    '/auth/otp/verify',
    { challengeId: input.challengeId, code: input.code },
    idempotent(input.idempotencyKey),
  )
  return data
}

export { newIdempotencyKey }
