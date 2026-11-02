import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

/** Infinite ticker whose speed and skew follow scroll velocity. */
export default function Marquee({ items, className = '' }: { items: string[]; className?: string }) {
  const track = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = track.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const loop = gsap.to(el, { xPercent: -50, ease: 'none', duration: 38, repeat: -1 })
    const skew = gsap.quickTo(el, 'skewX', { duration: 0.5, ease: 'power3.out' })
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity()
        loop.timeScale(1 + Math.min(Math.abs(v) / 400, 5) * (v < 0 ? -1 : 1))
        skew(gsap.utils.clamp(-8, 8, v / -300))
        gsap.delayedCall(0.15, () => {
          gsap.to(loop, { timeScale: 1, duration: 0.8, overwrite: true })
          skew(0)
        })
      },
    })
    return () => {
      loop.kill()
      st.kill()
    }
  }, [])
  const row = (k: string) => (
    <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 'b'}>
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className={i % 2 ? 'display text-bone/90' : 'display text-outline'}>{t}</span>
          <span className="mx-[0.5em] h-[0.18em] w-[0.18em] rounded-full bg-sell" />
        </span>
      ))}
    </div>
  )
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div ref={track} className="flex w-max will-change-transform">
        {row('a')}
        {row('b')}
      </div>
    </div>
  )
}
