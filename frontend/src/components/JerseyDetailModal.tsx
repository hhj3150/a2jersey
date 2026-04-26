import { useEffect } from 'react'

export interface JerseyDetail {
  slug: 'rare' | 'richness' | 'purity' | 'golden' | 'promise'
  no: string
  eng: string
  kr: string
  body: string[]
  tags: string[]
  image: string
  backdrop?: string
}

interface Props {
  detail: JerseyDetail | null
  onClose: () => void
}

export function JerseyDetailModal({ detail, onClose }: Props) {
  useEffect(() => {
    if (!detail) return
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
  }, [detail, onClose])

  if (!detail) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="jersey-modal-title"
      className="fixed inset-0 z-50"
    >
      {detail.backdrop ? (
        <>
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${detail.backdrop})` }}
          />
          <div aria-hidden className="absolute inset-0 bg-ink/65" />
        </>
      ) : (
        <div aria-hidden className="absolute inset-0 bg-ink/70" />
      )}

      <div
        className="relative h-full overflow-y-auto px-4 py-6 sm:py-12"
        onClick={onClose}
      >
        <div
          className="relative mx-auto w-full max-w-md rounded-2xl bg-cream shadow-2xl ring-1 ring-white/10"
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

        <img
          src={detail.image}
          alt={`${detail.eng} — ${detail.kr}`}
          className="block w-full rounded-t-2xl"
          loading="eager"
        />

        <h2 id="jersey-modal-title" className="sr-only">
          {detail.eng} · {detail.kr}
        </h2>

        <div className="px-6 pb-7 pt-5">
          <div className="space-y-3 text-sm leading-7 text-ink/80">
            {detail.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
            {detail.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-soil/10 px-2.5 py-1 text-[11px] font-medium tracking-wide text-soil-dark"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
