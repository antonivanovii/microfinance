import axios from 'axios'
import { env } from '../config'
import { toApiError } from './ApiError'

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: { Accept: 'application/json' },
})

api.interceptors.response.use(undefined, (error: unknown) => Promise.reject(toApiError(error)))

// Ключ живёт столько же, сколько попытка команды, а не запрос:
// создаётся один раз на действие и переиспользуется при повторе.
export const idempotent = (key: string) => ({ headers: { 'Idempotency-Key': key } })

export const newIdempotencyKey = (): string => crypto.randomUUID()
