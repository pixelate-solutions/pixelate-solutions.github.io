import { useCallback, useEffect, useRef, useState } from 'react'
import { LayoutGroup } from 'motion/react'
import { gsap, MQ } from '../lib/gsap'
import { useIsoLayoutEffect } from '../lib/hooks'
import { revealLines } from '../lib/reveal'
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
      const undo = revealLines(el.querySelector('#work-title'))
      el.querySelectorAll<HTMLElement>('[data-work-card]').forEach((card) => {
        const reveal = card.querySelector('[data-reveal]')
        const img = card.querySelector('[data-parallax]')
        // Cards that share a row open left to right: the delay follows the card's horizontal position.
        const delay = (card.getBoundingClientRect().left / window.innerWidth) * 0.3
        const tl = gsap.timeline({ delay, scrollTrigger: { trigger: card, start: 'top 88%', once: true } })
        tl.fromTo(reveal, { clipPath: 'inset(100% 0% 0% 0% round 1.5rem)' }, { clipPath: 'inset(0% 0% 0% 0% round 1.5rem)', duration: 1.5, ease: 'expo.inOut' }, 0)
          .fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.9, ease: 'expo.out' }, 0.1)
          .from(card.querySelectorAll('h3, p'), { y: 22, opacity: 0, duration: 1, stagger: 0.05 }, 0.45)
        gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      return undo
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} id="work" tabIndex={-1} aria-labelledby="work-title" className="relative py-28 outline-none md:py-44">
      <div className="container-x">
        <h2 id="work-title" className="display mb-16 max-w-[12ch] text-[clamp(2.6rem,6.4vw,6.5rem)] md:mb-24">
          Selected work
        </h2>
        <LayoutGroup>
          <div className="grid grid-cols-12 gap-x-6 gap-y-16 md:gap-x-8 md:gap-y-24">
            {projects.map((p) => (
              <ProjectCard key={p.slug} project={p} onOpen={onOpen} linkRef={(el) => (links.current[p.slug] = el)} />
            ))}
          </div>
          <ProjectDetail slug={open} sharedSlug={shared} onClose={onClose} onNavigate={onNavigate} />
        </LayoutGroup>
      </div>
    </section>
  )
}
