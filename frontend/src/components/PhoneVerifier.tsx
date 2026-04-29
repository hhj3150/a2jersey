// 휴대폰 OTP 인증 위젯.
// 흐름:
//   1) 휴대폰 입력 + "인증번호 받기" 클릭 → SMS 발송 → 코드 입력란 노출
//   2) 코드 입력 + "확인" 클릭 → 토큰 발급 → 부모에게 전달 (onVerified)
//   3) 부모는 verificationToken 으로 form 값 업데이트 → 등록 시 함께 전송
import { useEffect, useRef, useState } from 'react'
import { postVerifySendCode, postVerifyCheckCode } from '../lib/api'

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent'; expiresAt: number }
  | { kind: 'checking' }
  | { kind: 'verified' }

interface Props {
  phone: string
  phoneValid: boolean
  isVerified: boolean
  onVerified: (token: string) => void
  onReset: () => void
}

const PHONE_REGEX = /^01[016789]-?\d{3,4}-?\d{4}$/

export function PhoneVerifier({ phone, phoneValid, isVerified, onVerified, onReset }: Props) {
  const [status, setStatus] = useState<Status>(
    isVerified ? { kind: 'verified' } : { kind: 'idle' },
  )
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [remaining, setRemaining] = useState(0)
  const lastVerifiedPhone = useRef<string>(isVerified ? phone : '')

  // 휴대폰 번호가 인증된 번호와 달라지면 인증 상태 초기화
  useEffect(() => {
    if (isVerified && lastVerifiedPhone.current && phone !== lastVerifiedPhone.current) {
      setStatus({ kind: 'idle' })
      setCode('')
      setError(null)
      lastVerifiedPhone.current = ''
      onReset()
    }
  }, [phone, isVerified, onReset])

  // 5분 카운트다운
  useEffect(() => {
    if (status.kind !== 'sent') return
    const tick = () => {
      const left = Math.max(0, Math.floor((status.expiresAt - Date.now()) / 1000))
      setRemaining(left)
      if (left === 0) {
        setStatus({ kind: 'idle' })
        setError('인증번호가 만료되었습니다. 다시 발송해주세요.')
      }
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [status])

  const handleSend = async () => {
    if (!PHONE_REGEX.test(phone)) {
      setError('올바른 휴대폰 번호를 입력해주세요')
      return
    }
    setError(null)
    setStatus({ kind: 'sending' })
    const result = await postVerifySendCode(phone)
    if (!result.ok) {
      setStatus({ kind: 'idle' })
      setError(result.error || '발송에 실패했습니다')
      return
    }
    const ttlSec = result.ttl ?? 300
    setStatus({ kind: 'sent', expiresAt: Date.now() + ttlSec * 1000 })
    setCode('')
  }

  const handleCheck = async () => {
    if (!/^\d{6}$/.test(code)) {
      setError('인증번호 6자리를 입력해주세요')
      return
    }
    setError(null)
    setStatus({ kind: 'checking' })
    const result = await postVerifyCheckCode(phone, code)
    if (!result.ok || !result.token) {
      setStatus({ kind: 'sent', expiresAt: Date.now() + remaining * 1000 })
      setError(result.error || '인증에 실패했습니다')
      return
    }
    setStatus({ kind: 'verified' })
    lastVerifiedPhone.current = phone
    onVerified(result.token)
  }

  if (status.kind === 'verified') {
    return (
      <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-soil-dark">
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-soil text-white text-[10px]">
          ✓
        </span>
        휴대폰 인증 완료
      </p>
    )
  }

  const isSending = status.kind === 'sending'
  const isChecking = status.kind === 'checking'
  const isSent = status.kind === 'sent'

  return (
    <div className="mt-2 space-y-2">
      {!isSent && (
        <button
          type="button"
          onClick={handleSend}
          disabled={!phoneValid || isSending}
          className="text-xs font-medium text-soil-dark underline underline-offset-4 disabled:text-mute disabled:no-underline"
        >
          {isSending ? '발송 중...' : '인증번호 받기'}
        </button>
      )}

      {isSent && (
        <div className="rounded-xl border border-line bg-cream/40 p-3">
          <p className="text-xs text-mute mb-2">
            입력하신 번호로 6자리 인증번호가 발송되었습니다.{' '}
            <span className="font-medium text-soil-dark">{Math.ceil(remaining / 60)}분 남음</span>
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6자리"
              className="field-input flex-1 tracking-widest text-center"
              aria-label="인증번호"
            />
            <button
              type="button"
              onClick={handleCheck}
              disabled={isChecking || code.length !== 6}
              className="rounded-xl bg-soil-dark px-4 text-sm font-medium text-white disabled:bg-mute"
            >
              {isChecking ? '확인 중...' : '확인'}
            </button>
          </div>
          <button
            type="button"
            onClick={handleSend}
            disabled={isSending}
            className="mt-2 text-[11px] text-mute underline underline-offset-4"
          >
            인증번호 다시 받기
          </button>
        </div>
      )}

      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
