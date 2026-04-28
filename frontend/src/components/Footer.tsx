interface FooterProps {
  homepageUrl: string
}

const COMPANY = '농업회사법인 디투오'
const REPRESENTATIVE = '송영신'
const BIZ_REG_NO = '266-88-01121'
const TS_NO = '2025-경기안성-0841'
const ADDRESS = '경기도 안성시 미양면 미양로 466'
const PHONE = '031-674-3150'
const EMAIL = 'hhj3150@hanmail.net'

export function Footer({ homepageUrl }: FooterProps) {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-cream border-t border-line">
      <div className="container-app py-10 text-center">
        <img
          src="/logo-512.png"
          alt="송영신목장"
          className="mx-auto block h-20 w-auto opacity-90"
          width="512"
          height="414"
          decoding="async"
        />
        <p className="mt-3 text-base font-semibold text-ink">송영신목장</p>
        <p className="mt-1 text-xs text-mute">A2 Jersey Hay Milk · Made by Soil</p>

        <nav
          aria-label="법적 고지 및 외부 링크"
          className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs"
        >
          <a
            href={homepageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-soil-dark hover:underline"
          >
            공식 홈페이지
          </a>
          <span className="text-line">·</span>
          <a href="/privacy" className="text-soil-dark font-semibold hover:underline">
            개인정보 처리방침
          </a>
          <span className="text-line">·</span>
          <a href="/terms" className="text-soil-dark hover:underline">
            사전회원 이용약관
          </a>
        </nav>

        <div className="mt-6 mx-auto max-w-md text-left text-[11px] text-mute leading-relaxed">
          <dl className="grid grid-cols-[7rem_1fr] gap-x-2 gap-y-1">
            <dt className="text-mute">상호</dt>
            <dd className="text-ink">{COMPANY}</dd>
            <dt className="text-mute">대표자</dt>
            <dd className="text-ink">{REPRESENTATIVE}</dd>
            <dt className="text-mute">사업자등록번호</dt>
            <dd className="text-ink">{BIZ_REG_NO}</dd>
            <dt className="text-mute">통신판매업신고</dt>
            <dd className="text-ink">{TS_NO}</dd>
            <dt className="text-mute">주소</dt>
            <dd className="text-ink">{ADDRESS}</dd>
            <dt className="text-mute">전화</dt>
            <dd className="text-ink">
              <a href={`tel:${PHONE.replace(/-/g, '')}`} className="hover:underline">
                {PHONE}
              </a>
            </dd>
            <dt className="text-mute">이메일</dt>
            <dd className="text-ink">
              <a href={`mailto:${EMAIL}`} className="hover:underline">
                {EMAIL}
              </a>
            </dd>
          </dl>
        </div>

        <p className="mt-6 text-[11px] text-mute leading-relaxed">
          © {year} {COMPANY}. 본 페이지는 정기구독 사전회원 모집을 위한 안내입니다.
        </p>
        <p className="mt-1 text-[10px] text-mute">
          호스팅: Netlify, Inc. (미국) · API/DB: Railway Corp. (미국)
        </p>
      </div>
    </footer>
  )
}
