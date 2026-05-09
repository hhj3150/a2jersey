import { useDDay } from '../lib/useDDay'
import { env } from '../env'

interface HeroProps {
  onCtaClick: () => void
  launchDate: string
}

export function Hero({ onCtaClick, launchDate }: HeroProps) {
  const dday = useDDay(launchDate)
  const launchLabel = formatLaunchLabel(launchDate)
  const isLaunched = dday.phase === 'live' || dday.phase === 'today'

  // 오픈 후 shopUrl이 설정돼 있으면 외부 쇼핑몰로, 아직 미설정이면 사전회원 등록으로 폴백.
  // (아임웹 자체몰 연결 전까지 잘못된 링크로 보내지 않기 위함)
  const handleCtaClick = () => {
    if (isLaunched && env.shopUrl) {
      window.open(env.shopUrl, '_blank', 'noopener,noreferrer')
    } else {
      onCtaClick()
    }
  }

  return (
    <section className="section pt-16 sm:pt-24">
      <div className="container-app text-center">
        <img
          src="/logo-512.png"
          alt="송영신목장 — A2 저지"
          className="mx-auto block w-[180px] sm:w-[220px] h-auto"
          width="512"
          height="414"
          decoding="async"
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
          {dday.phase === 'pre'
            ? `정기구독 오픈까지 ${dday.label}`
            : dday.phase === 'today'
              ? '오늘 정기구독 오픈'
              : '정기구독 오픈 중'}
        </div>

        <button
          type="button"
          onClick={handleCtaClick}
          className="btn-primary mt-6 w-full sm:w-auto"
        >
          {isLaunched && env.shopUrl
            ? '정기구독 신청하기'
            : `${launchLabel} 오픈 알림 받기`}
          <span className="ml-1.5" aria-hidden>{isLaunched && env.shopUrl ? '→' : ''}</span>
        </button>

        {isLaunched && env.shopUrl && (
          <div className="mt-3">
            <button
              type="button"
              onClick={onCtaClick}
              className="text-sm text-mute underline-offset-4 hover:underline hover:text-soil-dark"
            >
              신상품·이벤트 소식 받기 →
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function formatLaunchLabel(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  return `${Number(m[2])}월 ${Number(m[3])}일`
}
