import type { ApplicationDraft } from './application'
import type { OtpChallenge, Session } from './schema'

interface Challenge extends OtpChallenge {
  code: string
  blockedUntil: number | null
}

interface MockState {
  session: Session
  challenges: Map<string, Challenge>
  /** Номера, уже бравшие займ: попадают в кабинет, а не в анкету. */
  returningPhones: Set<string>
  application: ApplicationDraft | null
}

const initial = (): MockState => ({
  session: { status: 'anonymous', customerId: null, returning: false },
  challenges: new Map(),
  returningPhones: new Set(['+79214801204']),
  application: null,
})

export const db: MockState = initial()

export function resetDb(): void {
  Object.assign(db, initial())
}
