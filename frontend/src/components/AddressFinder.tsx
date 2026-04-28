import { useCallback, useEffect, useRef, useState } from 'react'

const SDK_URL = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
const SDK_FLAG = '__a2jersey_postcode_loaded'

interface DaumPostcodeData {
  zonecode: string
  roadAddress: string
  jibunAddress: string
  autoJibunAddress?: string
  buildingName?: string
  apartment?: 'Y' | 'N'
}

interface DaumPostcodeInstance {
  open(): void
  embed(element: HTMLElement): void
}

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void
        onclose?: () => void
        animation?: boolean
        width?: string | number
        height?: string | number
      }) => DaumPostcodeInstance
    }
    [SDK_FLAG]?: Promise<void>
  }
}

const loadSdk = (): Promise<void> => {
  if (window.daum?.Postcode) return Promise.resolve()
  if (window[SDK_FLAG]) return window[SDK_FLAG] as Promise<void>

  const promise = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SDK_URL
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('주소 검색 SDK 로드 실패'))
    document.head.appendChild(s)
  })
  window[SDK_FLAG] = promise
  return promise
}

export interface AddressValue {
  postcode: string
  roadAddress: string
  jibunAddress: string
}

interface AddressFinderProps {
  value: AddressValue | null
  onChange: (v: AddressValue) => void
  error?: string
}

export function AddressFinder({ value, onChange, error }: AddressFinderProps) {
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const embedRef = useRef<HTMLDivElement | null>(null)
  const embeddedRef = useRef(false)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    loadSdk().catch(() => {
    })
  }, [])

  const openSearch = useCallback(async () => {
    setLoadError(null)
    try {
      setLoading(true)
      await loadSdk()
      setLoading(false)
      if (!window.daum?.Postcode) {
        setLoadError('주소 검색을 사용할 수 없습니다')
        return
      }
      setOpen(true)
    } catch (err) {
      setLoading(false)
      setLoadError(err instanceof Error ? err.message : '주소 검색 실패')
    }
  }, [])

  useEffect(() => {
    if (!open) {
      embeddedRef.current = false
      return
    }
    if (embeddedRef.current) return
    if (!embedRef.current) return
    if (!window.daum?.Postcode) return

    embeddedRef.current = true
    new window.daum.Postcode({
      oncomplete: (data) => {
        const jibun = data.jibunAddress || data.autoJibunAddress || ''
        onChangeRef.current({
          postcode: data.zonecode,
          roadAddress: data.roadAddress,
          jibunAddress: jibun,
        })
        setOpen(false)
      },
      onclose: () => {
        setOpen(false)
      },
      width: '100%',
      height: '100%',
      animation: true,
    }).embed(embedRef.current)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  return (
    <div>
      <div className="flex items-stretch gap-2">
        <input
          type="text"
          readOnly
          value={value ? `[${value.postcode}] ${value.roadAddress}` : ''}
          placeholder="주소찾기 버튼을 눌러 도로명 주소를 선택하세요"
          className="field-input flex-1 cursor-pointer bg-surface"
          onClick={openSearch}
        />
        <button
          type="button"
          onClick={openSearch}
          disabled={loading}
          className="px-4 rounded-xl border border-line bg-cream text-sm font-semibold text-soil-dark hover:border-soil disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? '로딩…' : '주소찾기'}
        </button>
      </div>
      {value?.jibunAddress && (
        <p className="mt-1 text-xs text-mute">지번: {value.jibunAddress}</p>
      )}
      {(error || loadError) && (
        <p className="field-error">{error || loadError}</p>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <div className="relative w-full max-w-md h-[500px] max-h-[90vh] rounded-xl bg-white shadow-xl overflow-hidden">
            <button
              type="button"
              aria-label="닫기"
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 border border-line text-soil-dark text-lg leading-none hover:bg-cream"
            >
              ×
            </button>
            <div ref={embedRef} className="w-full h-full" />
          </div>
        </div>
      )}
    </div>
  )
}
