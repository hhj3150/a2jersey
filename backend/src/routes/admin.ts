import { Router, type Request, type Response } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { db, type LeadRow, type BroadcastRow } from '../db.js'
import { requireAdmin } from '../middleware/admin.js'
import { interestLabels, type Interest } from '../schemas.js'
import {
  sendBulkSms,
  isWithinDaytimeKST,
  composeMarketingText,
  isSolapiConfigured,
  type SolapiConfig,
} from '../lib/solapi.js'

const router = Router()

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { ok: false, error: '관리자 요청이 너무 많습니다 (15분간 100회 제한)' },
})

router.use(adminLimiter)
router.use(requireAdmin)

const parsePositiveInt = (raw: unknown, fallback: number, max: number): number => {
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 1) return fallback
  return Math.min(Math.floor(n), max)
}

const parseInterests = (raw: string): Interest[] => {
  try {
    const v = JSON.parse(raw)
    return Array.isArray(v) ? (v as Interest[]) : []
  } catch {
    return []
  }
}

const serializeLead = (row: LeadRow) => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  region: row.region,
  postcode: row.postcode,
  addressRoad: row.address_road,
  addressJibun: row.address_jibun,
  addressDetail: row.address_detail,
  interests: parseInterests(row.interests),
  smsConsent: row.sms_consent === 1,
  ref: row.ref,
  status: row.status,
  memo: row.memo,
  createdAt: row.created_at,
})

router.get('/leads', (req: Request, res: Response) => {
  const page = parsePositiveInt(req.query.page, 1, 10_000)
  const pageSize = parsePositiveInt(req.query.pageSize, 50, 500)
  const offset = (page - 1) * pageSize

  const search = (typeof req.query.q === 'string' ? req.query.q.trim() : '').slice(0, 100)
  const refFilter = (typeof req.query.ref === 'string' ? req.query.ref.trim() : '').slice(0, 20)

  const where: string[] = []
  const params: Record<string, string> = {}

  if (search) {
    where.push('(name LIKE @q OR phone LIKE @q OR region LIKE @q)')
    params.q = `%${search}%`
  }
  if (refFilter) {
    where.push('ref = @ref')
    params.ref = refFilter
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const totalRow = db
    .prepare(`SELECT COUNT(*) AS c FROM leads ${whereSql}`)
    .get(params) as { c: number }
  const total = totalRow.c

  const rows = db
    .prepare(
      `SELECT * FROM leads ${whereSql} ORDER BY created_at DESC LIMIT @limit OFFSET @offset`,
    )
    .all({ ...params, limit: pageSize, offset }) as LeadRow[]

  const refStats = db
    .prepare(
      `SELECT ref, COUNT(*) AS c FROM leads GROUP BY ref ORDER BY c DESC`,
    )
    .all() as Array<{ ref: string; c: number }>

  return res.json({
    ok: true,
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    items: rows.map(serializeLead),
    refStats,
  })
})

const csvEscape = (v: string | number | null | undefined): string => {
  if (v === null || v === undefined) return ''
  const s = String(v)
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

router.get('/export.csv', (_req: Request, res: Response) => {
  const rows = db
    .prepare(`SELECT * FROM leads ORDER BY created_at DESC`)
    .all() as LeadRow[]

  const header = [
    'ID',
    '등록일시',
    '이름',
    '휴대폰',
    '우편번호',
    '도로명주소',
    '지번주소',
    '상세주소',
    '지역',
    '관심상품',
    'SMS수신동의',
    '유입경로',
    '상태',
    '메모',
  ]

  const lines = [header.map(csvEscape).join(',')]

  for (const row of rows) {
    const interests = parseInterests(row.interests)
      .map((k) => interestLabels[k] ?? k)
      .join(' / ')
    lines.push(
      [
        row.id,
        row.created_at,
        row.name,
        row.phone,
        row.postcode ?? '',
        row.address_road ?? '',
        row.address_jibun ?? '',
        row.address_detail ?? '',
        row.region,
        interests,
        row.sms_consent === 1 ? 'Y' : 'N',
        row.ref,
        row.status,
        row.memo ?? '',
      ]
        .map(csvEscape)
        .join(','),
    )
  }

  const BOM = '﻿'
  const csv = BOM + lines.join('\r\n') + '\r\n'

  const today = new Date().toISOString().slice(0, 10)
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="a2jersey-leads-${today}.csv"`,
  )
  return res.send(csv)
})

const deleteLead = db.prepare<[number]>('DELETE FROM leads WHERE id = ?')

router.delete('/leads/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ ok: false, error: 'Invalid id' })
  }
  const result = deleteLead.run(id)
  if (result.changes === 0) {
    return res.status(404).json({ ok: false, error: 'Not found' })
  }
  return res.json({ ok: true, deletedId: id })
})

router.get('/backup', async (_req: Request, res: Response) => {
  try {
    db.pragma('wal_checkpoint(TRUNCATE)')
    const dbPath = process.env.DATABASE_PATH || './data/leads.db'
    const { readFileSync } = await import('node:fs')
    const buf = readFileSync(dbPath)
    const today = new Date().toISOString().slice(0, 10)
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="a2jersey-leads-${today}.db"`,
    )
    res.setHeader('X-DB-Size', String(buf.length))
    return res.send(buf)
  } catch (err) {
    console.error('[backup] failed:', err)
    return res.status(500).json({ ok: false, error: 'Backup failed' })
  }
})

const broadcastSchema = z.object({
  message: z
    .string({ required_error: '메시지를 입력해주세요' })
    .trim()
    .min(1, '메시지를 입력해주세요')
    .max(1500, '메시지가 너무 깁니다 (최대 1500자)'),
  refFilter: z.string().trim().max(20).optional(),
  smsConsentOnly: z.boolean().optional().default(true),
  testNumber: z.string().trim().max(20).optional(),
  dryRun: z.boolean().optional(),
  bypassNightCheck: z.boolean().optional().default(false),
  skipAdPrefix: z.boolean().optional().default(false),
  skipOptOut: z.boolean().optional().default(false),
})

const solapiCfg = (): SolapiConfig => ({
  apiKey: process.env.SOLAPI_API_KEY,
  apiSecret: process.env.SOLAPI_API_SECRET,
  from: process.env.SOLAPI_FROM_NUMBER,
})

const insertBroadcast = db.prepare(`
  INSERT INTO broadcast_history
    (sender, message, target_filter, target_count, sent_count, failed_count, cost, dry_run, group_id, error_summary)
  VALUES
    (@sender, @message, @target_filter, @target_count, @sent_count, @failed_count, @cost, @dry_run, @group_id, @error_summary)
`)

router.get('/broadcast/preview', (req: Request, res: Response) => {
  const refFilter = (typeof req.query.ref === 'string' ? req.query.ref.trim() : '').slice(0, 20)
  const smsConsentOnly = req.query.smsConsentOnly !== 'false'

  const where: string[] = []
  const params: Record<string, string> = {}
  if (smsConsentOnly) where.push('sms_consent = 1')
  if (refFilter) {
    where.push('ref = @ref')
    params.ref = refFilter
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const row = db.prepare(`SELECT COUNT(*) AS c FROM leads ${whereSql}`).get(params) as { c: number }
  return res.json({
    ok: true,
    targetCount: row.c,
    daytimeKST: isWithinDaytimeKST(),
    solapiConfigured: isSolapiConfigured(solapiCfg()),
    serverDryRun: process.env.BROADCAST_DRY_RUN === 'true',
  })
})

router.post('/broadcast', async (req: Request, res: Response) => {
  let parsed
  try {
    parsed = broadcastSchema.parse(req.body)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: '입력값을 확인해주세요', fieldErrors: err.flatten().fieldErrors })
    }
    throw err
  }

  if (!parsed.bypassNightCheck && !isWithinDaytimeKST()) {
    return res.status(409).json({
      ok: false,
      error: '야간 발송 차단 (KST 21:00 ~ 08:00). 긴급 시 bypassNightCheck=true로 명시적 지정.',
      code: 'NIGHT_BLOCKED',
    })
  }

  const cfg = solapiCfg()
  const serverForcesDryRun = process.env.BROADCAST_DRY_RUN === 'true'
  const dryRun = serverForcesDryRun || parsed.dryRun === true || !isSolapiConfigured(cfg)

  let leads: { phone: string }[] = []
  if (parsed.testNumber) {
    leads = [{ phone: parsed.testNumber.replace(/[^0-9]/g, '') }]
  } else {
    const where: string[] = []
    const params: Record<string, string> = {}
    if (parsed.smsConsentOnly) where.push('sms_consent = 1')
    if (parsed.refFilter) {
      where.push('ref = @ref')
      params.ref = parsed.refFilter
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
    leads = db
      .prepare(`SELECT phone FROM leads ${whereSql} ORDER BY id`)
      .all(params) as { phone: string }[]
  }

  if (leads.length === 0) {
    return res.status(400).json({ ok: false, error: '발송 대상이 없습니다 (sms_consent=true 인 가입자가 없거나 필터 조건과 일치하는 대상 없음)' })
  }

  const finalText = composeMarketingText(parsed.message, {
    skipAdPrefix: parsed.skipAdPrefix,
    skipOptOut: parsed.skipOptOut,
  })

  const messages = leads.map((l) => ({ to: l.phone, text: finalText }))

  let sent = 0
  let failed = 0
  let cost: number | undefined
  let groupId: string | undefined
  let errorSummary: string | undefined

  if (dryRun) {
    sent = messages.length
    cost = undefined
  } else {
    const result = await sendBulkSms(cfg, messages)
    sent = result.registered
    failed = result.failed
    cost = result.cost
    groupId = result.groupId
    if (result.failedDetails.length > 0) {
      errorSummary = result.failedDetails.slice(0, 5).map((d) => `${d.to}: ${d.statusMessage || d.statusCode || '?'}`).join(' | ')
    }
  }

  const info = insertBroadcast.run({
    sender: 'admin',
    message: finalText,
    target_filter: parsed.refFilter || (parsed.testNumber ? `test:${parsed.testNumber}` : null),
    target_count: messages.length,
    sent_count: sent,
    failed_count: failed,
    cost: cost ?? null,
    dry_run: dryRun ? 1 : 0,
    group_id: groupId ?? null,
    error_summary: errorSummary ?? null,
  })

  return res.json({
    ok: failed === 0,
    historyId: info.lastInsertRowid,
    dryRun,
    targetCount: messages.length,
    sentCount: sent,
    failedCount: failed,
    cost,
    groupId,
    errorSummary,
    finalText,
  })
})

router.get('/broadcasts', (_req: Request, res: Response) => {
  const rows = db
    .prepare('SELECT * FROM broadcast_history ORDER BY sent_at DESC LIMIT 50')
    .all() as BroadcastRow[]
  return res.json({
    ok: true,
    items: rows.map((r) => ({
      id: r.id,
      sentAt: r.sent_at,
      sender: r.sender,
      message: r.message,
      targetFilter: r.target_filter,
      targetCount: r.target_count,
      sentCount: r.sent_count,
      failedCount: r.failed_count,
      cost: r.cost,
      dryRun: r.dry_run === 1,
      groupId: r.group_id,
      errorSummary: r.error_summary,
    })),
  })
})

router.get('/stats', (_req: Request, res: Response) => {
  const totalRow = db.prepare('SELECT COUNT(*) AS c FROM leads').get() as { c: number }
  const last24Row = db
    .prepare(`SELECT COUNT(*) AS c FROM leads WHERE created_at >= datetime('now', '-1 day')`)
    .get() as { c: number }
  const smsConsentRow = db
    .prepare('SELECT COUNT(*) AS c FROM leads WHERE sms_consent = 1')
    .get() as { c: number }
  const refRows = db
    .prepare('SELECT ref, COUNT(*) AS c FROM leads GROUP BY ref ORDER BY c DESC')
    .all() as Array<{ ref: string; c: number }>

  return res.json({
    ok: true,
    total: totalRow.c,
    last24h: last24Row.c,
    smsConsent: smsConsentRow.c,
    refStats: refRows,
    serverTime: new Date().toISOString(),
  })
})

export default router
