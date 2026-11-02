import { useEffect } from 'react'
import Header from './components/Header'
import Cursor from './components/Cursor'
import Marquee from './components/Marquee'
import Hero from './sections/Hero'
import Numbers from './sections/Numbers'
import Story from './sections/Story'
import Work from './sections/Work'
import Method from './sections/Method'
import Stack from './sections/Stack'
import Contact from './sections/Contact'
import { startSmoothScroll } from './lib/smooth'
import { ScrollTrigger } from './lib/gsap'

export default function App() {
  useEffect(() => {
    startSmoothScroll()
    // Fonts change line lengths; recompute pins/triggers once they are in.
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  return (
    <>
      <Header />
      <Cursor />
      <div className="grain" aria-hidden />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Marquee
          className="border-y border-white/10 py-5 text-[clamp(1.8rem,4vw,3.6rem)] leading-none"
          items={['Solutions Engineer', 'Forward Deployed', 'Solutions Architect', 'Sales Engineer', 'Founder', 'Account Manager']}
        />
        <Numbers />
        <Story />
        <Work />
        <Method />
        <Stack />
        <Contact />
      </main>
    </>
  )
}
