import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'

/** Trailing ring + label for fine pointers. The native cursor stays visible. */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [enabled] = useState(() => matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches)

  useEffect(() => {
    if (!enabled || !ring.current) return
    const el = ring.current
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 })
    const x = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' })
    const y = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })
    let current = ''
    const move = (e: PointerEvent) => {
      x(e.clientX)
      y(e.clientY)
      gsap.to(el, { opacity: 1, duration: 0.3, overwrite: 'auto' })
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor], a, button')
      const next = t?.dataset.cursor ?? (t ? '·' : '')
      if (next !== current) {
        current = next
        setLabel(next)
      }
    }
    const leave = () => gsap.to(el, { opacity: 0, duration: 0.3 })
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [enabled])

  if (!enabled) return null
  const big = label && label !== '·'
  return (
    <div ref={ring} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[70] mix-blend-difference">
      <div
        className={`grid place-items-center rounded-full border border-white transition-[width,height,background-color] duration-500 [transition-timing-function:var(--ease-out-expo)] ${
          big ? 'h-20 w-20 bg-white' : label ? 'h-12 w-12' : 'h-7 w-7'
        }`}
      >
        <span className={`font-mono text-[10px] uppercase tracking-[0.14em] text-black transition-opacity duration-300 ${big ? 'opacity-100' : 'opacity-0'}`}>{big ? label : ''}</span>
      </div>
    </div>
  )
}
