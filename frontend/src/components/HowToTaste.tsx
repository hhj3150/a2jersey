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

export function HowToTaste() {
  return (
    <section className="section bg-cream" aria-labelledby="howto-title">
      <div className="container-app">
        <p className="section-eyebrow">— How to Taste · 음용 가이드</p>
        <h2 id="howto-title" className="section-title">
          한 잔을, <span className="text-gold italic">천천히</span> 맞이하는 법.
        </h2>

        <ol className="mt-10 space-y-8">
          {TIPS.map((tip, idx) => (
            <li key={tip.num} className={idx > 0 ? 'pt-8 border-t border-line' : ''}>
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-medium text-soil italic">{tip.num}</span>
                <span className="text-xl font-semibold text-gold leading-none">{tip.kanji}</span>
                <h3 className="text-base sm:text-lg font-semibold text-ink">
                  {tip.title}
                </h3>
              </div>
              <p className="mt-3 ml-9 text-sm leading-7 text-mute">
                {tip.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
