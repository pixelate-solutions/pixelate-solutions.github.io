import { useRef } from 'react'
import { gsap, MQ, ScrollTrigger } from '../lib/gsap'
import { useIsoLayoutEffect } from '../lib/hooks'
import { growth, ledgers, type Stat } from '../content/site'

function format(v: number, s: Stat) {
  return `${s.prefix ?? ''}${v.toLocaleString('en-US', { maximumFractionDigits: s.decimals ?? 0, minimumFractionDigits: s.decimals ?? 0 })}${s.suffix ?? ''}`
}

function StatTile({ stat, accent, index }: { stat: Stat; accent: 'sell' | 'build'; index: number }) {
  return (
    <div data-stat className="group relative flex flex-col gap-8 border-t border-white/10 pt-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-dim">{String(index + 1).padStart(2, '0')}</span>
        <span className={`h-1.5 w-1.5 rounded-full ${accent === 'sell' ? 'bg-sell' : 'bg-build'} opacity-60 transition-opacity group-hover:opacity-100`} />
      </div>
      <div>
        <div className="text-[clamp(3rem,6.2vw,5.6rem)] font-semibold leading-[0.9] tracking-[-0.05em]">
          <span data-count={stat.value} data-format={JSON.stringify({ p: stat.prefix, s: stat.suffix, d: stat.decimals })}>
            {format(stat.value, stat)}
          </span>
        </div>
        <div className="mt-3 text-base font-medium text-bone">{stat.label}</div>
        <p className="mt-2 max-w-[22rem] text-sm leading-relaxed text-mute">{stat.note}</p>
      </div>
    </div>
  )
}

function GrowthBars() {
  const max = Math.max(...growth.bars.map((b) => b.value))
  return (
    <figure className="relative" aria-labelledby="growth-title">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 id="growth-title" className="text-2xl font-semibold tracking-tight md:text-3xl">
          {growth.title}
        </h3>
        <span className="eyebrow">{growth.caption}</span>
      </figcaption>
      <div className="mt-8 space-y-5">
        {growth.bars.map((b, i) => (
          <div key={b.label} className="grid grid-cols-[6.5rem_1fr] items-center gap-4 md:grid-cols-[8rem_1fr]">
            <span className="font-mono text-xs text-mute">{b.label}</span>
            <div className="relative h-12 md:h-14" title={`${b.label}: ${b.display}`}>
              <div className="absolute inset-y-0 left-0 rounded-r-[4px] bg-white/[0.035]" style={{ width: '100%' }} />
              <div
                data-bar
                className="absolute inset-y-0 left-0 min-w-[6px] origin-left rounded-r-[4px]"
                style={{
                  width: `${(b.value / max) * 100}%`,
                  background: i === 0 ? 'rgb(255 122 69 / .55)' : 'linear-gradient(90deg, rgb(255 122 69 / .55), var(--color-sell))',
                }}
              >
                {i > 0 && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-semibold tracking-tight text-ink md:text-2xl">{b.display}</span>}
              </div>
              {i === 0 ? (
                <span className="absolute top-1/2 -translate-y-1/2 text-lg font-semibold tracking-tight text-bone" style={{ left: `calc(${(b.value / max) * 100}% + 12px)` }}>
                  {b.display}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <table className="sr-only">
        <caption>{growth.caption}</caption>
        <tbody>
          {growth.bars.map((b) => (
            <tr key={b.label}>
              <th scope="row">{b.label}</th>
              <td>{b.display}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

export default function Numbers() {
  const root = useRef<HTMLElement>(null)

  useIsoLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      el.querySelectorAll<HTMLElement>('[data-count]').forEach((node) => {
        const end = Number(node.dataset.count)
        const f = JSON.parse(node.dataset.format ?? '{}') as { p?: string; s?: string; d?: number }
        const obj = { v: 0 }
        const render = () => {
          node.textContent = `${f.p ?? ''}${obj.v.toLocaleString('en-US', { maximumFractionDigits: f.d ?? 0, minimumFractionDigits: f.d ?? 0 })}${f.s ?? ''}`
        }
        render()
        gsap.to(obj, {
          v: end,
          duration: end > 50 ? 2.2 : 1.6,
          ease: 'expo.out',
          snap: { v: f.d ? 0.1 : 1 },
          onUpdate: render,
          scrollTrigger: { trigger: node, start: 'top 88%', once: true },
        })
      })
      gsap.from(el.querySelectorAll('[data-stat]'), {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.07,
        scrollTrigger: { trigger: el.querySelector('[data-ledgers]'), start: 'top 80%', once: true },
      })
      gsap.from(el.querySelectorAll('[data-bar]'), {
        clipPath: 'inset(0% 100% 0% 0%)',
        duration: 1.8,
        ease: 'expo.inOut',
        stagger: 0.25,
        scrollTrigger: { trigger: el.querySelector('#growth-title'), start: 'top 80%', once: true },
      })
      gsap.from(el.querySelectorAll('[data-reveal-line]'), {
        yPercent: 110,
        duration: 1.3,
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 75%', once: true },
      })
      ScrollTrigger.refresh()
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} id="numbers" tabIndex={-1} aria-labelledby="numbers-title" className="relative py-28 outline-none md:py-40">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-6">(01) The numbers</p>
            <h2 id="numbers-title" className="display text-[clamp(2.6rem,6.4vw,6.5rem)]">
              <span className="line-mask"><span data-reveal-line className="block">Two ledgers.</span></span>
              <span className="line-mask"><span data-reveal-line className="block serif-i text-bone/90">One person.</span></span>
            </h2>
          </div>
          <p className="self-end text-lg leading-relaxed text-mute lg:col-span-4">
            A quota-carrying sales book on one side, production code on the other. Every figure comes straight from the sales record or the codebase.
          </p>
        </div>

        <div data-ledgers className="mt-20 grid gap-16 lg:grid-cols-2 lg:gap-12">
          {ledgers.map((l) => (
            <div key={l.id}>
              <div className="mb-8 flex items-center justify-between">
                <h3 className="flex items-center gap-3 text-xl font-semibold tracking-tight">
                  <span className={`h-2.5 w-2.5 rounded-full ${l.id === 'book' ? 'bg-sell' : 'bg-build'}`} />
                  {l.title}
                </h3>
                <span className="eyebrow">{l.byline}</span>
              </div>
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
                {l.stats.map((s, i) => (
                  <StatTile key={s.label} stat={s} accent={l.id === 'book' ? 'sell' : 'build'} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 rounded-[1.75rem] border border-white/10 bg-ink-2/60 p-6 md:mt-32 md:p-10">
          <GrowthBars />
        </div>
      </div>
    </section>
  )
}
