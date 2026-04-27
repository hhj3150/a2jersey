import { useEffect, useState } from 'react'
import {
  fetchBroadcastPreview,
  fetchBroadcastHistory,
  sendBroadcast,
  type BroadcastPreview,
  type BroadcastResult,
  type BroadcastHistoryItem,
} from '../lib/admin'

interface Props {
  token: string
  onClose: () => void
  defaultRefFilter?: string
}

// EUC-KR 기준 바이트 (한국어 1글자 = 2바이트). 통신사 SMS/LMS 길이 판정과 일치.
// UTF-8 로 카운트하면 한국어 50% 과대계상 → LMS 오판정으로 4배 과금.
const eucKrBytes = (s: string): number => {
  let n = 0
  for (let i = 0; i < s.length; i++) {
    n += s.charCodeAt(i) <= 0x7f ? 1 : 2
  }
  return n
}

const COST_CONFIRM_THRESHOLD = 50_000

const formatDate = (iso: string): string => {
  const d = new Date(iso.replace(' ', 'T') + 'Z')
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false })
}

export function BroadcastModal({ token, onClose, defaultRefFilter }: Props) {
  const [tab, setTab] = useState<'compose' | 'history'>('compose')

  const [message, setMessage] = useState(
    '[송영신목장] 6월 1일 A2 저지 우유 정기구독이 오픈됩니다.\n네이버 스마트스토어에서 신청해 주세요.\n▶ https://smartstore.naver.com/a2milk_hay',
  )
  const [refFilter, setRefFilter] = useState(defaultRefFilter ?? '')
  const [smsConsentOnly, setSmsConsentOnly] = useState(true)
  const [testNumber, setTestNumber] = useState('')
  const [bypassNightCheck, setBypassNightCheck] = useState(false)
  const [forceDryRun, setForceDryRun] = useState(false)
  const [mode, setMode] = useState<'sms' | 'alimtalk'>('sms')

  const [preview, setPreview] = useState<BroadcastPreview | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<BroadcastResult | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [history, setHistory] = useState<BroadcastHistoryItem[] | null>(null)
  const [historyError, setHistoryError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setPreviewError(null)
    fetchBroadcastPreview(token, refFilter || undefined, smsConsentOnly).then((res) => {
      if (cancelled) return
      if (!res.ok) setPreviewError(res.error)
      else setPreview(res)
    })
    return () => {
      cancelled = true
    }
  }, [token, refFilter, smsConsentOnly])

  useEffect(() => {
    if (tab !== 'history') return
    setHistoryError(null)
    fetchBroadcastHistory(token).then((res) => {
      if (!res.ok) setHistoryError(res.error)
      else setHistory(res.items)
    })
  }, [tab, token])

  const targetCount = testNumber.trim() ? 1 : preview?.targetCount ?? 0
  const optOutNumber = preview?.optOutNumber ?? '080-000-0000'
  const previewText = `(광고) ${message.trim()}\n수신거부 ${optOutNumber}`
  const bytes = eucKrBytes(previewText)
  const isLMS = bytes > 90
  const unitCost = isLMS ? 40 : 10
  const estimatedCost = targetCount * unitCost
  const nightBlocked = preview ? !preview.daytimeKST && !bypassNightCheck : false
  const optOutMissing = preview ? !preview.optOutConfigured && !forceDryRun : false

  const canSubmit =
    !submitting &&
    message.trim().length > 0 &&
    targetCount > 0 &&
    !nightBlocked &&
    !optOutMissing

  const handleSubmit = async () => {
    if (!canSubmit) return
    const isReal = !forceDryRun
    const confirmText = testNumber.trim()
      ? `테스트 발송: ${testNumber} 1건${forceDryRun ? ' (드라이런)' : ''}`
      : `${targetCount}명에게 ${forceDryRun ? '드라이런 ' : '실제 '}발송합니다. 진행하시겠어요?\n예상 비용: ₩${estimatedCost.toLocaleString()}`
    if (!confirm(confirmText)) return

    // 비용 가드: 실제 발송이 임계값 초과 시 한 번 더 확인
    if (isReal && estimatedCost >= COST_CONFIRM_THRESHOLD) {
      const second = window.prompt(
        `⚠️ 큰 금액입니다. 예상 비용 ₩${estimatedCost.toLocaleString()} (${targetCount.toLocaleString()}명 × ₩${unitCost}).\n계속하려면 정확히 "발송확인" 이라고 입력하세요.`,
      )
      if (second?.trim() !== '발송확인') {
        alert('취소되었습니다.')
        return
      }
    }

    setSubmitting(true)
    setSubmitError(null)
    setResult(null)
    const res = await sendBroadcast(token, {
      message,
      refFilter: refFilter || undefined,
      smsConsentOnly,
      testNumber: testNumber || undefined,
      dryRun: forceDryRun || undefined,
      bypassNightCheck,
      mode,
    })
    setSubmitting(false)
    if ('historyId' in res) {
      setResult(res)
    } else {
      setSubmitError(res.error)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-stone-900">📨 일괄 메시지 발송</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="px-6 pt-3 border-b border-stone-200">
          <div className="flex gap-4 text-sm">
            <button
              type="button"
              onClick={() => setTab('compose')}
              className={`pb-2 -mb-px border-b-2 ${tab === 'compose' ? 'border-amber-600 text-amber-700 font-medium' : 'border-transparent text-stone-500'}`}
            >
              발송
            </button>
            <button
              type="button"
              onClick={() => setTab('history')}
              className={`pb-2 -mb-px border-b-2 ${tab === 'history' ? 'border-amber-600 text-amber-700 font-medium' : 'border-transparent text-stone-500'}`}
            >
              발송 이력
            </button>
          </div>
        </div>

        {tab === 'compose' ? (
          <div className="p-6 space-y-4">
            {preview && !preview.solapiConfigured && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded p-3 text-sm">
                ⚠️ 솔라피 환경변수가 설정되지 않았습니다. 발송 시도하면 자동으로 드라이런 모드로 처리됩니다.
              </div>
            )}
            {preview?.serverDryRun && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded p-3 text-sm">
                🧪 서버에 <code>BROADCAST_DRY_RUN=true</code> 설정. 모든 발송이 드라이런(시뮬레이션). 실제 발송은 환경변수 해제 후 가능.
              </div>
            )}
            {nightBlocked && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3 text-sm">
                🌙 야간 시간(KST 21:00 ~ 08:00) — 마케팅 메시지 발송 차단. 긴급 시 야간 발송 우회 체크.
              </div>
            )}
            {optOutMissing && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3 text-sm">
                🚫 OPT_OUT_NUMBER 환경변수 미설정 — 실제 발송 차단.
                <br />
                정통망법 §50 위반 방지를 위해 Solapi 080 부가서비스 신청 후 Railway 환경변수에 등록해주세요.
                <br />
                (드라이런 모드는 무관하게 사용 가능합니다)
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1">발송 채널</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode('sms')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm border ${mode === 'sms' ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-300 text-stone-700 bg-white'}`}
                >
                  SMS / LMS
                </button>
                <button
                  type="button"
                  onClick={() => preview?.alimtalkConfigured && setMode('alimtalk')}
                  disabled={!preview?.alimtalkConfigured}
                  className={`flex-1 px-3 py-2 rounded-md text-sm border ${mode === 'alimtalk' ? 'bg-yellow-400 text-stone-900 border-yellow-400' : 'border-stone-300 text-stone-700 bg-white'} disabled:opacity-40 disabled:cursor-not-allowed`}
                  title={preview?.alimtalkConfigured ? '카카오 알림톡 발송' : '카카오 채널 + 템플릿 등록 필요 (KAKAO_PFID, KAKAO_TEMPLATE_ID)'}
                >
                  💬 카카오 알림톡 {!preview?.alimtalkConfigured && '(미설정)'}
                </button>
              </div>
              {mode === 'alimtalk' && (
                <p className="mt-1 text-xs text-stone-500">
                  알림톡: 메시지 본문이 사전 승인된 템플릿과 정확히 일치해야 합니다. 카톡 미수신·차단 시 LMS로 자동 폴백.
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1">메시지 본문</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm font-mono"
                placeholder="발송할 메시지를 입력하세요. 자동으로 (광고) prefix와 수신거부 안내가 추가됩니다."
              />
              <div className="flex justify-between text-xs text-stone-500 mt-1">
                <span>실제 발송 본문에는 (광고) prefix · 수신거부 {optOutNumber} 자동 추가</span>
                <span>{bytes} bytes (EUC-KR) · {isLMS ? 'LMS (₩40)' : 'SMS (₩10)'}</span>
              </div>
              <details className="mt-2 text-xs text-stone-600">
                <summary className="cursor-pointer">실제 발송 본문 미리보기</summary>
                <pre className="mt-2 p-2 bg-stone-50 border border-stone-200 rounded whitespace-pre-wrap font-mono">{previewText}</pre>
              </details>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">유입 필터</label>
                <input
                  type="text"
                  value={refFilter}
                  onChange={(e) => setRefFilter(e.target.value)}
                  placeholder="예: cafe (비우면 전체)"
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">테스트 번호</label>
                <input
                  type="tel"
                  value={testNumber}
                  onChange={(e) => setTestNumber(e.target.value)}
                  placeholder="01012345678 (입력 시 1건만)"
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-md text-sm"
                />
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded p-3 text-sm space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={smsConsentOnly}
                  onChange={(e) => setSmsConsentOnly(e.target.checked)}
                />
                <span>마케팅 수신 동의자만 (sms_consent=true) — <strong>법적 권장</strong></span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={forceDryRun}
                  onChange={(e) => setForceDryRun(e.target.checked)}
                />
                <span>드라이런 (실제 발송 안 함, 이력만 기록)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={bypassNightCheck}
                  onChange={(e) => setBypassNightCheck(e.target.checked)}
                />
                <span>야간 발송 우회 (KST 21~08시 강제 발송)</span>
              </label>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm">
              <div className="flex justify-between"><span>발송 대상</span><strong>{targetCount.toLocaleString()}명</strong></div>
              <div className="flex justify-between"><span>건당 비용</span><span>₩{unitCost} ({isLMS ? 'LMS' : 'SMS'})</span></div>
              <div className="flex justify-between"><span>예상 총 비용</span><strong>₩{estimatedCost.toLocaleString()}</strong></div>
              {previewError && <p className="text-red-700 mt-2">{previewError}</p>}
            </div>

            {result && (
              <div className={`border rounded p-3 text-sm ${result.failedCount === 0 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-orange-50 border-orange-200 text-orange-800'}`}>
                <p className="font-medium">{result.dryRun ? '🧪 드라이런 완료' : '✅ 발송 완료'}</p>
                <ul className="mt-2 space-y-0.5 text-xs">
                  <li>이력 ID: #{result.historyId}</li>
                  <li>대상: {result.targetCount}건</li>
                  <li>성공: {result.sentCount}건 / 실패: {result.failedCount}건</li>
                  {result.cost !== undefined && <li>실제 차감 비용: ₩{result.cost.toLocaleString()}</li>}
                  {result.groupId && <li>솔라피 그룹: {result.groupId}</li>}
                  {result.errorSummary && <li className="text-red-700">오류: {result.errorSummary}</li>}
                </ul>
              </div>
            )}

            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3 text-sm">{submitError}</div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-stone-300 text-stone-700 rounded-md hover:bg-stone-50"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
              >
                {submitting ? '발송 중...' : forceDryRun ? '드라이런 실행' : '발송 시작'}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {historyError && <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3 text-sm mb-3">{historyError}</div>}
            {!history && !historyError && <div className="text-stone-500 text-sm">불러오는 중...</div>}
            {history && history.length === 0 && <div className="text-stone-500 text-sm">발송 이력이 없습니다.</div>}
            {history && history.length > 0 && (
              <ul className="space-y-3 text-sm">
                {history.map((h) => (
                  <li key={h.id} className="border border-stone-200 rounded p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium tabular-nums">#{h.id} · {formatDate(h.sentAt)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${h.dryRun ? 'bg-blue-100 text-blue-800' : h.failedCount === 0 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                        {h.dryRun ? '드라이런' : h.failedCount === 0 ? '성공' : '일부 실패'}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 mb-2">
                      {h.targetFilter ? `필터: ${h.targetFilter} · ` : ''}
                      대상 {h.targetCount} / 성공 {h.sentCount} / 실패 {h.failedCount}
                      {h.cost !== null ? ` · ₩${h.cost.toLocaleString()}` : ''}
                    </div>
                    <pre className="text-xs bg-stone-50 border border-stone-200 rounded p-2 whitespace-pre-wrap font-mono">{h.message}</pre>
                    {h.errorSummary && <p className="mt-2 text-xs text-red-700">{h.errorSummary}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
