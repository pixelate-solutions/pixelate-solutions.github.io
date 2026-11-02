import { useEffect, useLayoutEffect, useState } from 'react'

export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

function useMedia(query: string, initial = false) {
  const [match, setMatch] = useState(() => (typeof window === 'undefined' ? initial : window.matchMedia(query).matches))
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')
export const useIsDesktop = () => useMedia('(min-width: 1024px)')
export const useFinePointer = () => useMedia('(pointer: fine)')
