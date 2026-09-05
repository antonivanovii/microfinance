import { useNavigate } from 'react-router-dom'
import { EmptyState } from '@ds/ui'
import { ROUTES } from '@shared/config'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.root}>
      <EmptyState
        mascot="empty"
        title="Страница не найдена"
        description="Ссылка устарела или введена с ошибкой"
        action={{
          label: 'На главную',
          onClick: () => {
            void navigate(ROUTES.landing)
          },
        }}
      />
    </div>
  )
}
