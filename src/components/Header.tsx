import { useEffect, useRef, useState } from 'react'
import { person } from '../content/site'
import { scrollToTarget } from '../lib/smooth'
import { FileDown } from './Icons'

const links = [
  { href: '#numbers', label: 'Numbers' },
  { href: '#story', label: 'Story' },
  { href: '#work', label: 'Work' },
  { href: '#method', label: 'Method' },
  { href: '#stack', label: 'Stack' },
  { href: '#contact', label: 'Contact' },
]

function useEasternTime() {
  const fmt = () => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Detroit' }).format(new Date())
  const [t, setT] = useState(fmt)
  useEffect(() => {
    const id = window.setInterval(() => setT(fmt()), 15000)
    return () => window.clearInterval(id)
  }, [])
  return t
}

export default function Header() {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const last = useRef(0)
  const time = useEasternTime()

  useEffect(() => {
    const on = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setHidden(y > 400 && y > last.current + 4 ? true : y < last.current - 4 ? false : (h) => h)
      last.current = y
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    scrollToTarget(href)
    history.replaceState(null, '', href)
    const target = document.querySelector<HTMLElement>(href)
    target?.focus({ preventScroll: true })
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <a href="#main" className="sr-only-focusable btn btn-primary absolute left-4 top-3 z-10">
        Skip to content
      </a>
      <div className={`transition-colors duration-500 ${scrolled ? 'bg-ink/70 backdrop-blur-xl' : ''}`}>
        <div className="container-x flex h-16 items-center justify-between gap-6 md:h-20">
          <a href="#top" onClick={(e) => go(e, '#top')} className="group flex items-center gap-3">
            <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-white/15 font-mono text-[11px] font-medium tracking-tight">
              <span className="absolute inset-0 bg-[conic-gradient(from_200deg,var(--color-build),transparent_35%,var(--color-sell)_65%,transparent)] opacity-40 transition-opacity group-hover:opacity-80" />
              <span className="relative">JM</span>
            </span>
            <span className="hidden text-sm font-medium tracking-tight sm:block">{person.name}</span>
            <span className="sr-only">, back to top</span>
          </a>
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full border border-white/10 bg-ink/40 px-2 py-1.5 backdrop-blur-md">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={(e) => go(e, l.href)} className="block rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-bone/70 transition-colors hover:bg-white/5 hover:text-bone">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-4">
            <span className="eyebrow hidden xl:block" aria-label={`Local time in Michigan: ${time}`}>
              MI · {time} ET
            </span>
            <a href={person.resume} target="_blank" rel="noopener" className="btn btn-ghost !h-10 !px-4 text-sm">
              <FileDown className="h-4 w-4" /> Résumé
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
