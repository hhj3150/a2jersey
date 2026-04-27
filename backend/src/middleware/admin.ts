import type { Request, Response, NextFunction } from 'express'

const timingSafeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

const decodeBasic = (raw: string): { user: string; pass: string } | null => {
  if (!raw.startsWith('Basic ')) return null
  try {
    const decoded = Buffer.from(raw.slice(6).trim(), 'base64').toString('utf8')
    const idx = decoded.indexOf(':')
    if (idx < 0) return null
    return { user: decoded.slice(0, idx), pass: decoded.slice(idx + 1) }
  } catch {
    return null
  }
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const expectedUser = process.env.ADMIN_USER
  const expectedPassword = process.env.ADMIN_PASSWORD

  if (
    !expectedUser ||
    !expectedPassword ||
    expectedPassword === 'change-me-in-production'
  ) {
    return res.status(503).json({
      ok: false,
      error: 'ADMIN_USER / ADMIN_PASSWORD is not configured on server',
    })
  }

  const creds = decodeBasic(req.headers.authorization || '')

  if (
    !creds ||
    !timingSafeEqual(creds.user, expectedUser) ||
    !timingSafeEqual(creds.pass, expectedPassword)
  ) {
    res.setHeader('WWW-Authenticate', 'Basic realm="a2jersey-admin"')
    return res.status(401).json({ ok: false, error: 'Unauthorized' })
  }

  return next()
}

// 자동화(GitHub Actions cron 백업 등)용 Bearer 토큰 인증.
// BACKUP_TOKEN env 미설정 시 503. Bearer 가 일치하지 않으면 Basic 으로 폴백.
export const requireAdminOrBackupToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const backupToken = process.env.BACKUP_TOKEN
  const auth = req.headers.authorization || ''

  if (backupToken && auth.startsWith('Bearer ')) {
    const presented = auth.slice(7).trim()
    if (timingSafeEqual(presented, backupToken)) return next()
    return res.status(401).json({ ok: false, error: 'Invalid backup token' })
  }

  return requireAdmin(req, res, next)
}
