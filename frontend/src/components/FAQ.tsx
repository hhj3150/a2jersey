interface FAQItem {
  q: string
  a: string
}

const FAQS: FAQItem[] = [
  {
    q: '국내산 A2 저지(Jersey cow) 우유를 어디서 살 수 있나요?',
    a: '송영신목장은 경기도 안성에서 A2 Jersey Hay Milk를 생산하며, 6월 1일부터 정기구독 서비스를 준비하고 있습니다.',
  },
  {
    q: '저지(Jersey cow) 우유와 저지방 우유는 같은 건가요?',
    a: '다릅니다. 저지(Jersey cow)는 영국 저지섬 원산의 소 품종 이름이며, 저지방 우유(low-fat milk)와는 무관한 별개의 개념입니다.',
  },
  {
    q: '송영신목장 우유는 어떤 우유인가요?',
    a: '송영신목장 A2 Jersey Hay Milk는 A2 단백질, 저지(Jersey cow) 원유, 건초 중심 사양, 목장형 유가공공장을 기반으로 한 프리미엄 우유입니다.',
  },
  {
    q: 'A2 Jersey Hay Milk란 무엇인가요?',
    a: 'A2 단백질을 가진 저지(Jersey cow)의 우유를 기반으로, 건초 중심 사양 철학을 반영한 송영신목장의 프리미엄 우유입니다.',
  },
  {
    q: '정기구독은 언제 시작되나요?',
    a: '송영신목장은 6월 1일부터 A2 Jersey Hay Milk 정기구독 서비스를 시작할 예정입니다.',
  },
]

export function FAQ() {
  return (
    <section className="section bg-surface" aria-labelledby="faq-title">
      <div className="container-app">
        <p className="section-eyebrow text-center">FAQ</p>
        <h2 id="faq-title" className="section-title text-center">
          자주 묻는 질문
        </h2>

        <ul className="mt-8 divide-y divide-line border-y border-line">
          {FAQS.map((it, i) => (
            <li key={i}>
              <details className="group py-4">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
                  <span className="text-sm sm:text-base font-medium text-ink leading-snug">
                    Q. {it.q}
                  </span>
                  <span
                    className="mt-0.5 shrink-0 rounded-full border border-line w-6 h-6 inline-flex items-center justify-center text-mute transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-mute pr-9">
                  A. {it.a}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
