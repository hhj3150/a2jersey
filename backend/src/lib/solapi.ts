// Solapi (kr) Bulk SMS / 알림톡 adapter.
// Docs: https://developers.solapi.com/references/messages/sendMany
//
// Auth: HMAC-SHA256 over `${date}${salt}` keyed with API secret.
// We send up to 100 messages per request (Solapi v4 limit).
import { createHmac, randomBytes } from 'node:crypto'

const ENDPOINT = 'https://api.solapi.com/messages/v4/send-many/detail'
const BATCH_LIMIT = 100

export interface OutboundMessage {
  to: string
  text: string
}

export interface SolapiResult {
  ok: boolean
  groupId?: string
  total: number
  registered: number
  failed: number
  failedDetails: Array<{ to: string; statusCode?: string; statusMessage?: string }>
  cost?: number
  raw?: unknown
}

export interface SolapiConfig {
  apiKey?: string
  apiSecret?: string
  from?: string
  // 카카오 알림톡 (선택). 모두 채워지면 sendBulkAlimtalk 사용 가능.
  kakaoPfId?: string
  kakaoTemplateId?: string
}

export const isAlimtalkConfigured = (cfg: SolapiConfig): boolean =>
  Boolean(cfg.apiKey && cfg.apiSecret && cfg.kakaoPfId && cfg.kakaoTemplateId)

const buildAuthHeader = (apiKey: string, apiSecret: string): string => {
  const date = new Date().toISOString()
  const salt = randomBytes(32).toString('hex')
  const signature = createHmac('sha256', apiSecret).update(`${date}${salt}`).digest('hex')
  return `HMAC-SHA256 ApiKey=${apiKey}, Date=${date}, salt=${salt}, signature=${signature}`
}

export const isSolapiConfigured = (cfg: SolapiConfig): boolean =>
  Boolean(cfg.apiKey && cfg.apiSecret && cfg.from)

const chunk = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export async function sendBulkSms(
  cfg: SolapiConfig,
  messages: OutboundMessage[],
): Promise<SolapiResult> {
  if (!isSolapiConfigured(cfg)) {
    return {
      ok: false,
      total: messages.length,
      registered: 0,
      failed: messages.length,
      failedDetails: messages.map((m) => ({ to: m.to, statusMessage: 'Solapi not configured' })),
    }
  }
  if (messages.length === 0) {
    return { ok: true, total: 0, registered: 0, failed: 0, failedDetails: [] }
  }

  const apiKey = cfg.apiKey!
  const apiSecret = cfg.apiSecret!
  const from = cfg.from!

  let registered = 0
  let failed = 0
  let cost = 0
  const failedDetails: SolapiResult['failedDetails'] = []
  let lastGroupId: string | undefined
  let lastRaw: unknown

  for (const part of chunk(messages, BATCH_LIMIT)) {
    const body = {
      messages: part.map((m) => ({
        to: m.to,
        from,
        text: m.text,
        type: Buffer.byteLength(m.text, 'utf8') > 90 ? 'LMS' : 'SMS',
      })),
    }
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: buildAuthHeader(apiKey, apiSecret),
        },
        body: JSON.stringify(body),
      })
      const data = (await res.json()) as Record<string, unknown>
      lastRaw = data

      if (!res.ok) {
        failed += part.length
        for (const m of part) {
          failedDetails.push({
            to: m.to,
            statusCode: typeof data?.errorCode === 'string' ? (data.errorCode as string) : `HTTP_${res.status}`,
            statusMessage:
              typeof data?.errorMessage === 'string'
                ? (data.errorMessage as string)
                : (data?.message as string) || `HTTP ${res.status}`,
          })
        }
        continue
      }

      const groupInfo = data?.groupInfo as Record<string, unknown> | undefined
      const groupId = groupInfo?._id as string | undefined
      if (groupId) lastGroupId = groupId

      const count = (groupInfo?.count as Record<string, number> | undefined) || {}
      registered += Number(count.registeredSuccess ?? part.length)
      const failCount = Number(count.registeredFailed ?? 0)
      failed += failCount

      const balance = groupInfo?.point as Record<string, number> | undefined
      if (balance && typeof balance.sum === 'number') cost += balance.sum

      const failedList = (data?.failedMessageList as Array<Record<string, unknown>>) || []
      for (const f of failedList) {
        failedDetails.push({
          to: String(f.to ?? ''),
          statusCode: f.statusCode as string | undefined,
          statusMessage: f.statusMessage as string | undefined,
        })
      }
    } catch (err) {
      failed += part.length
      const msg = err instanceof Error ? err.message : 'Network error'
      for (const m of part) {
        failedDetails.push({ to: m.to, statusMessage: msg })
      }
    }
  }

  return {
    ok: failed === 0,
    groupId: lastGroupId,
    total: messages.length,
    registered,
    failed,
    failedDetails,
    cost: cost || undefined,
    raw: lastRaw,
  }
}

// Send via Kakao 알림톡 (ATA). Falls back to SMS/LMS when Kakao 발송 실패.
// Requires solapi 채널 등록 + 사전 승인된 템플릿.
export async function sendBulkAlimtalk(
  cfg: SolapiConfig,
  messages: OutboundMessage[],
  fallback: 'NONE' | 'SMS' | 'LMS' = 'LMS',
): Promise<SolapiResult> {
  if (!isAlimtalkConfigured(cfg)) {
    return {
      ok: false,
      total: messages.length,
      registered: 0,
      failed: messages.length,
      failedDetails: messages.map((m) => ({
        to: m.to,
        statusMessage: 'Alimtalk not configured (KAKAO_PFID / KAKAO_TEMPLATE_ID 누락)',
      })),
    }
  }
  if (messages.length === 0) {
    return { ok: true, total: 0, registered: 0, failed: 0, failedDetails: [] }
  }

  const apiKey = cfg.apiKey!
  const apiSecret = cfg.apiSecret!
  const from = cfg.from!
  const pfId = cfg.kakaoPfId!
  const templateId = cfg.kakaoTemplateId!

  let registered = 0
  let failed = 0
  let cost = 0
  const failedDetails: SolapiResult['failedDetails'] = []
  let lastGroupId: string | undefined
  let lastRaw: unknown

  for (const part of chunk(messages, BATCH_LIMIT)) {
    const body = {
      messages: part.map((m) => ({
        to: m.to,
        from,
        text: m.text,
        type: 'ATA',
        kakaoOptions: {
          pfId,
          templateId,
          disableSms: fallback === 'NONE',
        },
      })),
    }
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: buildAuthHeader(apiKey, apiSecret),
        },
        body: JSON.stringify(body),
      })
      const data = (await res.json()) as Record<string, unknown>
      lastRaw = data

      if (!res.ok) {
        failed += part.length
        for (const m of part) {
          failedDetails.push({
            to: m.to,
            statusCode: typeof data?.errorCode === 'string' ? (data.errorCode as string) : `HTTP_${res.status}`,
            statusMessage:
              typeof data?.errorMessage === 'string'
                ? (data.errorMessage as string)
                : (data?.message as string) || `HTTP ${res.status}`,
          })
        }
        continue
      }

      const groupInfo = data?.groupInfo as Record<string, unknown> | undefined
      const groupId = groupInfo?._id as string | undefined
      if (groupId) lastGroupId = groupId

      const count = (groupInfo?.count as Record<string, number> | undefined) || {}
      registered += Number(count.registeredSuccess ?? part.length)
      const failCount = Number(count.registeredFailed ?? 0)
      failed += failCount

      const balance = groupInfo?.point as Record<string, number> | undefined
      if (balance && typeof balance.sum === 'number') cost += balance.sum

      const failedList = (data?.failedMessageList as Array<Record<string, unknown>>) || []
      for (const f of failedList) {
        failedDetails.push({
          to: String(f.to ?? ''),
          statusCode: f.statusCode as string | undefined,
          statusMessage: f.statusMessage as string | undefined,
        })
      }
    } catch (err) {
      failed += part.length
      const msg = err instanceof Error ? err.message : 'Network error'
      for (const m of part) {
        failedDetails.push({ to: m.to, statusMessage: msg })
      }
    }
  }

  return {
    ok: failed === 0,
    groupId: lastGroupId,
    total: messages.length,
    registered,
    failed,
    failedDetails,
    cost: cost || undefined,
    raw: lastRaw,
  }
}

const KST_OFFSET_MIN = 9 * 60

export const isWithinDaytimeKST = (now: Date = new Date()): boolean => {
  const utcMin = now.getUTCHours() * 60 + now.getUTCMinutes()
  const kstMin = (utcMin + KST_OFFSET_MIN) % (24 * 60)
  return kstMin >= 8 * 60 && kstMin < 21 * 60
}

const AD_PREFIX = '(광고)'
const OPT_OUT_SUFFIX = '\n수신거부 080-080-0808'

export const composeMarketingText = (
  body: string,
  opts?: { skipAdPrefix?: boolean; skipOptOut?: boolean },
): string => {
  const parts: string[] = []
  if (!opts?.skipAdPrefix && !body.trim().startsWith(AD_PREFIX)) parts.push(AD_PREFIX)
  parts.push(body.trim())
  if (!opts?.skipOptOut && !body.includes('수신거부')) parts.push(OPT_OUT_SUFFIX.trim())
  return parts.join(' ').slice(0, 2000)
}
