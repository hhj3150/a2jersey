export function HayMilk() {
  return (
    <section className="bg-forest text-white py-16 sm:py-20" aria-labelledby="haymilk-title">
      <div className="container-app">
        <h2 id="haymilk-title" className="text-2xl sm:text-3xl font-semibold tracking-tight-kr">
          알프스의 700년, 헤이밀크.
        </h2>
        <p className="mt-2 text-sm text-gold italic">Hay Milk · 유럽 전통 건초 급이 방식</p>

        <p className="mt-6 text-sm leading-7 text-white/85">
          알프스의 작은 목장들이 700년 동안 지켜온 방식이 있습니다.
          사일리지(발효사료) 대신, 오직 <span className="text-gold">잘 마른 건초와 청초</span>만으로 젖소를 키우는 것.
          유럽에서는 이를 Heumilch(헤이밀크)라 부르며, EU가 별도의 전통식품 카테고리로 인증합니다.
        </p>
        <p className="mt-4 text-sm leading-7 text-white/85">
          송영신목장의 저지들은 이 방식을 그대로 따릅니다.
          사일리지 발효취가 우유로 옮겨오지 않고, 농후사료의 무거움도 없습니다.
          건초와 청초만이 만드는 깊고 깨끗한 우유.
        </p>
        <p className="mt-4 text-sm leading-7 text-white/85">
          그래서 지방산 프로파일부터 다릅니다. 오메가-6과 오메가-3의 비율이 4:1 이하 —
          현대인에게 부족한 불포화지방의 균형. 혀 위에서 가볍게 녹아내리고,
          목을 넘어간 뒤에도 입안이 끈적하지 않습니다.
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
