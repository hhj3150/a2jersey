export interface DDayInfo {
  days: number
  phase: 'pre' | 'today' | 'live'
  label: string
  shortLabel: string
}

const kstYmd = (d: Date): { y: number; m: number; day: number } => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d)
  const y = Number(parts.find((p) => p.type === 'year')?.value)
  const m = Number(parts.find((p) => p.type === 'month')?.value)
  const day = Number(parts.find((p) => p.type === 'day')?.value)
  return { y, m, day }
}

const daysBetweenYmd = (
  a: { y: number; m: number; day: number },
  b: { y: number; m: number; day: number },
): number => {
  const aMs = Date.UTC(a.y, a.m - 1, a.day)
  const bMs = Date.UTC(b.y, b.m - 1, b.day)
  return Math.round((aMs - bMs) / 86_400_000)
}

export function computeDDay(launchIso: string, now: Date = new Date()): DDayInfo {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(launchIso)
  if (!m) {
    return { days: 0, phase: 'pre', label: launchIso, shortLabel: launchIso }
  }
  const launchYmd = { y: Number(m[1]), m: Number(m[2]), day: Number(m[3]) }
  const todayYmd = kstYmd(now)
  const days = daysBetweenYmd(launchYmd, todayYmd)

  if (days > 0)  return { days,        phase: 'pre',   label: `D-${days}일`,         shortLabel: `D-${days}` }
  if (days === 0) return { days: 0,    phase: 'today', label: '오늘 오픈',          shortLabel: 'D-DAY' }
  return            { days: -days,     phase: 'live',  label: '정기구독 오픈 중',   shortLabel: 'OPEN' }
}
