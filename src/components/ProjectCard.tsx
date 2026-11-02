import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { gsap } from '../lib/gsap'
import type { Project } from '../content/projects'
import ProjectMedia from './ProjectMedia'
import { ArrowUpRight } from './Icons'

const spanClass: Record<number, string> = {
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  7: 'lg:col-span-7',
}

export default function ProjectCard({
  project,
  onOpen,
  linkRef,
}: {
  project: Project
  onOpen: (slug: string) => void
  linkRef: (el: HTMLAnchorElement | null) => void
}) {
  const card = useRef<HTMLDivElement>(null)
  const tilt = useRef<HTMLDivElement>(null)
  const media = useRef<HTMLDivElement>(null)
  const glare = useRef<HTMLDivElement>(null)
  const big = project.span >= 6

  useEffect(() => {
    const el = card.current
    const t = tilt.current
    const m = media.current
    const g = glare.current
    if (!el || !t || !m || !g || !matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
    const rx = gsap.quickTo(t, 'rotationX', { duration: 0.8, ease: 'power3.out' })
    const ry = gsap.quickTo(t, 'rotationY', { duration: 0.8, ease: 'power3.out' })
    const mx = gsap.quickTo(m, 'x', { duration: 1, ease: 'power3.out' })
    const my = gsap.quickTo(m, 'y', { duration: 1, ease: 'power3.out' })
    gsap.set(t, { transformPerspective: 1100 })
    const move = (e: PointerEvent) => {
      const r = t.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      rx(-py * 7)
      ry(px * 9)
      mx(-px * 22)
      my(-py * 16)
      g.style.background = `radial-gradient(420px circle at ${(px + 0.5) * 100}% ${(py + 0.5) * 100}%, rgb(255 255 255 / .16), transparent 45%)`
      g.style.opacity = '1'
    }
    const leave = () => {
      rx(0)
      ry(0)
      mx(0)
      my(0)
      g.style.opacity = '0'
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [])

  const open = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    if (tilt.current) gsap.set(tilt.current, { rotationX: 0, rotationY: 0 })
    if (media.current) gsap.set(media.current, { x: 0, y: 0 })
    onOpen(project.slug)
  }

  return (
    <article ref={card} data-work-card className={`group col-span-12 ${spanClass[project.span] ?? 'lg:col-span-6'} ${project.span === 4 ? 'md:col-span-6' : ''}`}>
      <a ref={linkRef} href={`#/work/${project.slug}`} onClick={open} className="relative block rounded-[1.5rem] outline-none" data-cursor="Open">
        <div data-reveal className="[clip-path:inset(0_0_0_0_round_1.5rem)]">
          <div ref={tilt} className="will-change-transform [transform-style:preserve-3d]">
            <motion.div
              layoutId={`media-${project.slug}`}
              className={`relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-ink-2 ${big ? 'aspect-[16/10]' : 'aspect-[4/3.4]'}`}
              style={{ borderRadius: 24 }}
            >
              <div ref={media} className="absolute -inset-6">
                <div data-parallax className="h-full w-full transition-[scale] duration-[1.2s] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.04]">
                  <ProjectMedia project={project} sizes={big ? '(min-width: 1024px) 58vw, 100vw' : '(min-width: 1024px) 34vw, 100vw'} compact={!big} />
                </div>
              </div>
              <div ref={glare} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500" />
              <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] ring-1 ring-inset ring-white/5 transition-[box-shadow] duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:shadow-[inset_0_0_0_1px_rgb(236_233_226/.18)]" />
              <div className="absolute right-4 top-4 grid h-11 w-11 scale-75 place-items-center rounded-full bg-bone text-ink opacity-0 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                <ArrowUpRight className="h-5 w-5 transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </motion.div>
          </div>
        </div>
        {/* palette glow under the card, revealed on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[6%] top-[12%] -z-10 h-[62%] rounded-[3rem] opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
          style={{ background: `linear-gradient(120deg, ${project.palette[0]}33, ${project.palette[1]}2e)` }}
        />
        <div className="mt-5 px-1">
          <p data-card-meta className="text-[13px] font-medium text-mute">
            {project.kicker}
          </p>
          <h3 className={`mt-1.5 font-bold tracking-[-0.03em] ${big ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}`}>
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:bg-[length:100%_2px]">
              {project.name}
            </span>
          </h3>
          <p className="mt-2 max-w-[36rem] text-[0.98rem] leading-relaxed text-mute">{project.summary}</p>
        </div>
      </a>
    </article>
  )
}
