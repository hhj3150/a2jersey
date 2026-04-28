import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import compression from 'compression'
import registerRouter from './routes/register.js'
import adminRouter from './routes/admin.js'
import { db } from './db.js'
import { startRetentionScheduler, stopRetentionScheduler } from './lib/retention.js'

const app = express()
const PORT = Number(process.env.PORT) || 4000

const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

app.set('trust proxy', 1)
app.disable('x-powered-by')

app.use(compression())

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true)
      if (corsOrigins.includes(origin) || corsOrigins.includes('*')) {
        return cb(null, true)
      }
      return cb(new Error(`CORS blocked: ${origin}`))
    },
    credentials: true,
  }),
)

app.use(express.json({ limit: '32kb' }))

app.use((req, res, next) => {
  const started = Date.now()
  res.on('finish', () => {
    if (req.path === '/api/health') return
    const ms = Date.now() - started
    console.log(
      `[req] ${req.method} ${req.path} ${res.statusCode} ${ms}ms ip=${req.ip ?? '-'}`,
    )
  })
  next()
})

app.get('/api/health', (_req, res) => {
  try {
    const row = db.prepare('SELECT 1 AS ok').get() as { ok: number } | undefined
    if (row?.ok !== 1) throw new Error('db ping failed')
    return res.json({
      ok: true,
      service: 'a2jersey-api',
      db: 'ok',
      ts: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[health] db ping failed:', err)
    return res.status(503).json({
      ok: false,
      service: 'a2jersey-api',
      db: 'down',
      ts: new Date().toISOString(),
    })
  }
})

app.use('/api', registerRouter)
app.use('/api/admin', adminRouter)

// 정보주체 권리 행사 안내 — PIPA §35~37 (열람·정정·삭제·처리정지)
// 실제 처리는 이메일 접수 → 보호책임자 수동 처리 (소상공인 표준 운영 방식)
app.get('/api/data-subject-rights', (_req, res) => {
  res.json({
    ok: true,
    contact: {
      email: 'hhj3150@hanmail.net',
      phone: '031-674-3150',
      responsibleParty: '송영신 (대표이사, 개인정보 보호책임자)',
    },
    requestableRights: [
      '개인정보 열람 (PIPA §35)',
      '개인정보 정정·삭제 (PIPA §36)',
      '개인정보 처리정지 (PIPA §37)',
      '동의 철회 및 회원 탈퇴',
    ],
    expectedResponseDays: 10,
    note: '요청 메일 제목에 [개인정보 권리행사]를 포함해주시면 신속히 처리됩니다.',
  })
})

const server = app.listen(PORT, () => {
  console.log(`[a2jersey-api] listening on :${PORT}`)
  console.log(`[a2jersey-api] cors origins: ${corsOrigins.join(', ')}`)
  startRetentionScheduler()
})

const shutdown = (signal: string): void => {
  console.log(`[a2jersey-api] ${signal} received — shutting down`)
  stopRetentionScheduler()
  server.close(() => {
    try {
      db.pragma('wal_checkpoint(TRUNCATE)')
      db.close()
      console.log('[a2jersey-api] db closed cleanly')
    } catch (err) {
      console.error('[a2jersey-api] db close failed:', err)
    }
    process.exit(0)
  })
  setTimeout(() => {
    console.error('[a2jersey-api] forced exit after 10s')
    process.exit(1)
  }, 10_000).unref()
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
