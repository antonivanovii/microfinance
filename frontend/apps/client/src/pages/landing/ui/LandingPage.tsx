import { Link } from 'react-router-dom'
import { Button } from '@ds/ui'
import { ROUTES } from '@shared/config'
import { SiteFooter } from '@widgets/site-footer'
import { Advantages, Cta, Examples, Faq, Hero, Requirements, Steps } from './sections'
import styles from './LandingPage.module.css'

export function LandingPage() {
  return (
    <div className={styles.root}>
      <main className={styles.main}>
        <Hero />
        <Advantages />
        <Steps />
        <Requirements />
        <Examples />
        <Faq />
        <Cta />
      </main>

      <SiteFooter />

      <div className={styles.stickyBar}>
        <Button size="lg" fullWidth asChild>
          <Link to={ROUTES.login}>Получить деньги</Link>
        </Button>
      </div>
    </div>
  )
}
