interface PreviewItem {
  name: string
  status: string
}

const ITEMS: PreviewItem[] = [
  { name: '750ml A2 저지 헤이밀크',     status: '6월 1일 오픈' },
  { name: '180ml A2 저지 헤이밀크',     status: '6월 1일 오픈' },
  { name: '500ml A2 저지 플래인 요거트', status: '6월 1일 오픈' },
  { name: '500ml A2 저지 프로틴 요거트', status: '6월 1일 오픈' },
  { name: '소프트아이스크림 · 카페 방문', status: '안성팜랜드 內' },
]

interface SubscriptionPreviewProps {
  launchDate: string
}

export function SubscriptionPreview({ launchDate }: SubscriptionPreviewProps) {
  return (
    <section className="section" aria-labelledby="subscription-preview-title">
      <div className="container-app">
        <p className="section-eyebrow text-center">Subscription</p>
        <h2 id="subscription-preview-title" className="section-title text-center">
          준비 중인 라인업
        </h2>
        <p className="mt-3 text-sm text-mute text-center max-w-reading mx-auto">
          국내산 A2 저지(Jersey cow) 우유를 찾는 소비자를 위해 송영신목장은
          {' '}{formatDate(launchDate)}부터 정기구독 서비스를 준비하고 있습니다.
        </p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {ITEMS.map((it) => (
            <li key={it.name} className="card flex items-center justify-between">
              <p className="text-base font-semibold text-ink">{it.name}</p>
              <span className="text-xs font-medium text-soil-dark whitespace-nowrap ml-3">
                {it.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  return `${m[1]}년 ${Number(m[2])}월 ${Number(m[3])}일`
}
