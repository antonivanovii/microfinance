import { useNavigate } from 'react-router-dom'
import { PhoneForm } from '@features/phone-auth'
import { ROUTES } from '@shared/config'
import { AuthLayout } from '@widgets/auth-layout'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <AuthLayout
      title="Введите телефон"
      subtitle="Пришлём код в SMS. Если вы уже брали займ — попадёте в свой кабинет."
      mascot="hello"
      onBack={() => {
        void navigate(ROUTES.landing)
      }}
    >
      <PhoneForm
        onSent={() => {
          void navigate(ROUTES.loginCode)
        }}
      />
    </AuthLayout>
  )
}
