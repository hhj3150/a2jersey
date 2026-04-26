export function Pasteurization() {
  return (
    <section className="bg-forest text-white py-16 sm:py-20 border-t border-white/10" aria-labelledby="past-title">
      <div className="container-app">
        <h2 id="past-title" className="text-2xl sm:text-3xl font-semibold tracking-tight-kr">
          75°C, 20초의 정직함.
        </h2>
        <p className="mt-2 text-sm text-gold italic">HTST Low-Temperature Pasteurization</p>

        <p className="mt-6 text-sm leading-7 text-white/85">
          135°C에서 단 2초. 시중의 대부분 우유는 초고온순간살균(UHT) 공정으로 만들어집니다.
          빠르고, 효율적이며, 오래 보관됩니다.
          그러나 그 대가로 우유 단백질은 열변성되고, <span className="text-gold">특유의 “끓인 향”</span>과 무거운 질감이 남습니다.
        </p>
        <p className="mt-4 text-sm leading-7 text-white/85">
          송영신은 다른 길을 택했습니다. 75°C에서 20초 — 유해균만을 정확히 제거하되,
          유청 단백질과 풍미 성분을 온전히 보존하는 HTST(고온단시간) 살균.
          우유 본연의 단맛과 풀향이 살아있고, 마신 뒤 입 안에 남는 여운은 짧고 깨끗합니다.
        </p>

        <hr className="mt-10 border-white/15" />

        <dl className="mt-8 grid grid-cols-2 gap-y-6 gap-x-6 text-sm">
          <div>
            <dt className="text-[11px] uppercase tracking-[0.2em] text-gold">Pasteurization</dt>
            <dd className="mt-1 text-lg font-semibold">75 <span className="text-white/60 italic font-normal text-sm">°C</span> × 20 <span className="text-white/60 italic font-normal text-sm">sec</span></dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.2em] text-gold">Protein Denaturation</dt>
            <dd className="mt-1 text-lg font-semibold">&lt; 5 <span className="text-white/60 italic font-normal text-sm">%</span></dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.2em] text-gold">Shelf Sense</dt>
            <dd className="mt-1 text-lg font-semibold">Fresh, Short</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
