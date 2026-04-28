import { useState } from 'react'
import { JerseyDetailModal, type JerseyDetail } from './JerseyDetailModal'

interface Card extends JerseyDetail {
  teaser: string
}

const CARDS: Card[] = [
  {
    slug: 'rare',
    no: 'No 01',
    eng: 'The Rare',
    kr: '희소함',
    teaser: '국내에서 보기 드문 저지(Jersey) 품종.',
    image: '/jersey-rare.jpg',
    backdrop: '/jersey-cow-real.jpg',
    photo: {
      src: '/jersey-cow-real.jpg',
      caption: '송영신목장의 저지들 · Made by Soil',
    },
    tags: ['Jersey', 'Rare', 'Precious'],
    body: [
      '영국 저지섬에서 700년, 한국 송영신목장에서 18년. 귀하기에 더 정성스러운 우유.',
      '국내에 매우 드물게 사육되는 저지(Jersey cow). 희소함이 곧 가치가 됩니다.',
    ],
  },
  {
    slug: 'richness',
    no: 'No 02',
    eng: 'The Richness',
    kr: '풍미의 깊이',
    teaser: '저지 품종 특유의 진하고 풍부한 풍미.',
    image: '/jersey-richness.jpg',
    backdrop: '/jersey-bottle-real.jpg',
    tags: ['Rich', 'Creamy'],
    body: [
      '저지(Jersey) 품종은 다른 젖소 품종에 비해 유지방·단백질이 풍부한 편으로 알려져 있습니다.',
      '진하지만 무겁지 않은 완벽한 균형. 한 잔으로도 충분한 풍미의 깊이.',
    ],
  },
  {
    slug: 'purity',
    no: 'No 03',
    eng: 'The Purity',
    kr: '본연의 맛',
    teaser: 'A2A2 단일 유전형의 우유.',
    image: '/jersey-purity.jpg',
    tags: ['A2A2', 'Pure', 'Original'],
    body: [
      '저지(Jersey)는 A2 베타카제인 단일 유전형(A2A2)을 갖춘 품종입니다. 송영신목장은 그 본연의 모습 그대로를 담고자 합니다.',
      '가벼우면서도 깊은 한 잔. A2A2 단일 유전형으로 빚은 본연의 우유.',
    ],
  },
  {
    slug: 'golden',
    no: 'No 04',
    eng: 'The Golden',
    kr: '황금빛 우유',
    teaser: '풀이 만든 황금빛, 자연이 그린 빛깔.',
    image: '/jersey-golden.jpg',
    tags: ['Golden', 'Natural', 'Beta-Carotene'],
    body: [
      '저지소는 베타카로틴을 분해하지 않고 우유에 그대로 담아냅니다. 노란 황금빛은 풀에서 온 자연의 색입니다.',
      '인공 색소 없이, 자연이 그린 빛깔. 풀의 흔적이 한 잔에 남습니다.',
    ],
  },
  {
    slug: 'promise',
    no: 'No 05',
    eng: 'The Promise',
    kr: '한결같은 약속',
    teaser: '동물복지 1호, 저탄소 1호, 18년의 정직.',
    image: '/jersey-promise.jpg',
    tags: ['Heritage', 'Welfare', 'Trust'],
    body: [
      '국내 최초 동물복지 낙농 1호, 저탄소 인증 1호. A2 저지 단일 계통 육성 18년의 시간.',
      '정직한 흙이 만든 정직한 우유. 송영신목장이 지켜온 시간, Made by Soil.',
    ],
  },
]

export function WhyDifferent() {
  const [openSlug, setOpenSlug] = useState<Card['slug'] | null>(null)
  const open = openSlug ? CARDS.find((c) => c.slug === openSlug) ?? null : null

  return (
    <section className="section" aria-labelledby="why-different-title">
      <div className="container-app">
        <p className="section-eyebrow text-center">Why Different</p>
        <h2 id="why-different-title" className="section-title text-center">
          송영신목장은 무엇이 다른가
        </h2>
        <p className="mt-3 text-sm text-mute text-center max-w-reading mx-auto">
          5가지 차이 — 카드를 누르면 자세히 볼 수 있습니다.
        </p>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {CARDS.map((c, idx) => {
            const isLastOdd = CARDS.length % 2 === 1 && idx === CARDS.length - 1
            return (
              <li
                key={c.slug}
                className={isLastOdd ? 'sm:col-span-2' : ''}
              >
                <button
                  type="button"
                  onClick={() => setOpenSlug(c.slug)}
                  aria-haspopup="dialog"
                  className="group relative w-full overflow-hidden rounded-2xl border border-line bg-surface p-5 text-left transition hover:border-soil hover:shadow-md focus:outline-none focus:ring-2 focus:ring-soil/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-soil">
                        {c.no} <span className="text-line">·</span> {c.eng}
                      </p>
                      <h3 className="mt-1.5 text-lg font-semibold text-ink">
                        {c.kr}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-mute">
                        {c.teaser}
                      </p>
                    </div>
                    <span
                      aria-hidden
                      className="ml-1 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cream text-soil-dark transition group-hover:bg-soil group-hover:text-white"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                  <p className="mt-4 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.18em] text-soil-dark/70">
                    Read More
                  </p>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <JerseyDetailModal detail={open} onClose={() => setOpenSlug(null)} />
    </section>
  )
}
