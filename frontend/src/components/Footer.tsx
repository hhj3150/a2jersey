interface FooterProps {
  homepageUrl: string
  facebookUrl: string
  instagramUrl: string
  naverBlogUrl: string
  youtubeUrl: string
}

// 공식 브랜드 아이콘 — 재사용 가능한 inline SVG (의존성 X)
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.128 22 16.991 22 12z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <path d="M16.5 11.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function NaverBlogIcon({ className }: { className?: string }) {
  // 네이버 검색 N 글리프 (녹색 브랜드 자산은 currentColor로 톤 통일)
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z" />
    </svg>
  )
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.546 15.568V8.432L15.818 12l-6.272 3.568z" />
    </svg>
  )
}

const COMPANY = '농업회사법인 디투오'
const REPRESENTATIVE = '송영신'
const BIZ_REG_NO = '266-88-01121'
const TS_NO = '2025-경기안성-0841'
const ADDRESS = '경기도 안성시 미양면 미양로 466'
const PHONE = '031-674-3150'
const EMAIL = 'hhj3150@hanmail.net'

export function Footer({
  homepageUrl,
  facebookUrl,
  instagramUrl,
  naverBlogUrl,
  youtubeUrl,
}: FooterProps) {
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

        <nav
          aria-label="송영신목장 SNS 채널"
          className="mt-5 flex items-center justify-center gap-3"
        >
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="송영신목장 페이스북"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-line text-mute transition hover:text-soil-dark hover:border-soil-dark/40"
          >
            <FacebookIcon className="h-4 w-4" />
          </a>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="송영신목장 인스타그램"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-line text-mute transition hover:text-soil-dark hover:border-soil-dark/40"
          >
            <InstagramIcon className="h-4 w-4" />
          </a>
          <a
            href={naverBlogUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="송영신목장 네이버 블로그"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-line text-mute transition hover:text-soil-dark hover:border-soil-dark/40"
          >
            <NaverBlogIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="송영신목장 유튜브"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-line text-mute transition hover:text-soil-dark hover:border-soil-dark/40"
          >
            <YouTubeIcon className="h-4 w-4" />
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
