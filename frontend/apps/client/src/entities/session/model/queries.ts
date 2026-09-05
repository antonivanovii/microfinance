import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchSession, logout } from '../api/sessionApi'
import type { Session } from './types'

export const sessionKeys = {
  current: ['session'] as const,
}

export function useSession() {
  return useQuery({
    queryKey: sessionKeys.current,
    queryFn: ({ signal }) => fetchSession(signal),
    staleTime: 60_000,
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear()
    },
  })
}

/** Кладёт сессию в кэш после входа — без лишнего запроса. */
export function useSetSession() {
  const queryClient = useQueryClient()
  return (session: Session) => {
    queryClient.setQueryData(sessionKeys.current, session)
  }
}
