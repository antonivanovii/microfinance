import { Navigate, useNavigate } from 'react-router-dom'
import { CodeForm, useChallengeStore } from '@features/phone-auth'
import { ROUTES } from '@shared/config'
import { AuthLayout } from '@widgets/auth-layout'

export function LoginCodePage() {
  const navigate = useNavigate()
  const challenge = useChallengeStore((state) => state.challenge)
  const reset = useChallengeStore((state) => state.reset)

  // Прямой заход по ссылке или перезагрузка: челленджа нет, вводить нечего.
  if (!challenge) return <Navigate to={ROUTES.login} replace />

  const backToPhone = () => {
    reset()
    void navigate(ROUTES.login)
  }

  return (
    <AuthLayout title="Код из SMS" onBack={backToPhone}>
      <CodeForm
        onChangePhone={backToPhone}
        onVerified={(session) => {
          // Повторный клиент идёт в кабинет, новый — в анкету. Решает сервер.
          void navigate(session.returning ? ROUTES.home : ROUTES.application, { replace: true })
        }}
      />
    </AuthLayout>
  )
}
