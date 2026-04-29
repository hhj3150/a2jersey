import { Router, type Request, type Response } from 'express'
import rateLimit from 'express-rate-limit'
import { ZodError } from 'zod'
import { registerSchema, deriveRegion } from '../schemas.js'
import { db } from '../db.js'
import { verifyAndConsumeToken } from './verify.js'

const router = Router()

const registerLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { ok: false, error: '잠시 후 다시 시도해주세요 (10분간 5회 제한)' },
})

const insertLead = db.prepare(`
  INSERT INTO leads
    (name, phone, region, interests, sms_consent, privacy_consent, ref, user_agent, ip,
     postcode, address_road, address_jibun, address_detail,
     privacy_consent_at, sms_consent_at, age_consent_at)
  VALUES
    (@name, @phone, @region, @interests, @sms_consent, @privacy_consent, @ref, @user_agent, @ip,
     @postcode, @address_road, @address_jibun, @address_detail,
     @privacy_consent_at, @sms_consent_at, @age_consent_at)
`)

const findByPhone = db.prepare<[string]>('SELECT id FROM leads WHERE phone = ?')

router.post('/register', registerLimiter, (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.parse(req.body)

    // 휴대폰 인증 토큰 검증 (정통망법 §50 — 수신자 본인 검증)
    const verify = verifyAndConsumeToken(parsed.verificationToken, parsed.phone)
    if (!verify.ok) {
      return res.status(400).json({
        ok: false,
        error: verify.error || '휴대폰 인증이 필요합니다',
        fieldErrors: { verificationToken: [verify.error || '휴대폰 인증이 필요합니다'] },
      })
    }

    const existing = findByPhone.get(parsed.phone) as { id: number } | undefined
    if (existing) {
      return res.status(409).json({
        ok: false,
        error: '이미 등록된 휴대폰 번호입니다',
        code: 'DUPLICATE_PHONE',
      })
    }

    const ip = req.ip || req.socket.remoteAddress || null
    const userAgent = req.headers['user-agent'] || null

    const region = parsed.region?.trim() || deriveRegion(parsed.addressRoad)

    const nowIso = new Date().toISOString()

    const result = insertLead.run({
      name: parsed.name,
      phone: parsed.phone,
      region,
      interests: JSON.stringify(parsed.interests),
      sms_consent: parsed.smsConsent ? 1 : 0,
      privacy_consent: 1,
      ref: parsed.ref,
      user_agent: userAgent,
      ip,
      postcode: parsed.postcode,
      address_road: parsed.addressRoad,
      address_jibun: parsed.addressJibun,
      address_detail: parsed.addressDetail,
      privacy_consent_at: nowIso,
      sms_consent_at: parsed.smsConsent ? nowIso : null,
      age_consent_at: nowIso,
    })

    return res.status(201).json({
      ok: true,
      id: result.lastInsertRowid,
    })
  } catch (err) {
    if (err instanceof ZodError) {
      const fieldErrors = err.flatten().fieldErrors
      return res.status(400).json({
        ok: false,
        error: '입력값을 확인해주세요',
        fieldErrors,
      })
    }

    if (
      err instanceof Error &&
      'code' in err &&
      (err as { code?: string }).code === 'SQLITE_CONSTRAINT_UNIQUE'
    ) {
      return res.status(409).json({
        ok: false,
        error: '이미 등록된 휴대폰 번호입니다',
        code: 'DUPLICATE_PHONE',
      })
    }

    console.error('[register] unexpected error:', err)
    return res.status(500).json({ ok: false, error: '서버 오류가 발생했습니다' })
  }
})

export default router
