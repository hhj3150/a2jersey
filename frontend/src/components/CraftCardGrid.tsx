import { useState } from 'react'
import { CraftDetailModal, type CraftSlug } from './CraftDetailModal'

interface Card {
  slug: CraftSlug
  no: string
  eng: string
  kr: string
  teaser: string
}

const CARDS: Card[] = [
  {
    slug: 'haymilk',
    no: 'No 06',
    eng: 'Hay Milk',
    kr: '알프스의 700년, 헤이밀크',
    teaser: '사일리지 없는 건초 급이 — EU Heumilch 전통.',
  },
  {
    slug: 'pasteurization',
    no: 'No 07',
    eng: 'HTST',
    kr: '75°C, 20초의 정직함',
    teaser: '풍미를 보존하는 저온 단시간 살균법.',
  },
  {
    slug: 'taste',
    no: 'No 08',
    eng: 'The Taste',
    kr: '물보다 가벼운 목넘김',
    teaser: '가볍지만 깊은 저지의 여운 + 음용 가이드.',
  },
]

export function CraftCardGrid() {
  const [openSlug, setOpenSlug] = useState<CraftSlug | null>(null)

  return (
    <section className="section bg-cream" aria-labelledby="craft-title">
      <div className="container-app">
        <p className="section-eyebrow text-center">The Craft</p>
        <h2 id="craft-title" className="section-title text-center">
          송영신의 방식
        </h2>
        <p className="mt-3 text-sm text-mute text-center max-w-reading mx-auto">
          어떻게 만들어, 어떻게 마시는가 — 카드를 누르면 자세히 볼 수 있습니다.
        </p>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {CARDS.map((c) => (
            <li key={c.slug}>
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
          ))}
        </ul>
      </div>

      <CraftDetailModal slug={openSlug} onClose={() => setOpenSlug(null)} />
    </section>
  )
}
