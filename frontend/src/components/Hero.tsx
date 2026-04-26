interface HeroProps {
  onCtaClick: () => void
  launchDate: string
}

export function Hero({ onCtaClick, launchDate }: HeroProps) {
  const launchLabel = formatLaunchLabel(launchDate)

  return (
    <section className="section pt-20 sm:pt-28">
      <div className="container-app text-center">
        <p className="section-eyebrow">Made by Soil</p>

        <h1 className="text-[2rem] sm:text-5xl font-bold tracking-tight-kr leading-[1.15] text-ink">
          국내산 A2 저지 우유,
          <br />
          <span className="text-soil-dark">송영신목장</span>
          <br />
          A2 Jersey Hay Milk
        </h1>

        <p className="mt-6 text-base sm:text-lg text-mute leading-relaxed max-w-reading mx-auto">
          송영신목장은 경기도 안성에서 저지소의 A2 우유를 기반으로
          A2 Jersey Hay Milk를 생산합니다.
          <br />
          {launchLabel} 정기구독이 시작됩니다.
        </p>

        <button
          type="button"
          onClick={onCtaClick}
          className="btn-primary mt-10 w-full sm:w-auto"
        >
          {launchLabel} 오픈 알림 받기
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
