import { Link } from 'react-router-dom'
import { OBJECTS } from '@ds/assets'
import { LEGAL_DOCUMENTS, ROUTES, type LegalDocument } from '@shared/config'
import styles from './SiteFooter.module.css'

const SHORT: Record<LegalDocument, string> = {
  terms: 'Общие условия',
  tariffs: 'Тарифы',
  pep: 'ПЭП',
  privacy: 'Персданные',
  complaints: 'Обращения',
  contacts: 'Контакты',
}

// Порядок задаёт колонки на десктопе: первая тройка — левая, вторая — правая.
const LINKS: LegalDocument[] = ['terms', 'tariffs', 'pep', 'privacy', 'complaints', 'contacts']

export function SiteFooter() {
  return (
    <footer className={styles.root}>
      <div className={styles.company}>
        <img className={styles.shield} src={OBJECTS.shield} alt="" />
        <div>
          <p className={styles.name}>ООО МКК «Рублик»</p>
          <p className={styles.registry}>
            В реестре МФО Банка России № 21-03-045-77 от 14.02.2021. Член СРО «МиР».
          </p>
        </div>
      </div>

      <nav className={styles.links} aria-label="Правовые документы">
        {LINKS.map((document) => (
          <Link
            key={document}
            to={ROUTES.legal(document)}
            className={styles.link}
            title={LEGAL_DOCUMENTS[document]}
          >
            {SHORT[document]}
          </Link>
        ))}
      </nav>

      <p className={styles.note}>
        ООО МКК «Рублик», ИНН 7712345678. В государственном реестре МФО Банка России № 21-03-045-77.
        Член СРО «МиР». ПСК от 0 % до 292,000 % годовых, сумма от 3 000 до 30 000 ₽, срок от 7 до 30
        дней. Пример: 15 000 ₽ на 14 дней — к возврату 17 100 ₽.
      </p>
    </footer>
  )
}
