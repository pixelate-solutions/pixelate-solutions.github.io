import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { coverFor, imagesFor, projects, type Project } from '../content/projects'
import ProjectMedia, { PhoneFrame } from './ProjectMedia'
import Picture from './Picture'
import { ArrowUpRight, Close } from './Icons'

const ease = [0.16, 1, 0.3, 1] as const

function Flow({ steps, palette }: { steps: string[]; palette: [string, string] }) {
  return (
    <ol className="relative flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-0" aria-label="Architecture, in order">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center md:flex-row">
          <span
            className="relative rounded-xl border border-white/12 bg-ink-3 px-3.5 py-2.5 font-mono text-[12px] leading-snug text-bone"
            style={{ boxShadow: i === 0 || i === steps.length - 1 ? `inset 0 0 0 1px ${i === 0 ? palette[0] : palette[1]}55` : undefined }}
          >
            <span className="mr-2 text-dim">{String(i + 1).padStart(2, '0')}</span>
            {s}
          </span>
          {i < steps.length - 1 && (
            <span className="relative mx-2 hidden h-px w-8 overflow-hidden bg-white/15 md:block" aria-hidden>
              <span
                className="absolute inset-y-0 w-3 [animation:flow-packet_1.6s_linear_infinite]"
                style={{ background: `linear-gradient(90deg, transparent, ${palette[0]}, transparent)`, animationDelay: `${i * 0.2}s` }}
              />
            </span>
          )}
        </li>
      ))}
    </ol>
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
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-10% 0px' },
    transition: { duration: 0.9, ease },
  }

  return (
    <div className="container-x grid gap-14 pb-24 pt-14 lg:grid-cols-12 lg:gap-10 lg:pt-20">
      <aside className="lg:col-span-4">
        <div className="space-y-8 lg:sticky lg:top-8">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-1">
            {project.client && (
              <div className="col-span-2 lg:col-span-1">
                <dt className="eyebrow">Client</dt>
                <dd className="mt-1.5 text-bone">{project.client}</dd>
              </div>
            )}
            <div>
              <dt className="eyebrow">Role</dt>
              <dd className="mt-1.5 text-bone">{project.role}</dd>
            </div>
            <div>
              <dt className="eyebrow">When</dt>
              <dd className="mt-1.5 text-bone">{project.period}</dd>
            </div>
          </dl>
          <div>
            <p className="eyebrow mb-3">Stack</p>
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <li key={s} className="chip">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          {project.links.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {project.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener" className="btn btn-ghost !h-11 text-sm">
                  {l.label} <ArrowUpRight className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
          {project.privacy && <p className="max-w-[22rem] font-mono text-[11px] leading-relaxed text-dim">{project.privacy}</p>}
        </div>
      </aside>

      <div className="space-y-20 lg:col-span-8">
        <motion.section {...reveal}>
          <h3 className="eyebrow mb-4">The problem</h3>
          <p className="text-[clamp(1.35rem,2.2vw,2rem)] font-medium leading-[1.3] tracking-[-0.02em] text-bone">{project.problem}</p>
        </motion.section>

        <motion.section {...reveal}>
          <h3 className="eyebrow mb-6">What I built</h3>
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {project.built.map((b, i) => (
              <li key={i} className="grid grid-cols-[2.5rem_1fr] gap-2 py-5 text-[1.02rem] leading-relaxed text-bone/85">
                <span className="font-mono text-xs leading-7 text-dim">{String(i + 1).padStart(2, '0')}</span>
                {b}
              </li>
            ))}
          </ul>
          {project.note && <p className="mt-6 max-w-[44rem] text-sm leading-relaxed text-mute">{project.note}</p>}
        </motion.section>

        <motion.section {...reveal}>
          <h3 className="eyebrow mb-6">Architecture</h3>
          <div className="rounded-2xl border border-white/10 bg-ink-2 p-5 md:p-7">
            <Flow steps={project.flow} palette={project.palette} />
          </div>
        </motion.section>

        <motion.section {...reveal}>
          <h3 className="eyebrow mb-6">Outcome & scale</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {project.outcomes.map((o) => (
              <div key={o.label} className="border-t border-white/10 pt-4">
                <div className="text-[clamp(2rem,3.4vw,3rem)] font-semibold leading-none tracking-[-0.045em]">{o.value}</div>
                <div className="mt-2 text-sm leading-snug text-mute">{o.label}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {(desktop.length > 0 || docs.length > 0 || phones.length > 0) && (
          <section>
            <h3 className="eyebrow mb-6">Screens</h3>
            <div className="space-y-10">
              {desktop.map((img) => (
                <motion.figure key={img.base} {...reveal}>
                  <div className="overflow-hidden rounded-2xl border border-white/10">
                    <Picture img={img} alt={img.caption || `${project.name} screen`} sizes="(min-width: 1024px) 60vw, 100vw" imgClassName="h-auto w-full" />
                  </div>
                  {img.caption && <figcaption className="mt-3 font-mono text-xs text-mute">{img.caption}</figcaption>}
                </motion.figure>
              ))}
              {docs.map((img) => (
                <motion.figure key={img.base} {...reveal}>
                  <div data-lenis-prevent className="mx-auto max-h-[85vh] max-w-[46rem] overflow-y-auto rounded-xl border border-white/10 bg-white">
                    <Picture img={img} alt={img.caption || `${project.name} document`} sizes="(min-width: 1024px) 46rem, 100vw" imgClassName="h-auto w-full" />
                  </div>
                  {img.caption && <figcaption className="mx-auto mt-3 max-w-[46rem] font-mono text-xs leading-relaxed text-mute">{img.caption}</figcaption>}
                </motion.figure>
              ))}
              {phones.length > 0 && (
                <motion.div {...reveal} className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                  {phones.map((img) => (
                    <figure key={img.base}>
                      <div className="mx-auto h-[min(64vh,34rem)] w-fit">
                        <PhoneFrame img={img} alt={img.caption || `${project.name} mobile screen`} sizes="(min-width: 1024px) 18vw, 45vw" />
                      </div>
                      {img.caption && <figcaption className="mt-3 text-center font-mono text-[11px] leading-relaxed text-mute">{img.caption}</figcaption>}
                    </figure>
                  ))}
                </motion.div>
              )}
            </div>
          </section>
        )}

        <button type="button" onClick={onNext} className="group block w-full border-t border-white/10 pt-8 text-left" data-cursor="Next">
          <span className="eyebrow">Next case</span>
          <span className="mt-3 flex items-center justify-between gap-6">
            <span className="display text-[clamp(2.4rem,6vw,5rem)] transition-colors group-hover:text-build">{next.name}</span>
            <ArrowUpRight className="h-10 w-10 shrink-0 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </span>
        </button>
      </div>
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
  const go = (d: number) => onNavigate(projects[(idx + d + projects.length) % projects.length].slug)

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
                <motion.span className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Case {String(idx + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
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

            <AnimatePresence mode="wait">
              <motion.div key={project.slug} initial={{ opacity: sharedSlug === project.slug ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                <header className="container-x pt-4 md:pt-8">
                  <motion.p className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease, delay: 0.25 }}>
                    {project.kicker}
                  </motion.p>
                  <h2 id="detail-title" className="display mt-4 text-[clamp(3rem,9vw,9rem)]">
                    <span className="line-mask">
                      <motion.span className="block" initial={{ y: '105%' }} animate={{ y: 0 }} exit={{ y: '105%' }} transition={{ duration: reduce ? 0 : 1, ease, delay: 0.2 }}>
                        {project.name}
                      </motion.span>
                    </span>
                  </h2>
                  <motion.p
                    className="mt-6 max-w-[48rem] text-lg leading-relaxed text-bone/80 md:text-xl"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease, delay: 0.35 }}
                  >
                    {project.tagline}
                  </motion.p>
                </header>
                <div className="container-x mt-10 md:mt-14">
                  <motion.div
                    layoutId={sharedSlug === project.slug ? `media-${project.slug}` : undefined}
                    className="relative aspect-[16/10] overflow-hidden border border-white/10 bg-ink-2 md:aspect-[16/8]"
                    style={{ borderRadius: 28 }}
                    transition={{ duration: reduce ? 0 : 0.9, ease }}
                    initial={sharedSlug === project.slug ? undefined : { opacity: 0, y: 40 }}
                    animate={sharedSlug === project.slug ? undefined : { opacity: 1, y: 0 }}
                  >
                    <ProjectMedia project={project} sizes="100vw" eager />
                  </motion.div>
                  {coverFor(project)?.caption && (
                    <motion.p className="mt-4 max-w-[60rem] font-mono text-xs leading-relaxed text-mute" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
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
