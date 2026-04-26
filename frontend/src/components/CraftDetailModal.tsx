import { useEffect } from 'react'

export type CraftSlug = 'haymilk' | 'pasteurization' | 'taste' | 'howto'

interface Props {
  slug: CraftSlug | null
  onClose: () => void
}

export function CraftDetailModal({ slug, onClose }: Props) {
  useEffect(() => {
    if (!slug) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [slug, onClose])

  if (!slug) return null

  const dark = slug === 'haymilk' || slug === 'pasteurization'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="craft-modal-title"
      className="fixed inset-0 z-50"
    >
      <div aria-hidden className="absolute inset-0 bg-ink/70" />

      <div
        className="relative h-full overflow-y-auto px-4 py-6 sm:py-12"
        onClick={onClose}
      >
        <div
          className={`relative mx-auto w-full max-w-md rounded-2xl shadow-2xl ring-1 ring-white/10 ${
            dark ? 'bg-forest text-white' : 'bg-cream text-ink'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm transition hover:bg-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <div className="px-6 pb-7 pt-9">
            {slug === 'haymilk' && <HayMilkContent />}
            {slug === 'pasteurization' && <PasteurizationContent />}
            {slug === 'taste' && <TasteContent />}
            {slug === 'howto' && <HowToTasteContent />}
          </div>
        </div>
      </div>
    </div>
  )
}

function HayMilkContent() {
  return (
    <>
      <h2 id="craft-modal-title" className="text-2xl font-semibold tracking-tight-kr">
        알프스의 700년, 헤이밀크.
      </h2>
      <p className="mt-2 text-sm text-gold italic">Hay Milk · 유럽 전통 건초 급이 방식</p>

      <p className="mt-6 text-sm leading-7 text-white/85">
        알프스의 작은 목장들이 700년 동안 지켜온 방식이 있습니다.
        사일리지(발효사료) 대신, 오직 <span className="text-gold">잘 마른 건초와 청초</span>만으로
        젖소를 키우는 것. 유럽에서는 이를 Heumilch(헤이밀크)라 부르며, EU가 별도의 전통식품
        카테고리로 인증합니다.
      </p>
      <p className="mt-4 text-sm leading-7 text-white/85">
        송영신목장의 저지들은 이 방식을 그대로 따릅니다. 사일리지 발효취가 우유로
        옮겨오지 않고, 농후사료의 무거움도 없습니다. 건초와 청초만이 만드는 깊고 깨끗한 우유.
      </p>
      <p className="mt-4 text-sm leading-7 text-white/85">
        그래서 지방산 프로파일부터 다릅니다. 오메가-6과 오메가-3의 비율이 4:1 이하 —
        현대인에게 부족한 불포화지방의 균형. 혀 위에서 가볍게 녹아내리고, 목을 넘어간 뒤에도
        입안이 끈적하지 않습니다.
      </p>

      <hr className="mt-8 border-white/15" />

      <dl className="mt-6 grid grid-cols-2 gap-y-5 gap-x-5 text-sm">
        <div>
          <dt className="text-[11px] uppercase tracking-[0.2em] text-gold">Diet</dt>
          <dd className="mt-1 text-base font-semibold">Hay &amp; Forage <span className="text-white/60 italic font-normal text-sm">only</span></dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.2em] text-gold">Omega-6 : Omega-3</dt>
          <dd className="mt-1 text-base font-semibold">≤ 4 : 1</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[11px] uppercase tracking-[0.2em] text-gold">Standard</dt>
          <dd className="mt-1 text-base font-semibold">EU Heumilch <span className="text-white/60 italic font-normal text-sm">spec.</span></dd>
        </div>
      </dl>
    </>
  )
}

function PasteurizationContent() {
  return (
    <>
      <h2 id="craft-modal-title" className="text-2xl font-semibold tracking-tight-kr">
        75°C, 20초의 정직함.
      </h2>
      <p className="mt-2 text-sm text-gold italic">HTST Low-Temperature Pasteurization</p>

      <p className="mt-6 text-sm leading-7 text-white/85">
        135°C에서 단 2초. 시중의 대부분 우유는 초고온순간살균(UHT) 공정으로 만들어집니다.
        빠르고, 효율적이며, 오래 보관됩니다. 그러나 그 대가로 우유 단백질은 열변성되고,
        <span className="text-gold"> 특유의 “끓인 향”</span>과 무거운 질감이 남습니다.
      </p>
      <p className="mt-4 text-sm leading-7 text-white/85">
        송영신은 다른 길을 택했습니다. 75°C에서 20초 — 유해균만을 정확히 제거하되,
        유청 단백질과 풍미 성분을 온전히 보존하는 HTST(고온단시간) 살균. 우유 본연의
        단맛과 풀향이 살아있고, 마신 뒤 입 안에 남는 여운은 짧고 깨끗합니다.
      </p>

      <hr className="mt-8 border-white/15" />

      <dl className="mt-6 grid grid-cols-2 gap-y-5 gap-x-5 text-sm">
        <div>
          <dt className="text-[11px] uppercase tracking-[0.2em] text-gold">Pasteurization</dt>
          <dd className="mt-1 text-base font-semibold">75 <span className="text-white/60 italic font-normal text-sm">°C</span> × 20 <span className="text-white/60 italic font-normal text-sm">sec</span></dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.2em] text-gold">Protein Denaturation</dt>
          <dd className="mt-1 text-base font-semibold">&lt; 5 <span className="text-white/60 italic font-normal text-sm">%</span></dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[11px] uppercase tracking-[0.2em] text-gold">Shelf Sense</dt>
          <dd className="mt-1 text-base font-semibold">Fresh, Short</dd>
        </div>
      </dl>
    </>
  )
}

function TasteContent() {
  return (
    <>
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-soil text-center">
        Taste
      </p>
      <h2
        id="craft-modal-title"
        className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight-kr leading-relaxed text-ink text-center"
      >
        물보다 가벼운 목넘김,
        <br />
        저지(Jersey cow)의 깊이.
      </h2>
      <p className="mt-6 text-sm leading-7 text-mute text-center">
        첫 모금에서 느껴지는 가벼움, 그 뒤에 남는 저지(Jersey cow) 특유의 진한 여운.
        매일 마실 수 있는 자연스러운 균형을 추구합니다.
      </p>
      <p className="mt-4 text-sm leading-7 text-mute text-center">
        저지소만이 가진 짧고 풍부한 지방구가 혀에서 사르르 녹으며, 헤이밀크 특유의
        풀향이 코 끝에 잠시 머물다 사라집니다. 그것이 한 잔의 끝입니다.
      </p>
    </>
  )
}

interface Tip {
  num: string
  kanji: string
  title: string
  body: string
}

const TIPS: Tip[] = [
  {
    num: '01',
    kanji: '冷',
    title: '4°C의 차가움으로',
    body: '저지의 유지방은 차갑게 식었을 때 가장 정돈된 크리미함을 보입니다. 냉장고에서 꺼낸 직후, 상온에 두지 말고 바로 잔에 따르세요.',
  },
  {
    num: '02',
    kanji: '器',
    title: '얇은 크리스탈 잔에',
    body: '머그가 아닌 유리 잔을 권합니다. 얇은 벽을 가진 잔은 입술에 닿는 순간 우유의 온도·질감을 가장 정확히 전달합니다.',
  },
  {
    num: '03',
    kanji: '空',
    title: '빈 속, 첫 번째 잔으로',
    body: '아침 공복이나 식전에 한 잔. 혀가 가장 예민할 때 A2 저지의 단맛과 풀향이 섬세하게 느껴집니다.',
  },
  {
    num: '04',
    kanji: '默',
    title: '첫 모금은 조용히',
    body: '첫 한 모금은 말 없이, 숨을 들이마신 뒤 삼켜보세요. 목을 넘어가는 2초의 감각 — 그것이 물과 다른 지점입니다.',
  },
]

function HowToTasteContent() {
  return (
    <>
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-soil">
        — How to Taste · 음용 가이드
      </p>
      <h2 id="craft-modal-title" className="mt-2 text-2xl font-semibold tracking-tight-kr text-ink">
        한 잔을, <span className="text-gold italic">천천히</span> 맞이하는 법.
      </h2>

      <ol className="mt-6 space-y-6">
        {TIPS.map((tip, idx) => (
          <li key={tip.num} className={idx > 0 ? 'pt-6 border-t border-line' : ''}>
            <div className="flex items-baseline gap-3">
              <span className="text-xs font-medium text-soil italic">{tip.num}</span>
              <span className="text-lg font-semibold text-gold leading-none">{tip.kanji}</span>
              <h3 className="text-base font-semibold text-ink">{tip.title}</h3>
            </div>
            <p className="mt-2 ml-9 text-sm leading-6 text-mute">{tip.body}</p>
          </li>
        ))}
      </ol>
    </>
  )
}
