import styles from './HeroCard.module.css'

interface HeroCardProps {
  caption: string
  amount: string
  action: { label: string; onClick: () => void }
}

export function HeroCard({ caption, amount, action }: HeroCardProps) {
  return (
    <section className={styles.root}>
      <span className={styles.caption}>{caption}</span>
      <span className={styles.amount}>{amount}</span>
      <button type="button" className={styles.action} onClick={action.onClick}>
        {action.label}
      </button>
    </section>
  )
}
