// 휴대폰 OTP 인증 엔드포인트.
// 흐름:
//   1) /verify/send-code — 6자리 코드 SMS 발송, DB 에 해시 저장 (TTL 5분)
//   2) /verify/check-code — 코드 검증 후 verificationToken 발급 (TTL 10분)
//   3) /register — 토큰을 받아 검증, 성공 시 토큰 소비
import { Router, type Request, type Response } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { db } from '../db.js'
import {
  generateCode,
  generateSalt,
  generateToken,
  hashCode,
  isoFromNow,
  OTP_TTL_SEC,
  TOKEN_TTL_SEC,
  sendOtpSms,
} from '../lib/otp.js'
import { isSolapiConfigured, type SolapiConfig } from '../lib/solapi.js'

const router = Router()

const PHONE_REGEX = /^01[016789]-?\d{3,4}-?\d{4}$/

const sendSchema = z.object({
  phone: z.string().trim().regex(PHONE_REGEX, '올바른 휴대폰 번호 형식이 아닙니다'),
})

const checkSchema = z.object({
  phone: z.string().trim().regex(PHONE_REGEX, '올바른 휴대폰 번호 형식이 아닙니다'),
  code: z.string().trim().regex(/^\d{6}$/, '인증번호는 6자리 숫자입니다'),
})

const sendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1시간
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    ok: false,
    error: '인증번호 발송 한도 초과 (1시간에 5회). 잠시 후 다시 시도해주세요',
  },
})

const checkLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5분
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    ok: false,
    error: '인증 시도 한도 초과 (5분에 10회). 잠시 후 다시 시도해주세요',
  },
})

const solapiCfg = (): SolapiConfig => ({
  apiKey: process.env.SOLAPI_API_KEY,
  apiSecret: process.env.SOLAPI_API_SECRET,
  from: process.env.SOLAPI_FROM_NUMBER,
})

const findByPhoneInLeads = db.prepare<[string]>('SELECT id FROM leads WHERE phone = ?')

// 같은 번호로 1분 내 재발송 차단 (코드 도용 방지 + SMS 비용 절약)
const findRecentByPhone = db.prepare<[string, string]>(`
  SELECT id, expires_at, created_at
  FROM phone_verifications
  WHERE phone = ?
    AND created_at > ?
    AND verified_at IS NULL
  ORDER BY id DESC
  LIMIT 1
`)

// 발송 시 같은 번호의 미사용 미인증 기존 코드 무효화
const expirePrevByPhone = db.prepare<[string]>(`
  UPDATE phone_verifications
     SET expires_at = datetime('now', '-1 minute')
   WHERE phone = ? AND verified_at IS NULL
`)

const insertVerification = db.prepare(`
  INSERT INTO phone_verifications (phone, code_hash, expires_at, ip)
  VALUES (@phone, @code_hash, @expires_at, @ip)
`)

const findActiveByPhone = db.prepare<[string]>(`
  SELECT id, code_hash, expires_at, attempts, verified_at
  FROM phone_verifications
  WHERE phone = ?
    AND verified_at IS NULL
    AND expires_at > datetime('now')
  ORDER BY id DESC
  LIMIT 1
`)

const incrementAttempts = db.prepare<[number]>(`
  UPDATE phone_verifications SET attempts = attempts + 1 WHERE id = ?
`)

const markVerified = db.prepare<[string, string, number]>(`
  UPDATE phone_verifications
     SET verified_at = datetime('now'),
         token = ?,
         token_expires_at = ?
   WHERE id = ?
`)

interface VerificationRow {
  id: number
  code_hash: string
  expires_at: string
  attempts: number
  verified_at: string | null
}

router.post('/verify/send-code', sendLimiter, async (req: Request, res: Response) => {
  try {
    const { phone } = sendSchema.parse(req.body)

    // 이미 등록된 번호는 발송 차단 (DUPLICATE_PHONE 미리 알림 + SMS 비용 절약)
    const existing = findByPhoneInLeads.get(phone) as { id: number } | undefined
    if (existing) {
      return res.status(409).json({
        ok: false,
        error: '이미 등록된 휴대폰 번호입니다',
        code: 'DUPLICATE_PHONE',
      })
    }

    // 1분 이내 재발송 차단
    const oneMinAgo = new Date(Date.now() - 60 * 1000).toISOString()
    const recent = findRecentByPhone.get(phone, oneMinAgo) as { id: number } | undefined
    if (recent) {
      return res.status(429).json({
        ok: false,
        error: '인증번호는 1분 후 재발송 가능합니다',
      })
    }

    const cfg = solapiCfg()
    if (!isSolapiConfigured(cfg)) {
      console.error('[verify/send-code] Solapi not configured')
      return res
        .status(503)
        .json({ ok: false, error: 'SMS 서비스 일시 점검 중. 잠시 후 다시 시도해주세요' })
    }

    const code = generateCode()
    const salt = generateSalt()
    const codeHash = hashCode(code, salt)
    // salt 를 code_hash 안에 함께 저장: `${salt}:${hash}` 형식
    const storedHash = `${salt}:${codeHash}`

    const ip = req.ip || req.socket.remoteAddress || null

    // 같은 번호의 기존 미인증 코드 무효화 (다중 발송 시 마지막 코드만 유효)
    expirePrevByPhone.run(phone)

    insertVerification.run({
      phone,
      code_hash: storedHash,
      expires_at: isoFromNow(OTP_TTL_SEC),
      ip,
    })

    const sendResult = await sendOtpSms(cfg, phone, code)
    if (!sendResult.ok) {
      console.error('[verify/send-code] Solapi send failed:', sendResult.error)
      return res.status(502).json({
        ok: false,
        error: '인증번호 발송에 실패했습니다. 번호를 확인하시고 잠시 후 다시 시도해주세요',
      })
    }

    return res.json({ ok: true, ttl: OTP_TTL_SEC })
  } catch (err) {
    if (err instanceof z.ZodError) {
      const fieldErrors = err.flatten().fieldErrors
      return res.status(400).json({ ok: false, error: '입력값을 확인해주세요', fieldErrors })
    }
    console.error('[verify/send-code] unexpected:', err)
    return res.status(500).json({ ok: false, error: '서버 오류가 발생했습니다' })
  }
})

router.post('/verify/check-code', checkLimiter, (req: Request, res: Response) => {
  try {
    const { phone, code } = checkSchema.parse(req.body)

    const row = findActiveByPhone.get(phone) as VerificationRow | undefined
    if (!row) {
      return res.status(400).json({
        ok: false,
        error: '인증번호가 만료되었거나 발급된 적이 없습니다. 다시 발송해주세요',
      })
    }

    const MAX_ATTEMPTS = 5
    if (row.attempts >= MAX_ATTEMPTS) {
      return res.status(429).json({
        ok: false,
        error: '인증 시도 횟수를 초과했습니다. 인증번호를 다시 발송해주세요',
      })
    }

    const [salt, expectedHash] = row.code_hash.split(':')
    if (!salt || !expectedHash) {
      console.error('[verify/check-code] malformed code_hash row id=', row.id)
      return res.status(500).json({ ok: false, error: '서버 오류가 발생했습니다' })
    }
    const actualHash = hashCode(code, salt)
    if (actualHash !== expectedHash) {
      incrementAttempts.run(row.id)
      const left = MAX_ATTEMPTS - (row.attempts + 1)
      return res.status(400).json({
        ok: false,
        error: `인증번호가 일치하지 않습니다 (남은 시도 ${left}회)`,
      })
    }

    const token = generateToken()
    const tokenExpires = isoFromNow(TOKEN_TTL_SEC)
    markVerified.run(token, tokenExpires, row.id)

    return res.json({ ok: true, token, ttl: TOKEN_TTL_SEC })
  } catch (err) {
    if (err instanceof z.ZodError) {
      const fieldErrors = err.flatten().fieldErrors
      return res.status(400).json({ ok: false, error: '입력값을 확인해주세요', fieldErrors })
    }
    console.error('[verify/check-code] unexpected:', err)
    return res.status(500).json({ ok: false, error: '서버 오류가 발생했습니다' })
  }
})

// /register 에서 사용할 토큰 검증 + 소비 헬퍼
const findActiveToken = db.prepare<[string, string]>(`
  SELECT id, phone, token_expires_at
    FROM phone_verifications
   WHERE token = ?
     AND phone = ?
     AND verified_at IS NOT NULL
     AND consumed_at IS NULL
     AND token_expires_at > datetime('now')
   LIMIT 1
`)

const consumeToken = db.prepare<[number]>(`
  UPDATE phone_verifications
     SET consumed_at = datetime('now')
   WHERE id = ?
`)

export interface VerifyTokenResult {
  ok: boolean
  error?: string
}

export function verifyAndConsumeToken(token: string, phone: string): VerifyTokenResult {
  if (!token || !phone) {
    return { ok: false, error: '휴대폰 인증이 필요합니다' }
  }
  const row = findActiveToken.get(token, phone) as { id: number } | undefined
  if (!row) {
    return {
      ok: false,
      error: '휴대폰 인증이 만료되었거나 유효하지 않습니다. 다시 인증해주세요',
    }
  }
  consumeToken.run(row.id)
  return { ok: true }
}

export default router
