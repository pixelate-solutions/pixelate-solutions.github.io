import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap, MQ } from '../lib/gsap'
import { useIsoLayoutEffect, useReducedMotion } from '../lib/hooks'
import { skillGroups } from '../content/site'

const W = 1000
const H = 660
const CX = W / 2
const CY = H / 2 + 6
const hueColor = { sell: '#ff7a45', build: '#5ce1e6', both: '#ece9e2' } as const

// Cross-links between groups that show where the two halves meet.
const bridges: [string, string, string][] = [
  ['sales', 'ai', 'MCP for customers'],
  ['industrial', 'data', 'machine telemetry'],
  ['sales', 'fullstack', 'quote configurators'],
]

function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

export default function Stack() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [userPicked, setUserPicked] = useState(false)
  const [hoverNode, setHoverNode] = useState<string | null>(null)

  const layout = useMemo(() => {
    const n = skillGroups.length
    return skillGroups.map((g, gi) => {
      const a = -Math.PI / 2 + (gi / n) * Math.PI * 2
      const hx = CX + Math.cos(a) * 345
      const hy = CY + Math.sin(a) * 215
      const nodes = g.skills.map((s, si) => {
        const ang = si * 2.39996 + gi
        const r = 52 + Math.sqrt(si + 1) * 21 + rand(gi * 50 + si) * 8
        return { label: s, x: hx + Math.cos(ang) * r * 1.15, y: hy + Math.sin(ang) * r * 0.85 }
      })
      return { ...g, x: hx, y: hy, nodes, angle: a }
    })
  }, [])

  const byId = Object.fromEntries(layout.map((g) => [g.id, g]))

  useEffect(() => {
    if (reduced || userPicked) return
    const el = root.current
    if (!el) return
    let id = 0
    const io = new IntersectionObserver(([e]) => {
      window.clearInterval(id)
      if (e.isIntersecting) id = window.setInterval(() => setActive((a) => (a + 1) % skillGroups.length), 3600)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearInterval(id)
    }
  }, [reduced, userPicked])

  useIsoLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el.querySelector('svg'), start: 'top 75%', once: true } })
      tl.from(el.querySelectorAll('[data-spoke]'), { attr: { 'stroke-dashoffset': 400 }, duration: 1.6, stagger: 0.05, ease: 'expo.inOut' })
        .from(el.querySelectorAll('[data-hub]'), { scale: 0, transformOrigin: 'center', duration: 1, stagger: 0.06, ease: 'back.out(2)' }, 0.2)
        .from(el.querySelectorAll('[data-node]'), { scale: 0, opacity: 0, transformOrigin: 'center', duration: 0.8, stagger: { each: 0.006, from: 'random' } }, 0.5)
    })
    return () => mm.revert()
  }, [])

  const pick = (i: number) => {
    setUserPicked(true)
    setActive(i)
  }
  const current = layout[active]

  return (
    <section ref={root} id="stack" tabIndex={-1} aria-labelledby="stack-title" className="relative overflow-hidden border-t border-white/10 py-28 outline-none md:py-40">
      <div className="container-x">
        <div className="mb-14 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-6">(05) The stack</p>
            <h2 id="stack-title" className="display text-[clamp(2.4rem,5.6vw,5.6rem)]">
              One constellation, <span className="serif-i text-bone/90">seven systems.</span>
            </h2>
          </div>
          <p className="self-end text-lg leading-relaxed text-mute lg:col-span-4">
            Engineering in <span className="text-build">cyan</span>, the field in <span className="text-sell">ember</span>. The lines between them are the work I like most.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div role="tablist" aria-label="Skill groups" aria-orientation="vertical" className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {layout.map((g, i) => (
                <button
                  key={g.id}
                  role="tab"
                  id={`tab-${g.id}`}
                  aria-selected={active === i}
                  aria-controls="skills-panel"
                  tabIndex={active === i ? 0 : -1}
                  onClick={() => pick(i)}
                  onKeyDown={(e) => {
                    if (['ArrowDown', 'ArrowRight'].includes(e.key)) {
                      e.preventDefault()
                      pick((i + 1) % layout.length)
                      ;(e.currentTarget.parentElement?.children[(i + 1) % layout.length] as HTMLElement)?.focus()
                    } else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
                      e.preventDefault()
                      const j = (i - 1 + layout.length) % layout.length
                      pick(j)
                      ;(e.currentTarget.parentElement?.children[j] as HTMLElement)?.focus()
                    }
                  }}
                  className={`group flex items-center justify-between gap-4 rounded-full border px-4 py-2 text-left transition-all duration-500 lg:rounded-xl lg:px-4 lg:py-3 ${
                    active === i ? 'border-white/25 bg-white/[0.06] text-bone' : 'border-white/10 text-mute hover:border-white/20 hover:text-bone lg:border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full" style={{ background: hueColor[g.hue] }} />
                    <span className="text-sm font-medium lg:text-lg lg:tracking-tight">{g.label}</span>
                  </span>
                  <span className="hidden font-mono text-[11px] text-dim lg:inline">{String(g.skills.length).padStart(2, '0')}</span>
                </button>
              ))}
            </div>
            <div id="skills-panel" role="tabpanel" aria-labelledby={`tab-${current.id}`} className="mt-8 min-h-[9rem]">
              <p className="eyebrow mb-3">{current.label}</p>
              <ul className="flex flex-wrap gap-2">
                {current.skills.map((s) => (
                  <li key={s} className="chip" style={{ borderColor: `${hueColor[current.hue]}40` }}>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative lg:col-span-8">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" role="img" aria-label="Skill constellation: seven groups around a center node, with links between sales and engineering groups.">
              <defs>
                <radialGradient id="core" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="#ece9e2" stopOpacity=".35" />
                  <stop offset="1" stopColor="#ece9e2" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx={CX} cy={CY} r="120" fill="url(#core)" />
              {/* spokes from the center to each hub */}
              {layout.map((g, i) => (
                <line
                  key={g.id}
                  data-spoke
                  x1={CX}
                  y1={CY}
                  x2={g.x}
                  y2={g.y}
                  stroke={hueColor[g.hue]}
                  strokeOpacity={active === i ? 0.6 : 0.14}
                  strokeWidth={active === i ? 1.4 : 1}
                  strokeDasharray="400"
                  strokeDashoffset="0"
                  style={{ transition: 'stroke-opacity .6s, stroke-width .6s' }}
                />
              ))}
              {/* bridges between sales-side and engineering-side groups */}
              {bridges.map(([a, b, label]) => {
                const A = byId[a]
                const B = byId[b]
                const mx = (A.x + B.x) / 2 + (CX - (A.x + B.x) / 2) * 0.45
                const my = (A.y + B.y) / 2 + (CY - (A.y + B.y) / 2) * 0.45
                const on = current.id === a || current.id === b
                return (
                  <g key={label}>
                    <path
                      d={`M ${A.x} ${A.y} Q ${mx} ${my} ${B.x} ${B.y}`}
                      fill="none"
                     
                      strokeWidth="1.2"
                      strokeDasharray="3 7"
                      strokeOpacity={on ? 0.95 : 0.35}
                      style={{ animation: 'dash 4s linear infinite', stroke: on ? '#ffc46b' : '#ece9e2', transition: 'stroke-opacity .6s' }}
                    />
                    <text x={mx} y={my - 6} textAnchor="middle" className="hidden fill-bone font-mono text-[11px] md:block" opacity={on ? 0.9 : 0} style={{ transition: 'opacity .6s' }}>
                      {label}
                    </text>
                  </g>
                )
              })}

              {layout.map((g, gi) => {
                const on = active === gi
                const c = hueColor[g.hue]
                return (
                  <g
                    key={g.id}
                    style={{ animation: `bob ${6 + gi * 0.7}s ${gi * -1.3}s ease-in-out infinite`, cursor: 'pointer' }}
                    onClick={() => pick(gi)}
                    onPointerEnter={() => matchMedia('(pointer: fine)').matches && pick(gi)}
                  >
                    {g.nodes.map((n) => (
                      <line key={`l-${n.label}`} x1={g.x} y1={g.y} x2={n.x} y2={n.y} stroke={c} strokeOpacity={on ? 0.35 : 0.07} style={{ transition: 'stroke-opacity .6s' }} />
                    ))}
                    {g.nodes.map((n) => {
                      const showLabel = on || hoverNode === `${g.id}:${n.label}`
                      const left = n.x < g.x
                      return (
                        <g key={n.label} data-node onPointerEnter={() => setHoverNode(`${g.id}:${n.label}`)} onPointerLeave={() => setHoverNode(null)}>
                          <circle cx={n.x} cy={n.y} r="12" fill="transparent" />
                          <circle cx={n.x} cy={n.y} r={on ? 3.6 : 2.4} fill={c} fillOpacity={on ? 1 : 0.4} style={{ transition: 'all .6s' }} />
                          <text
                            x={n.x + (left ? -8 : 8)}
                            y={n.y + 4}
                            textAnchor={left ? 'end' : 'start'}
                            className="pointer-events-none hidden fill-bone font-mono text-[12.5px] md:block"
                            opacity={showLabel ? 0.92 : 0}
                            style={{ transition: 'opacity .5s' }}
                          >
                            {n.label}
                          </text>
                        </g>
                      )
                    })}
                    <g data-hub>
                      <circle cx={g.x} cy={g.y} r={on ? 30 : 22} fill="#08090a" stroke={c} strokeOpacity={on ? 1 : 0.45} strokeWidth="1.2" style={{ transition: 'all .6s cubic-bezier(.16,1,.3,1)' }} />
                      {on && <circle cx={g.x} cy={g.y} r="30" fill="none" stroke={c} strokeOpacity=".5" style={{ transformOrigin: `${g.x}px ${g.y}px`, animation: 'ripple 2.4s ease-out infinite' }} />}
                      <circle cx={g.x} cy={g.y} r="4" fill={c} />
                      <text x={g.x} y={g.y + (g.y > CY ? 50 : -40)} textAnchor="middle" className="fill-bone text-[15px] font-semibold md:text-[16px]" opacity={on ? 1 : 0.55} style={{ transition: 'opacity .6s' }}>
                        {g.label}
                      </text>
                    </g>
                  </g>
                )
              })}

              <g>
                <circle cx={CX} cy={CY} r="34" fill="#08090a" stroke="#ece9e2" strokeOpacity=".5" />
                <circle cx={CX} cy={CY} r="34" fill="none" stroke="#ff7a45" strokeOpacity=".6" strokeDasharray="53 160" style={{ transformOrigin: `${CX}px ${CY}px`, animation: 'spin 9s linear infinite' }} />
                <circle cx={CX} cy={CY} r="34" fill="none" stroke="#5ce1e6" strokeOpacity=".6" strokeDasharray="53 160" strokeDashoffset="107" style={{ transformOrigin: `${CX}px ${CY}px`, animation: 'spin 9s linear infinite' }} />
                <text x={CX} y={CY + 5} textAnchor="middle" className="fill-bone font-mono text-[14px] font-medium">
                  JM
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
