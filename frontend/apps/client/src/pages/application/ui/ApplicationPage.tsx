import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorState, Skeleton } from '@ds/ui'
import {
  useCreateDraft,
  useCurrentDraft,
  useRestartDraft,
  type ApplicationDraft,
} from '@entities/application'
import { ApplicationWizard } from '@features/application-wizard'
import { ROUTES } from '@shared/config'
import { ApplicationSummary, WizardLayout } from '@widgets/wizard-layout'
import { DraftRestore } from './DraftRestore'
import styles from './ApplicationPage.module.css'

export function ApplicationPage() {
  const navigate = useNavigate()
  const draftQuery = useCurrentDraft()
  const createDraft = useCreateDraft()
  const restartDraft = useRestartDraft()

  /**
   * Момент открытия страницы. Возвращаться есть куда только к тому, что
   * сохранено ДО прихода: иначе экран восстановления всплывал бы после
   * каждого шага, ведь черновик сохраняется на каждом.
   */
  const [openedAt] = useState(() => Date.now())
  const [restoreDismissed, setRestoreDismissed] = useState(false)

  const draft = draftQuery.data ?? null

  // Черновика нет — создаём. Синхронизация с сервером, не вычисление стейта.
  useEffect(() => {
    if (draftQuery.isSuccess && draft === null && !createDraft.isPending) {
      createDraft.mutate(undefined)
    }
  }, [draftQuery.isSuccess, draft, createDraft])

  useEffect(() => {
    if (draft?.status === 'submitted') {
      void navigate(ROUTES.decision, { replace: true })
    }
  }, [draft?.status, navigate])

  if (draftQuery.isPending || (draftQuery.isSuccess && draft === null)) {
    return (
      <div className={styles.center}>
        <div className={styles.loading}>
          <Skeleton height="32px" radius="12px" />
          <Skeleton height="120px" radius="20px" />
          <Skeleton height="56px" radius="16px" />
        </div>
      </div>
    )
  }

  if (draftQuery.isError || !draft) {
    return (
      <div className={styles.center}>
        <ErrorState
          title="Не получилось открыть анкету"
          description="Данные не потеряны — попробуйте обновить"
          onRetry={() => {
            void draftQuery.refetch()
          }}
        />
      </div>
    )
  }

  if (!restoreDismissed && savedBefore(draft, openedAt)) {
    return (
      <DraftRestore
        draft={draft}
        onContinue={() => {
          setRestoreDismissed(true)
        }}
        onRestart={() => {
          restartDraft.mutate(undefined, {
            onSuccess: () => {
              setRestoreDismissed(true)
            },
          })
        }}
        restarting={restartDraft.isPending}
      />
    )
  }

  const step = draft.currentStep
  if (!step) return null

  return (
    <WizardLayout
      step={step}
      saved={draft.savedAt !== null}
      onBack={() => {
        void navigate(-1)
      }}
      onExit={() => {
        void navigate(ROUTES.landing)
      }}
      aside={<ApplicationSummary draft={draft} />}
    >
      <ApplicationWizard draft={draft} />
    </WizardLayout>
  )
}

function savedBefore(draft: ApplicationDraft, openedAt: number): boolean {
  if (draft.status !== 'draft' || draft.savedAt === null) return false
  if (draft.completedSteps.length === 0) return false
  return new Date(draft.savedAt).getTime() < openedAt
}
