import { Router, type Request, type Response } from 'express'
import rateLimit from 'express-rate-limit'
import { ZodError } from 'zod'
import { registerSchema } from '../schemas.js'
import { db } from '../db.js'

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
    (name, phone, region, interests, sms_consent, privacy_consent, ref, user_agent, ip)
  VALUES
    (@name, @phone, @region, @interests, @sms_consent, @privacy_consent, @ref, @user_agent, @ip)
`)

const findByPhone = db.prepare<[string]>('SELECT id FROM leads WHERE phone = ?')

router.post('/register', registerLimiter, (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.parse(req.body)

    const existing = findByPhone.get(parsed.phone) as { id: number } | undefined
    if (existing) {
      return res.status(409).json({
        ok: false,
        error: '이미 등록된 휴대폰 번호입니다',
        code: 'DUPLICATE_PHONE',
      })
    }

    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      null
    const userAgent = req.headers['user-agent'] || null

    const result = insertLead.run({
      name: parsed.name,
      phone: parsed.phone,
      region: parsed.region,
      interests: JSON.stringify(parsed.interests),
      sms_consent: parsed.smsConsent ? 1 : 0,
      privacy_consent: 1,
      ref: parsed.ref,
      user_agent: userAgent,
      ip,
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
