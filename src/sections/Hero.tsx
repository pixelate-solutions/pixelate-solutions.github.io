import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { gsap, MQ, SplitText } from '../lib/gsap'
import { useIsoLayoutEffect, useReducedMotion } from '../lib/hooks'
import { hero, person } from '../content/site'
import Portrait, { focusPortrait } from '../components/Portrait'
import Magnetic from '../components/Magnetic'
import { GitHub, LinkedIn, Mail } from '../components/Icons'

const SignalField = lazy(() => import('../components/SignalField'))

function useSignalField() {
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (reduced) return
    // Defer the WebGL chunk until the page is interactive so it never competes with first paint.
    const go = () => setReady(true)
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback
    const start = () => (idle ? idle(go, { timeout: 2500 }) : window.setTimeout(go, 1200))
    if (document.readyState === 'complete') window.setTimeout(start, 600)
    else window.addEventListener('load', () => window.setTimeout(start, 600), { once: true })
  }, [reduced])
  return ready && !reduced
}

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const showField = useSignalField()
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useIsoLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const split = SplitText.create(el.querySelectorAll('[data-hero-line]'), { type: 'chars', charsClass: 'inline-block will-change-transform' })
      const tl = gsap.timeline({ delay: 0.15 })
      tl.from(split.chars, { yPercent: 115, rotate: 6, duration: 1.4, stagger: 0.022, ease: 'expo.out' })
        .from('[data-hero-fade]', { y: 24, opacity: 0, duration: 1.1, stagger: 0.08 }, '-=1.0')
        .from('[data-hero-portrait]', { clipPath: 'inset(100% 0% 0% 0% round 28px)', scale: 1.08, duration: 1.6, ease: 'expo.inOut' }, 0.2)

      // scroll-out: the two thesis lines drift apart, portrait sinks back
      gsap.to('[data-hero-row="a"]', { xPercent: -8, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('[data-hero-row="b"]', { xPercent: 6, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('[data-hero-portrait]', { yPercent: 12, scale: 0.94, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('[data-hero-bg]', { opacity: 0.25, ease: 'none', scrollTrigger: { trigger: el, start: 'center top', end: 'bottom top', scrub: true } })
      return () => split.revert()
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} id="top" aria-label="Introduction" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-24 md:pt-28">
      {/* background: static gradient (always) + WebGL signal field (lazy, motion only) */}
      <div data-hero-bg className="absolute inset-0 -z-10" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(50% 40% at 12% 30%, rgb(143 179 201 / .10), transparent 70%), radial-gradient(45% 40% at 18% 80%, rgb(242 107 58 / .10), transparent 70%), radial-gradient(40% 50% at 78% 55%, rgb(236 233 226 / .06), transparent 70%)',
          }}
        />
        {showField && (
          <Suspense fallback={null}>
            <div className="absolute inset-0 animate-[fadein_2s_ease_forwards]">
              <SignalField active={inView} mergeX={0.74} />
            </div>
          </Suspense>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_30%_40%,transparent_40%,var(--color-ink)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
      </div>

      <div className="container-x flex flex-1 flex-col">
        <div className="mt-6 grid flex-1 items-center gap-10 lg:mt-0 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7 xl:col-span-7">
            <p className="sr-only">Joseph Morrison.</p>
            <h1 className="display text-[clamp(3.1rem,7.6vw,8.75rem)]" aria-label="An engineer who sells. A seller who ships.">
              <span data-hero-row="a" className="block" aria-hidden>
                <span className="line-mask" data-hero-line>
                  An engineer
                </span>
                <span className="line-mask">
                  <span data-hero-line>who </span>
                  <span className="cursor-default text-sell" onPointerEnter={() => focusPortrait('sell')} onPointerLeave={() => focusPortrait(null)}>
                    <span data-hero-line>sells.</span>
                  </span>
                </span>
              </span>
              <span data-hero-row="b" className="mt-[0.12em] block" aria-hidden>
                <span className="line-mask" data-hero-line>
                  A seller
                </span>
                <span className="line-mask">
                  <span data-hero-line>who </span>
                  <span className="cursor-default text-build" onPointerEnter={() => focusPortrait('build')} onPointerLeave={() => focusPortrait(null)}>
                    <span data-hero-line>ships.</span>
                  </span>
                </span>
              </span>
            </h1>

            <p data-hero-fade className="mt-8 max-w-[32rem] text-[1.05rem] leading-relaxed text-bone/75 md:mt-10 md:text-lg">
              {hero.lede}
            </p>

            <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-2 sm:gap-3">
              <Magnetic>
                <a className="btn btn-primary" href={`mailto:${person.email}`} data-cursor="Email">
                  <Mail className="h-4 w-4" /> Email me
                </a>
              </Magnetic>
              <Magnetic strength={0.5}>
                <a className="btn btn-ghost !w-12 !px-0 justify-center" href={person.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn profile">
                  <LinkedIn className="h-4 w-4" />
                </a>
              </Magnetic>
              <Magnetic strength={0.5}>
                <a className="btn btn-ghost !w-12 !px-0 justify-center" href={person.github} target="_blank" rel="noopener" aria-label="GitHub profile">
                  <GitHub className="h-4 w-4" />
                </a>
              </Magnetic>
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 xl:col-start-9">
            <div data-hero-portrait className="mx-auto w-full max-w-[26rem] lg:max-w-none">
              <Portrait />
            </div>
          </div>
        </div>
        <div className="h-10 md:h-14" />
      </div>
    </section>
  )
}
