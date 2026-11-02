import { gsap, SplitText } from './gsap'

/**
 * Masked line reveal for a wrapped heading. SplitText re-splits on resize (autoSplit) and
 * replays the entrance, so long headings never show a torn line. Call inside gsap.matchMedia(MQ.motion).
 */
export function revealLines(el: Element | null, opts: { start?: string; stagger?: number; delay?: number } = {}) {
  if (!el) return () => {}
  const split = SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'reveal-line',
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: 110,
        rotate: 1.5,
        transformOrigin: '0% 100%',
        duration: 1.25,
        ease: 'expo.out',
        stagger: opts.stagger ?? 0.09,
        delay: opts.delay ?? 0,
        scrollTrigger: { trigger: el, start: opts.start ?? 'top 80%', once: true },
      }),
  })
  return () => split.revert()
}

/** Draws a hairline from left to right when it scrolls into view. */
export function drawRules(root: Element, selector = '[data-rule]') {
  root.querySelectorAll<HTMLElement>(selector).forEach((rule) => {
    gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: rule, start: 'top 92%', once: true } })
  })
}
