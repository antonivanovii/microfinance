import { ApiError } from '@shared/api'
import {
  usePrefillFromEsia,
  useRecognizePassport,
  useSubmitApplication,
  useSubmitStep,
  type ApplicationDraft,
} from '@entities/application'
import {
  AddressStep,
  ConsentsStep,
  EmploymentStep,
  LoanParamsStep,
  PassportStep,
  PayoutStep,
  PersonalStep,
} from './steps'

/**
 * Рисует тот шаг, который назвал сервер. Порядок шагов и ветвление живут
 * на бэкенде: фронт спрашивает «что дальше» и отражает ответ.
 */
export function ApplicationWizard({ draft }: { draft: ApplicationDraft }) {
  const submitStep = useSubmitStep(draft.id)
  const submitApplication = useSubmitApplication(draft.id)
  const esia = usePrefillFromEsia()
  const passport = useRecognizePassport(draft.id)

  const step = draft.currentStep
  if (!step) return null

  const send = (values: Record<string, unknown>) => {
    submitStep.mutate({ step: step.id, values })
  }

  const pending = submitStep.isPending
  const serverErrors =
    submitStep.error instanceof ApiError ? submitStep.error.fieldErrors : undefined
  const defaults = draft.values as Record<string, string | boolean | undefined>

  switch (step.id) {
    case 'loan-params':
      return <LoanParamsStep onSubmit={send} pending={pending} />

    case 'personal':
      return (
        <PersonalStep
          defaults={defaults}
          onSubmit={send}
          onUseEsia={() => {
            esia.mutate(draft.id)
          }}
          pending={pending}
          esiaPending={esia.isPending}
        />
      )

    case 'passport':
      return (
        <PassportStep
          defaults={defaults}
          onSubmit={send}
          onRecognize={() => passport.mutateAsync()}
          pending={pending}
          serverErrors={serverErrors}
        />
      )

    case 'address':
      return <AddressStep defaults={defaults} onSubmit={send} pending={pending} />

    case 'employment':
      return <EmploymentStep defaults={defaults} onSubmit={send} pending={pending} />

    case 'payout':
      return <PayoutStep defaults={defaults} onSubmit={send} pending={pending} />

    case 'consents':
      return (
        <ConsentsStep
          draft={draft}
          onSubmit={(values) => {
            // Согласия сохраняем шагом, отправку заявки — отдельной командой
            // с ключом идемпотентности: двойное нажатие не должно создать
            // вторую заявку.
            submitStep.mutate(
              { step: 'consents', values },
              { onSuccess: () => submitApplication.mutate(undefined) },
            )
          }}
          pending={pending || submitApplication.isPending}
        />
      )
  }
}
