import { AxiosError } from 'axios'

interface ProblemDetails {
  title: string
  status: number
  detail?: string
  code?: string
  errors?: Record<string, string[]>
  traceId?: string
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string | undefined
  readonly detail: string | undefined
  readonly fieldErrors: Record<string, string[]> | undefined
  readonly traceId: string | undefined

  constructor(problem: ProblemDetails, options?: ErrorOptions) {
    super(problem.title, options)
    this.name = 'ApiError'
    this.status = problem.status
    this.code = problem.code
    this.detail = problem.detail
    this.fieldErrors = problem.errors
    this.traceId = problem.traceId
  }

  get isUnauthorized() {
    return this.status === 401
  }

  get isForbidden() {
    return this.status === 403
  }

  get isRetriable() {
    return this.status === 0 || this.status === 408 || this.status === 429 || this.status >= 500
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (error instanceof AxiosError) {
    const problem = error.response?.data as Partial<ProblemDetails> | undefined
    if (problem?.title && error.response) {
      return new ApiError(
        { ...problem, title: problem.title, status: error.response.status },
        { cause: error },
      )
    }
    return error.response
      ? new ApiError(
          {
            title: 'Не удалось выполнить запрос',
            status: error.response.status,
            code: 'REQUEST_FAILED',
          },
          { cause: error },
        )
      : new ApiError(
          {
            title: 'Нет связи с сервером',
            status: 0,
            code: 'NETWORK_UNAVAILABLE',
            detail: 'Проверьте подключение и попробуйте ещё раз',
          },
          { cause: error },
        )
  }

  return new ApiError({ title: 'Неизвестная ошибка', status: 0 }, { cause: error })
}
