import { useEffect, useState } from 'react'
import { computeDDay, type DDayInfo } from './dday'

export function useDDay(launchIso: string): DDayInfo {
  const [info, setInfo] = useState<DDayInfo>(() => computeDDay(launchIso))

  useEffect(() => {
    const recompute = () => setInfo(computeDDay(launchIso))
    recompute()

    const intervalId = setInterval(recompute, 60_000)
    const onVisible = () => {
      if (!document.hidden) recompute()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [launchIso])

  return info
}
