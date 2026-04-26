export function HayMilk() {
  return (
    <section className="bg-forest text-white py-16 sm:py-20" aria-labelledby="haymilk-title">
      <div className="container-app">
        <h2 id="haymilk-title" className="text-2xl sm:text-3xl font-semibold tracking-tight-kr">
          여름 초원, 건초 한 가지.
        </h2>
        <p className="mt-2 text-sm text-gold italic">Hay Milk · 건초 급이 방식</p>

        <p className="mt-6 text-sm leading-7 text-white/85">
          사일리지(발효사료)는 젖소의 위에서 발효취를 만들어 우유로 그대로 이행됩니다.
          농후사료를 많이 먹은 소의 우유는 무겁고 묵직합니다.
          송영신의 저지들은 오직 <span className="text-gold">잘 마른 건초와 청초</span>만을 먹습니다.
          유럽에서는 이를 Heumilch(건초 우유)라 부르며, 별도의 전통식품 인증을 부여합니다.
        </p>
        <p className="mt-4 text-sm leading-7 text-white/85">
          건초만으로 자란 저지가 내는 우유는 지방산 프로파일부터 다릅니다.
          오메가-6과 오메가-3의 비율이 4:1 이하 — 현대인이 결핍한 불포화지방의 균형.
          그래서 혀 위에서 가볍게 녹아내리고, 목을 넘어간 뒤에도 입안이 끈적하지 않습니다.
        </p>

        <hr className="mt-10 border-white/15" />

        <dl className="mt-8 grid grid-cols-2 gap-y-6 gap-x-6 text-sm">
          <div>
            <dt className="text-[11px] uppercase tracking-[0.2em] text-gold">Diet</dt>
            <dd className="mt-1 text-lg font-semibold">Hay &amp; Forage <span className="text-white/60 italic font-normal text-sm">only</span></dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.2em] text-gold">Omega-6 : Omega-3</dt>
            <dd className="mt-1 text-lg font-semibold">≤ 4 : 1</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.2em] text-gold">Standard</dt>
            <dd className="mt-1 text-lg font-semibold">EU Heumilch <span className="text-white/60 italic font-normal text-sm">spec.</span></dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
