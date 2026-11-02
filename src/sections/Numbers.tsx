import { useRef } from 'react'
import { gsap, MQ, ScrollTrigger } from '../lib/gsap'
import { useIsoLayoutEffect } from '../lib/hooks'
import { revealLines } from '../lib/reveal'
import { ledgers, type Stat } from '../content/site'

function format(v: number, s: Stat) {
  return `${s.prefix ?? ''}${v.toLocaleString('en-US', { maximumFractionDigits: s.decimals ?? 0, minimumFractionDigits: s.decimals ?? 0 })}${s.suffix ?? ''}`
}

export default function Numbers() {
  const root = useRef<HTMLElement>(null)

  useIsoLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const undo = revealLines(el.querySelector('#numbers-title'))
      el.querySelectorAll<HTMLElement>('[data-group]').forEach((group) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: group, start: 'top 78%', once: true } })
        tl.fromTo(group.querySelector('[data-rule]'), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'expo.inOut' }, 0)
          .from(group.querySelectorAll('[data-group-head]'), { y: 16, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.1)
        group.querySelectorAll<HTMLElement>('[data-stat]').forEach((tile, i) => {
          const node = tile.querySelector<HTMLElement>('[data-count]')!
          const end = Number(node.dataset.count)
          const f = JSON.parse(node.dataset.format ?? '{}') as { p?: string; s?: string; d?: number }
          const obj = { v: 0 }
          const render = () => {
            node.textContent = `${f.p ?? ''}${obj.v.toLocaleString('en-US', { maximumFractionDigits: f.d ?? 0, minimumFractionDigits: f.d ?? 0 })}${f.s ?? ''}`
          }
          render()
          const at = 0.25 + i * 0.18
          tl.fromTo(node, { y: 28, opacity: 0, filter: 'blur(14px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1, ease: 'expo.out', clearProps: 'filter' }, at)
            .to(obj, { v: end, duration: end > 50 ? 2.1 : 1.5, ease: 'expo.out', snap: { v: f.d ? 0.1 : 1 }, onUpdate: render }, at + 0.05)
            .from(tile.querySelector('[data-stat-label]'), { y: 10, opacity: 0, duration: 0.8 }, at + 0.3)
        })
      })
      ScrollTrigger.refresh()
      return undo
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} id="numbers" tabIndex={-1} aria-labelledby="numbers-title" className="relative py-28 outline-none md:py-44">
      <div className="container-x">
        <h2 id="numbers-title" className="display max-w-[14ch] text-[clamp(2.6rem,6.4vw,6.5rem)]">
          Two jobs. One person.
        </h2>

        <div className="mt-20 space-y-20 md:mt-28 md:space-y-28">
          {ledgers.map((l) => (
            <div key={l.id} data-group className="relative grid gap-10 pt-8 lg:grid-cols-12 lg:gap-8">
              <span data-rule className="absolute inset-x-0 top-0 h-px origin-left bg-white/12" aria-hidden />
              <div className="lg:col-span-4">
                <h3 data-group-head className="flex items-center gap-3 text-2xl font-bold tracking-tight md:text-3xl">
                  <span className={`h-2.5 w-2.5 rounded-full ${l.id === 'book' ? 'bg-sell' : 'bg-build'}`} />
                  {l.title}
                </h3>
                <p data-group-head className="mt-2 text-base text-mute">
                  {l.byline}
                </p>
              </div>
              <div className="grid gap-12 sm:grid-cols-2 lg:col-span-8">
                {l.stats.map((s) => (
                  <div key={s.label} data-stat>
                    <div className="display text-[clamp(4rem,9vw,8.5rem)] leading-[0.9] tabular-nums will-change-transform">
                      <span data-count={s.value} data-format={JSON.stringify({ p: s.prefix, s: s.suffix, d: s.decimals })}>
                        {format(s.value, s)}
                      </span>
                    </div>
                    <p data-stat-label className="mt-4 max-w-[18rem] text-lg leading-snug text-bone/80">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
