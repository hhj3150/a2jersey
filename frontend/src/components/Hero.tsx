import { useMemo } from 'react'
import { computeDDay } from '../lib/dday'

interface HeroProps {
  onCtaClick: () => void
  launchDate: string
}

export function Hero({ onCtaClick, launchDate }: HeroProps) {
  const dday = useMemo(() => computeDDay(launchDate), [launchDate])
  const launchLabel = formatLaunchLabel(launchDate)

  return (
    <section className="section pt-16 sm:pt-24">
      <div className="container-app text-center">
        <img
          src="/logo.svg"
          alt="송영신목장 — A2 저지"
          className="mx-auto block w-[160px] sm:w-[200px] h-auto"
          width="200"
          height="162"
        />

        <h1 className="mt-5 text-[2rem] sm:text-5xl font-bold tracking-tight-kr leading-[1.15] text-ink">
          국내산 A2 저지 우유,
          <br />
          <span className="text-soil-dark">송영신목장</span>
          <br />
          A2 Jersey Hay Milk
        </h1>

        <p className="mt-6 text-base sm:text-lg text-mute leading-relaxed max-w-reading mx-auto">
          송영신목장은 경기도 안성에서 저지 소의 A2 우유를 기반으로
          A2 Jersey Hay Milk를 생산합니다.
          <br />
          {launchLabel} 정기구독이 시작됩니다.
        </p>
        <p className="mt-2 text-xs text-mute">
          ※ '저지(Jersey)'는 영국 저지섬 원산의 소 품종이며, 저지방 우유와는 다릅니다.
        </p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-soil-dark">
          <span className="h-1.5 w-1.5 rounded-full bg-soil animate-pulse" aria-hidden />
          {dday.phase === 'live' ? '정기구독 오픈 중' : `정기구독 오픈까지 ${dday.label}`}
        </div>

        <button
          type="button"
          onClick={onCtaClick}
          className="btn-primary mt-6 w-full sm:w-auto"
        >
          {dday.phase === 'live' ? '사전회원 등록하기' : `${launchLabel} 오픈 알림 받기`}
        </button>
      </div>
    </section>
  )
}

function formatLaunchLabel(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  return `${Number(m[2])}월 ${Number(m[3])}일`
}
