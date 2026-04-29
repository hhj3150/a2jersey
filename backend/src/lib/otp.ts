// 휴대폰 OTP 발송 / 검증 유틸리티
// - 6자리 숫자 코드 (앞자리 0 허용)
// - bcrypt 가 아닌 SHA-256 + salt (단순/저렴, OTP 는 5분 TTL 이라 충분)
// - SMS 발송은 lib/solapi.ts 의 sendBulkSms 재사용
import { createHash, randomBytes, randomInt } from 'node:crypto'
import { sendBulkSms, type SolapiConfig } from './solapi.js'

export const OTP_TTL_SEC = 5 * 60 // 5분
export const TOKEN_TTL_SEC = 10 * 60 // 인증 후 등록까지 10분

export const generateCode = (): string => {
  // 100000~999999 → 6자리 보장. randomInt(0, 1_000_000) 은 0 패딩 필요해 가독성↓
  return String(randomInt(100000, 1_000_000))
}

export const hashCode = (code: string, salt: string): string =>
  createHash('sha256').update(`${code}:${salt}`).digest('hex')

export const generateToken = (): string => randomBytes(24).toString('hex')

export const generateSalt = (): string => randomBytes(8).toString('hex')

export const isoFromNow = (offsetSec: number): string =>
  new Date(Date.now() + offsetSec * 1000).toISOString()

export const composeOtpMessage = (code: string): string =>
  `[송영신목장] 인증번호 [${code}]\n타인에게 알려주지 마세요. (5분 유효)`

export async function sendOtpSms(
  cfg: SolapiConfig,
  phone: string,
  code: string,
): Promise<{ ok: boolean; error?: string }> {
  const text = composeOtpMessage(code)
  const result = await sendBulkSms(cfg, [{ to: phone, text }])
  if (!result.ok) {
    const detail = result.failedDetails[0]
    return {
      ok: false,
      error: detail?.statusMessage || '발송 실패',
    }
  }
  return { ok: true }
}
