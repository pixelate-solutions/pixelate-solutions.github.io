import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { coverFor, imagesFor, projects, type Project, type ShotImage } from '../content/projects'
import ProjectMedia, { PhoneFrame } from './ProjectMedia'
import Picture from './Picture'
import { ArrowUpRight, Close } from './Icons'

const ease = [0.16, 1, 0.3, 1] as const
const labels = ['The problem', 'What I built', 'The result']

/** Screenshot that wipes up from the bottom while the image settles from a slight zoom. */
function Screen({ img, alt, sizes, className, imgClassName }: { img: ShotImage; alt: string; sizes: string; className: string; imgClassName: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { clipPath: 'inset(100% 0% 0% 0% round 16px)' }}
      whileInView={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0% round 16px)' }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 1.3, ease }}
    >
      <motion.div
        initial={reduce ? undefined : { scale: 1.12 }}
        whileInView={reduce ? undefined : { scale: 1 }}
        viewport={{ once: true, margin: '-12% 0px' }}
        transition={{ duration: 1.7, ease }}
        className="origin-top"
      >
        <Picture img={img} alt={alt} sizes={sizes} imgClassName={imgClassName} />
      </motion.div>
    </motion.div>
  )
}

function Body({ project, onNext }: { project: Project; onNext: () => void }) {
  const images = imagesFor(project.slug)
  const cover = coverFor(project)
  const desktop = images.filter((i) => i.kind === 'desktop' && i !== cover)
  const docs = images.filter((i) => i.kind === 'document') // documents are always shown in full, even when used as the cover
  const phones = images.filter((i) => i.kind === 'mobile')
  const idx = projects.findIndex((p) => p.slug === project.slug)
  const next = projects[(idx + 1) % projects.length]
  const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-10% 0px' },
    transition: { duration: 0.9, ease },
  }

  return (
    <div className="container-x pb-24 pt-14 lg:pt-20">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-8">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-1">
              {project.client && (
                <div className="col-span-2 lg:col-span-1">
                  <dt className="eyebrow">Client</dt>
                  <dd className="mt-1 text-bone">{project.client}</dd>
                </div>
              )}
              <div>
                <dt className="eyebrow">Role</dt>
                <dd className="mt-1 text-bone">{project.role}</dd>
              </div>
              <div>
                <dt className="eyebrow">When</dt>
                <dd className="mt-1 text-bone">{project.period}</dd>
              </div>
            </dl>
            {project.links.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {project.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener" className="btn btn-ghost group !h-10 !px-4 text-sm" data-cursor="Visit">
                    {l.label} <ArrowUpRight className="h-4 w-4 transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                ))}
              </div>
            )}
            {project.privacy && <p className="mt-8 max-w-[22rem] text-[13px] leading-relaxed text-dim">{project.privacy}</p>}
          </div>
        </aside>

        <div className="lg:col-span-8">
          <ol className="border-t border-white/10">
            {project.points.map((p, i) => (
              <motion.li
                key={i}
                className="grid gap-2 border-b border-white/10 py-6 md:grid-cols-[11rem_1fr] md:gap-6"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8% 0px' }}
                transition={{ duration: 0.8, ease, delay: i * 0.08 }}
              >
                <span className="eyebrow pt-1">{labels[i]}</span>
                <span className="text-[1.15rem] leading-snug text-bone md:text-[1.3rem]">{p}</span>
              </motion.li>
            ))}
          </ol>
          <motion.ul className="mt-6 flex flex-wrap gap-2" {...reveal} aria-label="Stack">
            {project.stack.map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      {(desktop.length > 0 || docs.length > 0 || phones.length > 0) && (
        <div className="mt-20 space-y-10 md:mt-28">
          {desktop.map((img) => (
            <figure key={img.base}>
              <Screen img={img} alt={img.caption || `${project.name} screen`} sizes="(min-width: 1024px) 1400px, 100vw" className="overflow-hidden rounded-2xl border border-white/10 bg-ink-2" imgClassName="h-auto w-full" />
              {img.caption && (
                <motion.figcaption className="mt-3 text-[13px] text-mute" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 }}>
                  {img.caption}
                </motion.figcaption>
              )}
            </figure>
          ))}
          {docs.map((img) => (
            <motion.figure key={img.base} {...reveal}>
              <div data-lenis-prevent className="mx-auto max-h-[85vh] max-w-[52rem] overflow-y-auto rounded-xl border border-white/10 bg-white">
                <Picture img={img} alt={img.caption || `${project.name} document`} sizes="(min-width: 1024px) 52rem, 100vw" imgClassName="h-auto w-full" />
              </div>
              {img.caption && <figcaption className="mx-auto mt-3 max-w-[52rem] text-[13px] leading-relaxed text-mute">{img.caption}</figcaption>}
            </motion.figure>
          ))}
          {phones.length > 0 && (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {phones.map((img, i) => (
                <motion.figure
                  key={img.base}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ duration: 1, ease, delay: (i % 4) * 0.1 }}
                >
                  <div className="mx-auto h-[min(64vh,36rem)] w-fit">
                    <PhoneFrame img={img} alt={img.caption || `${project.name} mobile screen`} sizes="(min-width: 1024px) 22vw, 45vw" />
                  </div>
                  {img.caption && <figcaption className="mt-3 text-center text-[12px] leading-relaxed text-mute">{img.caption}</figcaption>}
                </motion.figure>
              ))}
            </div>
          )}
        </div>
      )}

      <button type="button" onClick={onNext} className="group mt-20 block w-full border-t border-white/10 pt-8 text-left md:mt-28" data-cursor="Next">
        <span className="eyebrow">Next</span>
        <span className="mt-3 flex items-center justify-between gap-6">
          <span className="min-w-0">
            <span className="display block text-[clamp(2.2rem,5.5vw,4.6rem)] transition-colors duration-500 group-hover:text-build">{next.name}</span>
            <span className="mt-3 block max-w-[34rem] text-base leading-relaxed text-mute transition-colors duration-500 group-hover:text-bone/80">{next.summary}</span>
          </span>
          <span className="relative hidden w-44 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-ink-2 md:block" style={{ aspectRatio: '16 / 10' }} aria-hidden>
            <span className="block h-full w-full transition-transform duration-[1.2s] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.06]">
              <ProjectMedia project={next} sizes="12rem" compact />
            </span>
            <span className="absolute inset-0 grid place-items-center bg-ink/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <ArrowUpRight className="h-7 w-7 text-bone" />
            </span>
          </span>
          <ArrowUpRight className="h-10 w-10 shrink-0 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 md:hidden" />
        </span>
      </button>
    </div>
  )
}

export default function ProjectDetail({
  slug,
  sharedSlug,
  onClose,
  onNavigate,
}: {
  slug: string | null
  sharedSlug: string | null
  onClose: () => void
  onNavigate: (slug: string) => void
}) {
  const project = projects.find((p) => p.slug === slug) ?? null
  const panel = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()
  // +1 when stepping to the next case, -1 for previous: the header slides in from that side.
  const [dir, setDir] = useState(0)

  useEffect(() => {
    if (!project) return
    const t = window.setTimeout(() => closeBtn.current?.focus({ preventScroll: true }), 50)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [project, onClose])

  useEffect(() => {
    panel.current?.scrollTo({ top: 0 })
  }, [slug])

  const idx = project ? projects.findIndex((p) => p.slug === project.slug) : 0
  const go = (d: number) => {
    setDir(d)
    onNavigate(projects[(idx + d + projects.length) % projects.length].slug)
  }
  const shared = sharedSlug === project?.slug
  const slide = reduce ? 0 : dir * 48

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          key="detail"
          className="fixed inset-0 z-[80]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-title"
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.15 } }}
            transition={{ duration: reduce ? 0 : 0.5 }}
          />
          <div ref={panel} data-lenis-prevent className="absolute inset-0 overflow-y-auto overscroll-contain">
            <div className="sticky top-0 z-10 bg-gradient-to-b from-ink via-ink/80 to-transparent">
              <div className="container-x flex h-16 items-center justify-between md:h-20">
                <motion.span className="flex items-center gap-3 text-[13px] font-medium text-mute" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <span>
                    {idx + 1} of {projects.length}
                  </span>
                  <span className="hidden h-px w-24 overflow-hidden bg-white/10 sm:block" aria-hidden>
                    <motion.span
                      className="block h-full origin-left bg-bone/70"
                      initial={false}
                      animate={{ scaleX: (idx + 1) / projects.length }}
                      transition={{ duration: reduce ? 0 : 0.8, ease }}
                    />
                  </span>
                </motion.span>
                <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <button type="button" onClick={() => go(-1)} className="btn btn-ghost !h-10 !px-4 text-sm" aria-label="Previous case study">
                    Prev
                  </button>
                  <button type="button" onClick={() => go(1)} className="btn btn-ghost !h-10 !px-4 text-sm" aria-label="Next case study">
                    Next
                  </button>
                  <button ref={closeBtn} type="button" onClick={onClose} className="btn btn-primary !h-10 !px-4 text-sm" aria-label="Close case study" data-cursor="Close">
                    <Close className="h-4 w-4" /> <span className="hidden sm:inline">Close</span>
                  </button>
                </motion.div>
              </div>
            </div>

            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={project.slug}
                initial={{ opacity: shared ? 1 : 0, x: shared ? 0 : slide }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -slide, transition: { duration: 0.3, ease } }}
                transition={{ duration: 0.5, ease }}
              >
                <header className="container-x pt-4 md:pt-8">
                  <motion.p className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease, delay: 0.25 }}>
                    {project.kicker}
                  </motion.p>
                  <h2 id="detail-title" className="display mt-3 text-[clamp(3rem,9vw,9rem)]">
                    <span className="line-mask">
                      <motion.span className="block" initial={{ y: '105%', rotate: reduce ? 0 : 2 }} animate={{ y: 0, rotate: 0 }} exit={{ y: '105%' }} transition={{ duration: reduce ? 0 : 1, ease, delay: 0.2 }} style={{ transformOrigin: '0% 100%' }}>
                        {project.name}
                      </motion.span>
                    </span>
                  </h2>
                  <motion.p
                    className="mt-5 max-w-[40rem] text-lg leading-relaxed text-bone/80 md:text-xl"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease, delay: 0.35 }}
                  >
                    {project.summary}
                  </motion.p>
                </header>
                <div className="container-x mt-10 md:mt-14">
                  <motion.div
                    layoutId={shared ? `media-${project.slug}` : undefined}
                    className="relative aspect-[16/10] overflow-hidden border border-white/10 bg-ink-2 md:aspect-[16/8]"
                    style={{ borderRadius: 28 }}
                    transition={{ duration: reduce ? 0 : 0.9, ease }}
                    initial={shared ? undefined : { opacity: 0, y: 40, clipPath: 'inset(8% 4% 8% 4% round 28px)' }}
                    animate={shared ? undefined : { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
                  >
                    <ProjectMedia project={project} sizes="100vw" eager />
                  </motion.div>
                  {coverFor(project)?.caption && (
                    <motion.p className="mt-4 max-w-[60rem] text-[13px] leading-relaxed text-mute" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                      {coverFor(project)!.caption}
                    </motion.p>
                  )}
                </div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, delay: 0.45 }}>
                  <Body project={project} onNext={() => go(1)} />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
