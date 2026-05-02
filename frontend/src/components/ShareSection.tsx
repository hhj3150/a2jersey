import { useState } from 'react'
import { useDDay } from '../lib/useDDay'

const buildShareUrl = (): string => {
  if (typeof window === 'undefined') return 'https://a2jersey-pre.netlify.app'
  const u = new URL(window.location.href)
  u.searchParams.set('ref', 'share')
  u.hash = ''
  return u.toString()
}

const SHARE_TITLE = '송영신목장 A2 Jersey Hay Milk'
const SHARE_TEXT_PRE =
  '국내산 A2 Jersey 우유 정기구독을 6월 1일 오픈합니다. 사전회원 신청하면 가장 먼저 안내드려요.'
const SHARE_TEXT_LIVE =
  '국내산 A2 Jersey 우유 — 송영신목장 헤이밀크와 요거트, 네이버 스마트스토어에서 정기구독으로 만나보세요.'

interface ShareSectionProps {
  launchDate: string
}

export function ShareSection({ launchDate }: ShareSectionProps) {
  const dday = useDDay(launchDate)
  const isLaunched = dday.phase === 'live' || dday.phase === 'today'
  const SHARE_TEXT = isLaunched ? SHARE_TEXT_LIVE : SHARE_TEXT_PRE
  const [status, setStatus] = useState<
    | { kind: 'idle' }
    | { kind: 'shared' }
    | { kind: 'copied' }
    | { kind: 'error'; message: string }
  >({ kind: 'idle' })

  const handleShare = async () => {
    const url = buildShareUrl()
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url })
        setStatus({ kind: 'shared' })
        setTimeout(() => setStatus({ kind: 'idle' }), 2500)
        return
      } catch (err) {
        if ((err as DOMException)?.name === 'AbortError') {
          setStatus({ kind: 'idle' })
          return
        }
      }
    }
    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT}\n${url}`)
      setStatus({ kind: 'copied' })
      setTimeout(() => setStatus({ kind: 'idle' }), 2500)
    } catch {
      window.prompt('링크를 복사해서 친구에게 공유해주세요', url)
      setStatus({ kind: 'idle' })
    }
  }

  const label =
    status.kind === 'shared'
      ? '공유됨 ✓'
      : status.kind === 'copied'
      ? '링크 복사됨 ✓'
      : '친구에게 추천하기'

  return (
    <section className="section bg-cream/40" aria-label="추천하기">
      <div className="container-app">
        <div className="card text-center py-8">
          <p className="section-eyebrow">Share</p>
          <h2 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight-kr text-ink">
            가족·친구에게도 알려주세요
          </h2>
          <p className="mt-3 text-sm text-mute max-w-reading mx-auto">
            {isLaunched ? (
              <>
                송영신목장 A2 Jersey 헤이밀크와 요거트를
                <br />
                가까운 분께 함께 추천해주세요.
              </>
            ) : (
              <>
                6월 1일 정기구독 오픈 정보를 함께 받아보실 수 있도록
                <br />
                가까운 분께 사전회원 안내를 공유해주세요.
              </>
            )}
          </p>

          <button
            type="button"
            onClick={handleShare}
            className="btn-primary mt-6 w-full sm:w-auto"
          >
            {label}
          </button>

          <p className="mt-4 text-xs text-mute">
            모바일에서는 카카오톡 등 메신저를 선택해 친구 주소록에서 직접 보낼 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  )
}
