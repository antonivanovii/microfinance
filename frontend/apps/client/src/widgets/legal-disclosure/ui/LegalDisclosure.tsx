import { Link } from 'react-router-dom'
import { OBJECTS } from '@ds/assets'
import { LEGAL_DOCUMENTS, ROUTES, type LegalDocument } from '@shared/config'
import styles from './LegalDisclosure.module.css'

const SHOWN: LegalDocument[] = ['terms', 'tariffs', 'pep', 'privacy', 'complaints']

/**
 * Обязательное раскрытие. Отсутствие любого пункта — замечание при проверке,
 * поэтому список задан здесь, а не собирается из того, что нашлось.
 */
export function LegalDisclosure() {
  return (
    <section className={styles.root} id="about" aria-label="Сведения о компании">
      <div className={styles.company}>
        <img className={styles.shield} src={OBJECTS.shield} alt="" />
        <div>
          <p className={styles.name}>ООО МКК «Рублик»</p>
          <p className={styles.registry}>
            В реестре МФО Банка России № 21-03-045-77 от 14.02.2021. Член СРО «МиР».
          </p>
        </div>
      </div>

      <nav className={styles.links}>
        {SHOWN.map((document) => (
          <Link key={document} to={ROUTES.legal(document)} className={styles.link}>
            {LEGAL_DOCUMENTS[document]}
            <span className={styles.chevron} aria-hidden="true">
              ›
            </span>
          </Link>
        ))}
      </nav>
    </section>
  )
}

export function LegalNote() {
  return (
    <p className={styles.note}>
      ПСК от 0 % до 292,000 % годовых. Сумма от 3 000 до 30 000 ₽, срок от 7 до 30 дней. Пример: 15
      000 ₽ на 14 дней — к возврату 17 100 ₽.
    </p>
  )
}
