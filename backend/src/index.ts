import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import registerRouter from './routes/register.js'
import adminRouter from './routes/admin.js'

const app = express()
const PORT = Number(process.env.PORT) || 4000

const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

app.set('trust proxy', 1)

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

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'a2jersey-api', ts: new Date().toISOString() })
})

app.use('/api', registerRouter)
app.use('/api/admin', adminRouter)

app.use((_req, res) => {
  res.status(404).json({ ok: false, error: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`[a2jersey-api] listening on :${PORT}`)
  console.log(`[a2jersey-api] cors origins: ${corsOrigins.join(', ')}`)
})
