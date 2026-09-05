import { HttpResponse, delay } from 'msw'

export async function networkDelay(ms = 220): Promise<void> {
  await delay(ms)
}

interface ProblemInit {
  status: number
  title: string
  code?: string
  detail?: string
  errors?: Record<string, string[]>
}

export function problem({ status, title, code, detail, errors }: ProblemInit) {
  return HttpResponse.json(
    {
      title,
      status,
      ...(code ? { code } : {}),
      ...(detail ? { detail } : {}),
      ...(errors ? { errors } : {}),
      traceId: crypto.randomUUID(),
    },
    { status, headers: { 'Content-Type': 'application/problem+json' } },
  )
}

export const notFound = (what: string) =>
  problem({ status: 404, title: `${what} не найден`, code: 'NOT_FOUND' })
