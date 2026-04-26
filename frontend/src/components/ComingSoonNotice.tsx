import { useEffect } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  launchLabel: string
  smartstoreUrl: string
  onSignupClick: () => void
}

export function ComingSoonNotice({
  open,
  onClose,
  launchLabel,
  smartstoreUrl,
  onSignupClick,
}: Props) {
  useEffect(() => {
    if (!open) return
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
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="coming-soon-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-cream shadow-xl"
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

        <div className="px-7 pt-9 pb-7 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-soil">
            Pre-Launch
          </p>
          <h2
            id="coming-soon-title"
            className="mt-3 text-2xl font-semibold tracking-tight-kr text-ink"
          >
            정기구독 {launchLabel} 오픈
          </h2>
          <p className="mt-4 text-sm leading-7 text-mute">
            {launchLabel}부터 네이버 스마트스토어에서
            <br />
            정기구독 신청이 가능합니다.
          </p>
          <p className="mt-3 text-sm leading-7 text-mute">
            오픈 즉시 가장 먼저 안내받으시려면
            <br />
            <span className="font-medium text-ink">사전회원</span>으로 등록해 주세요.
          </p>

          <div className="mt-7 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                onClose()
                onSignupClick()
              }}
              className="btn-primary w-full"
            >
              사전회원 등록하기
            </button>
            <a
              href={smartstoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line bg-surface px-5 py-3 text-sm font-medium text-ink transition hover:border-soil hover:text-soil-dark"
            >
              스마트스토어 미리 보기
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
                <path d="M2 9L9 2M9 2H4M9 2v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
