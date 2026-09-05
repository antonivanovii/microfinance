import { create } from 'zustand'
import type { OtpChallenge } from '../api/authApi'

interface ChallengeState {
  challenge: OtpChallenge | null
  /** Абсолютная метка, а не остаток: вкладка в фоне тормозит таймеры. */
  resendAt: number | null
  blockedUntil: number | null

  start: (challenge: OtpChallenge) => void
  block: (until: number) => void
  decrementAttempts: () => void
  reset: () => void
}

/**
 * Челлендж живёт между экранами /login и /login/code, поэтому не в состоянии
 * компонента. В URL его класть нельзя — это идентификатор попытки входа.
 */
export const useChallengeStore = create<ChallengeState>((set) => ({
  challenge: null,
  resendAt: null,
  blockedUntil: null,

  start: (challenge) => {
    set({
      challenge,
      resendAt: Date.now() + challenge.resendAfterSeconds * 1000,
      blockedUntil: null,
    })
  },
  block: (blockedUntil) => {
    set({ blockedUntil, resendAt: blockedUntil })
  },
  decrementAttempts: () => {
    set((state) =>
      state.challenge
        ? { challenge: { ...state.challenge, attemptsLeft: state.challenge.attemptsLeft - 1 } }
        : state,
    )
  },
  reset: () => {
    set({ challenge: null, resendAt: null, blockedUntil: null })
  },
}))
