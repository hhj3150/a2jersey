import { Router, type Request, type Response } from 'express'
import { db, type LeadRow } from '../db.js'
import { requireAdmin } from '../middleware/admin.js'
import { interestLabels, type Interest } from '../schemas.js'

const router = Router()

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

export default router
