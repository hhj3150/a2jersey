import { env } from '../env'
import type { RegisterFormValues } from './schemas'

export interface RegisterSuccess {
  ok: true
  id: number
}

export interface RegisterError {
  ok: false
  error: string
  code?: 'DUPLICATE_PHONE'
  fieldErrors?: Record<string, string[] | undefined>
}

export type RegisterResult = RegisterSuccess | RegisterError

export async function postRegister(
  values: RegisterFormValues,
  ref?: string,
): Promise<RegisterResult> {
  try {
    const payload = {
      name: values.name,
      phone: values.phone,
      postcode: values.postcode,
      addressRoad: values.addressRoad,
      addressJibun: values.addressJibun || undefined,
      addressDetail: values.addressDetail || undefined,
      interests: values.interests,
      smsConsent: values.smsConsent,
      privacyConsent: values.privacyConsent,
      ageConsent: values.ageConsent,
      ref: ref || 'direct',
    }
    const res = await fetch(`${env.apiUrl}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = (await res.json()) as RegisterResult
    return data
  } catch (err) {
    console.error('[postRegister] network error:', err)
    return {
      ok: false,
      error: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    }
  }
}

export function getRefFromUrl(): string | undefined {
  if (typeof window === 'undefined') return undefined
  const ref = new URLSearchParams(window.location.search).get('ref')
  return ref?.slice(0, 20) || undefined
}
