import { useState } from 'react'
import { SoftServeModal } from './SoftServeModal'

interface PreviewItem {
  name: string
  price?: string
  status: string
}

const ITEMS: PreviewItem[] = [
  { name: '750ml A2 저지 헤이밀크',     price: '12,000원', status: '6월 1일 오픈' },
  { name: '180ml A2 저지 헤이밀크',     price: '3,200원',  status: '6월 1일 오픈' },
  { name: '500ml A2 저지 플래인 요거트', price: '10,000원', status: '6월 1일 오픈' },
  { name: '500ml A2 저지 프로틴 요거트', price: '10,000원', status: '6월 1일 오픈' },
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
  const [softOpen, setSoftOpen] = useState(false)

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
          준비 중인 라인업
        </h2>
        <p className="mt-3 text-sm text-mute text-center max-w-reading mx-auto">
          국내산 A2 저지(Jersey cow) 우유를 찾는 소비자를 위해 송영신목장은
          {' '}{formatDate(launchDate)}부터 정기구독 서비스를 준비하고 있습니다.
        </p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {ITEMS.map((it) => (
            <li key={it.name}>
              <div className="card flex items-center justify-between gap-3">
                {renderRow(it)}
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setSoftOpen(true)}
          aria-haspopup="dialog"
          className="group mt-4 flex w-full items-center justify-between gap-3 rounded-2xl bg-forest p-5 text-left text-white shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gold/60"
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xl"
              aria-hidden
            >
              🍦
            </span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
                Signature
              </p>
              <p className="mt-0.5 text-base font-semibold">
                A2 저지 헤이밀크 소프트아이스크림
              </p>
              <p className="text-xs text-white/70 mt-0.5">
                안성팜랜드 內 송영신목장 부스 · 탭하여 자세히 보기
              </p>
            </div>
          </div>
          <span
            className="ml-1 text-2xl text-gold transition group-hover:translate-x-0.5"
            aria-hidden
          >
            ›
          </span>
        </button>

        <ul className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-mute">
          {POLICY_NOTES.map((n) => (
            <li key={n} className="flex items-center">
              <span className="mr-1.5 inline-block h-1 w-1 rounded-full bg-soil-dark" aria-hidden />
              {n}
            </li>
          ))}
        </ul>
      </div>

      <SoftServeModal open={softOpen} onClose={() => setSoftOpen(false)} />
    </section>
  )
}

function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  return `${m[1]}년 ${Number(m[2])}월 ${Number(m[3])}일`
}
