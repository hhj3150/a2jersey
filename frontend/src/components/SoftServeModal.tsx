import { useEffect } from 'react'

interface SoftServeModalProps {
  open: boolean
  onClose: () => void
}

interface DiffCard {
  no: string
  eyebrow: string
  title: string
  body: string
}

const DIFF_CARDS: DiffCard[] = [
  {
    no: 'NO 01',
    eyebrow: 'A2 PURITY',
    title: '100% A2 저지 헤이밀크 베이스',
    body:
      '공장 분유나 시판 우유가 아닌, 송영신 농장에서 갓 짠 A2 저지 헤이밀크만 사용합니다. 사일리지 없이 건초만 먹고 자란 저지소의 우유 — 출발점부터 다른 이유입니다.',
  },
  {
    no: 'NO 02',
    eyebrow: 'ON-FARM CREAM',
    title: '농장 자체 크림 분리기로 직접 분리',
    body:
      '외부에서 들여온 크림이 아닙니다. 송영신 목장 내 자체 크림 분리기로 갓 짠 우유에서 직접 분리한 크림 — 외부 유통을 거치지 않아 신선도와 풍미가 그대로 보존됩니다.',
  },
  {
    no: 'NO 03',
    eyebrow: '21% RICHNESS',
    title: '크림 함량 21%, 최종 크림비율 12.5%',
    body:
      '일반 시판 소프트아이스크림의 크림비율은 통상 6~8%. 송영신 소프트는 12.5%까지 끌어올려 한 입에 입안을 가득 채우는 진한 농도와 입안에서 천천히 녹아내리는 크리미함을 구현했습니다.',
  },
  {
    no: 'NO 04',
    eyebrow: 'GOLDEN FAT',
    title: '유지방 5%의 황금빛 베이스',
    body:
      '송영신 목장 우유의 유지방 함량은 약 5% — 일반 백색우유(3.5% 내외)보다 진합니다. 저지 품종 특유의 베타카로틴이 만든 자연스러운 황금빛, 풀이 전한 향이 그대로 풍미가 됩니다.',
  },
  {
    no: 'NO 05',
    eyebrow: 'BEYOND HOKKAIDO',
    title: '일본 최고 저지 아이스크림보다 압도적',
    body:
      '진짜 풍미를 위해 홋카이도까지 갈 필요 없습니다. 100% 국내 A2 저지 헤이밀크와 자체 분리 크림으로 만들어, 일본 최고 저지 소프트와 직접 비교해도 풍미와 크리미함에서 압도적인 한 끗을 보여줍니다.',
  },
]

const DATA_POINTS = [
  { value: '100%', label: 'A2 저지 헤이밀크' },
  { value: '21%', label: '크림 함량 (최종 12.5%)' },
  { value: '5%', label: '목장 우유 유지방' },
  { value: '0', label: '외부 크림·분유' },
]

export function SoftServeModal({ open, onClose }: SoftServeModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="softserve-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-6 sm:py-10"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition hover:bg-white"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <img
          src="/softserve-banner.jpg"
          alt="국내 최초 A2 저지(Jersey Cow) 헤이밀크 소프트 아이스크림 — 100% A2 Jersey Cow, 유럽 전통 헤이밀크 방식, 자체 분리 크림 21%"
          className="block w-full"
          loading="eager"
        />

        <div className="px-5 sm:px-8 py-7 sm:py-9">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-soil text-center">
            The Difference
          </p>
          <h2
            id="softserve-modal-title"
            className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight-kr text-ink text-center leading-tight"
          >
            왜 송영신 소프트는 다른가
          </h2>
          <p className="mt-3 text-sm text-mute text-center max-w-reading mx-auto leading-relaxed">
            한국에서 처음 만나는, 진짜 저지 헤이밀크 소프트아이스크림.
            <br />
            출발점이 다른 베이스, 농장 직접 분리한 크림, 압도적인 농도.
          </p>

          <ul className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DATA_POINTS.map((d) => (
              <li
                key={d.label}
                className="rounded-xl bg-cream/70 border border-line p-3 text-center"
              >
                <div className="text-2xl sm:text-3xl font-bold text-soil-dark tabular-nums tracking-tight">
                  {d.value}
                </div>
                <div className="mt-1 text-[11px] sm:text-xs text-mute leading-tight">
                  {d.label}
                </div>
              </li>
            ))}
          </ul>

          <ol className="mt-8 space-y-4">
            {DIFF_CARDS.map((c) => (
              <li
                key={c.no}
                className="rounded-xl border border-line bg-white p-4 sm:p-5"
              >
                <div className="flex items-baseline gap-2 text-xs">
                  <span className="font-semibold text-soil-dark tracking-wider">
                    {c.no}
                  </span>
                  <span className="text-mute">·</span>
                  <span className="font-semibold tracking-[0.15em] text-mute">
                    {c.eyebrow}
                  </span>
                </div>
                <h3 className="mt-1.5 text-base sm:text-lg font-semibold text-ink tracking-tight-kr leading-snug">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-mute leading-relaxed">{c.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-7 rounded-2xl bg-gradient-to-br from-cream to-cream/30 border border-line p-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-soil">
              Where to taste
            </p>
            <p className="mt-2 text-base font-semibold text-ink">
              안성팜랜드 內 송영신목장 부스
            </p>
            <p className="mt-2 text-sm text-mute leading-relaxed">
              지금 바로 한 입 — 홋카이도까지 갈 필요 없습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
