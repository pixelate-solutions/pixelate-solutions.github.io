import { useRef, useState } from 'react'
import { gsap, MQ, ScrollTrigger } from '../lib/gsap'
import { useIsoLayoutEffect } from '../lib/hooks'
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
            <circle key={i} cx="60" cy="60" r="18" fill="none" stroke="#ff7a45" strokeWidth="1.2" style={{ transformOrigin: '60px 60px', animation: `ripple 3s ${i}s ease-out infinite` }} />
          ))}
          <circle cx="60" cy="60" r="5" fill="#ff7a45" />
        </svg>
      )
    case 'scoping':
      return (
        <svg viewBox="0 0 120 120" className={common} aria-hidden>
          <rect x="22" y="22" width="76" height="76" rx="6" fill="none" stroke="#ece9e2" strokeOpacity=".5" strokeDasharray="6 6" style={{ animation: 'dash 6s linear infinite' }} />
          <rect x="38" y="38" width="44" height="44" rx="4" fill="#5ce1e6" fillOpacity=".15" stroke="#5ce1e6" />
          <path d="M8 60h14M98 60h14M60 8v14M60 98v14" stroke="#ff7a45" strokeWidth="1.4" />
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
              fill={i === 4 ? '#ff7a45' : '#5ce1e6'}
              fillOpacity={i === 4 ? 0.9 : 0.25}
              style={{ animation: `blink 2.4s ${i * 0.12}s ease-in-out infinite` }}
            />
          ))}
        </svg>
      )
    case 'deploy':
      return (
        <svg viewBox="0 0 120 120" className={common} aria-hidden>
          <path d="M6 70h26l8-24 12 46 10-34 6 12h46" fill="none" stroke="#5ce1e6" strokeWidth="1.6" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'trace 2.6s ease-in-out infinite' }} />
          <path d="M6 70h108" stroke="#ece9e2" strokeOpacity=".12" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 120 120" className={common} aria-hidden>
          {[14, 26, 44, 70].map((h, i) => (
            <rect key={i} x={20 + i * 22} y={100 - h} width="14" height={h} rx="3" fill={i === 3 ? '#ff7a45' : '#ece9e2'} fillOpacity={i === 3 ? 0.95 : 0.2} style={{ transformOrigin: `0 100px`, animation: `grow 3s ${i * 0.15}s ease-in-out infinite` }} />
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
      gsap.fromTo(
        el.querySelector('[data-step-progress]'),
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: el.querySelector('[data-steps]'), start: 'top 55%', end: 'bottom 55%', scrub: true } },
      )
      cards.forEach((card) => {
        gsap.from(card.querySelectorAll('[data-in]'), { y: 40, opacity: 0, duration: 1.1, stagger: 0.07, scrollTrigger: { trigger: card, start: 'top 78%', once: true } })
      })
    })
    return () => {
      triggers.forEach((t) => t.kill())
      mm.revert()
    }
  }, [])

  return (
    <section ref={root} id="method" tabIndex={-1} aria-labelledby="method-title" className="relative border-t border-white/10 py-28 outline-none md:py-40">
      <div className="container-x">
        <div className="mb-16 max-w-[60rem] md:mb-24">
          <p className="eyebrow mb-6">(04) How I work with customers</p>
          <h2 id="method-title" className="display text-[clamp(2.4rem,5.6vw,5.6rem)]">
            Discovery to expansion, <span className="serif-i text-bone/90">with my hands on both ends.</span>
          </h2>
          <p className="mt-8 max-w-[40rem] text-lg leading-relaxed text-mute">
            The same loop a Solutions Engineer runs: understand, scope, prove, deploy, grow. Here is where I have actually run each step.
          </p>
        </div>

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
                        className={`flex items-baseline gap-4 py-2 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] ${active === i ? 'translate-x-2 text-bone' : 'text-dim hover:text-mute'}`}
                      >
                        <span className="font-mono text-xs">{String(i + 1).padStart(2, '0')}</span>
                        <span className="text-4xl font-semibold tracking-[-0.04em] xl:text-5xl">{m.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </nav>

          <ol data-steps className="space-y-8 lg:col-span-8 lg:space-y-14">
            {method.map((m, i) => (
              <li key={m.id} id={`step-${m.id}`} data-step className="scroll-mt-32">
                <article
                  className={`relative overflow-hidden rounded-[1.75rem] border bg-ink-2/70 p-6 transition-colors duration-700 md:p-10 ${active === i ? 'border-white/20' : 'border-white/10'}`}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p data-in className="font-mono text-xs text-mute">
                        Step {String(i + 1).padStart(2, '0')} / 05
                      </p>
                      <h3 data-in className="mt-3 text-4xl font-semibold tracking-[-0.04em] md:text-5xl lg:sr-only">
                        {m.title}
                      </h3>
                      <p data-in className="mt-4 max-w-[34rem] text-xl font-medium leading-snug tracking-[-0.01em] text-bone md:text-2xl">
                        {m.line}
                      </p>
                    </div>
                    <div data-in className="h-20 w-20 shrink-0 md:h-28 md:w-28">
                      <Glyph id={m.id} />
                    </div>
                  </div>

                  <div data-in className="mt-10 rounded-2xl border border-white/10 bg-ink/60 p-5 md:p-7">
                    <p className="eyebrow flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-sell" /> Where I’ve done it · {m.example.where}
                    </p>
                    <h4 className="mt-3 text-xl font-semibold tracking-tight md:text-2xl">{m.example.title}</h4>
                    <p className="mt-3 max-w-[44rem] leading-relaxed text-mute">{m.example.body}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {m.example.proof.map((p) => (
                        <span key={p} className="chip">
                          {p}
                        </span>
                      ))}
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
