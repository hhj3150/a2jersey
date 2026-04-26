interface PointCard {
  badge: string
  title: string
  body: string
}

const POINTS: PointCard[] = [
  {
    badge: 'A2',
    title: 'A2 단백질',
    body: '국내에서 보기 드문 A2 단백질만 가진 저지(Jersey cow) 원유로 생산합니다.',
  },
  {
    badge: 'Jersey',
    title: '저지(Jersey cow) 원유',
    body: '저지(Jersey cow)의 짙고 부드러운 우유. 고소함과 깊이를 그대로 담았습니다.',
  },
  {
    badge: 'Hay Milk',
    title: '건초 중심 사양',
    body: '건초를 중심으로 한 식단이 만드는 자연스러운 풍미와 깨끗함.',
  },
  {
    badge: 'Farmstead',
    title: '목장형 유가공공장',
    body: '목장에서 착유한 원유를 자체 공장에서 HTST 방식으로 살균합니다.',
  },
]

export function WhyDifferent() {
  return (
    <section className="section" aria-labelledby="why-different-title">
      <div className="container-app">
        <p className="section-eyebrow text-center">Why Different</p>
        <h2 id="why-different-title" className="section-title text-center">
          송영신목장은 무엇이 다른가
        </h2>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {POINTS.map((p) => (
            <li key={p.badge} className="card">
              <span className="inline-block rounded-full bg-cream px-3 py-1 text-xs font-semibold tracking-wide text-soil-dark">
                {p.badge}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-ink">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-mute">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
