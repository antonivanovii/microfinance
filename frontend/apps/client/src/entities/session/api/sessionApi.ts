import { api } from '@shared/api'
import type { Session } from '../model/types'

export async function fetchSession(signal: AbortSignal): Promise<Session> {
  const { data } = await api.get<Session>('/auth/session', { signal })
  return data
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}
