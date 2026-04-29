import { db } from '../db.js'

// 보유기간(일) — 환경변수로 덮어쓸 수 있음 (테스트·운영 분리용)
const RETENTION_DAYS = Number(process.env.RETENTION_DAYS || 365)

// OTP 보유기간 — 코드 만료(5분) + 토큰 만료(10분) 후 7일 버퍼 (남용 조사용 audit trail).
// expires_at 기준으로 정리하면 미검증·검증완료·소비완료 모두 안전하게 포함됨.
const OTP_RETENTION_DAYS = Number(process.env.OTP_RETENTION_DAYS || 7)

const purgeStatement = db.prepare(`
  DELETE FROM leads
  WHERE datetime(created_at) <= datetime('now', ?)
`)

const purgeOtpStatement = db.prepare(`
  DELETE FROM phone_verifications
  WHERE datetime(expires_at) <= datetime('now', ?)
`)

export interface PurgeResult {
  deletedCount: number
  cutoffDays: number
  ranAt: string
}

export const purgeExpiredLeads = (): PurgeResult => {
  const offset = `-${RETENTION_DAYS} days`
  const info = purgeStatement.run(offset)
  return {
    deletedCount: Number(info.changes ?? 0),
    cutoffDays: RETENTION_DAYS,
    ranAt: new Date().toISOString(),
  }
}

export const purgeExpiredOtps = (): PurgeResult => {
  const offset = `-${OTP_RETENTION_DAYS} days`
  const info = purgeOtpStatement.run(offset)
  return {
    deletedCount: Number(info.changes ?? 0),
    cutoffDays: OTP_RETENTION_DAYS,
    ranAt: new Date().toISOString(),
  }
}

const runDailyPurge = (): void => {
  try {
    const r = purgeExpiredLeads()
    console.log(
      `[retention] daily purge: deleted ${r.deletedCount} expired leads (cutoff ${r.cutoffDays}d)`,
    )
  } catch (err) {
    console.error('[retention] daily lead purge failed:', err)
  }
  try {
    const r = purgeExpiredOtps()
    console.log(
      `[retention] daily purge: deleted ${r.deletedCount} expired OTP records (cutoff ${r.cutoffDays}d)`,
    )
  } catch (err) {
    console.error('[retention] daily OTP purge failed:', err)
  }
}

// 다음 KST 04:00 까지의 millisecond 계산.
// KST = UTC+9. 서버 OS TZ에 의존하지 않도록 UTC 기준 계산.
const msUntilNextKstFourAm = (): number => {
  const KST_OFFSET_MS = 9 * 60 * 60 * 1000
  const TARGET_HOUR_KST = 4
  const now = new Date()
  const nowKstMs = now.getTime() + KST_OFFSET_MS

  const nowKst = new Date(nowKstMs)
  const targetKst = new Date(
    Date.UTC(
      nowKst.getUTCFullYear(),
      nowKst.getUTCMonth(),
      nowKst.getUTCDate(),
      TARGET_HOUR_KST,
      0,
      0,
      0,
    ),
  )

  let targetKstMs = targetKst.getTime()
  if (targetKstMs <= nowKstMs) {
    targetKstMs += 24 * 60 * 60 * 1000
  }
  return targetKstMs - nowKstMs
}

let timerHandle: ReturnType<typeof setTimeout> | null = null

export const startRetentionScheduler = (): void => {
  // 1) 서버 부팅 직후 1회 실행 — 다운타임 동안 만료된 데이터 즉시 정리
  try {
    const r = purgeExpiredLeads()
    console.log(
      `[retention] startup purge: deleted ${r.deletedCount} expired leads (cutoff ${r.cutoffDays}d)`,
    )
  } catch (err) {
    console.error('[retention] startup lead purge failed:', err)
  }
  try {
    const r = purgeExpiredOtps()
    console.log(
      `[retention] startup purge: deleted ${r.deletedCount} expired OTP records (cutoff ${r.cutoffDays}d)`,
    )
  } catch (err) {
    console.error('[retention] startup OTP purge failed:', err)
  }

  // 2) 다음 KST 04:00 에 1차 실행 → 이후 24시간 주기 반복
  const scheduleNext = () => {
    const wait = msUntilNextKstFourAm()
    timerHandle = setTimeout(() => {
      runDailyPurge()
      timerHandle = setInterval(runDailyPurge, 24 * 60 * 60 * 1000)
    }, wait)
  }

  scheduleNext()
}

export const stopRetentionScheduler = (): void => {
  if (timerHandle) {
    clearTimeout(timerHandle as ReturnType<typeof setTimeout>)
    clearInterval(timerHandle as ReturnType<typeof setInterval>)
    timerHandle = null
  }
}
