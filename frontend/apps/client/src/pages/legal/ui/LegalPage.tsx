import { Link, Navigate, useParams } from 'react-router-dom'
import { LEGAL_DOCUMENTS, ROUTES, isLegalDocument } from '@shared/config'
import { LegalDisclosure } from '@widgets/legal-disclosure'
import { SiteFooter } from '@widgets/site-footer'
import styles from './LegalPage.module.css'

export function LegalPage() {
  const { document } = useParams()

  if (!document || !isLegalDocument(document)) {
    return <Navigate to={ROUTES.landing} replace />
  }

  return (
    <div className={styles.root}>
      <main className={styles.main}>
        <Link to={ROUTES.landing} className={styles.back}>
          ‹ На главную
        </Link>
        <h1 className={styles.title}>{LEGAL_DOCUMENTS[document]}</h1>
        <div className={styles.body}>
          <p>
            Документ публикуется в редакции, действующей на дату заключения договора. Текст
            загружается из хранилища документов и здесь не хранится.
          </p>
        </div>
        <LegalDisclosure />
      </main>
      <SiteFooter />
    </div>
  )
}
