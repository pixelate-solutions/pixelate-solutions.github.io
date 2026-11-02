import { useRef } from 'react'
import { gsap, MQ, ScrollTrigger } from '../lib/gsap'
import { useIsDesktop, useIsoLayoutEffect, useReducedMotion } from '../lib/hooks'
import { revealLines } from '../lib/reveal'
import { acts, chapters } from '../content/site'
import { projects } from '../content/projects'
import { ArrowUpRight } from '../components/Icons'

const actColor = { build: 'var(--color-build)', sell: 'var(--color-sell)', both: 'var(--color-bone)' } as const

/** Smooth path through points (Catmull-Rom → cubic Bézier). */
function pathThrough(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const t = 0.5
    d += ` C ${p1.x + ((p2.x - p0.x) / 6) * t * 2} ${p1.y + ((p2.y - p0.y) / 6) * t * 2}, ${p2.x - ((p3.x - p1.x) / 6) * t * 2} ${p2.y - ((p3.y - p1.y) / 6) * t * 2}, ${p2.x} ${p2.y}`
  }
  return d
}

export default function Story() {
  const root = useRef<HTMLElement>(null)
  const desktop = useIsDesktop()
  const reduced = useReducedMotion()
  const horizontal = desktop && !reduced

  useIsoLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const mm = gsap.matchMedia()

    mm.add(MQ.motion, () => revealLines(el.querySelector('#story-title')))

    mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
      const pin = el.querySelector<HTMLElement>('[data-pin]')!
      const track = el.querySelector<HTMLElement>('[data-track]')!
      const svg = el.querySelector<SVGSVGElement>('[data-path-svg]')!
      const path = el.querySelector<SVGPathElement>('[data-path]')!
      const glow = el.querySelector<SVGPathElement>('[data-path-glow]')!
      const dots = Array.from(el.querySelectorAll<HTMLElement>('[data-dot]'))
      const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-chapter]'))
      const progress = el.querySelector<HTMLElement>('[data-progress]')!

      const layoutPath = () => {
        const tr = track.getBoundingClientRect()
        svg.setAttribute('width', String(track.scrollWidth))
        svg.setAttribute('height', String(tr.height))
        svg.setAttribute('viewBox', `0 0 ${track.scrollWidth} ${tr.height}`)
        const pts = dots.map((d) => {
          const r = d.getBoundingClientRect()
          return { x: r.left - tr.left + r.width / 2, y: r.top - tr.top + r.height / 2 }
        })
        const first = { x: 0, y: pts[0].y + 40 }
        const last = { x: track.scrollWidth, y: pts[pts.length - 1].y - 30 }
        const d = pathThrough([first, ...pts, last])
        path.setAttribute('d', d)
        glow.setAttribute('d', d)
        el.querySelector('[data-path-base]')?.setAttribute('d', d)
        const len = path.getTotalLength()
        ;[path, glow].forEach((p) => {
          p.style.strokeDasharray = `${len}`
        })
        return len
      }
      let len = layoutPath()

      const distance = () => track.scrollWidth - window.innerWidth
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onRefresh: () => {
            len = layoutPath()
          },
          onUpdate: (self) => {
            // keep the drawing tip just right of screen centre, where the active chapter sits
            const frac = Math.min(1, (self.progress * distance() + window.innerWidth * 0.58) / track.scrollWidth)
            const off = len * (1 - frac)
            path.style.strokeDashoffset = `${off}`
            glow.style.strokeDashoffset = `${off}`
            progress.style.transform = `scaleX(${self.progress})`
          },
        },
      })
      const initial = len * (1 - Math.min(1, (window.innerWidth * 0.58) / track.scrollWidth))
      path.style.strokeDashoffset = `${initial}`
      glow.style.strokeDashoffset = `${initial}`

      cards.forEach((card) => {
        const inner = card.querySelectorAll('[data-chapter-in]')
        const dot = card.querySelector('[data-dot]')
        const body = card.querySelector('[data-chapter-body]')
        // Cards already on screen when the pin starts reveal on normal vertical scroll.
        const visibleAtStart = card.offsetLeft < window.innerWidth * 0.8
        const st = (start: string) =>
          visibleAtStart
            ? { trigger: pin, start: 'top 70%', toggleActions: 'play none none reverse' }
            : { trigger: card, containerAnimation: tween, start, toggleActions: 'play none none reverse' }
        gsap.from(inner, { y: 50, opacity: 0, stagger: 0.06, duration: 1, scrollTrigger: st('left 80%') })
        gsap.fromTo(dot, { scale: 0.4, opacity: 0.3 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(3)', scrollTrigger: st('left 60%') })
        // The chapter under the reading line is fully lit; the ones passing by sit back a little.
        ScrollTrigger.create({
          trigger: card,
          containerAnimation: tween,
          start: 'left 72%',
          end: 'right 28%',
          onToggle: (self) => {
            gsap.to(body, { opacity: self.isActive ? 1 : 0.55, duration: 0.7, ease: 'power2.out', overwrite: true })
            gsap.to(dot, { scale: self.isActive ? 1.25 : 1, duration: 0.5, ease: 'back.out(2)', overwrite: true })
          },
        })
      })
      el.querySelectorAll<HTMLElement>('[data-act-numeral]').forEach((n) => {
        gsap.fromTo(n, { xPercent: 30 }, { xPercent: -30, ease: 'none', scrollTrigger: { trigger: n, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } })
      })
    })

    mm.add(`${MQ.motion} and (max-width: 1023px)`, () => {
      const line = el.querySelector<HTMLElement>('[data-vline]')
      if (line) gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: el.querySelector('[data-track]'), start: 'top 70%', end: 'bottom 70%', scrub: true } })
      el.querySelectorAll<HTMLElement>('[data-chapter]').forEach((c) => {
        gsap.from(c.querySelectorAll('[data-chapter-in]'), { y: 30, opacity: 0, stagger: 0.06, duration: 0.9, scrollTrigger: { trigger: c, start: 'top 82%', once: true } })
      })
    })
    return () => mm.revert()
  }, [horizontal])

  let lastAct = ''
  return (
    <section ref={root} id="story" tabIndex={-1} aria-labelledby="story-title" className="relative outline-none">
      <div className="container-x pb-12 pt-24 md:pt-32">
        <h2 id="story-title" className="display max-w-[14ch] text-[clamp(2.4rem,5.6vw,5.6rem)]">
          Learned to <span className="text-build">build</span>. Learned to <span className="text-sell">sell</span>. Now both.
        </h2>
      </div>

      <div data-pin className={horizontal ? 'relative h-[100svh] overflow-hidden' : 'relative'}>
        <div
          data-track
          className={horizontal ? 'relative flex h-full w-max items-stretch pl-[max(3.5rem,calc((100vw-1520px)/2+3.5rem))] pr-[18vw]' : 'container-x relative flex flex-col gap-14 pb-24 pl-12 md:pl-20'}
        >
          {horizontal ? (
            <svg data-path-svg className="pointer-events-none absolute left-0 top-0" aria-hidden>
              <defs>
                <linearGradient id="story-grad" gradientUnits="objectBoundingBox" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stopColor="#3fd9cb" />
                  <stop offset="0.3" stopColor="#3fd9cb" />
                  <stop offset="0.45" stopColor="#8db4ff" />
                  <stop offset="0.6" stopColor="#9fe3c4" />
                  <stop offset="1" stopColor="#ece9e2" />
                </linearGradient>
                <filter id="story-blur" x="-10%" y="-50%" width="120%" height="200%">
                  <feGaussianBlur stdDeviation="8" />
                </filter>
              </defs>
              <path data-path-base d="" stroke="rgb(236 233 226 / .1)" strokeWidth="1" fill="none" strokeDasharray="2 6" />
              <path data-path-glow d="" stroke="url(#story-grad)" strokeWidth="6" strokeOpacity="0.45" fill="none" filter="url(#story-blur)" strokeLinecap="round" />
              <path data-path d="" stroke="url(#story-grad)" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          ) : (
            <span className="absolute bottom-24 left-[1.1rem] top-2 w-px bg-white/10 md:left-[2.6rem]" aria-hidden>
              <span data-vline className="absolute inset-0 origin-top bg-gradient-to-b from-build via-sell to-bone" />
            </span>
          )}

          <ol className={horizontal ? 'contents' : 'flex flex-col gap-16'}>
            {chapters.map((c, i) => {
              const newAct = c.act !== lastAct
              lastAct = c.act
              const project = c.slug ? projects.find((p) => p.slug === c.slug) : undefined
              const offset = horizontal ? (i % 2 === 0 ? 'pt-[31vh]' : 'pt-[45vh]') : ''
              const body = (
                <>
                  <p data-chapter-in className="text-[13px] font-medium text-mute">
                    {c.when}
                  </p>
                  <h3 data-chapter-in className="mt-2 text-[clamp(1.6rem,2.4vw,2.4rem)] font-bold leading-[1.02] tracking-[-0.03em]">
                    {c.org}
                    {project && <ArrowUpRight className="ml-2 inline-block h-[0.6em] w-[0.6em] align-baseline text-mute transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone" />}
                  </h3>
                  <p data-chapter-in className="mt-1.5 text-sm text-bone/70">
                    {c.role}
                  </p>
                  <p data-chapter-in className="mt-4 max-w-[26rem] text-[0.98rem] leading-relaxed text-mute">
                    {c.body}
                  </p>
                </>
              )
              return (
                <li
                  key={c.org}
                  data-chapter
                  className={horizontal ? `relative w-[min(26rem,30vw)] shrink-0 pr-[5vw] ${offset}` : 'relative'}
                >
                  {newAct && horizontal && (
                    <span
                      data-act-numeral
                      aria-hidden
                      className="display text-outline pointer-events-none absolute left-0 top-[7vh] select-none whitespace-nowrap text-[24vh] leading-none opacity-40"
                    >
                      {acts[c.act]}
                    </span>
                  )}
                  <span
                    data-dot
                    className={`absolute grid h-5 w-5 place-items-center rounded-full border-2 bg-ink ${horizontal ? '-mt-10 left-0' : '-left-[2.35rem] top-1 md:-left-[3.95rem]'}`}
                    style={{ borderColor: actColor[c.act], boxShadow: `0 0 24px ${actColor[c.act]}` }}
                    aria-hidden
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: actColor[c.act] }} />
                  </span>
                  <div data-chapter-body className="relative">
                    {project ? (
                      <a href={`#/work/${project.slug}`} className="group block rounded-xl outline-none" data-cursor="Open" aria-label={`${c.org}: open case study`}>
                        {body}
                      </a>
                    ) : (
                      body
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        {horizontal && (
          <div className="container-x pointer-events-none absolute inset-x-0 bottom-8">
            <div className="flex items-center gap-4 text-[13px] font-medium text-mute">
              <span>2023</span>
              <div className="relative h-px flex-1 bg-white/10">
                <div data-progress className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-build via-sell to-bone" />
              </div>
              <span>2026</span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
