import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  registerFormSchema,
  interestOptions,
  type RegisterFormValues,
} from '../lib/schemas'
import { postRegister, getRefFromUrl } from '../lib/api'
import { AddressFinder, type AddressValue } from './AddressFinder'
import { PhoneVerifier } from './PhoneVerifier'
import { useDDay } from '../lib/useDDay'

function SuccessPanel({ isLaunched }: { isLaunched: boolean }) {
  return (
    <section id="signup" className="section bg-cream" aria-live="polite">
      <div className="container-app">
        <div className="card text-center py-12">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-soil/10 text-soil-dark text-2xl">
            ✓
          </div>
          <h2 className="text-2xl font-semibold tracking-tight-kr text-ink">
            {isLaunched ? '소식받기 신청 완료' : '사전회원 등록 완료'}
          </h2>
          <p className="mt-4 text-base text-mute leading-relaxed max-w-reading mx-auto">
            {isLaunched ? (
              <>
                송영신목장 A2 Jersey Hay Milk 소식받기에 등록되었습니다.
                <br />
                신상품·이벤트·할인 소식을 가장 먼저 SMS로 안내드리겠습니다.
              </>
            ) : (
              <>
                송영신목장 A2 Jersey Hay Milk 사전회원으로 등록되었습니다.
                <br />
                6월 1일 정기구독 오픈 시 가장 먼저 안내드리겠습니다.
              </>
            )}
          </p>

          <div className="mt-8 rounded-xl bg-cream/60 border border-line p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-soil">
              안내받을 곳
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-ink">
              <li className="flex items-start gap-2">
                <span className="text-soil-dark mt-0.5">•</span>
                <span>등록하신 휴대폰 번호로 문자 발송 (마케팅 동의 시)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-soil-dark mt-0.5">•</span>
                <span>
                  {isLaunched
                    ? '신상품·시즌 이벤트·정기구독 할인 안내 (월 1~2회)'
                    : '6월 1일 정기구독 오픈 안내 (공식 홈페이지·문자)'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function ConfirmModal({
  open,
  variant,
  onClose,
}: {
  open: boolean
  variant: 'success-pre' | 'success-live' | 'duplicate'
  onClose: () => void
}) {
  // ESC 키로 닫기
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const config = {
    'success-pre': {
      icon: '✓',
      iconClass: 'bg-soil/10 text-soil-dark',
      title: '사전회원 등록이 완료되었습니다',
      body: (
        <>
          6월 1일 정기구독 오픈 시
          <br />
          가장 먼저 SMS로 안내드리겠습니다.
        </>
      ),
    },
    'success-live': {
      icon: '✓',
      iconClass: 'bg-soil/10 text-soil-dark',
      title: '알림받기가 신청되었습니다',
      body: (
        <>
          송영신목장 신상품·이벤트·할인 소식을
          <br />
          SMS로 가장 먼저 보내드릴게요.
        </>
      ),
    },
    duplicate: {
      icon: 'ℹ',
      iconClass: 'bg-blue-50 text-blue-700',
      title: '이미 가입하신 고객입니다',
      body: (
        <>
          이 휴대폰 번호로는 이미 알림받기가 신청되어 있어요.
          <br />
          신상품·이벤트 소식이 들어오면 SMS로 자동 안내드릴게요.
        </>
      ),
    },
  }[variant]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl ${config.iconClass}`}
          aria-hidden
        >
          {config.icon}
        </div>
        <h3
          id="confirm-modal-title"
          className="text-lg font-bold text-ink tracking-tight-kr"
        >
          {config.title}
        </h3>
        <p className="mt-3 text-sm text-mute leading-relaxed">{config.body}</p>
        <button
          type="button"
          onClick={onClose}
          className="btn-primary w-full mt-6"
        >
          확인
        </button>
      </div>
    </div>
  )
}

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; id: number }
  | { kind: 'error'; message: string }

type ModalState =
  | { kind: 'closed' }
  | { kind: 'success' }
  | { kind: 'duplicate' }

interface SignupFormProps {
  launchDate: string
}

export function SignupForm({ launchDate }: SignupFormProps) {
  const dday = useDDay(launchDate)
  const isLaunched = dday.phase === 'live' || dday.phase === 'today'
  const [state, setState] = useState<SubmitState>({ kind: 'idle' })
  const [modal, setModal] = useState<ModalState>({ kind: 'closed' })

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      postcode: '',
      addressRoad: '',
      addressJibun: '',
      addressDetail: '',
      interests: [],
      smsConsent: false,
      privacyConsent: false as unknown as true,
      ageConsent: false as unknown as true,
      verificationToken: '',
    },
    mode: 'onTouched',
  })

  const postcode = watch('postcode')
  const addressRoad = watch('addressRoad')
  const addressJibun = watch('addressJibun')
  const phoneValue = watch('phone')
  const verificationToken = watch('verificationToken')
  const PHONE_REGEX = /^01[016789]-?\d{3,4}-?\d{4}$/
  const phoneValid = PHONE_REGEX.test(phoneValue || '')
  const currentAddress: AddressValue | null =
    postcode && addressRoad
      ? { postcode, roadAddress: addressRoad, jibunAddress: addressJibun || '' }
      : null

  const onSubmit = handleSubmit(
    async (values) => {
      setState({ kind: 'submitting' })
      const ref = getRefFromUrl()
      const result = await postRegister(values, ref)

    if (result.ok) {
      setState({ kind: 'success', id: result.id })
      setModal({ kind: 'success' })
      requestAnimationFrame(() => {
        document
          .getElementById('signup')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      return
    }

    if (result.code === 'DUPLICATE_PHONE') {
      // 운영 정책: 중복 가입자에겐 친근한 안내만 + 폼은 그대로 둠 (refresh 안 함)
      setModal({ kind: 'duplicate' })
      setState({ kind: 'idle' })
      return
    }

    if (result.fieldErrors) {
      for (const [field, msgs] of Object.entries(result.fieldErrors)) {
        if (msgs?.[0]) {
          setError(field as keyof RegisterFormValues, {
            type: 'server',
            message: msgs[0],
          })
        }
      }
      setState({ kind: 'idle' })
      return
    }

      setState({ kind: 'error', message: result.error })
    },
    (formErrors) => {
      const order: (keyof RegisterFormValues)[] = [
        'name',
        'phone',
        'verificationToken',
        'postcode',
        'addressRoad',
        'addressDetail',
        'interests',
        'ageConsent',
        'privacyConsent',
      ]
      const first = order.find((k) => formErrors[k])
      if (!first) return
      // verificationToken 은 화면 보이는 입력이 없으므로 phone 영역으로 스크롤
      const target = first === 'verificationToken' ? 'phone' : first
      const el =
        document.querySelector<HTMLElement>(`#${target}`) ??
        document.querySelector<HTMLElement>(`[name="${target}"]`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    },
  )

  if (state.kind === 'success') {
    return (
      <>
        <SuccessPanel isLaunched={isLaunched} />
        <ConfirmModal
          open={modal.kind === 'success'}
          variant={isLaunched ? 'success-live' : 'success-pre'}
          onClose={() => setModal({ kind: 'closed' })}
        />
      </>
    )
  }

  const isSubmitting = state.kind === 'submitting'

  return (
    <section id="signup" className="section bg-cream" aria-labelledby="signup-title">
      <div className="container-app">
        <p className="section-eyebrow text-center">
          {isLaunched ? 'News' : 'Sign up'}
        </p>
        <h2 id="signup-title" className="section-title text-center">
          {isLaunched ? '송영신목장 소식 받기' : '정기구독 오픈 알림 받기'}
        </h2>
        <p className="mt-3 text-sm text-mute text-center max-w-reading mx-auto">
          {isLaunched ? (
            <>
              신상품·시즌 이벤트·정기구독 할인 소식을 SMS로 가장 먼저 안내드립니다.
              <br />
              월 1~2회, 광고 표기 + 080 무료 수신거부 포함.
            </>
          ) : (
            <>이름과 연락처만 남기시면 6월 1일 오픈 즉시 가장 먼저 안내드립니다.</>
          )}
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="field-label">이름</label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="홍길동"
              className="field-input"
              {...register('name')}
            />
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="field-label">휴대폰 번호</label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              inputMode="numeric"
              placeholder="010-1234-5678"
              className="field-input"
              {...register('phone')}
            />
            {errors.phone && <p className="field-error">{errors.phone.message}</p>}
            <PhoneVerifier
              phone={phoneValue || ''}
              phoneValid={phoneValid}
              isVerified={Boolean(verificationToken)}
              onVerified={(token) => {
                setValue('verificationToken', token, { shouldValidate: true })
                clearErrors('verificationToken')
              }}
              onReset={() => {
                setValue('verificationToken', '', { shouldValidate: false })
              }}
              onDuplicate={() => setModal({ kind: 'duplicate' })}
            />
            {errors.verificationToken && (
              <p className="field-error">{errors.verificationToken.message}</p>
            )}
          </div>

          <div>
            <label className="field-label">주소</label>
            <Controller
              name="postcode"
              control={control}
              render={() => (
                <AddressFinder
                  value={currentAddress}
                  onChange={(v) => {
                    setValue('postcode', v.postcode, { shouldValidate: true })
                    setValue('addressRoad', v.roadAddress, { shouldValidate: true })
                    setValue('addressJibun', v.jibunAddress, { shouldValidate: false })
                  }}
                  error={errors.postcode?.message || errors.addressRoad?.message}
                />
              )}
            />
            <input type="hidden" {...register('addressRoad')} />
            <input type="hidden" {...register('addressJibun')} />
            <input
              type="text"
              autoComplete="address-line2"
              placeholder="상세주소 (동/호수, 건물명 등)"
              className="field-input mt-2"
              maxLength={100}
              {...register('addressDetail')}
            />
            {errors.addressDetail && (
              <p className="field-error">{errors.addressDetail.message}</p>
            )}
          </div>

          <fieldset>
            <legend className="field-label">관심 상품 <span className="text-mute font-normal">(중복 선택)</span></legend>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {interestOptions.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 h-12 cursor-pointer hover:border-soil"
                >
                  <input
                    type="checkbox"
                    value={opt.value}
                    className="checkbox"
                    {...register('interests')}
                  />
                  <span className="text-sm text-ink">{opt.label}</span>
                </label>
              ))}
            </div>
            {errors.interests && (
              <p className="field-error">{errors.interests.message as string}</p>
            )}
          </fieldset>

          <div className="space-y-3 pt-2">
            <label htmlFor="ageConsent" className="flex items-start gap-3 cursor-pointer">
              <Controller
                name="ageConsent"
                control={control}
                render={({ field }) => (
                  <input
                    id="ageConsent"
                    type="checkbox"
                    className="checkbox mt-0.5"
                    checked={field.value === true}
                    onChange={(e) => {
                      const checked = e.target.checked
                      field.onChange(checked)
                      if (checked) clearErrors('ageConsent')
                    }}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                )}
              />
              <span className="text-sm text-ink leading-relaxed">
                <span className="font-semibold text-soil-dark">[필수]</span> 본인은 만 14세 이상입니다.
                <br />
                <span className="text-xs text-mute">
                  「개인정보 보호법」 제22조의2에 따라 만 14세 미만 아동의 가입을 받지 않습니다.
                </span>
              </span>
            </label>
            {errors.ageConsent && (
              <p className="field-error pl-8">{errors.ageConsent.message}</p>
            )}

            <label htmlFor="privacyConsent" className="flex items-start gap-3 cursor-pointer">
              <Controller
                name="privacyConsent"
                control={control}
                render={({ field }) => (
                  <input
                    id="privacyConsent"
                    type="checkbox"
                    className="checkbox mt-0.5"
                    checked={field.value === true}
                    onChange={(e) => {
                      const checked = e.target.checked
                      field.onChange(checked)
                      if (checked) clearErrors('privacyConsent')
                    }}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                )}
              />
              <span className="text-sm text-ink leading-relaxed">
                <span className="font-semibold text-soil-dark">[필수]</span> 개인정보 수집·이용에 동의합니다. (
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-soil-dark underline underline-offset-2 hover:text-soil"
                >
                  처리방침 전문 보기
                </a>
                )
                <br />
                <span className="text-xs text-mute leading-relaxed block mt-1">
                  · 수집 항목: 이름, 휴대폰 번호, 우편번호·도로명·지번·상세주소, 관심 상품
                  <br />
                  · 자동 수집: 접속 IP, User-Agent, 접속 일시, 유입 경로(ref)
                  <br />
                  · 처리 위탁: Solapi(SMS 발송), Railway·Netlify(미국, 호스팅)
                  <br />
                  · 보유 기간: 가입일로부터 1년 — 만료 시 자동 파기
                  <br />
                  · 거부 시 사전회원 등록이 어렵습니다.
                </span>
              </span>
            </label>
            {errors.privacyConsent && (
              <p className="field-error pl-8">{errors.privacyConsent.message}</p>
            )}

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox mt-0.5"
                {...register('smsConsent')}
              />
              <span className="text-sm text-ink leading-relaxed">
                <span className="font-semibold text-mute">[선택]</span>{' '}
                {isLaunched
                  ? '신상품·이벤트·할인 안내 등 마케팅 문자(광고) 수신에 동의합니다.'
                  : '정기구독 오픈 안내 및 마케팅 문자(광고) 수신에 동의합니다.'}
                <br />
                <span className="text-xs text-mute leading-relaxed block mt-1">
                  · 미동의 시에도 가입은 가능하나 소식 안내 문자를 받지 못할 수 있습니다.
                  <br />
                  · 야간(KST 21:00~08:00)에는 발송하지 않으며, 메시지마다 080 무료 수신거부 번호가 포함됩니다.
                </span>
              </span>
            </label>

            <p className="text-[11px] text-mute leading-relaxed pt-2 border-t border-line/60">
              가입 시{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-soil-dark underline underline-offset-2 hover:text-soil"
              >
                사전회원 이용약관
              </a>{' '}
              및{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-soil-dark underline underline-offset-2 hover:text-soil"
              >
                개인정보 처리방침
              </a>
              에 동의한 것으로 간주됩니다.
            </p>
          </div>

          {state.kind === 'error' && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {state.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full"
          >
            {isSubmitting
              ? '등록 중…'
              : isLaunched
                ? '소식받기 신청하기'
                : '사전회원 등록하기'}
          </button>
        </form>
      </div>

      <ConfirmModal
        open={modal.kind === 'duplicate'}
        variant="duplicate"
        onClose={() => setModal({ kind: 'closed' })}
      />
    </section>
  )
}
