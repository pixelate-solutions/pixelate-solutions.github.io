import { coverFor, imagesFor, type Project, type ShotImage } from '../content/projects'
import Picture from './Picture'
import Placeholder from './Placeholder'

export function PhoneFrame({ img, alt, sizes, eager }: { img: ShotImage; alt: string; sizes: string; eager?: boolean }) {
  return (
    <div className="relative aspect-[9/19.5] h-full overflow-hidden rounded-[12%/5.6%] border border-white/15 bg-black p-[2.2%] shadow-[0_30px_80px_-20px_rgb(0_0_0/.8)]">
      <Picture img={img} alt={alt} sizes={sizes} eager={eager} className="block h-full w-full" imgClassName="h-full w-full rounded-[10%/4.8%] object-cover object-top" />
    </div>
  )
}

const backdrop = (p: Project) => {
  const [a, b] = p.palette
  return { background: `radial-gradient(70% 90% at 20% 10%, ${a}40, transparent 60%), radial-gradient(60% 80% at 90% 100%, ${b}38, transparent 60%), #0f1012` }
}

/** Cover art for a project: chosen desktop screenshot, a document page, a pair of phones, or the generated placeholder. */
export default function ProjectMedia({ project, sizes, eager, compact }: { project: Project; sizes: string; eager?: boolean; compact?: boolean }) {
  const images = imagesFor(project.slug)
  const cover = coverFor(project)
  const phones = images.filter((i) => i.kind === 'mobile').slice(0, compact ? 2 : 3)

  if (cover?.kind === 'desktop') {
    return (
      <div className="relative h-full w-full overflow-hidden bg-ink-2">
        <Picture img={cover} alt={cover.caption || `${project.name} screenshot`} sizes={sizes} eager={eager} className="block h-full w-full" imgClassName="h-full w-full object-cover object-top" />
      </div>
    )
  }
  if (cover?.kind === 'document') {
    return (
      <div className="relative h-full w-full overflow-hidden" style={backdrop(project)}>
        <div className="absolute left-1/2 top-[9%] w-[58%] -translate-x-1/2 rotate-[-3deg] overflow-hidden rounded-md shadow-[0_40px_90px_-20px_rgb(0_0_0/.85)] ring-1 ring-white/10">
          <Picture img={cover} alt={cover.caption || `${project.name} report`} sizes={sizes} eager={eager} className="block" imgClassName="h-auto w-full" />
        </div>
      </div>
    )
  }
  if (phones.length) {
    return (
      <div className="relative flex h-full w-full items-center justify-center gap-[4%] overflow-hidden px-[6%] pt-[7%]" style={backdrop(project)}>
        {phones.map((p, i) => (
          <div key={p.base} className="h-[118%]" style={{ transform: `translateY(${i % 2 ? 9 : 0}%)` }}>
            <PhoneFrame img={p} alt={p.caption || `${project.name} mobile screen`} sizes="(min-width: 1024px) 14vw, 30vw" eager={eager} />
          </div>
        ))}
      </div>
    )
  }
  return <Placeholder project={project} compact={compact} />
}
