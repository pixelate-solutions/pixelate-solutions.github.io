/**
 * Generated placeholder for a project with no screenshots yet: on-brand gradient mesh,
 * blueprint grid, the project's architecture flow as a faint diagram, and the wordmark.
 */
import type { Project } from '../content/projects'

export default function Placeholder({ project, compact = false }: { project: Project; compact?: boolean }) {
  const [a, b] = project.palette
  const steps = project.flow.slice(0, 5)
  return (
    <div className="relative h-full w-full overflow-hidden bg-ink-2" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(60% 80% at 18% 20%, ${a}55, transparent 60%), radial-gradient(55% 75% at 85% 85%, ${b}50, transparent 60%), radial-gradient(40% 50% at 60% 30%, ${b}22, transparent 70%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            'linear-gradient(rgb(236 233 226 / .14) 1px, transparent 1px), linear-gradient(90deg, rgb(236 233 226 / .14) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(80% 80% at 50% 50%, black, transparent)',
        }}
      />
      {!compact && (
        <div className="absolute inset-x-[8%] bottom-[12%] flex items-center gap-2 opacity-70">
          {steps.map((s, i) => (
            <div key={s} className="flex min-w-0 flex-1 items-center gap-2">
              <span className="truncate rounded-full border border-white/15 bg-black/25 px-2 py-1 font-mono text-[9px] text-bone/80 backdrop-blur-sm">
                {s}
              </span>
              {i < steps.length - 1 && <span className="h-px w-3 shrink-0 bg-white/30" />}
            </div>
          ))}
        </div>
      )}
      <div className="absolute inset-0 grid place-items-center">
        <span
          className="display select-none text-center text-bone/95"
          style={{ fontSize: compact ? 'clamp(1.6rem, 3.2vw, 2.6rem)' : 'clamp(2.2rem, 5.5vw, 5.5rem)', textShadow: '0 10px 60px rgb(0 0 0 / .45)' }}
        >
          {project.name}
        </span>
      </div>
      <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/60">
        {project.kicker}
      </span>
    </div>
  )
}
