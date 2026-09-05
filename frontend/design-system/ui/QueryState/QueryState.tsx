import type { UseQueryResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'

interface QueryStateProps<TData, TError> {
  query: UseQueryResult<TData, TError>
  isEmpty: (data: TData) => boolean
  loading: ReactNode
  empty: ReactNode
  error: (error: TError, retry: () => void) => ReactNode
  children: (data: TData) => ReactNode
}

export function QueryState<TData, TError>({
  query,
  isEmpty,
  loading,
  empty,
  error,
  children,
}: QueryStateProps<TData, TError>) {
  // isPending, а не isLoading: refetch поверх данных не должен ронять
  // экран обратно в скелетон — ожидание решения поллится по кругу.
  if (query.isPending) return <>{loading}</>

  if (query.isError) {
    return <>{error(query.error, () => void query.refetch())}</>
  }

  if (isEmpty(query.data)) return <>{empty}</>

  return <>{children(query.data)}</>
}
