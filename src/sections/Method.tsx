import { useRef, useState } from 'react'
import { gsap, MQ, ScrollTrigger } from '../lib/gsap'
import { useIsoLayoutEffect } from '../lib/hooks'
import { drawRules, revealLines } from '../lib/reveal'
import { method } from '../content/site'
import { scrollToTarget } from '../lib/smooth'

/** Small looping glyph per phase. Pure SVG + CSS; the global reduced-motion rule freezes them. */
function Glyph({ id }: { id: string }) {
  const common = 'h-full w-full'
  switch (id) {
    case 'discovery':
      return (
        <svg viewBox="0 0 120 120" className={common} aria-hidden>
          {[0, 1, 2].map((i) => (
            <circle key={i} cx="60" cy="60" r="18" fill="none" stroke="#f26b3a" strokeWidth="1.2" style={{ transformOrigin: '60px 60px', animation: `ripple 3s ${i}s ease-out infinite` }} />
          ))}
          <circle cx="60" cy="60" r="5" fill="#f26b3a" />
        </svg>
      )
    case 'scoping':
      return (
        <svg viewBox="0 0 120 120" className={common} aria-hidden>
          <rect x="22" y="22" width="76" height="76" rx="6" fill="none" stroke="#ece9e2" strokeOpacity=".5" strokeDasharray="6 6" style={{ animation: 'dash 6s linear infinite' }} />
          <rect x="38" y="38" width="44" height="44" rx="4" fill="#9fbdd3" fillOpacity=".15" stroke="#9fbdd3" />
          <path d="M8 60h14M98 60h14M60 8v14M60 98v14" stroke="#f26b3a" strokeWidth="1.4" />
        </svg>
      )
    case 'prototype':
      return (
        <svg viewBox="0 0 120 120" className={common} aria-hidden>
          {Array.from({ length: 9 }).map((_, i) => (
            <rect
              key={i}
              x={24 + (i % 3) * 26}
              y={24 + Math.floor(i / 3) * 26}
              width="20"
              height="20"
              rx="4"
              fill={i === 4 ? '#f26b3a' : '#9fbdd3'}
              fillOpacity={i === 4 ? 0.9 : 0.25}
              style={{ animation: `blink 2.4s ${i * 0.12}s ease-in-out infinite` }}
            />
          ))}
        </svg>
      )
    case 'deploy':
      return (
        <svg viewBox="0 0 120 120" className={common} aria-hidden>
          <path d="M6 70h26l8-24 12 46 10-34 6 12h46" fill="none" stroke="#9fbdd3" strokeWidth="1.6" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'trace 2.6s ease-in-out infinite' }} />
          <path d="M6 70h108" stroke="#ece9e2" strokeOpacity=".12" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 120 120" className={common} aria-hidden>
          {[14, 26, 44, 70].map((h, i) => (
            <rect key={i} x={20 + i * 22} y={100 - h} width="14" height={h} rx="3" fill={i === 3 ? '#f26b3a' : '#ece9e2'} fillOpacity={i === 3 ? 0.95 : 0.2} style={{ transformOrigin: `0 100px`, animation: `grow 3s ${i * 0.15}s ease-in-out infinite` }} />
          ))}
        </svg>
      )
  }
}

export default function Method() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useIsoLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-step]'))
    const triggers = cards.map((card, i) =>
      ScrollTrigger.create({ trigger: card, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => s.isActive && setActive(i) }),
    )
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      drawRules(el)
      const undo = revealLines(el.querySelector('#method-title'))
      gsap.fromTo(
        el.querySelector('[data-step-progress]'),
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: el.querySelector('[data-steps]'), start: 'top 55%', end: 'bottom 55%', scrub: true } },
      )
      cards.forEach((card) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 78%', once: true } })
        tl.fromTo(card.querySelector('article'), { clipPath: 'inset(0% 0% 100% 0% round 1.75rem)' }, { clipPath: 'inset(0% 0% 0% 0% round 1.75rem)', duration: 1.3, ease: 'expo.inOut' }, 0)
          .from(card.querySelectorAll('[data-in]'), { y: 40, opacity: 0, duration: 1.1, stagger: 0.07 }, 0.35)
          .add(() => gsap.set(card.querySelector('article'), { clearProps: 'clipPath' }))
      })
      return undo
    })
    return () => {
      triggers.forEach((t) => t.kill())
      mm.revert()
    }
  }, [])

  return (
    <section ref={root} id="method" tabIndex={-1} aria-labelledby="method-title" className="relative py-28 outline-none md:py-44">
      <span data-rule className="absolute inset-x-0 top-0 h-px origin-left bg-white/10" aria-hidden />
      <div className="container-x">
        <h2 id="method-title" className="display mb-16 max-w-[12ch] text-[clamp(2.4rem,5.6vw,5.6rem)] md:mb-24">
          How I work
        </h2>

        <div className="grid gap-12 lg:grid-cols-12">
          <nav aria-label="Method steps" className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-32">
              <div className="relative pl-6">
                <span className="absolute bottom-2 left-0 top-2 w-px bg-white/10" aria-hidden>
                  <span data-step-progress className="absolute inset-0 origin-top bg-gradient-to-b from-sell via-bone to-build" />
                </span>
                <ol className="space-y-1">
                  {method.map((m, i) => (
                    <li key={m.id}>
                      <a
                        href={`#step-${m.id}`}
                        onClick={(e) => {
                          e.preventDefault()
                          scrollToTarget(`#step-${m.id}`, -120)
                        }}
                        aria-current={active === i ? 'step' : undefined}
                        className={`block py-2 text-4xl font-bold tracking-[-0.03em] transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] xl:text-5xl ${
                          active === i ? 'translate-x-2 text-bone' : 'text-dim hover:translate-x-1 hover:text-mute'
                        }`}
                      >
                        {m.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </nav>

          <ol data-steps className="space-y-6 lg:col-span-8 lg:space-y-10">
            {method.map((m, i) => (
              <li key={m.id} id={`step-${m.id}`} data-step className="scroll-mt-32">
                <article
                  className={`relative overflow-hidden rounded-[1.75rem] border bg-ink-2/70 p-6 transition-[border-color,background-color,box-shadow] duration-700 md:p-10 ${
                    active === i ? 'border-white/20 bg-ink-2 shadow-[0_30px_80px_-40px_rgb(0_0_0/.9)]' : 'border-white/10'
                  }`}
                >
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl transition-opacity duration-1000 ${active === i ? 'opacity-100' : 'opacity-0'}`}
                    style={{ background: i % 2 ? 'rgb(159 189 211 / .10)' : 'rgb(242 107 58 / .10)' }}
                  />
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h3 data-in className="text-3xl font-bold tracking-[-0.03em] md:text-4xl lg:sr-only">
                        {m.title}
                      </h3>
                      <p data-in className="mt-3 max-w-[30rem] text-xl font-medium leading-snug text-bone md:text-2xl lg:mt-0">
                        {m.line}
                      </p>
                      <p data-in className="mt-4 max-w-[34rem] leading-relaxed text-mute">
                        {m.where}
                      </p>
                    </div>
                    <div data-in className="h-20 w-20 shrink-0 md:h-24 md:w-24">
                      <Glyph id={m.id} />
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
