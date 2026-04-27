import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import compression from 'compression'
import registerRouter from './routes/register.js'
import adminRouter from './routes/admin.js'
import { db } from './db.js'

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

app.use((_req, res) => {
  res.status(404).json({ ok: false, error: 'Not found' })
})

const server = app.listen(PORT, () => {
  console.log(`[a2jersey-api] listening on :${PORT}`)
  console.log(`[a2jersey-api] cors origins: ${corsOrigins.join(', ')}`)
})

const shutdown = (signal: string): void => {
  console.log(`[a2jersey-api] ${signal} received — shutting down`)
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
