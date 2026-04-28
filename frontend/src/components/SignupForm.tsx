import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  registerFormSchema,
  interestOptions,
  type RegisterFormValues,
} from '../lib/schemas'
import { postRegister, getRefFromUrl } from '../lib/api'
import { AddressFinder, type AddressValue } from './AddressFinder'

function SuccessPanel() {
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
                <span>6월 1일 정기구독 오픈 안내 (공식 홈페이지·문자)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

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
    },
    mode: 'onTouched',
  })

  const postcode = watch('postcode')
  const addressRoad = watch('addressRoad')
  const addressJibun = watch('addressJibun')
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
      requestAnimationFrame(() => {
        document
          .getElementById('signup')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
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
    },
    (formErrors) => {
      const order: (keyof RegisterFormValues)[] = [
        'name',
        'phone',
        'postcode',
        'addressRoad',
        'addressDetail',
        'interests',
        'ageConsent',
        'privacyConsent',
      ]
      const first = order.find((k) => formErrors[k])
      if (!first) return
      const el =
        document.querySelector<HTMLElement>(`#${first}`) ??
        document.querySelector<HTMLElement>(`[name="${first}"]`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    },
  )

  if (state.kind === 'success') {
    return (
      <SuccessPanel />
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
        <p className="mt-1 text-[10px] text-mute/60 text-center" aria-hidden>
          build: 2026-04-29 / signup-fix-3
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
                <span className="font-semibold text-mute">[선택]</span> 정기구독 오픈 안내 및 마케팅 문자(광고) 수신에 동의합니다.
                <br />
                <span className="text-xs text-mute leading-relaxed block mt-1">
                  · 미동의 시에도 가입은 가능하나 오픈 안내 문자를 받지 못할 수 있습니다.
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
            {isSubmitting ? '등록 중…' : '사전회원 등록하기'}
          </button>
        </form>
      </div>
    </section>
  )
}
