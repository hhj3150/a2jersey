import type { Request, Response, NextFunction } from 'express'

const timingSafeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || expected === 'change-me-in-production') {
    return res.status(503).json({
      ok: false,
      error: 'ADMIN_PASSWORD is not configured on server',
    })
  }

  const header = req.headers.authorization || ''
  const fromHeader = header.startsWith('Bearer ') ? header.slice(7) : ''
  const fromQuery = typeof req.query.key === 'string' ? req.query.key : ''
  const provided = fromHeader || fromQuery

  if (!provided || !timingSafeEqual(provided, expected)) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' })
  }

  return next()
}
