import { useCallback, useEffect, useRef, useState } from 'react'
import { LayoutGroup } from 'motion/react'
import { gsap, MQ } from '../lib/gsap'
import { useIsoLayoutEffect } from '../lib/hooks'
import { lockScroll } from '../lib/smooth'
import { projects } from '../content/projects'
import ProjectCard from '../components/ProjectCard'
import ProjectDetail from '../components/ProjectDetail'

const HASH = /^#\/work\/([a-z0-9-]+)$/

function slugFromHash() {
  const m = window.location.hash.match(HASH)
  return m && projects.some((p) => p.slug === m[1]) ? m[1] : null
}

export default function Work() {
  const root = useRef<HTMLElement>(null)
  const links = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [open, setOpen] = useState<string | null>(() => (typeof window !== 'undefined' ? slugFromHash() : null))
  const [shared, setShared] = useState<string | null>(null)
  const pushed = useRef(false)
  const returnTo = useRef<string | null>(null)

  useEffect(() => {
    const sync = () => {
      const s = slugFromHash()
      setOpen(s)
      if (!s) pushed.current = false
    }
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  useEffect(() => {
    lockScroll(!!open)
    if (!open && returnTo.current) {
      const el = links.current[returnTo.current]
      returnTo.current = null
      el?.focus({ preventScroll: true })
    }
  }, [open])

  const onOpen = useCallback((slug: string) => {
    setShared(slug)
    returnTo.current = slug
    history.pushState({ work: slug }, '', `#/work/${slug}`)
    pushed.current = true
    setOpen(slug)
  }, [])

  const onClose = useCallback(() => {
    const current = slugFromHash()
    if (current) returnTo.current = shared ?? current
    if (pushed.current) {
      pushed.current = false
      history.back()
    } else {
      history.replaceState(null, '', '#work')
      setOpen(null)
    }
  }, [shared])

  const onNavigate = useCallback((slug: string) => {
    history.replaceState({ work: slug }, '', `#/work/${slug}`)
    setOpen(slug)
  }, [])

  useIsoLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      el.querySelectorAll<HTMLElement>('[data-work-card]').forEach((card) => {
        const reveal = card.querySelector('[data-reveal]')
        const img = card.querySelector('[data-parallax]')
        gsap.fromTo(
          reveal,
          { clipPath: 'inset(100% 0% 0% 0% round 1.5rem)' },
          { clipPath: 'inset(0% 0% 0% 0% round 1.5rem)', duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: card, start: 'top 88%', once: true } },
        )
        gsap.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 88%', once: true } })
        gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } })
        gsap.from(card.querySelectorAll('h3, p, .chip'), { y: 24, opacity: 0, duration: 1, stagger: 0.04, scrollTrigger: { trigger: card, start: 'top 80%', once: true } })
      })
      gsap.from(el.querySelectorAll('[data-work-title] > span > span'), { yPercent: 110, duration: 1.3, stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 75%', once: true } })
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} id="work" tabIndex={-1} aria-labelledby="work-title" className="relative py-28 outline-none md:py-40">
      <div className="container-x">
        <div className="mb-16 grid gap-8 md:mb-24 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-6">(03) Selected work</p>
            <h2 id="work-title" data-work-title className="display text-[clamp(2.6rem,6.4vw,6.5rem)]">
              <span className="line-mask"><span className="block">Problems I scoped,</span></span>
              <span className="line-mask"><span className="block serif-i text-bone/90">then shipped.</span></span>
            </h2>
          </div>
          <div className="self-end lg:col-span-4">
            <p className="text-lg leading-relaxed text-mute">
              Each case: the problem, what I built, the architecture, and what it added up to. Client and employer details are anonymized where they need to be.
            </p>
            <p className="eyebrow mt-6">{String(projects.length).padStart(2, '0')} cases · click to open</p>
          </div>
        </div>
        <LayoutGroup>
          <div className="grid grid-cols-12 gap-x-6 gap-y-16 md:gap-x-8 md:gap-y-24">
            {projects.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} onOpen={onOpen} linkRef={(el) => (links.current[p.slug] = el)} />
            ))}
          </div>
          <ProjectDetail slug={open} sharedSlug={shared} onClose={onClose} onNavigate={onNavigate} />
        </LayoutGroup>
      </div>
    </section>
  )
}
