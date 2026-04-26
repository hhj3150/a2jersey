export interface DDayInfo {
  days: number
  phase: 'pre' | 'today' | 'live'
  label: string
  shortLabel: string
}

export function computeDDay(launchIso: string, now: Date = new Date()): DDayInfo {
  const launch = new Date(`${launchIso}T00:00:00+09:00`)
  const today = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
  today.setHours(0, 0, 0, 0)
  launch.setHours(0, 0, 0, 0)

  const diffMs = launch.getTime() - today.getTime()
  const days = Math.round(diffMs / 86_400_000)

  if (days > 0)  return { days,        phase: 'pre',   label: `D-${days}일`,         shortLabel: `D-${days}` }
  if (days === 0) return { days: 0,    phase: 'today', label: '오늘 오픈',          shortLabel: 'D-DAY' }
  return            { days: -days,     phase: 'live',  label: '정기구독 오픈 중',   shortLabel: 'OPEN' }
}
