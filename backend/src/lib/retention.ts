import { db } from '../db.js'

// 보유기간(일) — 환경변수로 덮어쓸 수 있음 (테스트·운영 분리용)
const RETENTION_DAYS = Number(process.env.RETENTION_DAYS || 365)

const purgeStatement = db.prepare(`
  DELETE FROM leads
  WHERE datetime(created_at) <= datetime('now', ?)
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
    if (r.deletedCount > 0) {
      console.log(
        `[retention] startup purge: deleted ${r.deletedCount} expired leads (cutoff ${r.cutoffDays}d)`,
      )
    } else {
      console.log(
        `[retention] startup purge: no expired leads (cutoff ${r.cutoffDays}d)`,
      )
    }
  } catch (err) {
    console.error('[retention] startup purge failed:', err)
  }

  // 2) 다음 KST 04:00 에 1차 실행 → 이후 24시간 주기 반복
  const scheduleNext = () => {
    const wait = msUntilNextKstFourAm()
    timerHandle = setTimeout(() => {
      try {
        const r = purgeExpiredLeads()
        console.log(
          `[retention] daily purge: deleted ${r.deletedCount} expired leads (cutoff ${r.cutoffDays}d)`,
        )
      } catch (err) {
        console.error('[retention] daily purge failed:', err)
      }
      // 24시간마다 반복
      timerHandle = setInterval(() => {
        try {
          const r = purgeExpiredLeads()
          console.log(
            `[retention] daily purge: deleted ${r.deletedCount} expired leads (cutoff ${r.cutoffDays}d)`,
          )
        } catch (err) {
          console.error('[retention] daily purge failed:', err)
        }
      }, 24 * 60 * 60 * 1000)
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
