import { useEffect, useState } from 'react'
import { fetchAnalytics, type AnalyticsResponse } from '../lib/admin'

const pct = (n: number): string => `${(n * 100).toFixed(1)}%`
const round1 = (n: number): string => n.toFixed(1)

function Bar({
  label,
  count,
  share,
  total,
  tone = 'amber',
}: {
  label: string
  count: number
  share?: number
  total?: number
  tone?: 'amber' | 'stone' | 'green' | 'blue'
}) {
  const ratio = share !== undefined ? share : total ? count / total : 0
  const bgClass = {
    amber: 'bg-amber-500',
    stone: 'bg-stone-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600',
  }[tone]
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="w-44 shrink-0 truncate text-stone-700" title={label}>
        {label}
      </div>
      <div className="flex-1 bg-stone-100 rounded h-7 relative overflow-hidden">
        <div
          className={`${bgClass} h-7 rounded transition-[width] duration-300`}
          style={{ width: `${Math.max(2, ratio * 100)}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-medium text-stone-800">
          {count}건{share !== undefined && ` (${pct(share)})`}
        </span>
      </div>
    </div>
  )
}

function Card({
  title,
  value,
  hint,
}: {
  title: string
  value: string
  hint?: string
}) {
  return (
    <div className="bg-white border border-stone-200 rounded-lg p-4">
      <div className="text-xs text-stone-500">{title}</div>
      <div className="text-2xl font-bold tabular-nums mt-1">{value}</div>
      {hint && <div className="text-xs text-stone-400 mt-1">{hint}</div>}
    </div>
  )
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-white border border-stone-200 rounded-lg p-5">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-stone-900">{title}</h2>
        {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

function HourChart({ byHour }: { byHour: Array<{ hour: number; count: number }> }) {
  const map = new Map(byHour.map((h) => [h.hour, h.count]))
  const max = Math.max(1, ...byHour.map((h) => h.count))
  return (
    <div>
      <div className="flex items-end gap-1 h-32">
        {Array.from({ length: 24 }, (_, hour) => {
          const count = map.get(hour) ?? 0
          const ratio = count / max
          return (
            <div
              key={hour}
              className="flex-1 flex flex-col justify-end items-center group relative"
            >
              <div
                className="w-full bg-amber-500 rounded-t hover:bg-amber-600 transition-colors"
                style={{ height: `${Math.max(2, ratio * 100)}%`, minHeight: '2px' }}
                title={`${hour}시 — ${count}건`}
              />
              {count > 0 && (
                <div className="absolute -top-5 text-[10px] text-stone-700 font-medium hidden group-hover:block bg-white px-1 rounded">
                  {count}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="flex gap-1 mt-1 text-[10px] text-stone-500">
        {Array.from({ length: 24 }, (_, hour) => (
          <div key={hour} className="flex-1 text-center">
            {hour % 3 === 0 ? hour : ''}
          </div>
        ))}
      </div>
    </div>
  )
}

function DailyChart({
  daily,
}: {
  daily: Array<{ date: string; count: number }>
}) {
  if (daily.length === 0) {
    return <div className="text-sm text-stone-400 py-6 text-center">데이터 없음</div>
  }
  const max = Math.max(1, ...daily.map((d) => d.count))
  const total = daily.reduce((acc, d) => acc + d.count, 0)
  const avg = total / daily.length
  return (
    <div>
      <div className="flex items-end gap-1 h-32">
        {daily.map((d) => {
          const ratio = d.count / max
          return (
            <div
              key={d.date}
              className="flex-1 flex flex-col justify-end items-center group relative min-w-[4px]"
              title={`${d.date} — ${d.count}건`}
            >
              <div
                className="w-full bg-stone-700 rounded-t hover:bg-stone-900 transition-colors"
                style={{ height: `${Math.max(3, ratio * 100)}%` }}
              />
            </div>
          )
        })}
      </div>
      <div className="flex justify-between text-[11px] text-stone-500 mt-2">
        <span>{daily[0]?.date}</span>
        <span>일평균 {round1(avg)}건 / 합계 {total}건</span>
        <span>{daily[daily.length - 1]?.date}</span>
      </div>
    </div>
  )
}

function CrossTab({
  rows,
  emptyMessage,
}: {
  rows: Array<{
    label: string
    total: number
    items: Array<{ label: string; count: number }>
  }>
  emptyMessage: string
}) {
  if (rows.length === 0) {
    return <div className="text-sm text-stone-400 py-6 text-center">{emptyMessage}</div>
  }
  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.label} className="border border-stone-100 rounded p-3 bg-stone-50/50">
          <div className="flex items-baseline justify-between mb-2">
            <div className="font-medium text-stone-800">{row.label}</div>
            <div className="text-xs text-stone-500 tabular-nums">총 {row.total}건</div>
          </div>
          <div className="space-y-1.5">
            {row.items.map((it) => (
              <Bar
                key={it.label}
                label={it.label}
                count={it.count}
                total={row.total}
                tone="stone"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function daysSince(iso: string): number {
  const sent = new Date(iso.replace(' ', 'T') + 'Z').getTime()
  if (Number.isNaN(sent)) return 0
  return Math.max(0, Math.floor((Date.now() - sent) / 86_400_000))
}

function BroadcastStatus({
  lastBroadcast,
}: {
  lastBroadcast: AnalyticsResponse['lastBroadcast']
}) {
  // 운영자 발송 빈도 가시성 — 월 1~2회 권장 (가입자가 잊지 않을 빈도, 광고 피로도 적음)
  const RECOMMEND_MIN = 21 // 3주 미만이면 너무 잦음
  const RECOMMEND_MAX = 35 // 5주 초과면 너무 뜸함
  if (!lastBroadcast) {
    return (
      <div className="bg-white border border-amber-300 rounded-lg p-4 flex items-start gap-3">
        <div className="text-2xl" aria-hidden>📨</div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-stone-900">아직 일괄 발송 이력이 없습니다</div>
          <div className="text-xs text-stone-600 mt-1">
            상단 "📨 일괄 발송"으로 첫 메시지를 보낼 준비가 되어 있어요.
          </div>
        </div>
      </div>
    )
  }
  const days = daysSince(lastBroadcast.sentAt)
  const tone =
    days < RECOMMEND_MIN
      ? { color: 'text-blue-700', label: '최근 발송함', hint: '광고 피로도 주의 — 다음 발송은 약 3~5주 간격 권장' }
      : days <= RECOMMEND_MAX
        ? { color: 'text-green-700', label: '적정 간격', hint: '권장 발송 주기 안에 있어요' }
        : { color: 'text-amber-700', label: '발송 뜸함', hint: '신상품·이벤트 소식이 있으면 발송 권장' }
  return (
    <div className="bg-white border border-stone-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="text-2xl" aria-hidden>📨</div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-sm font-semibold text-stone-900">
              마지막 발송 후 {days}일
            </span>
            <span className={`text-xs font-medium ${tone.color}`}>· {tone.label}</span>
          </div>
          <div className="text-xs text-stone-500 mt-0.5">
            {lastBroadcast.sentAt} · 대상 {lastBroadcast.targetCount}명 / 발송 성공 {lastBroadcast.sentCount}명
          </div>
          <div className="text-xs text-stone-600 mt-2 italic line-clamp-2">
            "{lastBroadcast.messagePreview}…"
          </div>
          <div className="text-xs text-stone-500 mt-2">{tone.hint}</div>
        </div>
      </div>
    </div>
  )
}

function Insight({ data }: { data: AnalyticsResponse }) {
  if (data.total === 0) return null
  const lines: string[] = []

  if (data.byInterest.length > 0) {
    const top = data.byInterest[0]!
    lines.push(`최고 관심상품은 「${top.label}」으로 ${top.count}명 (${pct(top.share)})이 선택`)
  }
  if (data.byProvince.length > 0) {
    const top3 = data.byProvince.slice(0, 3)
    const sum = top3.reduce((a, b) => a + b.count, 0)
    const names = top3.map((p) => p.province).join('·')
    lines.push(
      `상위 3개 지역(${names})이 전체의 ${pct(sum / data.total)} 차지 — 마케팅·물류 우선순위`,
    )
  }
  if (data.byRef.length > 0) {
    const top = data.byRef[0]!
    lines.push(
      `유입경로 1위는 「${top.ref}」(${pct(top.share)}) — 광고 예산 배분 근거`,
    )
  }
  if (data.multiInterestRate > 0) {
    lines.push(
      `${pct(data.multiInterestRate)}가 2개 이상 상품에 관심 (1인당 평균 ${round1(data.avgInterestsPerLead)}개) — 번들·교차판매 가능성`,
    )
  }
  lines.push(
    `SMS 수신동의율 ${pct(data.smsConsentRate)} — 가능 발송 대상 ${Math.round(data.total * data.smsConsentRate)}명`,
  )

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="text-sm font-semibold text-amber-900 mb-2">
        영업 인사이트
      </div>
      <ul className="space-y-1 text-sm text-stone-800 list-disc list-inside">
        {lines.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  )
}

export function AnalyticsView({ token }: { token: string }) {
  const [data, setData] = useState<AnalyticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    const res = await fetchAnalytics(token)
    setLoading(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setData(res)
  }

  useEffect(() => {
    load()
  }, [])

  if (loading && !data) {
    return (
      <div className="bg-white border border-stone-200 rounded-lg p-12 text-center text-stone-500">
        분석 보고서 생성 중...
      </div>
    )
  }
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
        {error}
      </div>
    )
  }
  if (!data) return null

  if (data.total === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-lg p-12 text-center text-stone-500">
        아직 사전회원 데이터가 없어요. 가입자가 들어오면 자동으로 분석 보고서가 생성됩니다.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <BroadcastStatus lastBroadcast={data.lastBroadcast} />
      <Insight data={data} />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card title="전체 사전회원" value={`${data.total}명`} />
        <Card
          title="SMS 수신동의율"
          value={pct(data.smsConsentRate)}
          hint={`발송 가능 ${Math.round(data.total * data.smsConsentRate)}명`}
        />
        <Card
          title="다중관심자 비율"
          value={pct(data.multiInterestRate)}
          hint="2개 이상 상품 선택"
        />
        <Card
          title="1인당 평균 관심"
          value={`${round1(data.avgInterestsPerLead)}개`}
          hint="번들·교차판매 지표"
        />
      </section>

      <Section
        title="상품별 관심도"
        subtitle="우선 출시·생산 우선순위 결정 근거 (중복 선택 가능, 분모는 전체 가입자)"
      >
        <div className="space-y-2">
          {data.byInterest.map((it) => (
            <Bar key={it.key} label={it.label} count={it.count} share={it.share} />
          ))}
        </div>
      </Section>

      {data.topInterestPairs.length > 0 && (
        <Section
          title="상품 조합 TOP 5"
          subtitle="함께 선택된 상품 페어 — 번들 마케팅·세트 구성 후보"
        >
          <div className="space-y-2">
            {data.topInterestPairs.map((p, i) => (
              <Bar
                key={i}
                label={`${p.aLabel}  ×  ${p.bLabel}`}
                count={p.count}
                total={data.total}
                tone="green"
              />
            ))}
          </div>
        </Section>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <Section title="시도별 분포" subtitle="마케팅·물류 우선 지역">
          <div className="space-y-2">
            {data.byProvince.map((p) => (
              <Bar
                key={p.province}
                label={p.province}
                count={p.count}
                share={p.share}
                tone="blue"
              />
            ))}
          </div>
        </Section>

        <Section title="시군구 TOP 10" subtitle="카페 입점·오프라인 캠페인 우선순위">
          <div className="space-y-2">
            {data.byCity.map((c, i) => (
              <Bar
                key={c.city}
                label={`${i + 1}. ${c.city}`}
                count={c.count}
                total={data.total}
                tone="stone"
              />
            ))}
          </div>
        </Section>
      </div>

      <Section
        title="지역 × 상품 (상위 5개 시도)"
        subtitle="지역별 선호 상품 — 차별화 마케팅 메시지 근거"
      >
        <CrossTab
          rows={data.interestByProvince.map((p) => ({
            label: p.province,
            total: p.total,
            items: p.interests.map((i) => ({ label: i.label, count: i.count })),
          }))}
          emptyMessage="지역 데이터 없음"
        />
      </Section>

      <Section
        title="유입경로 × 상품"
        subtitle="채널별 고객 성향 — 광고 ROI·메시지 톤 결정"
      >
        <CrossTab
          rows={data.interestByRef.map((r) => ({
            label: r.ref,
            total: r.total,
            items: r.interests.map((i) => ({ label: i.label, count: i.count })),
          }))}
          emptyMessage="유입 데이터 없음"
        />
      </Section>

      <div className="grid md:grid-cols-2 gap-4">
        <Section title="일별 가입 추이" subtitle="최근 30일 — 모멘텀 / 캠페인 효과">
          <DailyChart daily={data.daily} />
        </Section>

        <Section title="시간대별 분포 (KST)" subtitle="SMS·알림톡 발송 최적 타이밍">
          <HourChart byHour={data.byHour} />
        </Section>
      </div>

      <div className="text-right">
        <button
          type="button"
          onClick={() => load()}
          disabled={loading}
          className="px-3 py-1.5 border border-stone-300 text-stone-700 text-sm rounded-md hover:bg-stone-100 disabled:opacity-50"
        >
          {loading ? '⟳ 갱신 중' : '↻ 보고서 새로고침'}
        </button>
      </div>
    </div>
  )
}
