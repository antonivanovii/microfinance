export type SessionStatus = 'anonymous' | 'authenticated'

export interface Session {
  status: SessionStatus
  customerId: string | null
  /** Уже брал займ: после входа идёт в кабинет, а не в анкету. */
  returning: boolean
}
