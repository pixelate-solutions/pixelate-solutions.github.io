/**
 * Split portrait. Left of the divider: hoodie (the engineer). Right: suit (the seller).
 * Both photos are pre-aligned on the eye line by sync-assets, so the wipe reads as one face.
 * Pointer moves the divider; it drifts on its own when idle; arrow keys work (role="slider").
 * Headline words dispatch `portrait:focus` events to push it fully to one side.
 */
import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { headshots } from '../content/projects'
import Picture from './Picture'

export const focusPortrait = (side: 'build' | 'sell' | null) => window.dispatchEvent(new CustomEvent('portrait:focus', { detail: side }))

export default function Portrait({ className = '' }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState(50)
  const state = useRef({ split: 50, hovering: false })

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const apply = () => {
      el.style.setProperty('--split', `${state.current.split}%`)
    }
    const proxy = state.current
    const to = (v: number, duration = 0.9, ease = 'expo.out') =>
      gsap.to(proxy, { split: v, duration: reduce ? 0 : duration, ease, overwrite: true, onUpdate: apply, onComplete: () => setValue(Math.round(proxy.split)) })

    let idle: gsap.core.Timeline | null = null
    const startIdle = () => {
      if (reduce) return
      idle?.kill()
      const leg = { ease: 'sine.inOut', onUpdate: apply }
      idle = gsap
        .timeline({ repeat: -1, delay: 0.4 })
        .to(proxy, { ...leg, split: 63, duration: 2.8 })
        .to(proxy, { ...leg, split: 37, duration: 5.6 })
        .to(proxy, { ...leg, split: 50, duration: 2.8 })
    }
    const intro = gsap.fromTo(proxy, { split: 100 }, { split: 50, duration: reduce ? 0 : 2.2, ease: 'expo.inOut', delay: 0.6, onUpdate: apply, onComplete: startIdle })
    apply()

    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch' && e.type === 'pointermove' && !(e.buttons & 1)) return
      intro.kill()
      idle?.kill()
      state.current.hovering = true
      const r = el.getBoundingClientRect()
      to(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)), 0.6)
    }
    const leave = () => {
      state.current.hovering = false
      to(50, 1.2)
      gsap.delayedCall(1.3, () => !state.current.hovering && startIdle())
    }
    const onFocusEvt = (e: Event) => {
      const side = (e as CustomEvent<'build' | 'sell' | null>).detail
      intro.kill()
      idle?.kill()
      if (side === 'build') to(100, 1.1, 'expo.inOut')
      else if (side === 'sell') to(0, 1.1, 'expo.inOut')
      else {
        to(50, 1.1, 'expo.inOut')
        gsap.delayedCall(1.2, () => !state.current.hovering && startIdle())
      }
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerdown', move)
    el.addEventListener('pointerleave', leave)
    window.addEventListener('portrait:focus', onFocusEvt)
    return () => {
      intro.kill()
      idle?.kill()
      gsap.killTweensOf(proxy)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerdown', move)
      el.removeEventListener('pointerleave', leave)
      window.removeEventListener('portrait:focus', onFocusEvt)
    }
  }, [])

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 25 : 10
    let next = state.current.split
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next -= step
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next += step
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = 100
    else return
    e.preventDefault()
    next = Math.max(0, Math.min(100, next))
    gsap.killTweensOf(state.current)
    gsap.to(state.current, {
      split: next,
      duration: 0.5,
      onUpdate: () => root.current?.style.setProperty('--split', `${state.current.split}%`),
    })
    setValue(next)
  }

  if (!headshots?.casual || !headshots?.suit) return null

  return (
    <div
      ref={root}
      role="slider"
      tabIndex={0}
      aria-label="Portrait comparison: Joseph as engineer (hoodie, left) and as seller (suit, right). Use arrow keys to move the divider."
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-valuetext={value > 66 ? 'Mostly engineer' : value < 34 ? 'Mostly seller' : 'Half engineer, half seller'}
      onKeyDown={onKey}
      className={`portrait group relative aspect-[4/5] touch-pan-y select-none overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-2 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)] ${className}`}
      style={{ ['--split' as string]: '100%' }}
      data-cursor="Drag"
    >
      <Picture
        img={headshots.casual}
        alt="Joseph Morrison in a black hoodie, outdoors"
        sizes="(min-width: 1024px) 34vw, 90vw"
        eager
        className="absolute inset-0"
        imgClassName="h-full w-full object-cover [filter:saturate(.82)_contrast(1.04)]"
      />
      <div className="absolute inset-0" style={{ clipPath: 'inset(0 0 0 var(--split))' }}>
        <Picture
          img={headshots.suit}
          alt="Joseph Morrison in a suit and tie"
          sizes="(min-width: 1024px) 34vw, 90vw"
          eager
          className="absolute inset-0"
          imgClassName="h-full w-full object-cover [filter:saturate(.82)_contrast(1.04)]"
        />
      </div>

      {/* colour wash: cyan on the engineer side, ember on the seller side */}
      <div className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: 'linear-gradient(90deg, rgb(92 225 230 / .35), transparent 45%, transparent 55%, rgb(255 122 69 / .35))' }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />

      {/* divider */}
      <div className="pointer-events-none absolute inset-y-0" style={{ left: 'var(--split)' }}>
        <div className="absolute inset-y-0 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-bone to-transparent" />
        <div className="absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-ink/50 backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-bone" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M9 6 3 12l6 6M15 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/70">Fig. 01 — Both</div>
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/70">
            <span className="h-1.5 w-1.5 rounded-full bg-build" /> Engineer
          </div>
          <div className="serif-i text-3xl leading-none text-build md:text-4xl">ships.</div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/70">
            Seller <span className="h-1.5 w-1.5 rounded-full bg-sell" />
          </div>
          <div className="serif-i text-3xl leading-none text-sell md:text-4xl">sells.</div>
        </div>
      </div>
    </div>
  )
}
