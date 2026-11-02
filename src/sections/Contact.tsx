import { useRef, useState } from 'react'
import { gsap, MQ, SplitText } from '../lib/gsap'
import { useIsoLayoutEffect } from '../lib/hooks'
import { drawRules } from '../lib/reveal'
import { person } from '../content/site'
import { scrollToTarget } from '../lib/smooth'
import Magnetic from '../components/Magnetic'
import Marquee from '../components/Marquee'
import { ArrowUpRight, FileDown, GitHub, LinkedIn } from '../components/Icons'

export default function Contact() {
  const root = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  useIsoLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      drawRules(el)
      const split = SplitText.create(el.querySelector('[data-contact-title]'), { type: 'chars,words', charsClass: 'inline-block' })
      gsap.from(split.chars, { yPercent: 120, rotate: 8, stagger: 0.025, duration: 1.3, scrollTrigger: { trigger: el, start: 'top 65%', once: true } })
      gsap.from(el.querySelectorAll('[data-contact-in]'), { y: 30, opacity: 0, stagger: 0.08, duration: 1.1, scrollTrigger: { trigger: el, start: 'top 55%', once: true } })
      return () => split.revert()
    })
    return () => mm.revert()
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${person.email}`
    }
  }

  return (
    <section ref={root} id="contact" tabIndex={-1} aria-labelledby="contact-title" className="relative overflow-hidden pt-28 outline-none md:pt-44">
      <span data-rule className="absolute inset-x-0 top-0 h-px origin-left bg-white/10" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{ background: 'radial-gradient(60% 50% at 20% 100%, rgb(159 189 211 / .10), transparent 70%), radial-gradient(60% 50% at 85% 90%, rgb(242 107 58 / .12), transparent 70%)' }}
      />
      <div className="container-x">
        <h2 id="contact-title" data-contact-title className="display text-[clamp(3.6rem,13vw,14rem)] leading-[0.85]">
          Say hello.
        </h2>
        <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p data-contact-in className="max-w-[30rem] text-xl leading-relaxed text-bone/80 md:text-2xl">
              Email is best. I’m in Michigan, Eastern time.
            </p>
            <div data-contact-in className="mt-10 flex flex-wrap items-center gap-3">
              <a href={`mailto:${person.email}`} className="group text-[clamp(1.4rem,3.4vw,2.6rem)] font-bold tracking-[-0.03em] text-bone" data-cursor="Write">
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:bg-[length:0%_2px]">
                  {person.email}
                </span>
              </a>
              <button type="button" onClick={copy} className="btn btn-ghost !h-10 !px-4 text-sm" aria-live="polite">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <div data-contact-in className="flex flex-wrap content-end gap-3 lg:col-span-5 lg:justify-end">
            <Magnetic>
              <a className="btn btn-primary" href={person.resume} target="_blank" rel="noopener" data-cursor="PDF">
                <FileDown className="h-4 w-4" /> Résumé
              </a>
            </Magnetic>
            <Magnetic>
              <a className="btn btn-ghost" href={person.linkedin} target="_blank" rel="noopener">
                <LinkedIn className="h-4 w-4" /> LinkedIn <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
              </a>
            </Magnetic>
            <Magnetic>
              <a className="btn btn-ghost" href={person.github} target="_blank" rel="noopener">
                <GitHub className="h-4 w-4" /> GitHub <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      <Marquee className="mt-24 border-y border-white/10 py-6 text-[clamp(2.4rem,6vw,5.5rem)] leading-none md:mt-32" items={['An engineer who sells', 'A seller who ships']} />

      <footer className="container-x flex flex-col gap-4 py-10 text-sm text-mute md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} Joseph A. Morrison · {person.location}
        </p>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            scrollToTarget('#top')
          }}
          className="text-sm font-medium text-mute transition-colors hover:text-bone"
        >
          Back to top ↑
        </a>
      </footer>
    </section>
  )
}
