import { useMutation } from '@tanstack/react-query'
import { ApiError } from '@shared/api'
import { useSetSession } from '@entities/session'
import { newIdempotencyKey, requestOtp, verifyOtp } from '../api/authApi'
import { useChallengeStore } from './challengeStore'

const BLOCK_CODE = 'OTP_BLOCKED'

export function useRequestOtp() {
  const start = useChallengeStore((s) => s.start)
  const block = useChallengeStore((s) => s.block)

  return useMutation({
    mutationFn: requestOtp,
    onSuccess: start,
    onError: (error) => {
      if (error instanceof ApiError && error.code === BLOCK_CODE) {
        block(Date.now() + blockSeconds(error) * 1000)
      }
    },
  })
}

export function useVerifyOtp() {
  const setSession = useSetSession()
  const decrementAttempts = useChallengeStore((s) => s.decrementAttempts)
  const block = useChallengeStore((s) => s.block)

  return useMutation({
    mutationFn: (input: { challengeId: string; code: string }) =>
      // Ключ на попытку, а не на запрос: повтор того же кода не должен
      // считаться второй попыткой.
      verifyOtp({ ...input, idempotencyKey: newIdempotencyKey() }),
    onSuccess: setSession,
    onError: (error) => {
      if (!(error instanceof ApiError)) return
      if (error.code === BLOCK_CODE) {
        block(Date.now() + blockSeconds(error) * 1000)
        return
      }
      decrementAttempts()
    },
  })
}

/** Сервер называет срок словами; для таймера берём число секунд из detail. */
function blockSeconds(error: ApiError): number {
  const minutes = /(\d+)\s*минут/.exec(error.detail ?? '')
  if (minutes?.[1]) return Number(minutes[1]) * 60
  const seconds = /(\d+)\s*с/.exec(error.detail ?? '')
  return seconds?.[1] ? Number(seconds[1]) : 15 * 60
}
