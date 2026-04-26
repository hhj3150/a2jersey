import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  registerFormSchema,
  interestOptions,
  type RegisterFormValues,
} from '../lib/schemas'
import { postRegister, getRefFromUrl } from '../lib/api'

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; id: number }
  | { kind: 'error'; message: string }

export function SignupForm() {
  const [state, setState] = useState<SubmitState>({ kind: 'idle' })

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      region: '',
      interests: [],
      smsConsent: false,
      privacyConsent: false as unknown as true,
    },
    mode: 'onBlur',
  })

  const onSubmit = handleSubmit(async (values) => {
    setState({ kind: 'submitting' })
    const ref = getRefFromUrl()
    const result = await postRegister(values, ref)

    if (result.ok) {
      setState({ kind: 'success', id: result.id })
      window.scrollTo({ top: document.getElementById('signup')?.offsetTop, behavior: 'smooth' })
      return
    }

    if (result.code === 'DUPLICATE_PHONE') {
      setError('phone', { type: 'manual', message: result.error })
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
  })

  if (state.kind === 'success') {
    return (
      <section id="signup" className="section bg-cream" aria-live="polite">
        <div className="container-app">
          <div className="card text-center py-12">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-soil/10 text-soil-dark text-2xl">
              ✓
            </div>
            <h2 className="text-2xl font-semibold tracking-tight-kr text-ink">
              사전회원 등록 완료
            </h2>
            <p className="mt-4 text-base text-mute leading-relaxed max-w-reading mx-auto">
              송영신목장 A2 Jersey Hay Milk 사전회원으로 등록되었습니다.
              <br />
              6월 1일 정기구독 오픈 시 가장 먼저 안내드리겠습니다.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const isSubmitting = state.kind === 'submitting'

  return (
    <section id="signup" className="section bg-cream" aria-labelledby="signup-title">
      <div className="container-app">
        <p className="section-eyebrow text-center">Sign up</p>
        <h2 id="signup-title" className="section-title text-center">
          정기구독 오픈 알림 받기
        </h2>
        <p className="mt-3 text-sm text-mute text-center max-w-reading mx-auto">
          이름과 연락처만 남기시면 6월 1일 오픈 즉시 가장 먼저 안내드립니다.
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
          </div>

          <div>
            <label htmlFor="region" className="field-label">거주 지역</label>
            <input
              id="region"
              type="text"
              autoComplete="address-level1"
              placeholder="예: 경기도 안성시 / 서울 강남구"
              className="field-input"
              {...register('region')}
            />
            {errors.region && <p className="field-error">{errors.region.message}</p>}
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
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox mt-0.5"
                {...register('privacyConsent')}
              />
              <span className="text-sm text-ink leading-relaxed">
                <span className="font-semibold text-soil-dark">[필수]</span> 개인정보 수집·이용에 동의합니다.
                <br />
                <span className="text-xs text-mute">
                  수집 항목: 이름, 휴대폰 번호, 거주 지역, 관심 상품 ·
                  보유 기간: 정기구독 오픈 안내 발송 후 1년 ·
                  거부 시 사전회원 등록이 어렵습니다.
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
                <span className="font-semibold text-mute">[선택]</span> 정기구독 오픈 안내 및 마케팅 문자 수신에 동의합니다.
                <br />
                <span className="text-xs text-mute">
                  미동의 시에도 가입은 가능하나 오픈 안내 문자를 받지 못할 수 있습니다.
                </span>
              </span>
            </label>
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
            {isSubmitting ? '등록 중…' : '사전회원 등록하기'}
          </button>
        </form>
      </div>
    </section>
  )
}
