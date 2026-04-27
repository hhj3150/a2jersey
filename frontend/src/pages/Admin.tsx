import { useEffect, useState, type FormEvent } from 'react'
import {
  buildBasicToken,
  clearAdminToken,
  deleteLead,
  downloadCsv,
  fetchLeads,
  getAdminToken,
  patchLead,
  setAdminToken,
  verifyToken,
  type AdminLead,
  type LeadStatus,
  type LeadsResponse,
} from '../lib/admin'
import { interestOptions } from '../lib/schemas'
import { BroadcastModal } from './BroadcastModal'

const STATUS_OPTIONS: { value: LeadStatus; label: string; tone: string }[] = [
  { value: 'new',       label: '신규',     tone: 'bg-stone-100 text-stone-700' },
  { value: 'contacted', label: '연락함',   tone: 'bg-blue-100 text-blue-800' },
  { value: 'converted', label: '전환',     tone: 'bg-green-100 text-green-800' },
  { value: 'rejected',  label: '거절',     tone: 'bg-red-100 text-red-700' },
]

const interestLabel = (k: string): string =>
  interestOptions.find((o) => o.value === k)?.label ?? k

const formatPhone = (raw: string): string => {
  const d = raw.replace(/\D/g, '')
  if (d.length === 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`
  return raw
}

const formatDate = (iso: string): string => {
  const d = new Date(iso.replace(' ', 'T') + 'Z')
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false })
}

function LoginScreen({ onSuccess }: { onSuccess: (token: string) => void }) {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!userId.trim() || !password.trim()) return
    setSubmitting(true)
    setError(null)
    const token = buildBasicToken(userId.trim(), password)
    const ok = await verifyToken(token)
    setSubmitting(false)
    if (!ok) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다')
      return
    }
    setAdminToken(token)
    onSuccess(token)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold text-stone-900">관리자 로그인</h1>
        <p className="text-sm text-stone-500">a2jersey 사전회원 관리</p>
        <div className="space-y-3">
          <input
            type="text"
            autoFocus
            autoComplete="username"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="아이디"
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !userId.trim() || !password.trim()}
          className="w-full py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800 disabled:opacity-50"
        >
          {submitting ? '확인 중...' : '로그인'}
        </button>
      </form>
    </div>
  )
}

function LeadsTable({
  items,
  onDelete,
  onPatch,
}: {
  items: AdminLead[]
  onDelete: (id: number) => void
  onPatch: (id: number, patch: { memo?: string | null; status?: LeadStatus }) => void
}) {
  if (items.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-lg p-12 text-center text-stone-500">
        조건에 맞는 가입자가 없습니다.
      </div>
    )
  }

  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-stone-50 text-stone-700">
          <tr className="whitespace-nowrap">
            <th className="px-3 py-2 text-left">ID</th>
            <th className="px-3 py-2 text-left">등록일시</th>
            <th className="px-3 py-2 text-left">이름</th>
            <th className="px-3 py-2 text-left">휴대폰</th>
            <th className="px-3 py-2 text-left">우편번호</th>
            <th className="px-3 py-2 text-left">주소</th>
            <th className="px-3 py-2 text-left">관심상품</th>
            <th className="px-3 py-2 text-center">SMS</th>
            <th className="px-3 py-2 text-left">유입</th>
            <th className="px-3 py-2 text-left">상태</th>
            <th className="px-3 py-2 text-left">메모</th>
            <th className="px-3 py-2 text-center">삭제</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.id} className="border-t border-stone-100 hover:bg-stone-50 align-top">
              <td className="px-3 py-2 text-stone-500 tabular-nums">{row.id}</td>
              <td className="px-3 py-2 tabular-nums whitespace-nowrap">{formatDate(row.createdAt)}</td>
              <td className="px-3 py-2 font-medium whitespace-nowrap">{row.name}</td>
              <td className="px-3 py-2 tabular-nums whitespace-nowrap">{formatPhone(row.phone)}</td>
              <td className="px-3 py-2 tabular-nums whitespace-nowrap">{row.postcode ?? '-'}</td>
              <td className="px-3 py-2 min-w-[260px] text-stone-700">
                {row.addressRoad ? (
                  <>
                    <div>{row.addressRoad}</div>
                    {row.addressDetail && (
                      <div className="text-stone-500 text-xs">{row.addressDetail}</div>
                    )}
                    {row.addressJibun && (
                      <div className="text-stone-400 text-xs mt-0.5">지번: {row.addressJibun}</div>
                    )}
                  </>
                ) : (
                  <span className="text-stone-400">{row.region || '-'}</span>
                )}
              </td>
              <td className="px-3 py-2 text-stone-600 min-w-[180px]">
                {row.interests.map(interestLabel).join(' · ')}
              </td>
              <td className="px-3 py-2 text-center">
                {row.smsConsent ? (
                  <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">Y</span>
                ) : (
                  <span className="inline-block px-2 py-0.5 bg-stone-100 text-stone-500 text-xs rounded">N</span>
                )}
              </td>
              <td className="px-3 py-2 text-stone-500">{row.ref}</td>
              <td className="px-3 py-2">
                <select
                  value={(row.status as LeadStatus) || 'new'}
                  onChange={(e) => onPatch(row.id, { status: e.target.value as LeadStatus })}
                  className={`text-xs px-2 py-1 rounded border-0 ${
                    STATUS_OPTIONS.find((s) => s.value === row.status)?.tone ??
                    'bg-stone-100 text-stone-700'
                  }`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-3 py-2 min-w-[180px]">
                <button
                  type="button"
                  onClick={() => {
                    const next = window.prompt('메모 (최대 500자, 빈 값으로 두면 삭제)', row.memo ?? '')
                    if (next === null) return
                    const trimmed = next.trim()
                    onPatch(row.id, { memo: trimmed || null })
                  }}
                  className="text-left text-xs text-stone-700 hover:text-stone-900 hover:underline w-full"
                  title="클릭해서 편집"
                >
                  {row.memo ? (
                    <span className="line-clamp-2">{row.memo}</span>
                  ) : (
                    <span className="text-stone-400">+ 메모 추가</span>
                  )}
                </button>
              </td>
              <td className="px-3 py-2 text-center">
                <button
                  type="button"
                  onClick={() => onDelete(row.id)}
                  className="text-xs text-red-600 hover:text-red-800 hover:underline"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [data, setData] = useState<LeadsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const [pageSize] = useState(50)
  const [searchInput, setSearchInput] = useState('')
  const [q, setQ] = useState('')
  const [refFilter, setRefFilter] = useState('')

  const [downloading, setDownloading] = useState(false)
  const [showBroadcast, setShowBroadcast] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    const res = await fetchLeads({ token, page, pageSize, q, ref: refFilter })
    setLoading(false)
    if (!res.ok) {
      setError(res.error)
      if (res.error === 'Unauthorized') onLogout()
      return
    }
    setData(res)
  }

  useEffect(() => {
    load()
  }, [page, q, refFilter])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    setPage(1)
    setQ(searchInput.trim())
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setQ('')
    setRefFilter('')
    setPage(1)
  }

  const handleDelete = async (id: number) => {
    if (!confirm(`ID ${id} 가입자를 정말 삭제하시겠어요?\n이 작업은 되돌릴 수 없습니다.`)) return
    const res = await deleteLead(token, id)
    if (!res.ok) {
      alert(`삭제 실패: ${res.error}`)
      return
    }
    await load()
  }

  const handlePatch = async (
    id: number,
    patch: { memo?: string | null; status?: LeadStatus },
  ) => {
    setData((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
          }
        : prev,
    )
    const res = await patchLead(token, id, patch)
    if (!res.ok) {
      alert(`업데이트 실패: ${res.error}`)
      await load()
    }
  }

  const handleDownloadCsv = async () => {
    setDownloading(true)
    const err = await downloadCsv(token)
    setDownloading(false)
    if (err) alert(`CSV 다운로드 실패: ${err.error}`)
  }

  const handleLogout = () => {
    clearAdminToken()
    onLogout()
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-stone-900">a2jersey 관리자</h1>
            <p className="text-xs text-stone-500">사전회원 모집 대시보드</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowBroadcast(true)}
              className="px-3 py-1.5 bg-stone-900 text-white text-sm rounded-md hover:bg-stone-800"
            >
              📨 일괄 발송
            </button>
            <button
              type="button"
              onClick={handleDownloadCsv}
              disabled={downloading}
              className="px-3 py-1.5 bg-amber-600 text-white text-sm rounded-md hover:bg-amber-700 disabled:opacity-50"
            >
              {downloading ? '내려받는 중...' : 'CSV 다운로드'}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 border border-stone-300 text-stone-700 text-sm rounded-md hover:bg-stone-100"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-4">
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white border border-stone-200 rounded-lg p-4">
            <div className="text-xs text-stone-500">전체 가입자</div>
            <div className="text-2xl font-bold tabular-nums">{data?.total ?? '-'}</div>
          </div>
          {data?.refStats.slice(0, 3).map((s) => (
            <div key={s.ref} className="bg-white border border-stone-200 rounded-lg p-4">
              <div className="text-xs text-stone-500">유입: {s.ref}</div>
              <div className="text-2xl font-bold tabular-nums">{s.c}</div>
            </div>
          ))}
        </section>

        <section className="bg-white border border-stone-200 rounded-lg p-4 flex flex-wrap items-end gap-3">
          <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-[240px]">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="이름·전화·지역 검색"
              className="flex-1 px-3 py-1.5 border border-stone-300 rounded-md text-sm"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-stone-900 text-white text-sm rounded-md hover:bg-stone-800"
            >
              검색
            </button>
          </form>
          <div className="flex items-center gap-2">
            <select
              value={refFilter}
              onChange={(e) => {
                setRefFilter(e.target.value)
                setPage(1)
              }}
              className="px-3 py-1.5 border border-stone-300 rounded-md text-sm"
            >
              <option value="">전체 유입</option>
              {data?.refStats.map((s) => (
                <option key={s.ref} value={s.ref}>
                  {s.ref} ({s.c})
                </option>
              ))}
            </select>
            {(q || refFilter) && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-3 py-1.5 border border-stone-300 text-stone-700 text-sm rounded-md hover:bg-stone-100"
              >
                초기화
              </button>
            )}
          </div>
        </section>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white border border-stone-200 rounded-lg p-12 text-center text-stone-500">
            불러오는 중...
          </div>
        ) : data ? (
          <>
            <LeadsTable items={data.items} onDelete={handleDelete} onPatch={handlePatch} />

            <div className="flex items-center justify-between text-sm">
              <div className="text-stone-500">
                {data.total}건 중 {(data.page - 1) * data.pageSize + 1}~
                {Math.min(data.page * data.pageSize, data.total)}건
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 border border-stone-300 rounded-md disabled:opacity-40"
                >
                  이전
                </button>
                <span className="tabular-nums">
                  {data.page} / {data.totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= data.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 border border-stone-300 rounded-md disabled:opacity-40"
                >
                  다음
                </button>
              </div>
            </div>
          </>
        ) : null}
      </main>

      {showBroadcast && (
        <BroadcastModal
          token={token}
          onClose={() => setShowBroadcast(false)}
          defaultRefFilter={refFilter || undefined}
        />
      )}
    </div>
  )
}

export function Admin() {
  const [token, setToken] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    document.title = 'a2jersey 관리자'
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'robots'
      document.head.appendChild(meta)
    }
    meta.content = 'noindex, nofollow, noarchive'

    const stored = getAdminToken()
    if (!stored) {
      setChecked(true)
      return
    }
    verifyToken(stored).then((ok) => {
      if (ok) setToken(stored)
      else clearAdminToken()
      setChecked(true)
    })
  }, [])

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-500">
        확인 중...
      </div>
    )
  }

  if (!token) return <LoginScreen onSuccess={setToken} />
  return <Dashboard token={token} onLogout={() => setToken(null)} />
}
