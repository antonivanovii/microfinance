import { useState } from 'react'
import { MASCOTS } from '@ds/assets'
import { formatCountdown, formatPhone } from '@ds/lib'
import { Button, OtpInput } from '@ds/ui'
import { ApiError } from '@shared/api'
import { useCountdown } from '@shared/lib'
import type { Session } from '@entities/session'
import { useChallengeStore } from '../model/challengeStore'
import { useRequestOtp, useVerifyOtp } from '../model/mutations'
import styles from './CodeForm.module.css'

interface CodeFormProps {
  onVerified: (session: Session) => void
  onChangePhone: () => void
}

export function CodeForm({ onVerified, onChangePhone }: CodeFormProps) {
  const { challenge, resendAt, blockedUntil } = useChallengeStore()
  const requestOtp = useRequestOtp()
  const verifyOtp = useVerifyOtp()
  const [code, setCode] = useState('')

  const resendIn = useCountdown(resendAt)
  const blockedFor = useCountdown(blockedUntil)
  const blocked = blockedFor > 0
  const length = challenge?.codeLength ?? 4

  const verify = (value: string) => {
    if (!challenge || blocked || value.length !== length) return
    verifyOtp.mutate({ challengeId: challenge.challengeId, code: value }, { onSuccess: onVerified })
  }

  if (!challenge) return null

  const error = verifyOtp.error instanceof ApiError ? verifyOtp.error : null
  const message = error
    ? blocked
      ? (error.detail ?? error.message)
      : `${error.message}${error.detail ? `. ${error.detail}` : ''}`
    : undefined

  return (
    <div className={styles.root}>
      <div className={styles.body}>
        <p className={styles.sent}>
          Отправили на {formatPhone(challenge.phone)}
          {blocked ? null : (
            <>
              .{' '}
              <button type="button" className={styles.change} onClick={onChangePhone}>
                Изменить номер
              </button>
            </>
          )}
        </p>

        <OtpInput
          value={code}
          onChange={(next) => {
            setCode(next)
            // Код собран — отправляем сами: лишнее нажатие на мобильном
            // стоит конверсии.
            verify(next)
          }}
          length={length}
          resendAfterSeconds={blocked ? blockedFor : resendIn}
          onResend={() => {
            setCode('')
            requestOtp.mutate(challenge.phone)
          }}
          attemptsLeft={blocked ? 0 : challenge.attemptsLeft}
          disabled={blocked}
          {...(message ? { error: message } : {})}
        />

        {blocked ? (
          <div className={styles.help}>
            <img className={styles.helpMascot} src={MASCOTS.error} alt="" />
            <p className={styles.helpTitle}>Не приходит SMS?</p>
            <p className={styles.helpText}>
              Проверьте, что номер введён верно и связь есть. Если не помогло — напишем в поддержку
              и разберёмся.
            </p>
            <div className={styles.helpAction}>
              <Button variant="outline" size="md" fullWidth asChild>
                <a href="tel:+78007002299">Написать в поддержку</a>
              </Button>
            </div>
          </div>
        ) : challenge.previewCode ? (
          <div className={styles.preview}>
            <span className={styles.previewBadge}>SMS</span>
            <span className={styles.previewText}>
              <strong>Рублик:</strong> код {challenge.previewCode} для входа. Никому не сообщайте
            </span>
          </div>
        ) : null}
      </div>

      <div className={styles.footer}>
        <Button
          size="lg"
          fullWidth
          disabled={code.length !== length || blocked}
          loading={verifyOtp.isPending}
          onClick={() => {
            verify(code)
          }}
        >
          {blocked ? `Отправить снова · ${formatCountdown(blockedFor)}` : 'Войти'}
        </Button>
      </div>
    </div>
  )
}
