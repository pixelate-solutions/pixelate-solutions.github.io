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

export default function Header() {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [current, setCurrent] = useState<string>('')
  const last = useRef(0)

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

  // Which section is under the reading line, for the nav highlight (and aria-current).
  useEffect(() => {
    const sections = links.map((l) => document.querySelector<HTMLElement>(l.href)).filter((s): s is HTMLElement => !!s)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(`#${e.target.id}`)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
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
            <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-white/15 text-[12px] font-bold tracking-tight">
              <span className="absolute inset-0 bg-[conic-gradient(from_200deg,var(--color-build),transparent_35%,var(--color-sell)_65%,transparent)] opacity-40 transition-opacity group-hover:opacity-80" />
              <span className="relative">JM</span>
            </span>
            <span className="hidden text-[15px] font-semibold tracking-tight sm:block">{person.name}</span>
            <span className="sr-only">, back to top</span>
          </a>
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full border border-white/10 bg-ink/40 px-2 py-1.5 backdrop-blur-md">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => go(e, l.href)}
                    aria-current={current === l.href ? 'location' : undefined}
                    className={`relative block rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-500 hover:text-bone ${
                      current === l.href ? 'text-bone' : 'text-bone/65'
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-0 -z-10 rounded-full bg-white/[0.08] transition-[opacity,transform] duration-500 [transition-timing-function:var(--ease-out-expo)] ${
                        current === l.href ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                      }`}
                    />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a href={person.resume} target="_blank" rel="noopener" className="btn btn-ghost !h-10 !px-4 text-sm">
            <FileDown className="h-4 w-4" /> Résumé
          </a>
        </div>
      </div>
    </header>
  )
}
