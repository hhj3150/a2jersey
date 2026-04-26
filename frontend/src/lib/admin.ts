import { env } from '../env'
import type { Interest } from './schemas'

const TOKEN_KEY = 'a2jersey:adminToken'

export const getAdminToken = (): string | null =>
  typeof window === 'undefined' ? null : sessionStorage.getItem(TOKEN_KEY)

export const setAdminToken = (token: string): void => {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export const clearAdminToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY)
}

export const buildBasicToken = (user: string, password: string): string => {
  const raw = `${user}:${password}`
  const utf8 = new TextEncoder().encode(raw)
  let bin = ''
  for (let i = 0; i < utf8.length; i++) bin += String.fromCharCode(utf8[i]!)
  return btoa(bin)
}

export interface AdminLead {
  id: number
  name: string
  phone: string
  region: string
  postcode: string | null
  addressRoad: string | null
  addressJibun: string | null
  addressDetail: string | null
  interests: Interest[]
  smsConsent: boolean
  ref: string
  status: string
  memo: string | null
  createdAt: string
}

export interface LeadsResponse {
  ok: true
  page: number
  pageSize: number
  total: number
  totalPages: number
  items: AdminLead[]
  refStats: Array<{ ref: string; c: number }>
}

export interface AdminError {
  ok: false
  error: string
}

const headers = (token: string): HeadersInit => ({
  Authorization: `Basic ${token}`,
})

export async function fetchLeads(params: {
  token: string
  page: number
  pageSize: number
  q?: string
  ref?: string
}): Promise<LeadsResponse | AdminError> {
  const qs = new URLSearchParams()
  qs.set('page', String(params.page))
  qs.set('pageSize', String(params.pageSize))
  if (params.q) qs.set('q', params.q)
  if (params.ref) qs.set('ref', params.ref)

  try {
    const res = await fetch(`${env.apiUrl}/api/admin/leads?${qs.toString()}`, {
      headers: headers(params.token),
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.error('[fetchLeads] error:', err)
    return { ok: false, error: '네트워크 오류' }
  }
}

export async function deleteLead(
  token: string,
  id: number,
): Promise<{ ok: true; deletedId: number } | AdminError> {
  try {
    const res = await fetch(`${env.apiUrl}/api/admin/leads/${id}`, {
      method: 'DELETE',
      headers: headers(token),
    })
    return await res.json()
  } catch (err) {
    console.error('[deleteLead] error:', err)
    return { ok: false, error: '네트워크 오류' }
  }
}

export async function downloadCsv(token: string): Promise<AdminError | null> {
  try {
    const res = await fetch(`${env.apiUrl}/api/admin/export.csv`, {
      headers: headers(token),
    })
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as AdminError | null
      return data || { ok: false, error: `HTTP ${res.status}` }
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const today = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = `a2jersey-leads-${today}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    return null
  } catch (err) {
    console.error('[downloadCsv] error:', err)
    return { ok: false, error: '네트워크 오류' }
  }
}

export async function verifyToken(token: string): Promise<boolean> {
  const res = await fetchLeads({ token, page: 1, pageSize: 1 })
  return res.ok === true
}

export interface BroadcastPreview {
  ok: true
  targetCount: number
  daytimeKST: boolean
  solapiConfigured: boolean
  alimtalkConfigured: boolean
  serverDryRun: boolean
}

export async function fetchBroadcastPreview(
  token: string,
  refFilter?: string,
  smsConsentOnly = true,
): Promise<BroadcastPreview | AdminError> {
  const qs = new URLSearchParams()
  if (refFilter) qs.set('ref', refFilter)
  qs.set('smsConsentOnly', String(smsConsentOnly))
  try {
    const res = await fetch(
      `${env.apiUrl}/api/admin/broadcast/preview?${qs.toString()}`,
      { headers: headers(token) },
    )
    return await res.json()
  } catch (err) {
    console.error('[fetchBroadcastPreview] error:', err)
    return { ok: false, error: '네트워크 오류' }
  }
}

export interface BroadcastResult {
  ok: boolean
  historyId: number
  dryRun: boolean
  targetCount: number
  sentCount: number
  failedCount: number
  cost?: number
  groupId?: string
  errorSummary?: string
  finalText: string
}

export interface BroadcastInput {
  message: string
  refFilter?: string
  smsConsentOnly?: boolean
  testNumber?: string
  dryRun?: boolean
  bypassNightCheck?: boolean
  skipAdPrefix?: boolean
  skipOptOut?: boolean
  mode?: 'sms' | 'alimtalk'
}

export async function sendBroadcast(
  token: string,
  input: BroadcastInput,
): Promise<BroadcastResult | AdminError> {
  try {
    const res = await fetch(`${env.apiUrl}/api/admin/broadcast`, {
      method: 'POST',
      headers: { ...headers(token), 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    return await res.json()
  } catch (err) {
    console.error('[sendBroadcast] error:', err)
    return { ok: false, error: '네트워크 오류' }
  }
}

export interface BroadcastHistoryItem {
  id: number
  sentAt: string
  sender: string
  message: string
  targetFilter: string | null
  targetCount: number
  sentCount: number
  failedCount: number
  cost: number | null
  dryRun: boolean
  groupId: string | null
  errorSummary: string | null
}

export async function fetchBroadcastHistory(
  token: string,
): Promise<{ ok: true; items: BroadcastHistoryItem[] } | AdminError> {
  try {
    const res = await fetch(`${env.apiUrl}/api/admin/broadcasts`, {
      headers: headers(token),
    })
    return await res.json()
  } catch (err) {
    console.error('[fetchBroadcastHistory] error:', err)
    return { ok: false, error: '네트워크 오류' }
  }
}
