interface FooterProps {
  homepageUrl: string
}

export function Footer({ homepageUrl }: FooterProps) {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-cream border-t border-line">
      <div className="container-app py-10 text-center">
        <p className="text-base font-semibold text-ink">송영신목장</p>
        <p className="mt-1 text-xs text-mute">A2 Jersey Hay Milk · Made by Soil</p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
          <a
            href={homepageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-soil-dark hover:underline"
          >
            공식 홈페이지
          </a>
          <span className="text-line">·</span>
          <span className="text-mute">경기도 안성시</span>
        </div>

        <p className="mt-6 text-[11px] text-mute leading-relaxed">
          © {year} 송영신목장. 본 페이지는 정기구독 사전회원 모집을 위한 안내입니다.
        </p>
      </div>
    </footer>
  )
}
