import { useState } from 'react'
import { ComingSoonNotice } from './ComingSoonNotice'
import { useDDay } from '../lib/useDDay'
import { env } from '../env'

interface PreviewItem {
  name: string
  price?: string
  status: string
}

const ITEMS: PreviewItem[] = [
  { name: '750ml A2 저지 헤이밀크',     price: '12,000원', status: '정기배송 6월 1일' },
  { name: '180ml A2 저지 헤이밀크',     price: '3,500원',  status: '정기배송 6월 1일' },
  { name: '500ml A2 저지 플래인 요거트', price: '10,000원', status: '정기배송 6월 1일' },
  { name: '500ml A2 저지 프로틴 요거트', price: '10,000원', status: '정기배송 6월 1일' },
]

const POLICY_NOTES: string[] = [
  '정기구독 10% 할인',
  '4만 원 이상 구독 시 택배비 무료',
  '정기배송 매주 화·목요일',
]

interface SubscriptionPreviewProps {
  launchDate: string
}

export function SubscriptionPreview({ launchDate }: SubscriptionPreviewProps) {
  const [noticeOpen, setNoticeOpen] = useState(false)
  const dday = useDDay(launchDate)
  const isLive = dday.phase === 'live'
  const launchLabel = formatLaunchShort(launchDate)

  const handleSubscribeClick = () => {
    if (isLive) {
      window.open(env.smartstoreUrl, '_blank', 'noopener,noreferrer')
    } else {
      setNoticeOpen(true)
    }
  }

  const scrollToSignup = () => {
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const renderRow = (it: PreviewItem) => (
    <>
      <p className="text-base font-semibold text-ink text-left">{it.name}</p>
      <div className="flex flex-col items-end whitespace-nowrap">
        {it.price && (
          <span className="text-sm font-semibold text-ink">{it.price}</span>
        )}
        <span className="text-xs font-medium text-soil-dark mt-0.5">
          {it.status}
        </span>
      </div>
    </>
  )

  return (
    <section className="section" aria-labelledby="subscription-preview-title">
      <div className="container-app">
        <p className="section-eyebrow text-center">Subscription</p>
        <h2 id="subscription-preview-title" className="section-title text-center">
          송영신목장 라인업
        </h2>
        <p className="mt-3 text-sm text-mute text-center max-w-reading mx-auto">
          국내산 A2 저지(Jersey cow) 헤이밀크와 요거트 라인업입니다. 현재 안성팜랜드에서 시판 중이며,
          사전회원 모집 후 {formatDate(launchDate)}부터 정기배송이 시작됩니다.
        </p>

        <figure className="relative mt-8 flex justify-center">
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-56 w-72 sm:h-64 sm:w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-gold/20 via-gold/10 to-transparent blur-2xl"
          />
          <img
            src="/jersey-lineup-iso.webp"
            alt="A2 저지 헤이밀크 라인업 — 180ml · 500ml 플레인 요거트 · 750ml"
            width="1192"
            height="1182"
            className="block h-auto w-full max-w-[320px] sm:max-w-[420px] drop-shadow-xl"
            loading="lazy"
            decoding="async"
          />
        </figure>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {ITEMS.map((it) => (
            <li key={it.name}>
              <div className="card flex items-center justify-between gap-3">
                {renderRow(it)}
              </div>
            </li>
          ))}
        </ul>

        <figure className="mt-8">
          <img
            src="/jersey-softserve.jpg"
            alt="A2 Jersey Hay Milk Ice Cream — 이제 홋카이도까지 갈 필요없습니다. 안성팜랜드에서 만나보세요."
            width="1182"
            height="1388"
            className="block h-auto w-full rounded-2xl shadow-sm"
            loading="lazy"
            decoding="async"
          />
        </figure>

        <ul className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-mute">
          {POLICY_NOTES.map((n) => (
            <li key={n} className="flex items-center">
              <span className="mr-1.5 inline-block h-1 w-1 rounded-full bg-soil-dark" aria-hidden />
              {n}
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={handleSubscribeClick}
            className="btn-primary w-full sm:w-auto sm:px-10"
            aria-haspopup={isLive ? undefined : 'dialog'}
          >
            {isLive ? '정기구독 신청하기' : `정기구독 신청하기 · ${launchLabel} 오픈`}
            <span className="ml-1.5" aria-hidden>{isLive ? '→' : '↗'}</span>
          </button>
          <p className="mt-2.5 text-[11px] text-mute">
            {isLive
              ? '네이버 스마트스토어로 이동합니다'
              : `${launchLabel}부터 네이버 스마트스토어에서 신청 가능`}
          </p>
        </div>
      </div>

      <ComingSoonNotice
        open={noticeOpen}
        onClose={() => setNoticeOpen(false)}
        launchLabel={launchLabel}
        smartstoreUrl={env.smartstoreUrl}
        onSignupClick={scrollToSignup}
      />
    </section>
  )
}

function formatLaunchShort(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  return `${Number(m[2])}월 ${Number(m[3])}일`
}

function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  return `${m[1]}년 ${Number(m[2])}월 ${Number(m[3])}일`
}
