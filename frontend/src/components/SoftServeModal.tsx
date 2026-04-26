import { useEffect } from 'react'

interface SoftServeModalProps {
  open: boolean
  onClose: () => void
}

export function SoftServeModal({ open, onClose }: SoftServeModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="softserve-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-xl"
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

        <h2 id="softserve-modal-title" className="sr-only">
          국내 최초 A2 저지 헤이밀크 소프트 아이스크림
        </h2>

        <img
          src="/softserve-banner.jpg"
          alt="국내 최초 A2 저지(Jersey Cow) 헤이밀크 소프트 아이스크림 — 100% A2 Jersey Cow, 유럽 전통 헤이밀크 방식, 자체 분리 크림 21%"
          className="block w-full rounded-2xl"
          loading="eager"
        />

        <p className="px-5 py-4 text-center text-xs text-mute">
          안성팜랜드 內 송영신목장 부스에서 직접 맛보실 수 있습니다
        </p>
      </div>
    </div>
  )
}
