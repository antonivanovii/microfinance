import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { newIdempotencyKey } from '@shared/api'
import {
  createDraft,
  fetchCurrentDraft,
  findEmployer,
  prefillFromEsia,
  recognizePassport,
  restartDraft,
  submitApplication,
  submitStep,
  suggestAddress,
} from '../api/applicationApi'
import type { ApplicationDraft, StepId } from './types'

export const applicationKeys = {
  all: ['application'] as const,
  current: () => [...applicationKeys.all, 'current'] as const,
  address: (query: string) => [...applicationKeys.all, 'address', query] as const,
  employer: (inn: string) => [...applicationKeys.all, 'employer', inn] as const,
}

export function useCurrentDraft() {
  return useQuery({
    queryKey: applicationKeys.current(),
    queryFn: ({ signal }) => fetchCurrentDraft(signal),
    // Черновик — источник истины о шаге, устаревшим он быть не должен.
    staleTime: 0,
  })
}

/** Пишет ответ сервера прямо в кэш: следующий шаг приходит вместе с ним. */
function useDraftMutation<TInput>(mutationFn: (input: TInput) => Promise<ApplicationDraft>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: (draft) => {
      queryClient.setQueryData(applicationKeys.current(), draft)
    },
  })
}

export const useCreateDraft = () => useDraftMutation(createDraft)
export const useRestartDraft = () => useDraftMutation(restartDraft)
export const usePrefillFromEsia = () => useDraftMutation(prefillFromEsia)

export function useSubmitStep(draftId: string | undefined) {
  return useDraftMutation((input: { step: StepId; values: Record<string, unknown> }) =>
    submitStep({
      draftId: draftId!,
      ...input,
      // Ключ на попытку шага: повтор того же ответа не должен создавать
      // второй черновик или второй платёж дальше по саге.
      idempotencyKey: newIdempotencyKey(),
    }),
  )
}

export function useSubmitApplication(draftId: string | undefined) {
  return useDraftMutation(() =>
    submitApplication({ draftId: draftId!, idempotencyKey: newIdempotencyKey() }),
  )
}

export function useRecognizePassport(draftId: string | undefined) {
  return useMutation({ mutationFn: () => recognizePassport(draftId!) })
}

export function useAddressSuggestions(query: string) {
  return useQuery({
    queryKey: applicationKeys.address(query),
    queryFn: ({ signal }) => suggestAddress(query, signal),
    enabled: query.trim().length >= 3,
    staleTime: 60_000,
  })
}

export function useEmployer(inn: string) {
  const digits = inn.replace(/\D/g, '')
  return useQuery({
    queryKey: applicationKeys.employer(digits),
    queryFn: ({ signal }) => findEmployer(digits, signal),
    enabled: digits.length === 10 || digits.length === 12,
    retry: false,
    staleTime: 10 * 60_000,
  })
}
